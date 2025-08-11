import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listOrders } from '../api'
import type { Order } from '../types'
import StatusBadge from '../components/StatusBadge'

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const ctrl = new AbortController()
    listOrders(ctrl.signal)
      .then(setOrders)
      .catch((e: any) => {
        if (e?.name === 'AbortError') return
        setError(e?.message ?? 'Falha ao carregar pedidos')
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.cliente.toLowerCase().includes(q) ||
        o.produto.toLowerCase().includes(q) ||
        String(o.valor).includes(q)
    )
  }, [orders, query])

  if (loading) return <div className="text-slate-500">Carregando pedidos...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-500">Acompanhe e gerencie pedidos</p>
        </div>
        <Link
          to="/novo"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          Novo Pedido
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <input
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400"
          placeholder="Buscar por cliente, produto ou valor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Produto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Valor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 text-sm text-slate-900">{o.cliente}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{o.produto}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {o.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-4 py-3 text-sm"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`/pedido/${o.id}`)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


