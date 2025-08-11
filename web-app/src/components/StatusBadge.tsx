type Props = {
  status: number
}

const map = {
  0: { text: 'Pendente', color: 'bg-amber-100 text-amber-800 ring-amber-200' },
  1: { text: 'Processando', color: 'bg-blue-100 text-blue-800 ring-blue-200' },
  2: { text: 'Finalizado', color: 'bg-emerald-100 text-emerald-800 ring-emerald-200' },
} as const

export default function StatusBadge({ status }: Props) {
  const meta = map[status as 0 | 1 | 2] ?? map[0]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${meta.color}`}>
      {meta.text}
    </span>
  )
}


