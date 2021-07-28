import { elements } from "./base";

export const toggleLikeButton = (isLiked) => {
    const iconString = isLiked ? '-outlined' : '';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart${iconString}`);
}

export const toggleLikeMenu = (num) => {
    elements.like_field.style.visibility = num > 0 ? "visible" : "hidden";
}

export const renderLike = (like) => {
    const markUp = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitString(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>    
    `;
    elements.likes_list.insertAdjacentHTML('beforeend', markUp);

}

export const deleteLike = id => {
    const li = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;

    li.parentElement.removeChild(li);
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

