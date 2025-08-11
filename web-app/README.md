OMS - Frontend (React + Vite + Tailwind)

Requisitos
- Node.js 20+ (recomendado) e npm

Como iniciar do zero
1) Instalar dependências
```powershell
cd web-app
npm i
```

2) Rodar em desenvolvimento (porta 3000)
```powershell
npm run dev
```
Acesse: http://localhost:3000

Configurações importantes
- API base URL: definida em `src/api.ts` (`http://localhost:5000`). Se mudar a porta da API, ajuste esse arquivo.
- Tailwind CSS: já configurado (Tailwind v4). Se aparecer erro do PostCSS do Tailwind, instale o plugin:
```powershell
npm i -D @tailwindcss/postcss
```

Scripts úteis
- `npm run dev`: inicia o Vite na porta 3000
- `npm run build`: build de produção
- `npm run preview`: pré-visualiza o build

Funcionalidades
- Listar pedidos
- Criar novo pedido
- Ver detalhes do pedido

Solução de problemas
- Failed to fetch no navegador: verifique se a API está rodando em `http://localhost:5000` e com CORS liberado para `http://localhost:3000`.
- AbortError/"signal is aborted": ocorre por causa do HMR do Vite; é ignorado pelo app.