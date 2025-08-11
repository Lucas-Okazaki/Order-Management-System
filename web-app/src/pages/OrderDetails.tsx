import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../api'
import type { Order } from '../types'
import StatusBadge from '../components/StatusBadge'

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const ctrl = new AbortController()
    getOrder(id, ctrl.signal)
      .then(setOrder)
      .catch((e: any) => {
        if (e?.name === 'AbortError') return
        setError(e?.message ?? 'Falha ao carregar pedido')
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [id])

  if (loading) return <div className="text-slate-500">Carregando pedido...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!order) return <div className="text-slate-500">Pedido não encontrado.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Detalhes do Pedido</h1>
          <p className="text-sm text-slate-500">ID: {order.id}</p>
        </div>
        <Link
          to="/"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Cliente</dt>
              <dd className="font-medium text-slate-900">{order.cliente}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Produto</dt>
              <dd className="font-medium text-slate-900">{order.produto}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Valor</dt>
              <dd className="font-medium text-slate-900">
                {order.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium"><StatusBadge status={order.status} /></dd>
            </div>
            <div>
              <dt className="text-slate-500">Criado em</dt>
              <dd className="font-medium text-slate-900">
                {new Date(order.dataCriacao).toLocaleString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}


