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
let fixedOrderQuantity = 15; //variable para cambiar la cantidad fija de productos de la estrategia 1

let days = 2000; //cantidad de dias que se hara la simulacion

// Iniciar con el inventario lleno
let currentInventory = maxCapacity;
let totalCost = 0;
let pendingOrders = [];
let dailyCosts = [];

//Almacenar el valor de los gastos de cada estrtaegia para la conclusion
let totalCostStrategy1 = 0;
let totalCostStrategy2 = 0;

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
        if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '') {
            // Mostrar los detalles
            detailsContainer.innerHTML = currentDailyCosts.map(cost => `<p>Día ${cost.day}: Costo acumulado $${cost.totalCost}, Inventario: ${cost.currentInventory}</p>`).join('');
            detailsContainer.style.display = 'block';
        } else {
            // Ocultar los detalles
            detailsContainer.innerHTML = '';
            detailsContainer.style.display = 'none';
        }
    });

    if (strategy === 1) {
        totalCostStrategy1 = totalCost;
    } else {
        totalCostStrategy2 = totalCost;
    }
}

function conclusionStrategies() {
    const conclusionContainer = document.getElementById('conclusion');
    let conclusionHtml = '';

    if (totalCostStrategy1 < totalCostStrategy2) {
        conclusionHtml = `<p>La Estrategia 1 es más eficiente con un costo total de $${totalCostStrategy1} comparado con $${totalCostStrategy2} de la Estrategia 2.</p> <p>Si desea comparar ambas estrategias dia a dia porfavor revisar los detalles de cada estrategia</p>`;
    } else if (totalCostStrategy2 < totalCostStrategy1) {
        conclusionHtml = `<p>La Estrategia 2 es más eficiente con un costo total de $${totalCostStrategy2} comparado con $${totalCostStrategy1} de la Estrategia 1.</p> <p>Si desea comparar ambas estrategias dia a dia porfavor revisar los detalles de cada estrategia</p>`;
    } else {
        conclusionHtml = `<p>Ambas estrategias son igualmente eficientes con un costo total de $${totalCostStrategy1}.</p> <p>Si desea comparar ambas estrategias dia a dia porfavor revisar los detalles de cada estrategia</p>`;
    }

    conclusionContainer.innerHTML = conclusionHtml;
}
// Simulando ambas estrategias
simulateStrategy(1);
simulateStrategy(2);
conclusionStrategies();