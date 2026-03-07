const TOKEN_KEY = 'pei-gems-token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function withAuthHeaders(headers = {}) {
  const token = getToken()
  if (!token) return headers

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}
