export default function RatingStars({ rating, onRate, interactive = false }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          className={`text-3xl transition ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
        >
          ⭐
        </button>
      ))}
    </div>
  )
}
