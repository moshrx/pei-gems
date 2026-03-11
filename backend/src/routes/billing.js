const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const User = require('../models/User');

const PLAN_PRICE_MAP = {
  basic: process.env.STRIPE_BASIC_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

// POST /api/billing/checkout — create Stripe Checkout session
router.post('/checkout', auth, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !['basic', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Valid plan (basic or pro) is required.' });
    }

    const priceId = PLAN_PRICE_MAP[plan];
    if (!priceId) {
      return res.status(500).json({ error: `Stripe price ID for "${plan}" plan is not configured.` });
    }

    const user = await User.findById(req.user._id);

    // Create or retrieve Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      user.subscription = { ...user.subscription, stripeCustomerId: customerId };
      await user.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pricing`,
      metadata: { userId: req.user._id.toString(), plan },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/billing/subscription — get current subscription
router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const sub = user.subscription || { plan: 'free' };
    res.json({
      plan: sub.plan || 'free',
      currentPeriodEnd: sub.currentPeriodEnd || null,
      stripeSubscriptionId: sub.stripeSubscriptionId || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/billing/subscription — cancel subscription
router.delete('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subId = user.subscription?.stripeSubscriptionId;

    if (!subId) {
      return res.status(400).json({ error: 'No active subscription to cancel.' });
    }

    await stripe.subscriptions.cancel(subId);

    user.subscription.plan = 'free';
    user.subscription.stripeSubscriptionId = null;
    user.subscription.currentPeriodEnd = null;
    await user.save();

    res.json({ message: 'Subscription cancelled.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/billing/webhook — Stripe webhook handler (raw body, registered in server.js)
async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // No secret configured — parse body directly (dev only)
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (userId && plan) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await User.findByIdAndUpdate(userId, {
            'subscription.plan': plan,
            'subscription.stripeSubscriptionId': session.subscription,
            'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscription.id });
        if (user) {
          user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          await user.save();
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { 'subscription.stripeSubscriptionId': subscription.id },
          {
            'subscription.plan': 'free',
            'subscription.stripeSubscriptionId': null,
            'subscription.currentPeriodEnd': null,
          }
        );
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.webhookHandler = webhookHandler;

module.exports = router;
