OMS - API (.NET 8 Minimal API)

Requisitos
- .NET SDK 8.0+
- (Opcional) PostgreSQL se quiser usar banco real. Sem connection string, usa banco em memória.

Como iniciar do zero
1) Restaurar e compilar
```powershell
cd api
dotnet restore
dotnet build
```

2) Executar (porta 5000)
```powershell
dotnet run
```
Acesse Swagger (se Development): http://localhost:5000/swagger

Endpoints principais
- POST `/orders` cria um pedido
- GET `/orders` lista pedidos
- GET `/orders/{id}` detalhe do pedido

CORS
- Habilitado para `http://localhost:3000` (frontend). Ajuste em `Program.cs` se necessário.

Banco de dados
- Por padrão usa InMemory.
- Para Postgres, defina `ConnectionStrings:DefaultConnection` em `appsettings.json` ou variáveis de ambiente e o app usará Npgsql.

Service Bus (opcional)
- Se `AzureServiceBus:ConnectionString` e `AzureServiceBus:QueueName` forem definidos, mensagens são enviadas e processadas pelo `OrderProcessorWorker` (simula processamento do pedido mudando status).

