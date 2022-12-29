import {
  FASTElement,
  html,
  css,
  repeat,
  observable,
} from 'https://cdn.jsdelivr.net/npm/@microsoft/fast-element/dist/fast-element.min.js';

const styles = css`
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

  .svgMain {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    border: 3px dotted #333333;
    background-color: #666666;
    margin: 25px;
    padding: 30px;
  }
`;

let template = html`
  <div class="svgMain">
    <h3>
      ${(x) => {
        return x.graphOptions ? x.graphOptions : '';
      }}
    </h3>
    <svg width="1200" height="700" id="SVG"></svg>
  </div>
`;

export class D3ChartComponent extends FASTElement {
  static definition = {
    name: 'd3-chart-component',
    template,
    styles: styles,
    attributes: [
      'svg',
      'svg1',
      'graphOptions',
      'margin',
      'width',
      'height',
      'g',
      'x0',
      'x1',
      'y1',
      'z',
    ],
  };

  connectedCallback() {
    super.connectedCallback();
  }

  updateText(newOptions) {
    this.graphOptions = newOptions;
  }

  updateGraphOptions(
    rateNames,
    categoriesNames,
    range,
    value,
    colors,
    is_trans,
    valuelength
  ) {
    const bargraphed = document.querySelector('d3-chart-component').shadowRoot;
    this.svg = d3.select(bargraphed.getElementById('SVG'));
    this.setGraph(
      rateNames,
      categoriesNames,
      range,
      value,
      colors,
      is_trans,
      valuelength
    );
    // this.setSVG([], 1);
  }

  clearGraphOptions() {
    this.svg.selectAll('*').remove();
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
      this.setXaxis(rateNames, categoriesNames);
    }

    if (yaxisData) {
      this.setYAxis(yaxisData);
    }

    if (barData) {
      this.setBarGraph(barData, trans);
    }
  }

  setSVG(color, barSize) {
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

    // x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.2);

    // x1 = d3.scaleBand();

    this.y = d3.scaleLinear().rangeRound([this.height / 1.75, 0]);
    if (color) {
      this.z = d3.scaleOrdinal().range(color);
    } else {
      this.z = d3.scaleOrdinal().range(['#cccccc', '#333333']);
    }
  }

  setXaxis(rateNames, categoriesNames) {
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

  setYAxis(data) {
    this.y.domain(data);
    this.g
      .append('g')
      .attr('class', 'y-axis axis')
      .attr('transform', 'translate(0,' + this.height / 7 + ')')
      .call(d3.axisLeft(this.y).ticks(7));
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
}
FASTElement.define(D3ChartComponent);
