export const elements =  {
    search_form: document.querySelector('.search'),
    search_input: document.querySelector('.search__field'),
    result_list: document.querySelector('.results__list'),
    recipe: document.querySelector('.recipe'),
    result: document.querySelector('.results'),
    results_pages: document.querySelector('.results__pages'),
    results_link: document.querySelector('.results__link'),
    recipe_ingredient_list: document.querySelector('.recipe__ingredient-list'),
    shopping_list: document.querySelector('.heading-2'),
    shopping: document.querySelector('.shopping'),
    like_panel: document.querySelector('.likes__panel'),
    like_field: document.querySelector('.likes__field'),
    likes_list: document.querySelector('.likes__list')
}

export const deleteLoader = () => {
    const loader = document.querySelector('.loader');

    if (loader) loader.parentElement.removeChild(loader);
}

export const renderLoader = (parent) => {
    const html = `
        <div class="loader">
            <svg> 
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', html);

}