import { elements } from "./base";

const createItem = (item) => {
    let markUp = `
        <li class="shopping__item" data-itemId = "${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step=".1" class="shopping__count__value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ing}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    return markUp;
}

export const renderItem = (items) => {
    let markUp = `
        ${items.map(el => createItem(el)).join('')}        
    `;

    elements.shopping_list.insertAdjacentHTML('afterend', markUp);
}

const renderOneItem = (item) => {
    const markUp = createItem(item);
    elements.shopping_list.insertAdjacentHTML('afterend', markUp);
}

export const deleteItem = (id) => {
    let item = document.querySelector(`[data-itemId="${id}"]`);

    item.parentElement.removeChild(item);
}

export const deleteAllItems = () => {
    let items = Array.from(document.querySelectorAll('li.shopping__item'));

    items.forEach(el => {
        el.parentElement.removeChild(el);
    })
}

export const toggleClearButton = (num) => {
    document.querySelector('.clear__btn').style.visibility = num > 0 ? "visible" : "hidden";
}