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

let dishes = [];

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

function loadDishes() {
    return fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            dishes = data.map(dish => ({
                keyword: dish.keyword,
                name: dish.name,
                price: dish.price,
                category: dish.category,
                count: dish.count,
                image: dish.image,
                kind: dish.kind
            }));
            return dishes;
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            showNotification(
                'Не удалось загрузить меню. Пожалуйста, обновите страницу.'
            );
            return [];
        });
    if ((currentSelection.drink || currentSelection.dessert) && 
        !currentSelection.soup && 
        !currentSelection.main && 
        !currentSelection.salad) {
        return { 
            valid: false, 
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

function initFormValidation() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const orderValidation = isValidOrder();
        
        if (!orderValidation.valid) {
            showNotification(orderValidation.message);
            return;
        }
        
        const requiredFields = form.querySelectorAll('[required]');
        let missingFields = [];
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                missingFields.push(field.name);
            }
        });
        
        if (missingFields.length > 0) {
            showNotification('Заполните все обязательные поля формы');
            return;
        }
        
        form.submit();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDishes()
        .then(() => {
            renderDishes();
            initFilters();
            initFormValidation();
        })
        .catch(error => {
            console.error('Ошибка инициализации:', error);
            showNotification(
                'Ошибка загрузки данных. Пожалуйста, обновите страницу.'
            );
        });
});
