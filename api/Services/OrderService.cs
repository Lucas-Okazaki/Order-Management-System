using Api2.Data;
using Api2.Models;
using Azure.Messaging.ServiceBus;
using Microsoft.EntityFrameworkCore;

namespace Api2.Services;

public class OrderService
{
    private readonly AppDbContext _dbContext;
    private readonly IServiceProvider _serviceProvider;
    private readonly string _queueName;

    public OrderService(AppDbContext dbContext, IServiceProvider serviceProvider, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _serviceProvider = serviceProvider;
        _queueName = configuration["AzureServiceBus:QueueName"] ?? "orders";
    }

    public async Task<Order> CreateAsync(Order order, CancellationToken ct = default)
    {
        order.Id = Guid.NewGuid();
        order.DataCriacao = DateTime.UtcNow;
        order.Status = OrderStatus.Pendente;

        await _dbContext.Orders.AddAsync(order, ct);
        await _dbContext.SaveChangesAsync(ct);

        var client = _serviceProvider.GetService<ServiceBusClient>();
        if (client is not null)
        {
            var sender = client.CreateSender(_queueName);
            var message = new ServiceBusMessage(System.Text.Json.JsonSerializer.Serialize(order))
            {
                ContentType = "application/json"
            };
            await sender.SendMessageAsync(message, ct);
        }

        return order;
    }

    public Task<List<Order>> ListAsync(CancellationToken ct = default)
    {
        return _dbContext.Orders.AsNoTracking().OrderByDescending(o => o.DataCriacao).ToListAsync(ct);
    }

    public Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return _dbContext.Orders.AsNoTracking().FirstOrDefaultAsync(o => o.Id == id, ct);
    }

    public async Task UpdateStatusAsync(Guid id, OrderStatus status, CancellationToken ct = default)
    {
        var entity = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == id, ct);
        if (entity is null) return;
        entity.Status = status;
        await _dbContext.SaveChangesAsync(ct);
    }
}


