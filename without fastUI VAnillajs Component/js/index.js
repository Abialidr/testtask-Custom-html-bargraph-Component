function init() {
  setSVG([], 0);
  const xaxis = Object.keys(data.X_Axis);
  const XAxisDropDown = document.getElementById('xaxis');
  const newOption = document.createElement('fast-option');
  const optionText = document.createTextNode('Choose');
  newOption.appendChild(optionText);
  newOption.setAttribute('value', '');
  XAxisDropDown.appendChild(newOption);
  const newOptions = xaxis.map((data) => {
    let text = data.split('_');
    text = text.reduce((result, data) => {
      return result + ' ' + data;
    });
    const newOption = document.createElement('fast-option');
    const optionText = document.createTextNode(text);
    newOption.appendChild(optionText);
    newOption.setAttribute('value', data);
    return newOption;
  });
  newOptions.forEach((data) => {
    XAxisDropDown.appendChild(data);
  });
}

$(document).on('change', '#xaxis', function (e) {
  xaxis = document.getElementById('xaxis').value;

  if (xaxis !== '') {
    yaxis = Object.keys(data.X_Axis[xaxis].Y_Axis);
    AddtoYAxis(yaxis);
    AddtoGroup(Object.keys(data.X_Axis[xaxis].Y_Axis[yaxis[0]].group));
    AddtoDate(Object.keys(data.X_Axis[xaxis].Y_Axis[yaxis[0]].date));
    $('#groupSelect').hide(400);
    $('#dateSelect').hide(400);
    document.getElementById('group').checked = false;
    document.getElementById('date').checked = false;
    GroupCheck = false;
    DateCheck = false;

    const subData =
      data.X_Axis[xaxis].Y_Axis[Object.keys(data.X_Axis[xaxis].Y_Axis)[0]];

    rateNames = data.X_Axis[xaxis].key.map(function (d) {
      return d;
    });
    document.getElementById('colorDivMain').innerHTML = '';

    const innerHTML = rateNames.map((data, index) => {
      const colorDivSub = document.createElement('div');
      colorDivSub.className = 'colorDivSub';
      const label = document.createElement('label');
      label.innerHTML = data;
      const Input = document.createElement('input');
      Input.type = 'color';
      Input.id = index;
      // Input.onclick = changeColor();
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      Input.value = color;
      Input.className = 'colors';
      colorDivSub.appendChild(label);
      colorDivSub.appendChild(Input);
      return { colorDivSub, color };
    });

    innerHTML.forEach((data, index) => {
      document.getElementById('colorDivMain').appendChild(data.colorDivSub);
    });

    Color = innerHTML.map((data, index) => {
      return data.color;
    });

    categoriesNames = subData.value.map(function (d) {
      return d.state;
    });

    range = subData.range;
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

    $('#ColorDiv').show(750);
  } else {
    svg.selectAll('*').remove();
    AddtoYAxis('');
    AddtoGroup('');
    AddtoDate('');
    AddtoYAxis('');
    $('#groupSelect').hide(400);
    $('#dateSelect').hide(400);
    document.getElementById('group').checked = false;
    document.getElementById('date').checked = false;
    GroupCheck = false;
    DateCheck = false;

    $('#ColorDiv').hide(750);
    document.getElementById('colorDivMain').innerHTML = '';
  }
});

$(document).on('change', '#yaxis', function (e) {
  var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  yaxis = document.getElementById('yaxis').value;
  console.log(yaxis);
  AddtoGroup(Object.keys(data.X_Axis[xaxis].Y_Axis[yaxis].group));
  AddtoDate(Object.keys(data.X_Axis[xaxis].Y_Axis[yaxis].date));
  $('#groupSelect').hide(400);
  $('#dateSelect').hide(400);
  document.getElementById('group').checked = false;
  document.getElementById('date').checked = false;
  GroupCheck = false;
  DateCheck = false;

  const subData = data.X_Axis[xaxis].Y_Axis[yaxis];

  categoriesNames = subData.value.map(function (d) {
    return d.state;
  });

  range = subData.range;
  value = subData.value;

  setGraph(rateNames, categoriesNames, range, value, Color, true, value.length);
});

$(document).on('change', '.colors', function (e) {
  console.log(range, value);

  const id = e.target.id;
  const colorVal = e.target.value;
  Color[id] = colorVal;
  setGraph(
    rateNames,
    categoriesNames,
    range,
    value,
    Color,
    false,
    value.length
  );
});

$(document).on('change', '#group', function (e) {
  GroupCheck = e.target.checked;
  AdditionalOptions();
  changeText(GroupCheck, DateCheck);
  if (GroupCheck) {
    $('#groupSelect').show(400);
  } else {
    $('#groupSelect').hide(400);
  }
});

$(document).on('change', '#date', function (e) {
  DateCheck = e.target.checked;
  AdditionalOptions();
  changeText(GroupCheck, DateCheck);
  if (DateCheck) {
    $('#dateSelect').show(400);
  } else {
    $('#dateSelect').hide(400);
  }
});

$(document).on('change', '#dateSelect', function () {
  AdditionalOptions();
  changeText(GroupCheck, DateCheck);
});

$(document).on('change', '#groupSelect', function () {
  AdditionalOptions();
  changeText(GroupCheck, DateCheck);
});

$(document).on('change', '#inputText', function () {
  changeText(GroupCheck, DateCheck);
});
