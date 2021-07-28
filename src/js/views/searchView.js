import { elements } from './base';

export const getInput = ()  => elements.search_input.value

export const clearList = () => {
    elements.results_pages.innerHTML = '';
    elements.result_list.innerHTML = '';
}
export const clearInput = () => {
    elements.search_input.value = '';
}
export const highlighted_link = id => {
    // document.querySelector('results_link--active').classList.remove('results_link--active')
    document.querySelectorAll('.results__link').forEach(el => {
        el.classList.remove('results__link--active')
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

const limitString = (title, limit = 17) => {
    if (title.length > limit){

        let newTitle = [];
        title.split(' ').reduce((count, cur) => {
            if (count + cur.length < limit){
                newTitle.push(cur);
            }
            return count + cur.length;
        }, 0)

        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderOneRecipe = (recipe) => {
    let markUp = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${limitString(recipe.title, 18)}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitString(recipe.title, 18)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    elements.result_list.insertAdjacentHTML('beforeend', markUp)
}

const createButton = (page, type) => `
   <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
   </button>
`

const renderPageButton = (page, numResults, resultsPerPage) => {

    const pages = Math.ceil(numResults / resultsPerPage);
    let button;

    if (page === 1 && pages > 1){
        //Only button to next page
        button = createButton(1, "next")
    } else if(page === pages && pages > 1){
        //Only button to previous page
        button = createButton(pages, "prev")
    } else if (page < pages) {
        //Both buttons
        button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `
    }

    elements.results_pages.insertAdjacentHTML('afterbegin', button);

}

export const renderRecipes = (recipes, page = 1 , resultsPerPage = 10) => {

    let start = (page - 1) * resultsPerPage;
    let end = page * resultsPerPage;

    recipes.slice(start, end).forEach(el => renderOneRecipe(el));
    renderPageButton(page, recipes.length, resultsPerPage);
}

