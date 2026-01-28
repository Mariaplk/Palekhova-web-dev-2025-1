const currentOrder = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null,
};

const availableCombos = [
    { soup: true, main: true, salad: true, drink: true },
    { soup: true, main: true, drink: true },
    { soup: true, salad: true, drink: true },
    { main: true, salad: true, drink: true },
    { main: true, drink: true },
];

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
            message: 'Выберите главное блюдо' 
        };
    }
    

    const needsDrink = 
        (currentSelection.soup && 
        currentSelection.main && 
        currentSelection.salad) || 
        (currentSelection.soup && 
        currentSelection.main) || 
        (currentSelection.soup && 
        currentSelection.salad) || 
        (currentSelection.main && 
        currentSelection.salad);   
    
    if (needsDrink && !currentSelection.drink) {
        return { 
            valid: false, 
            message: 'Выберите напиток' 
        };
    }
    
    if (currentSelection.soup && 
        !currentSelection.main && 
        !currentSelection.salad) {
        return { 
            valid: false, 
            message: 'Выберите главное блюдо/салат/стартер' 
        };
    }
    
    if (currentSelection.salad && 
        !currentSelection.soup && 
        !currentSelection.main) {
        return { 
            valid: false, 
            message: 'Выберите суп или главное блюдо' 
        };
    }
    
    const isValidCombo = availableCombos.some(combo => {
        const comboMatches = 
            (!combo.soup || currentSelection.soup) &&
            (!combo.main || currentSelection.main) &&
            (!combo.salad || currentSelection.salad) &&
            (!combo.drink || currentSelection.drink);
        
        return comboMatches;
    });
    
    if (isValidCombo) {
        return { 
            valid: true, 
            message: '' 
        };
    }

    return { 
        valid: false, 
        message: 'Выбранные блюда не соответствуют доступным комбинациям ланча' 
    };
}

function showNotification(message) {
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const text = document.createElement('p');
    text.textContent = message;
    
    const button = document.createElement('button');
    button.className = 'notification-btn';
    button.textContent = 'Окей 👌';
    
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

function initFormValidation() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (event) => {
        const orderValidation = isValidOrder();
        
        if (!orderValidation.valid) {
            event.preventDefault();
            showNotification(orderValidation.message);
            return;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDishes();
    initFilters();
    initFormValidation();
});
