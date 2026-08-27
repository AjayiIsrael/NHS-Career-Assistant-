import api from './client'

/**
 * Register a new user.
 * Backend: POST /users/register  { username, email, password } -> UserResponse
 */
export function register({ username, email, password }) {
  return api.post('/users/register', { username, email, password }).then((r) => r.data)
}

/**
 * Log in.
 * Backend: POST /users/login  { username, email, password } -> { access_token, token_type }
 * The backend authenticates on email only, but its request model still requires a
 * username field, so we pass the email through as the username too.
 */
export function login({ email, password }) {
  return api
    .post('/users/login', { username: email, email, password })
    .then((r) => r.data)
}
