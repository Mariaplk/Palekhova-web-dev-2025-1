const API_KEY = '6a48b49a-943d-4bd4-868c-94a15212daff';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const LOCAL_STORAGE_KEY = 'foodConstructOrder';

let allDishes = [];
let selectedDishes = {};

function checkAuthError(response) {
    if (response.status === 401) {
        showNotification(
            'Необходима авторизация. Проверьте API Key.',
            'error'
        );
        return true;
    }
    return false;
}

function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        
        if (checkAuthError(response)) {
            return [];
        }
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки заказов');
        }
        
        return await response.json();
    } catch (error) {
        showNotification('Ошибка загрузки заказов', 'error');
        return [];
    }
}

async function checkOrderLimit() {
    try {
        const orders = await loadOrders();
        return orders.length < 10;
    } catch (error) {
        console.error('Ошибка проверки лимита заказов:', error);
        return true;
    }
}

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
                'Время доставки не может быть раньше текущего времени',
                'error'
            );
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
        showNotification('Напиток обязателен для заказа', 'error');
        return;
    }
    
    const dessertDish = getDishByCategory('dessert');
    if (dessertDish) orderData.dessert_id = dessertDish.id;
    
    if (!mainDish) {
        const selectedCombo = getSelectedCombo();
        if (selectedCombo && selectedCombo.main) {
            showNotification(
                'Главное блюдо обязательно для выбранного комбо',
                'error'
            );
            return;
        }
    }
    
    if (!validateCombo()) {
        showNotification(
            'Состав заказа не соответствует доступным комбо',
            'error'
        );
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
        
        if (checkAuthError(response)) {
            return;
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка отправки заказа');
        }
        
        const result = await response.json();
        const successMsg = 'Заказ успешно оформлен! ID заказа: ' + result.id;
        showNotification(successMsg, 'success');
        
        setTimeout(() => {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            window.location.href = 'index.html';
        }, 3000);
        
    } catch (error) {
        const errorMsg = 'Ошибка при оформлении заказа: ' + error.message;
        showNotification(errorMsg, 'error');
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
