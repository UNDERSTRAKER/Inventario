// Definir variables para los parámetros del inventario
//Aqui se cambian los valores de todo el programa
let maxCapacity = 50;
let orderCost = 10;
let returnCost = 5;
let minDeliveryTime = 3;
let maxDeliveryTime = 7;
let minCustomerOrder = 10;
let maxCustomerOrder = 20;
let unitNotDeliveredCost = 2;

let minInventoryLevel = 10;
let fixedOrderQuantity = 15;

let days = 2000;

// Iniciar con el inventario lleno
let currentInventory = maxCapacity;
let totalCost = 0;
let pendingOrders = [];
let dailyCosts = [];

// Función para simular el día a día del inventario
function simulateDay(day) {
    // Verificar y actualizar inventario basado en pedidos pendientes
    pendingOrders = pendingOrders.filter(order => {
        if (order.deliveryDay === day) {
            let newInventoryLevel = currentInventory + order.quantity;
            if (newInventoryLevel > maxCapacity) {
                totalCost += (newInventoryLevel - maxCapacity) * returnCost;
                currentInventory = maxCapacity; // Asumiendo que devolvemos el exceso
            } else {
                currentInventory = newInventoryLevel;
            }
            return false; // Eliminar pedido de la lista de pendientes
        }
        return true; // Mantener pedido en la lista si aún no es el día de entrega
    });

    // Simular pedido del cliente
    const customerOrder = Math.floor(Math.random() * (maxCustomerOrder - minCustomerOrder + 1)) + minCustomerOrder;
    let unitsDeliveredToCustomer = Math.min(currentInventory, customerOrder);
    let unitsNotDeliveredToCustomer = customerOrder - unitsDeliveredToCustomer;
    totalCost += unitsNotDeliveredToCustomer * unitNotDeliveredCost;
    currentInventory -= unitsDeliveredToCustomer;

    dailyCosts.push({ day, totalCost, currentInventory });
}

// Función para realizar pedidos al proveedor
function placeOrder(strategy, day) {
    if (currentInventory <= minInventoryLevel) {
        let orderQuantity = strategy === 1 ? fixedOrderQuantity : maxCapacity - currentInventory;
        let deliveryTime = Math.floor(Math.random() * (maxDeliveryTime - minDeliveryTime + 1)) + minDeliveryTime;
        pendingOrders.push({ quantity: orderQuantity, deliveryDay: day + deliveryTime });
        totalCost += orderCost; // Costo por hacer el pedido
    }
}

// Función principal para simular la estrategia
function simulateStrategy(strategy) {
    currentInventory = maxCapacity; // Reiniciar inventario para cada simulación
    totalCost = 0; // Reiniciar costo total
    pendingOrders = []; // Reiniciar pedidos pendientes
    dailyCosts = []; // Reiniciar registro de costos diarios

    for (let day = 1; day <= days; day++) {
        simulateDay(day);
        placeOrder(strategy, day);
    }
    //mostrar los resultados en la pantalla
    const containerId = strategy === 1 ? 'resultadosEstrategia1' : 'resultadosEstrategia2';
    const container = document.getElementById(containerId);

    let contenidoHtml = `<p>Gastos totales después de ${days} días:<b> $${totalCost}</b></p>`;
    container.innerHTML += contenidoHtml;

    //que voleo hacer funcionar estos botones :'c
    let btn = document.createElement('button');
    btn.textContent = `Ver Detalles de la estrategia ${strategy}`
    btn.classList.add('button')
    container.appendChild(btn);

    let detailsContainer = document.createElement('div');
    container.appendChild(detailsContainer);

    let currentDailyCosts = [...dailyCosts];

    btn.addEventListener('click', function () {
        if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '')  {
            // Mostrar los detalles
            detailsContainer.innerHTML = currentDailyCosts.map(cost => `<p>Día ${cost.day}: Costo acumulado $${cost.totalCost}, Inventario: ${cost.currentInventory}</p>`).join('');
            detailsContainer.style.display = 'block';
        } else {
            // Ocultar los detalles
            detailsContainer.innerHTML = '';
            detailsContainer.style.display = 'none';
        }
    });
}
// Simulando ambas estrategias
simulateStrategy(1);
simulateStrategy(2);