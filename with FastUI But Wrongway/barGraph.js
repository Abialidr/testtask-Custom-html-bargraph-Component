import {
  FASTElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/npm/@microsoft/fast-element/dist/fast-element.min.js';

const barGraphStyles = css`
  .axis {
    font-size: 14px;
    font-weight: bold;
  }

  text {
    fill: black;
    stroke: none;
  }

  .axis path,
  .axis line {
    /* fill: none; */
    /* stroke: none; */
    stroke-width: 2px;
    shape-rendering: crispEdges;
  }

  .grid path {
    stroke: none;
  }

  .grid line {
    stroke: #e0e0e0;
    shape-rendering: crispEdges;
  }

  .data-line {
    fill: none;
    stroke: #3c92ba;
    stroke-width: 4px;
  }

  .data-circle {
    fill: #3c92ba;
  }

  .axis-title {
    text-anchor: end;
    fill: #5d6971;
    font-weight: normal;
  }

  .axis-tspan {
    font-size: 12px;
  }

  .clinical-cut-off-line {
    fill: none;
    stroke: #333333;
    stroke-dasharray: 8, 8;
    stroke-width: 4px;
  }

  .clinical-cut-off-text {
    text-transform: uppercase;
    text-anchor: start;
    font-size: 12px;
    font-weight: bold;
    fill: #333333;
    stroke: none;
  }

  @-webkit-keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }

  .bars-container-middle {
    fill: none;
    stroke: none;
  }

  .clinically-significant-pulsing-rect {
    fill: pink;
    /* Giving Animation Function */
    -webkit-animation: pulse 1.5s ease infinite;
  }

  /* .bars {
  max-width: 10px;
} */

  .mainDiv {
    margin: 25px;
    height: 100%;
    padding: 25px;
    border: 1px solid black;
    display: flex;
    flex-direction: row;
    margin-right: 25px;
    width: fit-content;
  }

  .inputDiv {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 8px;
  }

  .inputDiv2 {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .containerDiv {
    display: flex;
    flex-direction: column;
    border: 3px solid #333333;
    background-color: #666666;
    margin: 25px;
    padding: 30px;
  }

  .svgMain {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    border: 3px dotted #333333;
    background-color: #666666;
    margin: 25px;
    padding: 30px;
  }

  .colorDivMain {
    display: flex;
    flex-direction: column;
  }

  .colorDivSub {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 10px;
    width: 100%;
  }
  .text {
    margin: 10px;
    font-size: x-large;
  }

  .colors {
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background-color: #666666;
    border: none;
  }

  #svg_text {
    margin: 10px;
    font-size: x-large;
  }

  .grid path {
    stroke: none;
  }

  .grid line {
    stroke: #e0e0e0;
    stroke-dasharray: 5px;
    shape-rendering: crispEdges;
  }

  .ColorDiv {
    margin-top: 8px;
    transition: display 1s;
  }

  .toggle-content {
    display: none;
    height: 0;
    transition: height 350ms ease-in-out;
  }

  .toggle-content.is-visible {
    height: auto;
    display: block;
  }
`;

let template = html`
  <div class="mainDiv">
    <div class="containerDiv">
      <div class="inputDiv">
        <label>Name</label>
        <fast-text-field
          appearance="primary"
          name="newTask"
          placeholder="Enter your todo here"
          id="inputText"
        />
      </div>
      <div class="inputDiv">
        <label>X-Axis</label>
        <fast-select id="xaxis"> </fast-select>
      </div>
      <div class="inputDiv">
        <label>Y-axis</label>
        <fast-select id="yaxis">
          <fast-option value="">Choose</fast-option>
          <slot name="axis"></slot>
        </fast-select>
      </div>
      <div class="ColorDiv toggle-content" id="ColorDiv">
        <label style="margin-left: 10px">Colors</label>
        <div class="colorDivMain" id="colorDivMain"></div>
      </div>
      <fast-divider></fast-divider>
      <div class="text">Aditional options</div>
      <div class="inputDiv">
        <div class="inputDiv2">
          <label>Group By</label>
          <fast-switch id="group"></fast-switch>
        </div>
        <div id="groupDiv" class="toggle-content">
          <fast-select id="groupSelect"> </fast-select>
        </div>
      </div>
      <div class="inputDiv">
        <div class="inputDiv2">
          <label>Date Range</label>
          <fast-switch id="date"></fast-switch>
        </div>
        <div id="dateDiv" class="toggle-content">
          <fast-select id="dateSelect"> </fast-select>
        </div>
      </div>
    </div>
    <div class="svgMain">
      <div id="svg_text" id="svg_text"></div>
      <svg width="1200" height="700" id="svgOG"></svg>
    </div>
  </div>
`;

export class BarGraph extends FASTElement {
  data = {};

  //d3 variable
  x0;
  x1;
  y1;
  z;
  svg;
  margin;
  width;
  width;
  g;

  //onchange variable
  rateNames;
  xaxis;
  yaxis;
  categoriesNames;
  Color;
  range;
  value;
  GroupCheck;
  DateCheck;

  //other variable
  bargraphed = document.getElementById('bargraph').shadowRoot;

  static definition = {
    name: 'bar-graph',
    template,
    styles: barGraphStyles,
    attributes: [
      'data',
      'onLoad', // same attr/prop
    ],
  };
  connectedCallback() {
    super.connectedCallback();
    this.init();

    this.bargraphed = document.getElementById('bargraph').shadowRoot;

    this.bargraphed.querySelector('#xaxis').addEventListener('change', () => {
      this.xaxis = this.bargraphed.querySelector('#xaxis').value;

      if (this.xaxis !== '') {
        this.yaxis = Object.keys(data.X_Axis[this.xaxis].Y_Axis);
        this.AddtoYAxis(this.yaxis);
        this.AddtoGroup(
          Object.keys(data.X_Axis[this.xaxis].Y_Axis[this.yaxis[0]].group)
        );
        this.AddtoDate(
          Object.keys(data.X_Axis[this.xaxis].Y_Axis[this.yaxis[0]].date)
        );

        this.hide(this.bargraphed.getElementById('groupDiv'));
        this.hide(this.bargraphed.getElementById('dateDiv'));
        this.bargraphed.getElementById('group').checked = false;
        this.bargraphed.getElementById('date').checked = false;
        this.GroupCheck = false;
        this.DateCheck = false;

        const subData =
          data.X_Axis[this.xaxis].Y_Axis[
            Object.keys(data.X_Axis[this.xaxis].Y_Axis)[0]
          ];

        this.rateNames = data.X_Axis[this.xaxis].key.map(function (d) {
          return d;
        });
        this.bargraphed.getElementById('colorDivMain').innerHTML = '';

        const innerHTML = this.rateNames.map((data, index) => {
          const colorDivSub = document.createElement('div');
          colorDivSub.className = 'colorDivSub';
          const label = document.createElement('label');
          label.innerHTML = data;
          const Input = document.createElement('input');
          Input.type = 'color';
          Input.id = index;
          const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          Input.value = color;
          Input.className = 'colors';
          Input.name = 'colors';
          colorDivSub.appendChild(label);
          colorDivSub.appendChild(Input);
          return { colorDivSub, color };
        });

        innerHTML.forEach((data, index) => {
          this.bargraphed
            .getElementById('colorDivMain')
            .appendChild(data.colorDivSub);
        });

        this.Color = innerHTML.map((data, index) => {
          return data.color;
        });

        this.bargraphed.querySelectorAll('.colors').forEach((box) =>
          box.addEventListener('change', (e) => {
            const id = e.target.id;
            const colorVal = e.target.value;
            this.Color[id] = colorVal;
            console.log(
              this.rateNames,
              this.categoriesNames,
              this.range,
              this.value,
              this.Color,
              false,
              this.value.length
            );
            this.setGraph(
              this.rateNames,
              this.categoriesNames,
              this.range,
              this.value,
              this.Color,
              false,
              this.value.length
            );
          })
        );

        this.categoriesNames = subData.value.map(function (d) {
          return d.state;
        });

        this.range = subData.range;
        this.value = subData.value;

        this.setGraph(
          this.rateNames,
          this.categoriesNames,
          this.range,
          this.value,
          this.Color,
          true,
          this.value.length
        );

        this.show(this.bargraphed.getElementById('ColorDiv'));
      } else {
        this.svg.selectAll('*').remove();
        this.AddtoYAxis('');
        this.AddtoGroup('');
        this.AddtoDate('');
        this.AddtoYAxis('');
        this.hide(this.bargraphed.getElementById('groupDiv'));
        this.hide(this.bargraphed.getElementById('dateDiv'));
        this.hide(this.bargraphed.getElementById('ColorDiv'));

        this.bargraphed.getElementById('group').checked = false;
        this.bargraphed.getElementById('date').checked = false;
        this.GroupCheck = false;
        this.DateCheck = false;
        this.bargraphed.getElementById('svg_text').innerHTML = '';

        this.bargraphed.getElementById('colorDivMain').innerHTML = '';
      }
    });

    this.bargraphed.querySelector('#yaxis').addEventListener('change', () => {
      var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

      this.yaxis = this.bargraphed.getElementById('yaxis').value;
      this.AddtoGroup(
        Object.keys(data.X_Axis[this.xaxis].Y_Axis[this.yaxis].group)
      );
      this.AddtoDate(
        Object.keys(data.X_Axis[this.xaxis].Y_Axis[this.yaxis].date)
      );
      this.hide(this.bargraphed.getElementById('groupDiv'));
      this.hide(this.bargraphed.getElementById('dateDiv'));
      this.bargraphed.getElementById('group').checked = false;
      this.bargraphed.getElementById('date').checked = false;
      this.GroupCheck = false;
      this.DateCheck = false;

      const subData = data.X_Axis[this.xaxis].Y_Axis[this.yaxis];

      this.categoriesNames = subData.value.map(function (d) {
        return d.state;
      });

      this.range = subData.range;
      this.value = subData.value;

      this.setGraph(
        this.rateNames,
        this.categoriesNames,
        this.range,
        this.value,
        this.Color,
        true,
        this.value.length
      );
    });

    this.bargraphed
      .querySelector('#inputText')
      .addEventListener('change', () => {
        this.changeText(this.GroupCheck, this.DateCheck);
      });

    this.bargraphed.querySelector('#group').addEventListener('change', (e) => {
      this.GroupCheck = e.target.checked;
      this.AdditionalOptions();
      this.changeText(this.GroupCheck, this.DateCheck);
      if (this.GroupCheck) {
        this.show(this.bargraphed.getElementById('groupDiv'));
      } else {
        this.hide(this.bargraphed.getElementById('groupDiv'));
      }
    });

    this.bargraphed.querySelector('#date').addEventListener('change', (e) => {
      this.DateCheck = e.target.checked;
      this.AdditionalOptions();
      this.changeText(this.GroupCheck, this.DateCheck);
      if (this.DateCheck) {
        this.show(this.bargraphed.getElementById('dateDiv'));
      } else {
        this.hide(this.bargraphed.getElementById('dateDiv'));
      }
    });

    this.bargraphed
      .querySelector('#dateSelect')
      .addEventListener('change', () => {
        this.AdditionalOptions();
        this.changeText(this.GroupCheck, this.DateCheck);
      });

    this.bargraphed
      .querySelector('#groupSelect')
      .addEventListener('change', () => {
        this.AdditionalOptions();
        this.changeText(this.GroupCheck, this.DateCheck);
      });
  }
  // intialisation functions
  init() {
    this.setSVG([], 0);
    this.xaxis = Object.keys(data.X_Axis);
    this.bargraphed = document.getElementById('bargraph').shadowRoot;
    const newOption = document.createElement('fast-option');
    const optionText = document.createTextNode('Choose');
    newOption.appendChild(optionText);
    newOption.setAttribute('value', '');
    this.bargraphed.getElementById('xaxis').appendChild(newOption);

    const newOptions = this.xaxis.map((data) => {
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
      this.bargraphed.getElementById('xaxis').appendChild(data);
    });
  }

  //D3 Functions
  setGraph(
    rateNames,
    categoriesNames,
    yaxisData,
    barData,
    color,
    trans,
    barSize
  ) {
    this.svg.selectAll('*').remove();
    this.setSVG(color, barSize);
    if (rateNames && categoriesNames) {
      this.setXais(rateNames, categoriesNames);
    }

    if (yaxisData) {
      this.setYAxis(yaxisData);
    }

    if (barData) {
      this.setBarGraph(barData, trans);
    }
  }

  setSVG(color, barSize) {
    console.log(this.bargraphed);
    const mainSvg = this.bargraphed.querySelector('#svgOG');
    console.log(mainSvg);
    this.svg = d3.select(mainSvg);
    this.margin = { top: 20, right: 20, bottom: 0, left: 40 };
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height =
      +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    if (barSize > 3) {
      this.x0 = d3
        .scaleBand()
        .rangeRound([0, this.width])
        .paddingInner(0.5)
        .paddingOuter(0.1);
    } else if (barSize > 6) {
      this.x0 = d3
        .scaleBand()
        .rangeRound([0, this.width])
        .paddingInner(0.3)
        .paddingOuter(0.1);
    } else if (barSize > 9) {
      this.x0 = d3.scaleBand().rangeRound([0, this.width]).padding(0.1);
    } else if (barSize > 1 && barSize <= 3) {
      this.x0 = d3
        .scaleBand()
        .rangeRound([0, this.width])
        .paddingInner(0.7)
        .paddingOuter(0.1);
    } else {
      this.x0 = d3
        .scaleBand()
        .rangeRound([0, this.width])
        .paddingInner(0.9)
        .paddingOuter(0.1);
    }

    this.x1 = d3.scaleBand().paddingInner(0.1);

    this.y = d3.scaleLinear().rangeRound([this.height / 1.75, 0]);
    if (color) {
      this.z = d3.scaleOrdinal().range(color);
    } else {
      this.z = d3.scaleOrdinal().range(['#cccccc', '#333333']);
    }
  }

  setXais(rateNames, categoriesNames) {
    this.x0.domain(categoriesNames);
    this.x1.domain(rateNames).rangeRound([0, this.x0.bandwidth()]);

    const legend = this.g.append('g').attr('class', 'legend');
    const legenG = legend
      .selectAll('g')
      .data(
        rateNames.map(function (d) {
          return d;
        })
      )
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        'translate(' + i * (this.width / (rateNames.length + 1)) + ', 0)';
        return (
          'translate(' + i * (this.width / (rateNames.length + 1)) + ', 0)'
        );
      });

    legenG
      .append('rect')
      .attr('x', 0)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', this.z);

    legenG
      .append('text')
      .attr('x', 25)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(function (d) {
        return d;
      });

    this.g
      .append('g')
      .attr('class', 'x-axis axis')
      .attr('transform', 'translate(0,' + this.height / 1.4 + ')')
      .call(d3.axisBottom(this.x0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')
      .text(function (d) {
        if (d.length > 14) {
          return d.substring(0, 14) + '...';
        } else {
          return d;
        }
      });

    this.g
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + this.height / 7 + ')')
      .call(d3.axisLeft(this.y).tickSize(-this.width).tickFormat('').ticks(10));
  }

  setBarGraph(data, trans) {
    const barG = this.g
      .append('g')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d) => {
        return 'translate(' + this.x0(d.state) + ',0)';
      });

    if (trans) {
      barG
        .selectAll('.bars')
        .data(function (d) {
          return d.values;
        })
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('transform', 'translate(0,' + this.height / 7 + ')')
        .attr('x', (d) => {
          return this.x1(d.type);
        })
        .attr('width', this.x1.bandwidth())
        .attr('fill', (d) => {
          return this.z(d.type);
        })
        .attr('y', this.height / 2)
        .transition()
        .delay(function (d, i) {
          return i * 250;
        }) // this is to do left then right bars
        .duration(250)
        .attr('y', (d) => {
          return this.y(d.value);
        })
        .attr('height', (d) => {
          if (d.value > 0) {
            return this.height / 1.75 - this.y(d.value);
          } else {
            return 0;
          }
        });
    } else {
      barG
        .selectAll('.bars')
        .data(function (d) {
          return d.values;
        })
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('transform', 'translate(0,' + this.height / 7 + ')')
        .attr('x', (d) => {
          return this.x1(d.type);
        })
        .attr('width', this.x1.bandwidth())
        .attr('fill', (d) => {
          return this.z(d.type);
        })
        .attr('y', this.height / 2)
        .attr('y', (d) => {
          return this.y(d.value);
        })
        .attr('height', (d) => {
          if (d.value > 0) {
            return this.height / 1.75 - this.y(d.value);
          } else {
            return 0;
          }
        });
    }

    this.g
      .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + this.height / 1.4 + ')')
      .call(d3.axisBottom(this.x0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')
      .text(function (d) {
        if (d.length > 14) {
          return d.substring(0, 14) + '...';
        } else {
          return d;
        }
      });
  }

  setYAxis(data) {
    this.y.domain(data);
    this.g
      .append('g')
      .attr('class', 'y-axis axis')
      .attr('transform', 'translate(0,' + this.height / 7 + ')')
      .call(d3.axisLeft(this.y).ticks(7));
  }
  //otherfunctions
  AddtoYAxis(data) {
    const YAxisDropDown = this.bargraphed.getElementById('yaxis');
    this.Addto(YAxisDropDown, data);
  }

  AddtoGroup(data) {
    const groupDropDown = this.bargraphed.getElementById('groupSelect');
    this.Addto(groupDropDown, data);
  }

  AddtoDate(data) {
    const dateDropDown = this.bargraphed.getElementById('dateSelect');
    this.Addto(dateDropDown, data);
  }

  Addto(dropDown, data) {
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
        newOption.setAttribute('this.value', data);
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
      newOption.setAttribute('this.value', '');
      dropDown.appendChild(newOption);
    }
  }

  AdditionalOptions() {
    if (this.DateCheck && this.GroupCheck) {
      const group = this.bargraphed.getElementById('groupSelect').value;
      const date = this.bargraphed.getElementById('dateSelect').value;
      console.log(group, date, 'badfjab;vafb');
      this.yaxis = this.bargraphed.getElementById('yaxis').value;
      this.value = data.X_Axis[this.xaxis].Y_Axis[this.yaxis].both[group][date];
      this.categoriesNames = this.value.map(function (d) {
        return d.state;
      });
      this.setGraph(
        this.rateNames,
        this.categoriesNames,
        this.range,
        this.value,
        this.Color,
        true,
        this.value.length
      );
    } else if (this.DateCheck) {
      this.yaxis = this.bargraphed.getElementById('yaxis').value;
      const date = this.bargraphed.getElementById('dateSelect').value;
      this.value = data.X_Axis[this.xaxis].Y_Axis[this.yaxis].date[date];
      this.categoriesNames = this.value.map(function (d) {
        return d.state;
      });
      console.log(date, 'badfjab;vafb');

      this.setGraph(
        this.rateNames,
        this.categoriesNames,
        this.range,
        this.value,
        this.Color,
        true,
        this.value.length
      );
    } else if (this.GroupCheck) {
      this.yaxis = this.bargraphed.getElementById('yaxis').value;
      const group = this.bargraphed.getElementById('groupSelect').value;
      this.value = data.X_Axis[this.xaxis].Y_Axis[this.yaxis].group[group];
      this.categoriesNames = this.value.map(function (d) {
        return d.state;
      });
      console.log(group, 'badfjab;vafb');

      this.setGraph(
        this.rateNames,
        this.categoriesNames,
        this.range,
        this.value,
        this.Color,
        true,
        this.value.length
      );
    } else {
      this.yaxis = this.bargraphed.getElementById('yaxis').value;
      const subData = data.X_Axis[this.xaxis].Y_Axis[this.yaxis];
      this.categoriesNames = subData.value.map(function (d) {
        return d.state;
      });
      this.value = subData.value;
      this.setGraph(
        this.rateNames,
        this.categoriesNames,
        this.range,
        this.value,
        this.Color,
        true,
        this.value.length
      );
    }
  }

  changeText(group, date) {
    let finalText;
    if (group && date) {
      const groupText = this.bargraphed.getElementById('groupSelect').value;
      const dateText = this.bargraphed.getElementById('dateSelect').value;
      const text = this.bargraphed.getElementById('inputText').value;
      finalText = text + '-' + groupText + '-' + dateText;
      console.log(groupText, dateText);
    } else if (group) {
      const groupText = this.bargraphed.getElementById('groupSelect').value;
      const text = this.bargraphed.getElementById('inputText').value;
      finalText = text + '-' + groupText;
    } else if (date) {
      const dateText = this.bargraphed.getElementById('dateSelect').value;
      const text = this.bargraphed.getElementById('inputText').value;
      finalText = text + '-' + dateText;
    } else {
      const text = this.bargraphed.getElementById('inputText').value;
      finalText = text;
    }
    this.bargraphed.getElementById('svg_text').innerHTML = finalText;
  }

  hide(elem) {
    elem.classList.remove('is-visible');
  }

  show(elem) {
    elem.classList.add('is-visible');
  }
}
FASTElement.define(BarGraph);
