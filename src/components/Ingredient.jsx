import { IonItem, IonLabel } from "@ionic/react";
import styles from "./Ingredient.module.scss";

export const Ingredient = ({ ingredient }) => {

	return (

		<IonItem lines="full" className={ styles.ingredientItem }>
			<img alt="ingredient" src={ ingredient.image } className={ styles.ingredientImage }
				onError={(e) => {
					e.currentTarget.src = "/assets/placeholder.png"
				}}/>
			<IonLabel className="ion-text-wrap ion-margin-start">
				<h3>{ ingredient.text }</h3>
				<p>{ ingredient.weight.toFixed(2) }g</p>
			</IonLabel>
		</IonItem>
	);
}