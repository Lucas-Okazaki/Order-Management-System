# Order-Management-System

Sistema de Gestão de Pedidos com .NET 8 (API) e React + Vite + Tailwind (Frontend).

## Arquitetura
- `api/`: Minimal API em .NET 8 com EF Core
  - Banco InMemory por padrão; suporta PostgreSQL (Npgsql)
  - CORS habilitado para o frontend
  - Porta padrão: `http://localhost:5000`
- `web-app/`: Frontend em React + Vite + Tailwind
  - Porta padrão: `http://localhost:3000`

## Requisitos
- Windows, macOS ou Linux
- .NET SDK 8.0+
- Node.js 20+ e npm
- (Opcional) Docker para PostgreSQL

## Rodando o projeto completo (modo rápido - InMemory)
Este modo usa o banco em memória (sem depender de Postgres).

1) API
```powershell
cd api
dotnet run
```
- A API iniciará em `http://localhost:5000`
- Endpoints: `/orders` (GET/POST), `/orders/{id}` (GET)

2) Frontend
Abra um novo terminal:
```powershell
cd web-app
npm i
npm run dev
```
- Acesse `http://localhost:3000`

## Rodando com PostgreSQL (opcional)
Se quiser persistência real, suba um Postgres com Docker e configure a string de conexão.

1) Subir Postgres via Docker Compose (opcional)
```powershell
# Na raiz do projeto
docker compose up -d
```
- Postgres disponível em `localhost:5432`
- Usuário: `admin`, Senha: `anyPassword123`, Database: `mydatabase`

2) Configurar a API para usar Postgres
Edite `api/appsettings.json` e defina `ConnectionStrings:DefaultConnection`, por exemplo:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=mydatabase;Username=admin;Password=anyPassword123"
  }
}
```
Ou use variável de ambiente `ConnectionStrings__DefaultConnection`.

3) Iniciar a API
```powershell
cd api
dotnet run
```

4) Iniciar o Frontend
```powershell
cd web-app
npm i
npm run dev
```

## CORS
- A API já permite `http://localhost:3000`.
- Se mudar a porta do frontend, ajuste em `api/Program.cs` (origens CORS) e em `web-app/src/api.ts` (BASE_URL da API).

## Variáveis opcionais
- `AzureServiceBus:ConnectionString` e `AzureServiceBus:QueueName`: habilitam envios/consumo de mensagens e simulam processamento do pedido (status avança de Pendente → Processando → Finalizado).

## Troubleshooting
- "Failed to fetch" no frontend:
  - Verifique se a API está em `http://localhost:5000` e a origem `http://localhost:3000` está liberada em CORS (`Program.cs`).
  - Reinicie a API após alterar CORS.
- "signal is aborted without reason": ruído do HMR/StrictMode; o app ignora aborts do fetch.
- PowerShell não aceita `&&`:
  - Use `;` para separar comandos (`cd api; dotnet run`).

## Scripts úteis
- API: `dotnet build`, `dotnet run`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`
