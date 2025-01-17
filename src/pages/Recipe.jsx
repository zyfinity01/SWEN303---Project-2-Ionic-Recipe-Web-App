import { IonBackButton, IonButton, IonButtons, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonList, IonListHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonModal, useIonToast } from '@ionic/react';
import { bookmark, bookmarkOutline, informationCircleOutline, layersOutline, peopleOutline, timeOutline, home } from 'ionicons/icons';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { Ingredient } from '../components/Ingredient';
import IngredientsModal from '../components/IngredientsModal';
import NutritionModal from '../components/NutritionModal';
import BookmarkStore, { addToBookmarks } from '../store/BookmarkStore';
import styles from "./Recipe.module.scss";

import { useStoreState } from "pullstate";
import { getBookmarks } from '../store/Selectors';

const Recipe = () => {

	const pageRef = useRef();
	const { state } = useLocation();
	const [ recipe, setRecipe ] = useState([]);
	const [ fromSearch, setFromSearch ] = useState(false);
	const [ fromBookmarks, setFromBookmarks ] = useState(false);

	const history = useHistory();
	const bookmarks = useStoreState(BookmarkStore, getBookmarks);

	const [ showToast ] = useIonToast();

	const handleDismissIngredientsModal = () => {

		hideIngredientsModal();
	}

	const handleDismissNutritionModal = () => {

		hideNutritionModal();
	}

	const [ showIngredientsModal, hideIngredientsModal ] = useIonModal(IngredientsModal, {

		dismiss: handleDismissIngredientsModal,
		ingredients: recipe.ingredients
	});

	const [ showNutritionModal, hideNutritionModal ] = useIonModal(NutritionModal, {

		dismiss: handleDismissNutritionModal,
		recipe
	});

    const goToHome = () => {
        history.push('/');
    }

	useEffect(() => {

		if (state && state.recipe) {

			setRecipe(state.recipe);
		}

		if (state && state.fromSearch) {

			setFromSearch(state.fromSearch);
		}

		if (state && state.fromBookmarks) {

			setFromBookmarks(state.fromBookmarks);
		}
	}, [ state ]);

	const addBookmark = async () => {

		const added = addToBookmarks(recipe);
		showToast({

			message: added ? "This recipe has been bookmarked!" : "This recipe has been removed from your bookmarks.",
			duration: 2000,
			color: "main"
		});
	}

	return (
		<IonPage ref={ pageRef }>
			<IonHeader>
				<IonToolbar>
					<IonTitle>View Recipe</IonTitle>
					<IonButtons slot="start">
						<IonBackButton text={ fromSearch ? "Search" : fromBookmarks ? "Bookmarks" : "Recipes" } color="main" defaultHref="/" />
					</IonButtons>

					<IonButtons slot="end">
						<IonButton onClick={ addBookmark }>
							<IonIcon icon={ bookmarks.includes(recipe) ? bookmark : bookmarkOutline } className='white-icon' />
						</IonButton>
						<IonButton onClick={goToHome}>
                            <IonIcon icon={home} className='white-icon' />
                        </IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>

				<div className={ styles.headerImage }>
					<img src={ recipe.image } alt="main cover"
						onError={(e) => {
							e.currentTarget.src = "/assets/placeholder.png"
						}}
					/>
					<div className={ `${ styles.headerInfo } animate__animated animate__slideInLeft` }>
						<h1>{ recipe.label }</h1>
						<p>{ recipe.dishType && recipe.dishType[0] }</p>
					</div>
				</div>

				<IonGrid>

					<IonRow className="ion-text-center">
						<IonCol size="4">
							<IonCardTitle>
								<IonIcon icon={ peopleOutline } />
							</IonCardTitle>
							<IonCardSubtitle>serves { recipe.yield && recipe.yield }</IonCardSubtitle>
						</IonCol>
						<IonCol size="4">
							<IonCardTitle>
								<IonIcon icon={ timeOutline } />
							</IonCardTitle>
							<IonCardSubtitle>{ recipe.totalTime !== 0 ? `${ recipe.totalWeight && recipe.totalWeight.toFixed(0) } mins` : "N/A" }</IonCardSubtitle>
						</IonCol>
						<IonCol size="4">
							<IonCardTitle>
								<IonIcon icon={ layersOutline } />
							</IonCardTitle>
							<IonCardSubtitle>{ recipe.totalWeight && recipe.totalWeight.toFixed(0) }g</IonCardSubtitle>
						</IonCol>
					</IonRow>

					<IonRow className="ion-text-center">
						<IonCol size="6">
							{/* <IonButton color="main" onClick={ () => showIngredientsModal({
								
								presentingElement: pageRef.current,
								cssClass: "customModal"
							})}>
								<IonIcon icon={ informationCircleOutline } />&nbsp;
								View Ingredients
								</IonButton> */}
						</IonCol>
						<IonCol size="12">
							<IonButton expand="block" color="main" onClick={ () => showNutritionModal({
								
								presentingElement: pageRef.current,
								cssClass: "customModal"
							})}>
								<IonIcon icon={ informationCircleOutline } />&nbsp;
								View Nutrition
								</IonButton>
						</IonCol>
					</IonRow>

						{ recipe.ingredients && 
							<IonList>
								<IonListHeader>Ingredients ({ recipe.ingredients.length })</IonListHeader>
								{ recipe.ingredients.map((ingredient, index) => {

									return <Ingredient key={ `ingredient_${ index }` } ingredient={ ingredient } />;
								})}
							</IonList>
						}
					</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Recipe;
