import { useAuthStore } from '@/auth/auth.store'

export function LoginForm() {
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  async function handleLogin() {
    await login('email@email.com', '123456')
  }

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      Entrar
    </button>
  )
}
