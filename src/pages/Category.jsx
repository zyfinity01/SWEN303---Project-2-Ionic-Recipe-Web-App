import { IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { RecipeListItem } from '../components/RecipeListItem';
import { recipes } from '../recipes';
import { chevronDownOutline } from "ionicons/icons";

const Category = () => {
    const { name } = useParams();
    const [ categoryRecipes, setCategoryRecipes ] = useState([]);
    const [ selectedServes, setSelectedServes] = useState("*");
    const [ sortType, setSortType ] = useState('');

    useEffect(() => {
        setCategoryRecipes(recipes[name.toLowerCase()].hits);
    }, [name]);

    /**
     * Sort recipes
     * @param {string} type value to sort by
     */
    const sortRecipes = (type) => {
        let sortedRecipes = [...categoryRecipes];
        sortedRecipes.sort((a, b) => {
            if (type === 'calorieCount') {
                return a.recipe.calories - b.recipe.calories;
            } else if (type === 'totalTime') {
                return a.recipe.totalTime - b.recipe.totalTime;
            } else {
                return 0;
            }
        });
        setCategoryRecipes(sortedRecipes);
        setSortType(type);
    };

    /**
     * Filter recipes by the 'yield' or serve count
     * @param {Object} recipe API recipe.
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
                    { /* Sort Buttons */ }
                    <IonButtons slot="end">
                        <IonButton style={{ '--background': 'white', '--color': 'black' }} onClick={() => sortRecipes('calorieCount')}>
                            <IonIcon icon={chevronDownOutline} />&nbsp;Sort by Calorie Count
                        </IonButton>
                        <IonButton style={{ '--background': 'white', '--color': 'black' }} onClick={() => sortRecipes('totalTime')}>
                            <IonIcon icon={chevronDownOutline} />&nbsp;Sort by Total Time
                        </IonButton>
                    </IonButtons>
				</IonToolbar>
      
                { /* Serves selector */}
                <select value={selectedServes} onChange={(event) => {
                    setSelectedServes(event.target.value);
                }}>
                    <option value="*">All Serves</option>
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
