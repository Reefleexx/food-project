import { elements, renderLoader, deleteLoader } from "./views/base";
import {renderRecipes} from "./views/searchView";
import * as SearchView from './views/searchView.js';
import * as RecipeView from "./views/recipeView";
import * as ListView from "./views/listView";
import * as LikesView from "./views/likeView";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Like";
import Search from "./models/Search.js";



let state = {};

/*
    ****SEARCH CONTROLLER****
 */

const controlSearch = async () => {

    /*Get data from the input */
    const query = SearchView.getInput();

    //Test
    // const query = 'pizza';


    if (query) {
        // save to the state
        state.search = new Search(query);

        // Loader spining
        renderLoader(elements.result);

        //3) Search for result
        try{
            await state.search.getResults();
            deleteLoader();

            //4 Log it to the UI
            SearchView.clearList();
            SearchView.clearInput();
            SearchView.renderRecipes(state.search.result);
        }catch (err){
            alert('Invalid request');
        }

    }
};

/*
    ****RECIPE CONTROLLER****
 */
const controlRecipe = async () => {
    // Get id from URL
    const id = window.location.hash.replace("#", "");

    if (id) {
        // Prepare UI for changes
        if (state.search) SearchView.highlighted_link(id);

        RecipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create a new recipe object
        state.recipe = new Recipe(id);

        // Get data from server
        await state.recipe.getRecipe();

        // Calculate data

        state.recipe.calcServings();
        state.recipe.calcTime();
        state.recipe.parseIngredients();

        deleteLoader();
        // Render recipe
        RecipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
};


/*
    ****LIST CONTROLLER****
 */
const controlList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        state.list.addItem(el.count, el.unit, el.ingredients);
    })
    state.list.persistItems();
    ListView.renderItem(state.list.items);
}


/*
    ****LIST CONTROLLER****
*/


/*
        ****CASH CONTROLLER****
*/
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.list = new List();
    state.list.readItems();
    state.likes.readData();
    ListView.toggleClearButton(state.list.getNumOfItems());
    LikesView.toggleLikeMenu(state.likes.getNumOfLikes())
    ListView.renderItem(state.list.items);
    state.likes.likes.forEach(el => LikesView.renderLike(el));
})


const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)){

        // Add recipe from the state
        let like = state.likes.addLike(currentID, state.recipe.img, state.recipe.title, state.recipe.publisher);
        state.likes.persistData();

        // Toggle like buttons
        LikesView.toggleLikeButton(false);

        // Add like to the UI
        LikesView.renderLike(like);
    // User IS liked current recipe
    } else {
        // Delete recipe from the state
        state.likes.deleteLike(currentID);
        state.likes.persistData();

        // Toggle like buttons
        LikesView.toggleLikeButton(true);

        // Remove like from the UI
        LikesView.deleteLike(currentID);
    }
    LikesView.toggleLikeMenu(state.likes.getNumOfLikes())

}

/*****
    ****EVENT HANDLERS****
*****/

////////////////    CONTROL RECIPES   \\\\\\\\\\\\\
['hashchange', 'load'].forEach(el => window.addEventListener(el, controlRecipe));

///////////////     FIND RECIPES    \\\\\\\\\\\\\\\
elements.search_form.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});

//////////////      PAGE BUTTONS     \\\\\\\\\\\\\\
elements.result.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const pageNumber = parseInt(btn.dataset.goto, 10);

        SearchView.clearList();
        renderRecipes(state.search.result, pageNumber);
    }
});

//////////////      RECIPE BUTTONS    \\\\\\\\\\\\\\\\\\
elements.recipe.addEventListener('click', e => {
    // DECREASE BUTTON CLICKED
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
       if (state.recipe.servings > 1) {
           state.recipe.updateCount('dec');
           RecipeView.updateCount(state.recipe);
       }
   }
    // INCREASE BUTTON CLICKED
   if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateCount('inc');
        RecipeView.updateCount(state.recipe);
    }
    // SHOPPING LIST BUTTON IS CLICKED
   if (e.target.matches('.btn-small.recipe__btn, .btn-small.recipe__btn *')){
        controlList();
        ListView.toggleClearButton(state.list.getNumOfItems());
   }
    // LIKE BUTTON IS CLICKED
   if (e.target.matches('.recipe__love, .recipe__love *')){
       controlLikes();
   }
});

//////////////      SHOPPING LIST BUTTONS     \\\\\\\\\\\\\\\\\\
elements.shopping.addEventListener('click', e => {

    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        const id = e.target.closest('.shopping__item').dataset.itemid;
        //////////  Delete shopping item from the state
        state.list.deleteItem(id);
        state.list.persistItems();

        /////////   Delete shopping item from the UI
        ListView.deleteItem(id);
        ListView.toggleClearButton(state.list.getNumOfItems());

    }else if (e.target.matches('.shopping__count__value')){
        const id = e.target.closest('.shopping__item').dataset.itemid;

        const value = parseFloat(e.target.value, 10);
        state.list.updateCount(id, value);
        state.list.persistItems();

    }else if (e.target.closest('.clear__btn')){
        // Delete from the state
        state.list.deleteAllItems();
        state.list.persistItems();

        // Delete from the UI
        ListView.deleteAllItems();

        //Toggle clear button
        ListView.toggleClearButton(state.list.getNumOfItems());
    }
})
