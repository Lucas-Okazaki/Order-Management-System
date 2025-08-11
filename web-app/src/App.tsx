import { Outlet, Link, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
              OMS
              <span className="ml-2 rounded bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">Orders</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link to="/" className={`px-3 py-2 rounded-md ${location.pathname === '/' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Pedidos</Link>
              <Link to="/novo" className={`px-3 py-2 rounded-md ${location.pathname === '/novo' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Novo Pedido</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App
