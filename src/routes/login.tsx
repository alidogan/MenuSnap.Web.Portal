import { createFileRoute } from '@tanstack/react-router'
import { keycloak } from '@/core/auth/keycloak'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-12 shadow-lg">
        <img src="/favicon.ico" alt="MenuSnap" className="h-12 w-12" />
        <h1 className="text-2xl font-bold text-gray-800">MenuSnap Admin</h1>
        <p className="text-sm text-gray-500">Log in met je MenuSnap account</p>
        <button
          onClick={() => keycloak.login()}
          className="mt-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Inloggen
        </button>
      </div>
    </div>
  )
}
