import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../axios-orders';
import { useDispatch, useSelector } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import withErroeHandler from '../../hoc/withErrorHandler/withErrorHandler';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

const burgerBuilder = props => {
	const [purchasing, setPurchasing] = useState(false)

	const dispatch = useDispatch()

	// ing: state.burgerBuilder.ingredients,
	// 	price: state.burgerBuilder.totalPrice,
	// 	error: state.burgerBuilder.error,
	// 	isAuthenticated: state.auth.token !== null,

	const ing = useSelector(state => state.burgerBuilder.ingredients)
	const price = useSelector(state => state.burgerBuilder.totalPrice)
	const error = useSelector(state => state.burgerBuilder.error)
	const isAuthenticated = useSelector(state => state.auth.token !== null)
	
	const onIngredientAdded = (ingName) => dispatch(actions.addIngredients(ingName))
	const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName))
	const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [])
	const onInitPurchase = () => dispatch(actions.purchaseInit())
	const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path))
	
	useEffect(() => {
		onInitIngredients()
	}, [onInitIngredients])

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	}

	const purchaseHandler = () => {
		if (isAuthenticated) {
			setPurchasing(true)
		} else {
			onSetAuthRedirectPath('/checkout')
			props.history.push('/auth')
		}
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false)
	};

	const purchaseContinueHandler = () => {
		onInitPurchase();
		props.history.push('/checkout');
	}

	const disabledInfo = {
		...ing
	}

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let orderSummary = null;

	let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner />;

	if (ing) {
		burger = (
			<Auxiliary>
				<Burger ingredients={ing} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemove={onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(ing)}
					ordered={purchaseHandler}
					isAuth={isAuthenticated}
					price={price}
				/>
			</Auxiliary>
		)

		orderSummary = <OrderSummary
			ingredients={ing}
			price={price}
			purchaseCancelled={purchaseCancelHandler}
			purchaseContinued={purchaseContinueHandler}
		/>;
	}

	// if (loading) {
	// 	orderSummary = <Spinner />
	// }

	return (
		<Auxiliary>
			<Modal
				show={purchasing}
				modalClosed={purchaseCancelHandler}
			>
				{orderSummary}
			</Modal>
			{burger}
		</Auxiliary>
	);

}

export default withErroeHandler(burgerBuilder, axios);

