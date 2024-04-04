import { gql, useQuery } from "@apollo/client";
import Head from "next/head";

const GET_RECIPES = gql`
  query Recipes {
    recipes {
      id
      title
      ingredients {
        title
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_RECIPES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Recipes</h1>
      <main>
        {data.recipes.map((recipe) => (
          <>
            <h2>{recipe.title}</h2>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.title}>{ingredient.title}</li>
              ))}
            </ul>
          </>
        ))}
      </main>
    </>
  );
}
