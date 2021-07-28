export default class Search{
    constructor(query) {
        this.query = query;
    }
    async getResults(){
        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            let data = await res.json();
            this.result = data.recipes;
        } catch(err) {
            alert(err);
        }
    }

}



