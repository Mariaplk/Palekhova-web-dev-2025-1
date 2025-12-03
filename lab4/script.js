const currentOrder = {
    soup: null,
    main: null,
    drink: null,
};

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
        selectedCard.style.border = '2px solid tomato';
    }
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const orderTotal = document.getElementById('order-total');
    const totalPrice = document.getElementById('total-price');

    let total = 0;
    let hasSelectedItems = false;
    let orderHTML = '';

    const hasAnySelection = currentOrder.soup || 
        currentOrder.main || 
        currentOrder.drink;

    if (!hasAnySelection) {
        orderHTML = '<h2>Ничего не выбрано</h2>';
    } else {
        if (currentOrder.soup) {
            orderHTML += '<div class="order-item">' +
                '<strong>Суп</strong><br>' +
                `${currentOrder.soup.name} ` +
                `${currentOrder.soup.price}Р</div>`;
            total += currentOrder.soup.price;
            hasSelectedItems = true;
            document.getElementById('soup-input')
                .value = currentOrder.soup.keyword;
        } else {
            orderHTML += '<div class="order-item">' +
                '<strong>Суп</strong><br>' +
                'Блюдо не выбрано</div>';
            document.getElementById('soup-input').value = '';
        }

        if (currentOrder.main) {
            orderHTML += '<div class="order-item">' +
                '<strong>Главное блюдо</strong><br>' +
                `${currentOrder.main.name} ` +
                `${currentOrder.main.price}Р</div>`;
            total += currentOrder.main.price;
            hasSelectedItems = true;
            document.getElementById('main-input')
                .value = currentOrder.main.keyword;
        } else {
            orderHTML += '<div class="order-item">' +
                '<strong>Главное блюдо</strong><br>' +
                'Блюдо не выбрано</div>';
            document.getElementById('main-input').value = '';
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
    else if (dish.category === 'drink') orderCategory = 'drink';

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
    const sortedDishes = [...dishes].sort((a, b) => 
        a.name.localeCompare(b.name)
    );
    const soupContainer = document.getElementById('soup-dishes');
    const mainContainer = document.getElementById('main-dishes');
    const drinkContainer = document.getElementById('drink-dishes');

    soupContainer.innerHTML = '';
    mainContainer.innerHTML = '';
    drinkContainer.innerHTML = '';

    sortedDishes.forEach((dish) => {
        const dishCard = createDishCard(dish);

        if (dish.category === 'soup') {
            soupContainer.appendChild(dishCard);
        } else if (dish.category === 'main') {
            mainContainer.appendChild(dishCard);
        } else if (dish.category === 'drink') {
            drinkContainer.appendChild(dishCard);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDishes();
});
