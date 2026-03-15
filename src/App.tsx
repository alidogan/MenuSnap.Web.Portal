import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrimeReactProvider } from 'primereact/api'
import { queryClient } from '@/core/config/queryClient'
import { routeTree } from './routeTree.gen'
import { LayoutProvider } from '@/core/layouts/PrivateAppLayout/layoutContext'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PrimeReactProvider>
  )
}
