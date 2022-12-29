function setGraph(
  rateNames,
  categoriesNames,
  yaxisData,
  barData,
  color,
  trans,
  barSize
) {
  svg.selectAll('*').remove();
  setSVG(color, barSize);
  if (rateNames && categoriesNames) {
    setXais(rateNames, categoriesNames);
  }

  if (yaxisData) {
    setYAxis(yaxisData);
  }

  if (barData) {
    setBarGraph(barData, trans);
  }
}

function setSVG(color, barSize) {
  svg = d3.select('svg');
  margin = { top: 20, right: 20, bottom: 0, left: 40 };
  width = +svg.attr('width') - margin.left - margin.right;
  height = +svg.attr('height') - margin.top - margin.bottom;
  g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  if (barSize > 3) {
    x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.5)
      .paddingOuter(0.1);
  } else if (barSize > 6) {
    x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.1);
  } else if (barSize > 9) {
    x0 = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  } else if (barSize > 1 && barSize <= 3) {
    x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.7)
      .paddingOuter(0.1);
  } else {
    x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.9)
      .paddingOuter(0.1);
  }

  x1 = d3.scaleBand().paddingInner(0.1);

  // x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.2);

  // x1 = d3.scaleBand();

  y = d3.scaleLinear().rangeRound([height / 1.75, 0]);
  if (color) {
    z = d3.scaleOrdinal().range(color);
  } else {
    z = d3.scaleOrdinal().range(['#cccccc', '#333333']);
  }
}

function setXais(rateNames, categoriesNames) {
  x0.domain(categoriesNames);
  x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);

  legend = g.append('g').attr('class', 'legend');

  const legenG = legend
    .selectAll('g')
    .data(
      rateNames.map(function (d) {
        return d;
      })
    )
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
      return 'translate(' + i * (width / (rateNames.length + 1)) + ', 0)';
    });

  legenG
    .append('rect')
    .attr('x', 0)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', z);

  legenG
    .append('text')
    .attr('x', 25)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .text(function (d) {
      return d;
    });

  g.append('g')
    .attr('class', 'x-axis axis')
    .attr('transform', 'translate(0,' + height / 1.4 + ')')
    .call(d3.axisBottom(x0))
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

  g.append('g')
    .attr('class', 'grid')
    .attr('transform', 'translate(0,' + height / 7 + ')')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(10));
}

function setBarGraph(data, trans) {
  const barG = g
    .append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function (d) {
      return 'translate(' + x0(d.state) + ',0)';
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
      .attr('transform', 'translate(0,' + height / 7 + ')')
      .attr('x', function (d) {
        return x1(d.type);
      })
      .attr('width', x1.bandwidth())
      .attr('fill', function (d) {
        return z(d.type);
      })
      .attr('y', height / 2)
      .transition()
      .delay(function (d, i) {
        return i * 250;
      }) // this is to do left then right bars
      .duration(250)
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('height', function (d) {
        if (d.value > 0) {
          return height / 1.75 - y(d.value);
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
      .attr('transform', 'translate(0,' + height / 7 + ')')
      .attr('x', function (d) {
        return x1(d.type);
      })
      .attr('width', x1.bandwidth())
      .attr('fill', function (d) {
        return z(d.type);
      })
      .attr('y', height / 2)
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('height', function (d) {
        if (d.value > 0) {
          return height / 1.75 - y(d.value);
        } else {
          return 0;
        }
      });
  }

  g.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + height / 1.4 + ')')
    .call(d3.axisBottom(x0))
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

function setYAxis(data) {
  y.domain(data);
  g.append('g')
    .attr('class', 'y-axis axis')
    .attr('transform', 'translate(0,' + height / 7 + ')')
    .call(d3.axisLeft(y).ticks(7));
}
