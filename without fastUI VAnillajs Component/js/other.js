function AddtoYAxis(data) {
  const YAxisDropDown = document.getElementById('yaxis');
  Addto(YAxisDropDown, data);
}

function AddtoGroup(data) {
  const groupDropDown = document.getElementById('groupSelect');
  Addto(groupDropDown, data);
}

function AddtoDate(data) {
  const dateDropDown = document.getElementById('dateSelect');
  Addto(dateDropDown, data);
}

function Addto(dropDown, data) {
  dropDown.innerHTML = '';
  if (data !== '') {
    const newOptions = data.map((data, index) => {
      let text = data.split('_');

      text = text.reduce((result, data) => {
        return result + ' ' + data;
      });

      const newOption = document.createElement('fast-option');
      const optionText = document.createTextNode(text);
      newOption.appendChild(optionText);
      newOption.setAttribute('value', data);
      if (index === 0) {
        newOption.setAttribute('selected', 'selected');
      }
      return newOption;
    });

    newOptions.forEach((data) => {
      dropDown.appendChild(data);
    });
  } else {
    const newOption = document.createElement('fast-option');
    const optionText = document.createTextNode('Choose');
    newOption.appendChild(optionText);
    newOption.setAttribute('value', '');
    dropDown.appendChild(newOption);
  }
}

function AdditionalOptions() {
  if (DateCheck && GroupCheck) {
    const group = document.getElementById('groupSelect').value;
    const date = document.getElementById('dateSelect').value;
    const yaxis = document.getElementById('yaxis').value;
    value = data.X_Axis[xaxis].Y_Axis[yaxis].both[group][date];
    categoriesNames = value.map(function (d) {
      return d.state;
    });
    setGraph(
      rateNames,
      categoriesNames,
      range,
      value,
      Color,
      true,
      value.length
    );
  } else if (DateCheck) {
    const yaxis = document.getElementById('yaxis').value;
    const date = document.getElementById('dateSelect').value;
    value = data.X_Axis[xaxis].Y_Axis[yaxis].date[date];
    categoriesNames = value.map(function (d) {
      return d.state;
    });
    setGraph(
      rateNames,
      categoriesNames,
      range,
      value,
      Color,
      true,
      value.length
    );
  } else if (GroupCheck) {
    const yaxis = document.getElementById('yaxis').value;
    const group = document.getElementById('groupSelect').value;
    value = data.X_Axis[xaxis].Y_Axis[yaxis].group[group];
    categoriesNames = value.map(function (d) {
      return d.state;
    });
    setGraph(
      rateNames,
      categoriesNames,
      range,
      value,
      Color,
      true,
      value.length
    );
  } else {
    const yaxis = document.getElementById('yaxis').value;
    const subData = data.X_Axis[xaxis].Y_Axis[yaxis];
    categoriesNames = subData.value.map(function (d) {
      return d.state;
    });
    value = subData.value;
    setGraph(
      rateNames,
      categoriesNames,
      range,
      value,
      Color,
      true,
      value.length
    );
  }
}

function changeText(group, date) {
  let finalText;
  if (group && date) {
    const groupText = document.getElementById('groupSelect').value;
    const dateText = document.getElementById('dateSelect').value;
    const text = document.getElementById('inputText').value;
    finalText = text + '-' + groupText + '-' + dateText;
  } else if (group) {
    const groupText = document.getElementById('groupSelect').value;
    const text = document.getElementById('inputText').value;
    finalText = text + '-' + groupText;
  } else if (date) {
    const dateText = document.getElementById('dateSelect').value;
    const text = document.getElementById('inputText').value;
    finalText = text + '-' + dateText;
  } else {
    const text = document.getElementById('inputText').value;
    finalText = text;
  }
  document.getElementById('svg_text').innerHTML = finalText;
}
