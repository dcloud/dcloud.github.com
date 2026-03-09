// Dough main

const calculator = document.getElementById("temperature-calculator");
if (calculator != null) {
  runCalculator();
} else {
  console.error("Calculator element not found");
}

function runCalculator() {
  const desiredDoughTemperature = calculator.querySelector("#ddt");
  const flourTemperature = calculator.querySelector("#ft");
  const roomTemperature = calculator.querySelector("#rt");
  const waterTemperature = calculator.querySelector("#wt");

  // Calculate water temperature to achieve desired dough temperature
  function calculateWaterTemperature() {
    const desiredDoughTemperatureValue = parseInt(
      desiredDoughTemperature.value,
      10,
    );
    const flourTemperatureValue = parseInt(flourTemperature.value, 10);
    const roomTemperatureValue = parseInt(roomTemperature.value, 10);
    const ttfMultiplier = 3;

    if (
      Number.isNaN(desiredDoughTemperatureValue) ||
      Number.isNaN(flourTemperatureValue) ||
      Number.isNaN(roomTemperatureValue)
    ) {
      return "";
    }

    // Calculate water temperature using the formula
    const totalTemperatureFactor = desiredDoughTemperatureValue * ttfMultiplier;
    const waterTemperatureValue =
      totalTemperatureFactor - (flourTemperatureValue + roomTemperatureValue);

    return waterTemperatureValue.toFixed();
  }

  function setWaterTemperature() {
    const temp = calculateWaterTemperature();
    waterTemperature.value = temp;
  }

  // Add event listeners to update water temperature when dough temperature or flour temperature changes
  desiredDoughTemperature.addEventListener("blur", setWaterTemperature);
  flourTemperature.addEventListener("blur", setWaterTemperature);
  roomTemperature.addEventListener("blur", setWaterTemperature);
}
