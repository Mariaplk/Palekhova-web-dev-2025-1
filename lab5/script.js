const currentOrder = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null,
};

function filterDishes(category, kind) {
    const container = document.getElementById(`${category}-dishes`);
    const allCards = container.querySelectorAll('.dish-card');
    
    allCards.forEach(card => {
        const dishKeyword = card.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        
        if (dish.kind === kind) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function resetFilter(category) {
    const container = document.getElementById(`${category}-dishes`);
    const allCards = container.querySelectorAll('.dish-card');
    
    allCards.forEach(card => {
        card.style.display = 'flex';
    });
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categorySection = this.closest('.dishes-section');
            const category = categorySection
                .querySelector('.dishes-grid')
                .id
                .split('-')[0];
            const kind = this.getAttribute('data-kind');
            
            const isActive = this.classList.contains('active');
            
            const sectionFilters = categorySection
                .querySelectorAll('.filter-btn');
            sectionFilters.forEach(btn => btn.classList.remove('active'));
            
            if (isActive) {
                resetFilter(category);
            } else {
                this.classList.add('active');
                filterDishes(category, kind);
            }
        });
    });
}

function highlightSelectedDish(selectedDish) {
    const allCardsInCategory = document.querySelectorAll('[data-dish]');
    allCardsInCategory.forEach((card) => {
        const dishKeyword = card.getAttribute('data-dish');
        const dish = dishes.find((d) => d.keyword === dishKeyword);
        if (dish && dish.category === selectedDish.category) {
            card.style.border = '1px solid #eee';
        }
    });

    const selectedCard = document.querySelector(
        `[data-dish="${selectedDish.keyword}"]`
    );
    if (selectedCard) {
        }

        if (currentOrder.salad) {
            orderHTML += '<div class="order-item">' +
                '<strong>Салат/стартер</strong><br>' +
                `${currentOrder.salad.name} ` +
                `${currentOrder.salad.price}Р</div>`;
            total += currentOrder.salad.price;
            hasSelectedItems = true;
            document.getElementById('salad-input')
                .value = currentOrder.salad.keyword;
        } else {
            orderHTML += '<div class="order-item">' +
                '<strong>Салат/стартер</strong><br>' +
                'Блюдо не выбрано</div>';
            document.getElementById('salad-input').value = '';
        }

        if (currentOrder.drink) {
            orderHTML += '<div class="order-item">' +
                '<strong>Напиток</strong><br>' +
                `${currentOrder.drink.name} ` +
                `${currentOrder.drink.price}Р</div>`;
            total += currentOrder.drink.price;
            hasSelectedItems = true;
            document.getElementById('drink-input')
                .value = currentOrder.drink.keyword;
        } else {
            orderHTML += '<div class="order-item">' +
                '<strong>Напиток</strong><br>' +
                'Напиток не выбран</div>';
            document.getElementById('drink-input').value = '';
        }

        if (currentOrder.dessert) {
            orderHTML += '<div class="order-item">' +
                '<strong>Десерт</strong><br>' +
                `${currentOrder.dessert.name} ` +
                `${currentOrder.dessert.price}Р</div>`;
            total += currentOrder.dessert.price;
            hasSelectedItems = true;
            document.getElementById('dessert-input')
                .value = currentOrder.dessert.keyword;
        } else {
            orderHTML += '<div class="order-item">' +
                '<strong>Десерт</strong><br>' +
                'Десерт не выбран</div>';
            document.getElementById('dessert-input').value = '';
        }
    }

    orderSummary.innerHTML = orderHTML;

    if (hasSelectedItems) {
        orderTotal.style.display = 'block';
        totalPrice.textContent = total;
    } else {
        orderTotal.style.display = 'none';
    }
}

function addToOrder(dish) {
    let orderCategory;
    if (dish.category === 'soup') orderCategory = 'soup';
    else if (dish.category === 'main') orderCategory = 'main';
    else if (dish.category === 'salad') orderCategory = 'salad';
    else if (dish.category === 'drink') orderCategory = 'drink';
    else if (dish.category === 'dessert') orderCategory = 'dessert';

    currentOrder[orderCategory] = dish;

    highlightSelectedDish(dish);
    updateOrderSummary();
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price}Р</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-btn">Добавить</button>
    `;

    const addButton = card.querySelector('.add-btn');
    addButton.addEventListener('click', () => {
        addToOrder(dish);
    });

    return card;
}

function renderDishes() {
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    
    categories.forEach(category => {
        const container = document.getElementById(`${category}-dishes`);
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
}

document.addEventListener('DOMContentLoaded', () => {
    renderDishes();
    initFilters();
});
