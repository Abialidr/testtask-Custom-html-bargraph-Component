function updateGraphOptions(
  rateNames,
  categoriesNames,
  range,
  value,
  colors,
  is_trans,
  valuelength
) {
  let chartComponent = document.getElementById('d3chartcomponent');
  chartComponent.updateGraphOptions(
    rateNames,
    categoriesNames,
    range,
    value,
    colors,
    is_trans,
    valuelength
  );
}

function clearGraphOptions() {
  let chartComponent = document.getElementById('d3chartcomponent');
  chartComponent.clearGraphOptions();
}

function updateText(newOptions) {
  let chartComponent = document.getElementById('d3chartcomponent');
  chartComponent.updateText(newOptions);
}
