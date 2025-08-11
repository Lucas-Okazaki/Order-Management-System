export type Order = {
  id: string
  cliente: string
  produto: string
  valor: number
  status: number // 0=Pendente,1=Processando,2=Finalizado
  dataCriacao: string
}

export type CreateOrderInput = {
  cliente: string
  produto: string
  valor: number
}


