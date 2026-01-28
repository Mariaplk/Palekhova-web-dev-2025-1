const API_KEY = '6a48b49a-943d-4bd4-868c-94a15212daff';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const LOCAL_STORAGE_KEY = 'foodConstructOrder';

const availableCombos = [
    { soup: true, main: true, salad: true, drink: true },
    { soup: true, main: true, drink: true },
    { soup: true, salad: true, drink: true },
    { main: true, salad: true, drink: true },
    { main: true, drink: true },
];

let dishes = [];
let selectedDishes = {};

function showNotification(message) {
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const text = document.createElement('p');
    text.textContent = message;
    
    const button = document.createElement('button');
    button.className = 'notification-btn';
    button.innerHTML = 'Окей 👌';
    
    notification.appendChild(text);
    notification.appendChild(button);
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
    
    button.addEventListener('click', () => {
        overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

async function loadDishes() {
    try {
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        dishes = await response.json();
        return dishes;
    } catch (error) {
        showNotification(
            'Ошибка загрузки данных. Пожалуйста, обновите страницу.'
        );
        return [];
    }
}

function loadSelectedDishes() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        selectedDishes = JSON.parse(saved);
    }
}

function saveSelectedDishes() {
    localStorage.setItem(
        LOCAL_STORAGE_KEY, 
        JSON.stringify(selectedDishes)
    );
}

            delete selectedDishes[existingDish.id];
        }
        selectedDishes[dishId] = true;
    }
    
    saveSelectedDishes();
    updateDishCardStates();
    updateStickyPanel();
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish-id', dish.id);
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price}Р</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-btn">Добавить</button>
    `;
    
    const addButton = card.querySelector('.add-btn');
    addButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDishSelection(dish.id);
    });
    
    card.addEventListener('mouseenter', () => {
        const selectedDish = getDishByCategory(dish.category);
        if (!selectedDish || selectedDish.id !== dish.id) {
            card.style.border = '2px solid tomato';
            addButton.style.backgroundColor = 'tomato';
            addButton.style.color = 'white';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const selectedDish = getDishByCategory(dish.category);
        if (!selectedDish || selectedDish.id !== dish.id) {
            card.style.border = '1px solid #eee';
            addButton.style.backgroundColor = '#f1eee9';
            addButton.style.color = '#000';
        }
    });
    
    return card;
}

function renderDishes() {
    const categories = ['soup', 'main-course', 'salad', 'drink', 'dessert'];
    
    categories.forEach(category => {
        let containerId;
        
        if (category === 'main-course') {
            containerId = 'main-dishes';
        } else {
            containerId = `${category}-dishes`;
        }
        
        const container = document.getElementById(containerId);
        
        if (!container) return;
        
        const categoryDishes = dishes.filter(dish => 
            dish.category === category
        );
        const sortedDishes = categoryDishes.sort((a, b) => 
            a.name.localeCompare(b.name)
        );
        
        container.innerHTML = '';
        
        sortedDishes.forEach(dish => {
            const dishCard = createDishCard(dish);
            container.appendChild(dishCard);
        });
    });
    
    updateDishCardStates();
}

function initStickyPanel() {
    const panelHTML = `
        <div id="sticky-panel" class="sticky-panel" 
            style="display: none; position: sticky; bottom: 0; 
                   background: white; padding: 1rem; 
                   border-top: 1px solid #ddd; text-align: center; 
                   z-index: 1000;">
            <p>Стоимость заказа: 
                <span id="total-price-sticky">0</span> руб.
            </p>
            <a href="order.html" id="go-to-order" 
               style="display: inline-block; margin-top: 0.5rem; 
                      padding: 0.5rem 1rem; background: #4CAF50; 
                      color: white; text-decoration: none; 
                      border-radius: 4px;">
                Перейти к оформлению
            </a>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
}

async function initPage() {
    await loadDishes();
    loadSelectedDishes();
    renderDishes();
    initFilters();
    initStickyPanel();
    updateStickyPanel();
}

document.addEventListener('DOMContentLoaded', initPage);
