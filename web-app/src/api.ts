import type { CreateOrderInput, Order } from './types'

const BASE_URL = 'http://localhost:5000'

export async function listOrders(signal?: AbortSignal): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/orders`, { signal })
  if (!res.ok) throw new Error('Falha ao carregar pedidos')
  return res.json()
}

export async function getOrder(id: string, signal?: AbortSignal): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders/${id}`, { signal })
  if (!res.ok) throw new Error('Pedido não encontrado')
  return res.json()
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente: input.cliente,
      produto: input.produto,
      valor: input.valor,
    }),
  })
  if (!res.ok) throw new Error('Falha ao criar pedido')
  return res.json()
}


