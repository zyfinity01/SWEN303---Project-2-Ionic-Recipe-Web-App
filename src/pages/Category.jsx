import { IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { RecipeListItem } from '../components/RecipeListItem';
import { recipes } from '../recipes';
import { chevronDownOutline } from "ionicons/icons";

const Category = () => {
    const { name } = useParams();
    const [categoryRecipes, setCategoryRecipes] = useState([]);
    const [sortType, setSortType] = useState(''); // <-- Add this line

    // Add this function
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

    useEffect(() => {
        setCategoryRecipes(recipes[name.toLowerCase()].hits);
    }, [name]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Categories" defaultHref="/"/>
                    </IonButtons>
                    <IonTitle>{name} Recipes</IonTitle>
                    <IonButtons slot="end">
                        <IonButton style={{ '--background': 'white', '--color': 'black' }} onClick={() => sortRecipes('calorieCount')}>
                            <IonIcon icon={chevronDownOutline} />&nbsp;Sort by Calorie Count
                        </IonButton>
                        <IonButton style={{ '--background': 'white', '--color': 'black' }} onClick={() => sortRecipes('totalTime')}>
                            <IonIcon icon={chevronDownOutline} />&nbsp;Sort by Total Time
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{name} Recipes</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    {categoryRecipes.map((categoryRecipe, index) => {
                        const { recipe } = categoryRecipe;
                        return (
                            <RecipeListItem recipe={recipe} key={`recipe_${index}`} />
                        );
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Category;
