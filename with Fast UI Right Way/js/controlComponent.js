import {
  FASTElement,
  html,
  css,
  repeat,
  observable,
} from 'https://cdn.jsdelivr.net/npm/@microsoft/fast-element/dist/fast-element.min.js';

const styles = css`
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

  .toggle-content {
    display: none;
  }

  .toggle-content .is-visible {
    display: block;
  }
`;

// const colorDivMainTemplate = html`
//   <div class="ColorDiv" id="ColorDiv">
//     <label style="margin-left: 10px">Colors</label>
//     <div class="colorDivMain" id="colorDivMain">
//       <div>
//         ${repeat(
//           (x) => x.rateNames,
//           html`
//         <div class="colorDivSub">
//             <label>${(x) => x}</label>
//             <input type="color" id="${(x, c) => c.index}"
//             value="${(x) => {
//               const color =
//                 '#' + Math.floor(Math.random() * 16777215).toString(16);
//               console.log(x, 'in color');
//               let controlcomponent =
//                 document.getElementById('controlcomponent');
//               controlcomponent.updateColor(color, x);
//               return color;
//             }}"
//             @change="${(x, c) => {
//               console.log(c);
//               let controlcomponent =
//                 document.getElementById('controlcomponent');
//               controlcomponent.updateColor(c.event.target.value);
//             }}"

//           class="colors"

//           ></input>
//         </div>
//         `
//         )}
//       </div>
//     </div>
//   </div>
// `;

let template = html`
  <div id="controlcomponent">
    <div class="inputDiv">
      <label>Name</label>
      <fast-text-field
        appearance="primary"
        name="title"
        placeholder="Enter your todo here"
        id="title"
        @change="${(x, c) =>
          x.changeGraphOptions({ name: 'text', value: c.event.target.value })}"
      />
    </div>
    <div class="inputDiv">
      <label>X-Axis</label>
      <fast-select
        id="xaxis"
        @change="${(x, c) =>
          x.changeGraphOptions({
            name: 'xaxis',
            value: c.event.target.value,
          })}}"
      >
        <fast-option value="">Select</fast-option>
        ${repeat(
          (x) => x.xAxisOptions,
          html` <fast-option :value="${(x) => x}">${(x) => x}</fast-option> `
        )}
      </fast-select>
    </div>
    <div class="inputDiv">
      <label>Y-axis</label>
      <fast-select
        id="yaxis"
        @change="${(x, c) => {
          x.changeGraphOptions({
            name: 'yaxis',
            value: c.event.target.value,
          });
        }}}"
      >
        ${repeat(
          (x) => x.yAxisOptions,
          html` <fast-option :value="${(x) => x}">${(x) => x}</fast-option> `
        )}
      </fast-select>
    </div>
    <div class="ColorDiv" style="display:none" id="ColorDiv">
      <label style="margin-left: 10px">Colors</label>
      <div class="colorDivMain" id="colorDivMain"></div>
    </div>

    <fast-divider></fast-divider>
    <div class="text">Aditional options</div>
    <div class="inputDiv">
      <div class="inputDiv2">
        <label>Group By</label>
        <fast-switch
          id="group"
          current-checked="${(x, c) => {
            return x.groupCheck;
          }}"
          @change="${(x, c) => {
            x.changeGraphOptions({
              name: 'group',
              value: c.event.target.checked,
            });
          }}"
        ></fast-switch>
      </div>
      <div
        style="${(x, c) => {
          return x.groupCheck ? 'display:block' : 'display:none';
        }}"
      >
        <fast-select
          class="${(x, c) => {
            return x.groupCheck ? 'is-visible' : 'toggel-content';
          }}"
          id="groupSelect"
          @change="${(x, c) => {
            console.log(c.event.target.value);
            x.changeGraphOptions({
              name: 'groupSelect',
              value: c.event.target.value,
            });
          }}"
        >
          ${repeat(
            (x) => x.groupOptions,
            html`
              <fast-option :value="${(x) => x.value}"
                >${(x) => x.value}</fast-option
              >
            `
          )}
        </fast-select>
      </div>
    </div>
    <div class="inputDiv">
      <div class="inputDiv2">
        <label>Date Range</label>
        <fast-switch
          id="date"
          current-checked="${(x, c) => {
            return x.dateCheck;
          }}"
          @change="${(x, c) =>
            x.changeGraphOptions({
              name: 'date',
              value: c.event.target.checked,
            })}}"
        ></fast-switch>
      </div>
      <div
        style="${(x, c) => {
          return x.dateCheck ? 'display:block' : 'display:none';
        }}"
      >
        <fast-select
          id="dateSelect"
          @change="${(x, c) =>
            x.changeGraphOptions({
              name: 'dateSelect',
              value: c.event.target.value,
            })}"
        >
          ${repeat(
            (x) => x.dateOptions,
            html`
              <fast-option :value="${(x) => x.value}"
                >${(x) => x.value}</fast-option
              >
            `
          )}
        </fast-select>
      </div>
    </div>
  </div>
`;

export class ControlComponent extends FASTElement {
  static definition = {
    name: 'control-component',
    template,
    styles: styles,
    attributes: [
      //control panel variables
      'text',
      'finaltext',
      'xAxisOptions',
      'yAxisOptions',
      'groupOptions',
      'dateOptions',
      'groupValue',
      'dateValue',
      'xaxis',
      'yaxis',
      'groupCheck',
      'dateCheck',
      //common variables
      'colors',
      'namedcolors',
      //d3
      'rateNames',
      'categoriesNames',
      'range',
      'value',
    ],
  };
  xAxisOptions = Object.keys(data.X_Axis);
  colors = [];
  connectedCallback() {
    super.connectedCallback();
  }

  changeGraphOptions(newOptions) {
    if (newOptions.name === 'xaxis') {
      this.xaxis = newOptions.value;
      if (newOptions.value !== '') {
        this.yAxisOptions = Object.keys(data.X_Axis[this.xaxis].Y_Axis);
        this.yaxis = Object.keys(data.X_Axis[this.xaxis].Y_Axis)[0];

        this.groupOptions = Object.keys(
          data.X_Axis[this.xaxis].Y_Axis[this.yaxis].group
        ).map((data, i) => {
          return {
            value: data,
            index: i,
          };
        });

        this.dateOptions = Object.keys(
          data.X_Axis[this.xaxis].Y_Axis[this.yaxis].date
        ).map((data, i) => {
          return {
            value: data,
            index: i,
          };
        });
        this.groupValue = this.groupOptions[0].value;
        this.dateValue = this.dateOptions[0].value;

        this.groupCheck = false;
        this.dateCheck = false;

        const subData =
          data.X_Axis[this.xaxis].Y_Axis[
            Object.keys(data.X_Axis[this.xaxis].Y_Axis)[0]
          ];

        this.rateNames = data.X_Axis[this.xaxis].key.map(function (d) {
          return d;
        });

        const bargraphed =
          document.getElementById('controlcomponent').shadowRoot;

        this.show(bargraphed.getElementById('ColorDiv'));
        bargraphed.getElementById('colorDivMain').innerHTML = '';

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
          bargraphed
            .getElementById('colorDivMain')
            .appendChild(data.colorDivSub);
        });

        this.colors = innerHTML.map((data, index) => {
          return data.color;
        });

        bargraphed.querySelectorAll('.colors').forEach((box) =>
          box.addEventListener('change', (e) => {
            const id = e.target.id;
            const colorVal = e.target.value;
            this.colors[id] = colorVal;
            updateGraphOptions(
              this.rateNames,
              this.categoriesNames,
              this.range,
              this.value,
              this.colors,
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
      } else {
        // this.svg.selectAll('*').remove();
        const bargraphed =
          document.getElementById('controlcomponent').shadowRoot;

        this.hide(bargraphed.getElementById('ColorDiv'));
        this.yAxisOptions = ['Select'];
        this.groupOptions = ['Select'];
        this.dateOptions = ['Select'];
        this.rateNames = [];
        this.groupValue = null;
        this.dateValue = null;

        this.groupCheck = false;
        this.dateCheck = false;
        updateText('');
      }
    }

    if (newOptions.name === 'yaxis') {
      this.yaxis = newOptions.value;

      this.groupCheck = false;
      this.dateCheck = false;

      this.changeText();

      this.groupOptions = ['Select'];
      this.dateOptions = ['Select'];

      console.log(this.groupOptions);
      console.log(this.dateOptions);

      const subData = data.X_Axis[this.xaxis].Y_Axis[this.yaxis];

      this.categoriesNames = subData.value.map(function (d) {
        return d.state;
      });

      this.range = subData.range;
      this.value = subData.value;
    }

    if (newOptions.name === 'group') {
      this.groupCheck = newOptions.value;
      if (this.groupCheck) {
        this.groupOptions = Object.keys(
          data.X_Axis[this.xaxis].Y_Axis[this.yaxis].group
        ).map((data, i) => {
          return {
            value: data,
            index: i,
          };
        });
        this.groupValue = this.groupOptions[0].value;
        this.changeText();
      }

      this.AdditionalOptions();
    }

    if (newOptions.name === 'date') {
      this.dateCheck = newOptions.value;
      if (this.dateCheck) {
        this.dateOptions = Object.keys(
          data.X_Axis[this.xaxis].Y_Axis[this.yaxis].date
        ).map((data, i) => {
          return {
            value: data,
            index: i,
          };
        });
        this.dateValue = this.dateOptions[0].value;
        this.changeText();
      }
      this.AdditionalOptions();
    }

    if (newOptions.name === 'groupSelect') {
      console.log(newOptions.value);
      this.groupValue = newOptions.value;
      this.changeText();
      this.AdditionalOptions();
    }

    if (newOptions.name === 'dateSelect') {
      console.log(newOptions.value);
      this.dateValue = newOptions.value;
      this.changeText();
      this.AdditionalOptions();
    }

    if (newOptions.name === 'text') {
      this.text = newOptions.value;
      this.changeText();
    }

    if (this.xaxis) {
      updateGraphOptions(
        this.rateNames,
        this.categoriesNames,
        this.range,
        this.value,
        this.colors,
        true,
        this.value.length
      );
    } else {
      clearGraphOptions();
    }
  }

  AdditionalOptions() {
    if (this.dateCheck && this.groupCheck) {
      this.value =
        data.X_Axis[this.xaxis].Y_Axis[this.yaxis].both[this.groupValue][
          this.dateValue
        ];
      this.categoriesNames = this.value.map(function (d) {
        return d.state;
      });
    } else if (this.dateCheck) {
      this.value =
        data.X_Axis[this.xaxis].Y_Axis[this.yaxis].date[this.dateValue];
      this.categoriesNames = this.value.map(function (d) {
        return d.state;
      });
    } else if (this.groupCheck) {
      this.value =
        data.X_Axis[this.xaxis].Y_Axis[this.yaxis].group[this.groupValue];
      this.categoriesNames = this.value.map(function (d) {
        return d.state;
      });
    } else {
      const subData = data.X_Axis[this.xaxis].Y_Axis[this.yaxis];
      this.categoriesNames = subData.value.map(function (d) {
        return d.state;
      });
      this.value = subData.value;
    }
  }

  changeText() {
    if (this.groupCheck && this.dateCheck) {
      this.finalText = this.text + '-' + this.groupValue + '-' + this.dateValue;
    } else if (this.groupCheck) {
      this.finalText = this.text + '-' + this.dateValue;
    } else if (this.dateCheck) {
      this.finalText = this.text + '-' + this.groupValue;
    } else {
      this.finalText = this.text;
    }
    updateText(this.finalText);
  }

  hide(elem) {
    elem.style.display = 'none';
  }

  show(elem) {
    elem.style.display = 'block';
  }
}
FASTElement.define(ControlComponent);
