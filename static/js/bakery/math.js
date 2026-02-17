const tool = document.getElementById("bakers-math");
const recipe = document.getElementById("recipe");

const Units = Object.freeze({
  CUPS: "cups",
  GRAMS: "grams",
  TEASPOONS: "teaspoons",
  TABLESPOONS: "tablespoons",
  OUNCES: "ounces",
});

const IngredientType = Object.freeze({
  FLOUR: "flour",
  WATER: "water",
  SALT: "salt",
  YEAST: "yeast",
  OTHER: "other",
});

const mapUnits = (unit) => {
  switch (unit) {
    case "c":
    case "cup":
    case "cups":
      return Units.CUPS;
    case "g":
    case "gram":
    case "grams":
      return Units.GRAMS;
    case "tsp":
    case "teaspoon":
    case "teaspoons":
      return Units.TEASPOONS;
    case "tbsp":
    case "tablespoon":
    case "tablespoons":
      return Units.TABLESPOONS;
    case "oz":
    case "ounce":
    case "ounces":
      return Units.OUNCES;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
};

const detectType = (input) => {
  const lowercaseInput = input.toLowerCase();
  if (lowercaseInput.includes("flour")) return IngredientType.FLOUR;
  if (lowercaseInput.includes("water")) return IngredientType.WATER;
  if (lowercaseInput.includes("salt")) return IngredientType.SALT;
  if (lowercaseInput.includes("yeast")) return IngredientType.YEAST;
  return IngredientType.OTHER;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const parseAmount = (amount) => {
  const match = amount.match(
    /((?<whole>\d+)\s)?(?<numerator>\d+)\/(?<denominator>\d+)/,
  );
  if (match) {
    const whole = parseInt(match.groups.whole || 0);
    const numerator = parseInt(match.groups.numerator);
    const denominator = parseInt(match.groups.denominator);
    const value = whole + numerator / denominator;
    return value;
  }
  return parseFloat(amount);
};

const parseIngredient = (ingredient) => {
  const measures = [
    ...ingredient.matchAll(
      /(?<value>(?:\d+\s)?\d+(?:[./]\d+)?)\s?(?<unit>c|cups?|g|grams?|tsp|teaspoons?|tbsp|tablespoons?|oz|ounces?)\b/g,
    ),
  ];
  let match = measures.find((m) => m.groups.unit.startsWith("g"));
  if (!match) {
    match = measures[0];
  }
  const amount = parseAmount(match.groups.value);
  const unit = mapUnits(match.groups.unit);
  const unit_index = ingredient.indexOf(match.groups.unit);
  const raw_name = ingredient.slice(unit_index).replace(/^[^\s]+\s/, "");
  const type = detectType(raw_name);
  const name = capitalize(raw_name);
  return { amount, unit, name, type, rawAmount: match[0] };
};

const parseRecipe = (input) => {
  const ingredients = input.split("\n");
  let recipe = [];
  let totalFlour = 0;
  let totalWeight = 0;
  for (const ingredient of ingredients) {
    if (ingredient.trim().length === 0) continue;
    const parsed = parseIngredient(ingredient);
    recipe.push(parsed);
    if (parsed.type === IngredientType.FLOUR) {
      totalFlour += parsed.amount;
    }
    if (parsed.unit === Units.GRAMS) {
      // We can only calculuate in grams, for now
      totalWeight += parsed.amount;
    }
  }
  recipe = recipe.map((r) => {
    const percentage =
      r.unit === Units.GRAMS
        ? ((r.amount / totalFlour) * 100).toFixed(2)
        : null;
    return { ...r, percentage };
  });
  return { recipe, totalFlour, totalWeight };
};

const displayRecipePercentages = (recipe, totalFlour) => {
  const output = tool.querySelector("#recipe-percentages > tbody");
  output.innerHTML = "";
  for (const { amount, unit, name, percentage, type, rawAmount } of recipe) {
    const row = document.createElement("tr");
    const labelCell = document.createElement("th");
    const pctCell = document.createElement("td");
    const amtCell = document.createElement("td");
    labelCell.textContent = name;
    pctCell.textContent = percentage ? `${percentage}%` : "";
    amtCell.textContent = `${amount} ${unit}`;
    row.dataset.amount = amount;
    row.dataset.unit = unit;
    row.dataset.rawAmount = rawAmount;
    row.dataset.bakersPercentage = percentage;
    row.dataset.type = type;
    row.appendChild(amtCell);
    row.appendChild(labelCell);
    row.appendChild(pctCell);
    output.appendChild(row);
  }
};

const displayScaledRecipe = (recipe) => {
  const output = tool.querySelector("#scaled-recipe > tbody");
  output.innerHTML = "";

  for (const { amount, unit, name, percentage, type } of recipe) {
    const row = document.createElement("tr");
    const labelCell = document.createElement("th");
    const valueCell = document.createElement("td");
    labelCell.textContent = name;
    valueCell.textContent = `${amount.toFixed(2)} ${unit}`;
    row.dataset.amount = amount;
    row.dataset.unit = unit;
    row.dataset.bakersPercentage = percentage;
    row.dataset.type = type;
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    output.appendChild(row);
  }
};

const scaleRecipe = (recipe, scaleFactor) => {
  const scaledRecipe = recipe.map((item) => {
    const { amount } = item;
    return { ...item, amount: amount * scaleFactor };
  });
  return scaledRecipe;
};

const handleRecipeChange = () => {
  const recipe_input = tool.querySelector("#recipe");
  const scaleControl = tool.querySelector("#scale-pct");
  const { recipe, totalWeight } = parseRecipe(recipe_input.value);
  // console.log(`Total Flour: ${totalFlour}. Total Weight: ${totalWeight}.`);
  displayRecipePercentages(recipe, totalWeight);

  const scaleFactor = parseInt(scaleControl.value) / 100;
  const scaledRecipe = scaleRecipe(recipe, scaleFactor);
  displayScaledRecipe(scaledRecipe);
};

const runTool = () => {
  tool.querySelector("#recipe").addEventListener("blur", handleRecipeChange);
  tool
    .querySelector("#scale-pct")
    .addEventListener("change", handleRecipeChange);
};

if (tool != null && recipe != null) {
  runTool();
} else {
  console.error("Bakers Math tool element not found");
}
