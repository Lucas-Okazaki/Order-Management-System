using Api2.Background;
using Api2.Data;
using Api2.Models;
using Api2.Services;
using Azure.Messaging.ServiceBus;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5099");

var pgCs = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrWhiteSpace(pgCs))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(pgCs));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("ordersdb"));
}

var serviceBusCs = builder.Configuration["AzureServiceBus:ConnectionString"];
if (!string.IsNullOrWhiteSpace(serviceBusCs))
{
    try
    {
        var endpointPart = serviceBusCs
            .Split(';', StringSplitOptions.RemoveEmptyEntries)
            .FirstOrDefault(p => p.TrimStart().StartsWith("Endpoint=", StringComparison.OrdinalIgnoreCase))?
            .Substring("Endpoint=".Length);

        if (!string.IsNullOrWhiteSpace(endpointPart) && Uri.TryCreate(endpointPart, UriKind.Absolute, out _))
        {
            builder.Services.AddSingleton(new ServiceBusClient(serviceBusCs));
        }
        else
        {
            Console.WriteLine("[api2] ServiceBus desabilitado: ConnectionString inválida.");
        }
    }
    catch
    {
        Console.WriteLine("[api2] ServiceBus desabilitado: falha ao validar ConnectionString.");
    }
}

builder.Services.AddScoped<OrderService>();
builder.Services.AddHostedService<OrderProcessorWorker>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.MapPost("/orders", async (Order input, OrderService service, CancellationToken ct) =>
{
    var created = await service.CreateAsync(input, ct);
    return Results.Created($"/orders/{created.Id}", created);
});

app.MapGet("/orders", async (OrderService service, CancellationToken ct) =>
{
    var items = await service.ListAsync(ct);
    return Results.Ok(items);
});

app.MapGet("/orders/{id}", async (Guid id, OrderService service, CancellationToken ct) =>
{
    var item = await service.GetByIdAsync(id, ct);
    return item is not null ? Results.Ok(item) : Results.NotFound();
});

app.Run();


