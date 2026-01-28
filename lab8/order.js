const API_KEY = '6a48b49a-943d-4bd4-868c-94a15212daff';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const LOCAL_STORAGE_KEY = 'foodConstructOrder';

function getDishByCategory(category) {
    const selectedIds = Object.keys(selectedDishes);
    for (const dishId of selectedIds) {
        const dish = allDishes.find(d => d.id == dishId);
        if (dish && (dish.category === category || 
                     (category === 'main' && 
                      (dish.category === 'main_course' || 
                       dish.category === 'main-course')))) {
            return dish;
        }
    }
    return null;
}

function renderOrderItems() {
    const container = document.getElementById('order-items-list');
    const selectedIds = Object.keys(selectedDishes);
    
    if (selectedIds.length === 0) {
        container.innerHTML = `
            <div class="empty-order">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, 
                перейдите на страницу <a href="index.html">Собрать ланч</a>.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'dishes-grid';
    
    selectedIds.forEach(dishId => {
        const dish = allDishes.find(d => d.id == dishId);
        if (!dish) return;
        
        const item = document.createElement('div');
        item.className = 'dish-card';
        item.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price}Р</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="remove-btn" data-id="${dish.id}">Удалить</button>
        `;
        
        const removeButton = item.querySelector('.remove-btn');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeDishFromOrder(dish.id);
        });
        
        gridContainer.appendChild(item);
    });
    
    container.appendChild(gridContainer);
}

function updateOrderSummary() {
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    let totalPrice = 0;
    
    categories.forEach(category => {
        const dish = getDishByCategory(category);
        const summaryElement = document.getElementById(`${category}-summary`);
        
        if (dish) {
            summaryElement.textContent = `${dish.name} ${dish.price}Р`;
            totalPrice += dish.price;
        } else {
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: formData.get('delivery_type')
    };
    
    if (orderData.delivery_type === 'by_time') {
        const deliveryTime = formData.get('delivery_time');
        if (!deliveryTime) {
            alert('Укажите время доставки');
            return;
        }
        
        const now = new Date();
        const [hours, minutes] = deliveryTime.split(':').map(Number);
        const deliveryDate = new Date();
        deliveryDate.setHours(hours, minutes, 0, 0);
        
        if (deliveryDate < now) {
            alert('Время доставки не может быть раньше текущего времени');
            return;
        }
        
        orderData.delivery_time = deliveryTime;
    }
    
    const comment = formData.get('comments');
    if (comment) {
        orderData.comment = comment;
    }
    
    const soupDish = getDishByCategory('soup');
    if (soupDish) orderData.soup_id = soupDish.id;
    
    const mainDish = getDishByCategory('main');
    if (mainDish) orderData.main_course_id = mainDish.id;
    
    const saladDish = getDishByCategory('salad');
    if (saladDish) orderData.salad_id = saladDish.id;
    
    const drinkDish = getDishByCategory('drink');
    if (drinkDish) {
        orderData.drink_id = drinkDish.id;
    } else {
        alert('Напиток обязателен для заказа');
        return;
    }
    
    const dessertDish = getDishByCategory('dessert');
    if (dessertDish) orderData.dessert_id = dessertDish.id;
    
    if (!mainDish) {
        const selectedCombo = getSelectedCombo();
        if (selectedCombo && selectedCombo.main) {
            alert('Главное блюдо обязательно для выбранного комбо');
            return;
        }
    }
    
    if (!validateCombo()) {
        alert('Состав заказа не соответствует доступным комбо');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка отправки заказа');
        }
        
        const result = await response.json();
        alert('Заказ успешно оформлен! ID заказа: ' + result.id);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.location.href = 'index.html';
        
    } catch (error) {
        alert('Ошибка при оформлении заказа: ' + error.message);
    }
}

function initEventListeners() {
    const form = document.getElementById('order-submit-form');
    form.addEventListener('submit', submitOrder);
    
    const deliveryTypeRadios = document.querySelectorAll(
        'input[name="delivery_type"]'
    );
    const deliveryTimeInput = document.getElementById('delivery_time');
    
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const checkedRadio = document.querySelector(
                'input[name="delivery_type"]:checked'
            );
            deliveryTimeInput.disabled = checkedRadio.value !== 'by_time';
        });
    });
    
    deliveryTimeInput.disabled = true;
}

async function initOrderPage() {
    await loadAllDishes();
    loadSelectedDishes();
    renderOrderItems();
    updateOrderSummary();
    initEventListeners();
}

document.addEventListener('DOMContentLoaded', initOrderPage);
