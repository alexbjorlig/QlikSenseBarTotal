define([
        'jquery',
        /*'underscore',*/
        './initialproperties',
        './properties',
        './lib/js/extensionUtils',
        'text!./lib/css/style.css',
        './lib/external/d3.min'
],
function ($, /*_,*/ initProps, props, extensionUtils, cssContent) {
    'use strict';
    extensionUtils.addStyleToHeader(cssContent);

    return {

        initialProperties: initProps,
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1,
                    max: 1
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 1
                },
                sorting: {
                    uses: "sorting"
                },
                settings: {
                    uses: "settings",
                    items: {
                        colors: {
                            type: "items",
                            label: "Colors",
                            items: {
                                positive: {
                                    ref: "bartotal.positivecolor",
                                    label: "Positive",
                                    type: "string",
                                    expression: "optional",
                                    defaultValue: "rgb(68,119,170)"
                                },
                                negative: {
                                    ref: "bartotal.negativecolor",
                                    label: "Negative",
                                    type: "string",
                                    expression: "optional",
                                    defaultValue: "rgb(249,63,23)"
                                },
                                total: {
                                    ref: "bartotal.totalcolor",
                                    label: "Color",
                                    type: "string",
                                    expression: "optional",
                                    defaultValue: "rgb(123,122,120)"
                                }
                            }
                        },
                        total: {
                            type: "items",
                            label: "Show total bar",
                            items: {
                                total: {
                                    type: "string",
                                    component: "switch",
                                    label: "Enable Totals",
                                    ref: "bartotal.total",
                                    options: [{
                                        value: true,
                                        label: "Show"
                                    }, {
                                        value: false,
                                        label: "Hide"
                                        }],
                                    defaultValue: true,
                                },
                                totalLabel: {
                                    ref: "bartotal.totalLabel",
                                    label: "Label",
                                    type: "string",
                                    expression: "optional",
                                    defaultValue: "Total",
                                    show: function (d) {
                                        return d.bartotal.total;
                                    }
                                },
                                reverse: {
                                    type: "string",
                                    component: "switch",
                                    label: "Reverse placement",
                                    ref: "bartotal.reverse",
                                    options: [{
                                        value: true,
                                        label: "True"
                                    }, {
                                        value: false,
                                        label: "False"
                                        }],
                                    defaultValue: false,
                                    show: function (d) {
                                        return d.bartotal.total;
                                    }
                                }
                            }
                        },
                        data: {
                            type: "items",
                            label: "Datapoints",
                            items: {
                                abbr: {
                                    type: "string",
                                    component: "switch",
                                    label: "Abbreviate numbers",
                                    ref: "bartotal.abbr",
                                    options: [{
                                        value: true,
                                        label: "Yes"
                                    }, {
                                        value: false,
                                        label: "No"
                                        }],
                                    defaultValue: true,
                                },
                                datapoints: {
                                    ref: "bartotal.dataPoints",
                                    label: "Datapoints",
                                    component: "dropdown",
                                    options: [{
                                        value: "no",
                                        label: "No datapoints"
                                    }, {
                                        value: "exp",
                                        label: "Expression value"
                                        }, {
                                        value: "cum", //hoho
                                        label: "Cumulative"
                                        }],
                                    type: "string",
                                    defaultValue: "exp"
                                }
                            }
                        },
                        axis: {
                            type: "items",
                            label: "Axis",
                            items: {
                                xaxis: {
                                    type: "string",
                                    component: "switch",
                                    label: "X-Axis",
                                    ref: "bartotal.xaxis",
                                    options: [{
                                        value: true,
                                        label: "Show"
                                    }, {
                                        value: false,
                                        label: "Hide"
                                        }],
                                    defaultValue: true
                                },
                                yaxis: {
                                    type: "string",
                                    component: "switch",
                                    label: "Y-Axis",
                                    ref: "bartotal.yaxis",
                                    options: [{
                                        value: true,
                                        label: "Show"
                                    }, {
                                        value: false,
                                        label: "Hide"
                                        }],
                                    defaultValue: true
                                }

                            }
                        },  // axis
                        space: {
                          type: "items",
                          label: "Spacing",
                          items: {
                            bar_padding: {
                              type: "number",
                              component: "slider",
                              label: "Space between bars",
                              ref: "bartotal.bar_padding",
                              min: 0,
                              max: 1,
                              step: 0.05,
                              defaultValue: [0.1]
                              }
                            }
                        } // Space
                    }
                }
            }
        },
        snapshot: { canTakeSnapshot: true },

        paint: function ($element, layout) {
          // Used to empty the destination, every time the figure has to be drawn
          $element.empty();
          //Can't be bothered to bind().
          var that = this;

          // I don't know what this variable describes --> but if maxGlyph is less than 5, 5 is returned else the number.
          // If number of dimensions is low --> the number is lower than if higher
          var maxGlyph = layout.qHyperCube.qDimensionInfo[0].qApprMaxGlyphCount < 5 ? 5 : layout.qHyperCube.qDimensionInfo[0].qApprMaxGlyphCount;

          var maxLabel = maxGlyph * 9;
          var rotateLabels = false; // the x axis postition of labels

          // In the example with months as a dimension, it returns "Month"
          var _f = layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0];
          var calculatedDimension = (_f.toLocaleLowerCase().indexOf('=valueloop') == 0 || _f.toLocaleLowerCase().indexOf('=valuelist') == 0)

          var datapoint = layout.bartotal.dataPoints;
          //console.log(datapoint);

          var useTotal = layout.bartotal.total;
          //console.log(useTotal);
          var reverse = layout.bartotal.reverse;
          //console.log(reverse);

          var useX = layout.bartotal.xaxis;
          var useY = layout.bartotal.yaxis;

          var format = layout.bartotal.abbr;
          var formatNumber = d3.format(".4s");

          var invert = layout.bartotal.inverse;

          var margins = {
              top: 20,
              right: 55,
              left: 55,
              bottom: 55
          };

          var othersLabel = layout.qHyperCube.qDimensionInfo[0].othersLabel;

          //Filter dimensions and map for cumulative sums
          // The qMatrix contains an object literal with the
          // dimensions and measures values
          var data = layout.qHyperCube.qDataPages[0].qMatrix
              .filter(function (d) {
                // Return only the qText (for example "april") for the dimension
                // if it is not undefined or qIsOtherCell
                  return d[0].qText !== undefined || d[0].qIsOtherCell;
              })
              .map(function (d, i, arr) {
                  return {
                      // If qIsOtherCell return othersLabel else return
                      // qText --> for example "april"
                      label: d[0].qIsOtherCell ? othersLabel : d[0].qText,
                      // value is set to qNum of the measure, for example 30238
                      value: d[1].qNum,
                      // element is set to qElemNumber
                      element: d[0].qElemNumber,
                      // Now we calculate the sum of the measure
                      // Remember that i is the iteration number
                      // If i is 0, e.i. the first iteration return the qNum,
                      // else return
                      sum: (i === 0) ? d[1].qNum : arr.map(function (d) {
                          // Ved første iteration retuner qNum af measure
                          return d[1].qNum;
                      }).reduce(function (prev, curr, idx) {
                          // Ellers brug map og reduce til at summere akkumeleret
                          if (idx > i) return prev;
                          return prev + curr
                      })
                  }
              });
          /***********************
          The above code thus returns nicely formmated array with the
          following structure:
          [
          {element: 1,
            label: "april",
            sum: 34032,
            value: 34032},
          { element: 2,
            label: "maj",
            sum: 44032,
            value: 10000}...]
          ***********************/

          // The following function is a simple funcional map function
          // To return the total sum
          var totalsum = data.reduce(function(sum, row){
            return sum + row.value
          }, 0)


          /**************************
          CUSTOM SETTING: Total
          There are 3 scenarios:
             1) The user does not want to show total, no data is changed
             2) The user wants total placed left, i.e reverse = true
                the totalsum object is placed in the beginning of array
             3) The user wants total placed right, i.e reverse = false
                the totalsum object is placed at the end of the array
          **************************/
          if (useTotal) {
              if (reverse) { // Scenario 2
                  data.unshift({
                      label: layout.bartotal.totalLabel,
                      value: totalsum,
                      element: 'total',
                      sum: totalsum
                  })
              } else {  // Scenario 3
                  data.push({
                      label: layout.bartotal.totalLabel,
                      value: totalsum,
                      element: 'total',
                      sum: totalsum
                  })
              }
          };

          // The width of the area to use for drawing the graph is
          // calculated by taking the width and subtracting margins
          var width = $element.width() - margins.left - margins.right;

          // The max value in the array is found using d3.max
          // as it ignores undefined values
          var max = d3.max(data, function(d) {
            return d.sum
          }) * 1.05;

          // Min is set to 0
          var min = 0;


          // TODO Explain/understand how this code works, possible updgrade
          // to d3 v4. But it builds a scale used for graphing
          var xScale = d3.scale.ordinal()
              .rangeRoundBands([0, width], layout.bartotal.bar_padding)
              .domain(data.map(function (d) {
                  return d.label
              }));

          // If maxLabel is more than 55, the number of dimensions is high,
          // and we need to rotate the labels to make more room
          if (maxLabel > 55) {
              margins.bottom = maxLabel;
              rotateLabels = true;
          }

          // xScale.rangeBand() returns the width of the x band.
          // This way we can dynamicly change label orientation if
          if (maxLabel > xScale.rangeBand()) {
              margins.bottom = 55;
              rotateLabels = true; // Edited this code to work as intended
          };

          var height = $element.height() - margins.top - margins.bottom;


          var yScale = d3.scale.linear()
              .domain([min, max])
              .range([min, height]);

          var y = d3.scale.linear()
              .domain([min, max])
              .range([height, min]);

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .tickFormat(d3.format("s"));

          var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

          var svg = d3.select($element.get(0)).selectAll('svg')
              .data([null])
              .enter()
              .append('svg')
              .attr('width', width + margins.left + margins.right)
              .attr('height', height + margins.top + margins.bottom)
              .append("g")
              .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

          // Variable implemented by me
          var percentage = 0.8;

          /*************************************
          Building the rectangles
          *************************************/
          svg.selectAll("rect")
              .data(data)
              .enter()
              .append("rect")
              .attr('id', function (d) {
                  return d.element
              })
              .attr("class", function (d) {
                  return d.label === layout.bartotal.totalLabel ? "total" : (d.value < 0) ? "negative" : "positive";
              })
              .attr("x", function (d, i) {
                return xScale(d.label);
              })
              .attr("y", function (d, i) {
                return height - yScale(d.value);
              })
              .attr("width", xScale.rangeBand())
              .attr("height", function (d, i) {
                  return yScale(Math.abs(d.value));
              })
              .style('fill', function (d) {
                  if (d.label === layout.bartotal.totalLabel) return layout.bartotal.totalcolor;
                  var color = (d.value < 0) ? layout.bartotal.negativecolor : layout.bartotal.positivecolor;
                  return color;
              });

          if (!calculatedDimension) {
              svg.selectAll('rect').style('cursor', 'pointer').on('click', handleClick);
          }

          /*************************************
          The following code controls the labels
          *************************************/
          var barLabels = svg.append("g")
              .selectAll('text')
              .data(data)
              .enter()
              .append("text")
              .attr("x", function (d) {
                  return xScale(d.label) + (xScale.rangeBand() / 2);
              })
              .attr("y", function (d, i) {
                return height - yScale(d.value);
              })
              .attr('dy', -5)
              .attr('text-anchor', 'middle')
              .text(function (d) {
                  var val = '';
                  if (datapoint == 'exp') {
                      val = format ? formatNumber(d.value) : d.value;
                  } else if (datapoint === 'cum') {
                      val = format ? formatNumber(d.sum) : d.sum;
                  };
                  return val;
              });


          if (useY) {
              svg.append("g").attr("class", "yaxis axis").call(yAxis);
          };
          if (useX) {
              svg.append("g")
                  .attr("class", "xaxis axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);
          };
          if (useX && rotateLabels) {
              svg.selectAll(".xaxis text")
                  .style("text-anchor", "end")
                  .attr("transform", function (d) {
                      return "translate(" + -8 + "," + 0 + ")rotate(-45)";
                  });
          };

            /*
            This function makes the extension "interactive"
            */
            function handleClick(d, i) {
                //Break if in edit mode.
                if (that.$scope.$parent.$parent.editmode) return;

                //Can't select the total bar or NULL.
                if (d.element == 'total' || d.element == -2) return;

                that.selectValues(0, [d.element], true);

                if (that.selectedArrays[0].length === 0) {
                    svg.selectAll('rect').style('opacity', 1);
                    return;
                };

                svg.selectAll('rect').style('opacity', 0.4);

                svg.selectAll('rect').each(function () {
                    var e = d3.select(this);
                    var id = e.attr('id');
                    that.selectedArrays[0].forEach(function (d) {
                        if (id == d) {
                            return e.style('opacity', 1);
                        }
                    })
                })
            };  // ClickHandler

        }
    };

});
