import axios from 'axios';
import { Fraction } from 'fractional';

export default class Recipe {


    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try{

            let data = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            data = data.data.recipe;

            this.title = data.title;
            this.img = data.image_url;
            this.url = data.source_url;
            this.publisher = data.publisher;
            this.ingredients = data.ingredients;
            this.lengthIng = this.ingredients.length;

        } catch (err) {
            alert(err);
        }
    }


    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;

    }

    parseIngredients() {
        const longUnits = ["cups", "tablespoons", "tablespoon", "teaspoons", "teaspoon", "ounces", "ounce", "pounds", "jars"];
        const shirtUnits = ["cup", "tbsp", "tbsp", "tsp", "tsp", "oz", "oz", "pound", "jar"];
        let units = [...shirtUnits, 'kg', 'g'] ;

        let newIngredients = this.ingredients.map(el => {
             // Uniform units
            let ingredients = el.toLowerCase();

            longUnits.forEach((unitLong, i) => {
                ingredients = ingredients.replace(unitLong, shirtUnits[i]);
            });

            // Delete parentheses
            ingredients = ingredients.replace(/ *\([^)]*\) */g, " ");

            // Sort all of this sheet
            let arrOfIng = ingredients.split(' ');

            const unitIndex = arrOfIng.findIndex(element => units.includes(element));

            let objIng;

            // If there are both unit and count
            if (unitIndex > -1) {
                let arrOfNums = arrOfIng.slice(0, unitIndex);
                let count;

                if (arrOfNums.length === 1){
                    if (arrOfNums[0] != '' && arrOfNums[0] != ' ') {
                        count = eval(arrOfNums[0].replace("-", "+"))
                    } else if (arrOfNums[0] == ''){
                        count = 1;
                    }
                } else if(arrOfNums.length === 2){
                    count = eval(arrOfNums.join("+"));
                }

                objIng = {
                    count,
                    unit: arrOfIng[unitIndex],
                    ingredients: arrOfIng.slice(unitIndex + 1).join(" ")
                }
              // If there are NO unit and first el is number
            }else if(parseInt(arrOfIng[0], 10)) {
                objIng = {
                    count: parseInt(arrOfIng[0], 10),
                    unit: "",
                    ingredients: arrOfIng.slice(1).join(' ')
                }
             // if there are no unit and no count
            }else if(unitIndex === -1) {
                objIng = {
                    count: 1,
                    unit: "",
                    ingredients
                }

            }

            return objIng;
        });

        this.ingredients = newIngredients;

    }

    updateCount(type) {

        let newServ = type === 'inc' ? this.servings + 1 : this.servings - 1;

        this.ingredients.forEach(el => {
            el.count *= (newServ / this.servings);
        })

        this.servings = newServ;
    }

}