using Api2.Models;
using Api2.Services;
using Azure.Messaging.ServiceBus;

namespace Api2.Background;

public class OrderProcessorWorker : BackgroundService
{
    private readonly ServiceBusProcessor? _processor;
    private readonly OrderService _orderService;

    public OrderProcessorWorker(IServiceProvider sp, IConfiguration configuration, OrderService orderService)
    {
        _orderService = orderService;
        var queueName = configuration["AzureServiceBus:QueueName"] ?? "orders";
        var client = sp.GetService<ServiceBusClient>();
        _processor = client?.CreateProcessor(queueName, new ServiceBusProcessorOptions
        {
            MaxConcurrentCalls = 1,
            AutoCompleteMessages = false
        });
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_processor is null) return;
        _processor.ProcessMessageAsync += OnMessageReceivedAsync;
        _processor.ProcessErrorAsync += OnErrorAsync;
        await _processor.StartProcessingAsync(stoppingToken);
    }

    private async Task OnMessageReceivedAsync(ProcessMessageEventArgs args)
    {
        try
        {
            var order = System.Text.Json.JsonSerializer.Deserialize<Order>(args.Message.Body);
            if (order is null)
            {
                await args.CompleteMessageAsync(args.Message);
                return;
            }

            await _orderService.UpdateStatusAsync(order.Id, OrderStatus.Processando, args.CancellationToken);
            await Task.Delay(TimeSpan.FromSeconds(5), args.CancellationToken);
            await _orderService.UpdateStatusAsync(order.Id, OrderStatus.Finalizado, args.CancellationToken);

            await args.CompleteMessageAsync(args.Message);
        }
        catch
        {
            await args.AbandonMessageAsync(args.Message);
        }
    }

    private Task OnErrorAsync(ProcessErrorEventArgs args)
    {
        Console.Error.WriteLine($"Service Bus error: {args.Exception.Message}");
        return Task.CompletedTask;
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_processor is not null)
        {
            await _processor.StopProcessingAsync(cancellationToken);
        }
        await base.StopAsync(cancellationToken);
    }
}


