import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { RecipeListItem } from '../components/RecipeListItem';
import { recipes } from '../recipes';

const Category = () => {

    const { name } = useParams();
    const [ categoryRecipes, setCategoryRecipes ] = useState([]);
    const [ selectedServes, setSelectedServes] = useState("*");

    useEffect(() => {

        setCategoryRecipes(recipes[name.toLowerCase()].hits);
    }, [ name ]);

    /**
     * Filter recipes by the 'yield' or serve count
     */
    const servesFilter = (recipe) => {
        switch (selectedServes) {
            case '*':
                return true;
            case '+6':
                return recipe.yield >= 6;
            default:
                return recipe.yield === parseInt(selectedServes)
        }
    }

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Categories" defaultHref="/"/>
                    </IonButtons>
					<IonTitle>{ name } Recipes</IonTitle>
				</IonToolbar>
                <select value={selectedServes}
                    onChange={(event) => {
                        setSelectedServes(event.target.value);
                }}>
                    <option value="*">All</option>
                    <option value="1">1 serves</option>
                    <option value="2">2 serves</option>
                    <option value="3">3 serves</option>
                    <option value="4">4 serves</option>
                    <option value="5">5 serves</option>
                    <option value="6+">6+ serves</option>
                </select>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{ name } Recipes</IonTitle>
					</IonToolbar>
				</IonHeader>

                <IonList>
                {
                    (() => {
                        const filteredRecipes = categoryRecipes.filter(data => {
                            return servesFilter(data.recipe); /* && another filter */
                        });

                        return filteredRecipes.length === 0 ? (
                            <div>
                                <h3>No results found.</h3>
                                <p>Refine your search to see more results.</p>
                            </div>
                        ) : (
                            filteredRecipes.map((categoryRecipe, index) => {
                            const { recipe } = categoryRecipe;
                            return <RecipeListItem recipe={recipe} key={`recipe_${index}`} />;
                            })
                        );
                    })()
                }
                </IonList>
			</IonContent>
		</IonPage>
	);
};

export default Category;
