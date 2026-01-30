const API_KEY = '6a48b49a-943d-4bd4-868c-94a15212daff';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
let allDishes = [];
let allOrders = [];

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function loadDishes() {
    try {
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки блюд');
        allDishes = await response.json();
        return allDishes;
    } catch (error) {
        showNotification('Ошибка загрузки блюд', 'error');
        return [];
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказов');
        allOrders = await response.json();
        return allOrders;
    } catch (error) {
        showNotification('Ошибка загрузки заказов', 'error');
        return [];
    }
}

function getDishName(dishId) {
    const dish = allDishes.find(d => d.id == dishId);
    return dish ? dish.name : 'Неизвестное блюдо';
}

function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const dateStr = date.toLocaleDateString('ru-RU');
    const timeStr = date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    return dateStr + ' ' + timeStr;
}

function formatDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        const time = order.delivery_time;
                    ${dishName} (${dishPrice} руб.)
                </div>
            </div>
        `;
    }
    
    if (order.dessert_id) {
        const dishName = getDishName(order.dessert_id);
        const dessertDish = allDishes.find(d => d.id == order.dessert_id);
        const dishPrice = dessertDish?.price || 0;
        
        html += `
            <div class="order-summary-row">
                <div class="order-summary-label">Десерт</div>
                <div class="order-summary-value">
                    ${dishName} (${dishPrice} руб.)
                </div>
            </div>
        `;
    }

    html += `
                <div class="order-summary-row order-total-row">
                    <div class="order-summary-label">Стоимость:</div>
                    <div class="order-summary-value">
                        ${totalPrice} руб.
                    </div>
                </div>
            </div>
            
            <div class="info-divider"></div>
            
            <div class="modal-buttons">
                <button type="button" class="action-btn" 
                    onclick="hideModal('edit-modal')">Отмена</button>
                <button type="submit" class="action-btn edit-btn">
                    Сохранить
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('edit-modal-content').innerHTML = html;
    
    const deliveryTypeRadios = document.querySelectorAll(
        'input[name="delivery_type"]'
    );
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const deliveryTimeRow = document.getElementById(
                'delivery-time-row'
            );
            if (this.value === 'by_time') {
                deliveryTimeRow.style.display = 'flex';
            } else {
                deliveryTimeRow.style.display = 'none';
            }
        });
    });
    
    const form = document.getElementById('edit-order-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateOrder(orderId, new FormData(form));
    });
    
    showModal('edit-modal');
}

function confirmDelete(orderId) {
    const order = allOrders.find(o => o.id == orderId);
    if (!order) return;
    
    const total = calculateOrderTotal(order);
    const composition = getOrderComposition(order);
    
    let html = `
        <h3>Удаление заказа</h3>
        <p>Вы уверены, что хотите удалить заказ?
        </p>
        <div class="modal-buttons">
            <button type="button" class="action-btn" 
                onclick="hideModal('delete-modal')">Отмена</button>
            <button type="button" class="action-btn delete-btn" 
                onclick="deleteOrder(${order.id})">Да</button>
        </div>
    `;
    
    document.getElementById('delete-modal-content').innerHTML = html;
    showModal('delete-modal');
}

function initModalListeners() {
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    const overlay = document.getElementById('modal-overlay');
    overlay.addEventListener('click', function() {
        document.querySelectorAll('.modal').forEach(modal => {
            hideModal(modal.id);
        });
    });
}

async function initOrdersPage() {
    await loadDishes();
    await loadOrders();
    renderOrdersTable();
    initModalListeners();
}

document.addEventListener('DOMContentLoaded', initOrdersPage);
