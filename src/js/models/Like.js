// import {loader} from "webpack";

export default class Likes {

    constructor(){
        this.likes = [];
    }

    addLike(id, img, title, author){
        const like = {
            id,
            img,
            title,
            author
        }
        this.likes.push(like);
        return like;
    }

    deleteLike(id){
        const i = this.likes.findIndex(el => el.id === id);
        this.likes.splice(i, 1);
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem("likes", JSON.stringify(this.likes))
    }

    readData(){
        let data = JSON.parse(localStorage.getItem("likes"));
        if (data){
            this.likes = data;
        }
    }


}