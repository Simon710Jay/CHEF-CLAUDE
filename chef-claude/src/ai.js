const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/recipe";

export async function getRecipeFromMistral(ingredientsArr) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients: ingredientsArr.join(", ")
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.recipe;
}
