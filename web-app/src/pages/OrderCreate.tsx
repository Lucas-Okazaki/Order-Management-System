import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api'

export default function OrderCreate() {
  const [cliente, setCliente] = useState('')
  const [produto, setProduto] = useState('')
  const [valor, setValor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const num = Number(valor.replace(',', '.'))
    if (!cliente || !produto || Number.isNaN(num)) {
      setError('Preencha todos os campos corretamente')
      return
    }
    try {
      setSubmitting(true)
      const created = await createOrder({ cliente, produto, valor: num })
      navigate(`/pedido/${created.id}`)
    } catch (e: any) {
      setError(e.message ?? 'Erro ao criar pedido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900">Novo Pedido</h1>
      <p className="mb-6 text-sm text-slate-500">Cadastre um novo pedido</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Cliente</label>
          <input
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Nome do cliente"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Produto</label>
          <input
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Produto"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Valor (R$)</label>
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="0,00"
            inputMode="decimal"
          />
        </div>

        {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : 'Salvar Pedido'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}


