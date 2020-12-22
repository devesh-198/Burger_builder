import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transfoemedIngredients = Object.keys(props.ingredients)
        .map(igkey => {
            return [...Array(props.ingredients[igkey])].map((_, i) => {
            return <BurgerIngredient key={igkey + i} type={igkey} /> 
            })
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);

        if (transfoemedIngredients.length === 0) {
            transfoemedIngredients = <p>Please start adding ingredients</p>
        }

        return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transfoemedIngredients}
            <BurgerIngredient type="bread-bottom"/>             
        </div>
    )
}

export default burger;