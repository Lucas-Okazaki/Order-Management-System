import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import OrdersList from './pages/OrdersList'
import OrderCreate from './pages/OrderCreate'
import OrderDetails from './pages/OrderDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <OrdersList /> },
      { path: 'novo', element: <OrderCreate /> },
      { path: 'pedido/:id', element: <OrderDetails /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
