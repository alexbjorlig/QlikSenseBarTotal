define( [], function () {
	'use strict';

	// ****************************************************************************************
	// Dimensions & Measures
	// ****************************************************************************************
	var dimensions = {
		uses: "dimensions",
		min: 1,
		max: 1
	};

	var measures = {
		uses: "measures",
		min: 1,
		max: 1
	};

	var sorting = {
		uses: "sorting"
	};

	// ****************************************************************************************
	// Other Settings
	// ****************************************************************************************

	var testSetting = {
		ref: "props.test",
		label: "Test Setting",
		type: "string",
		expression: "optional",
		show: true
	};

	// ****************************************************************************************
	// Property Panel Definition
	// ****************************************************************************************

	// Appearance Panel
	var appearancePanel = {
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
												offset: {
                            type: "items",
                            label: "Offset first bar",
                            items: {
                                useoffset: {
                                    label: "Offset",
                                    type: "boolean",
                                    component: "switch",
                                    options: [{
                                        label: "Disabled",
                                        value: false
                                    }, {
                                        label: "Enabled",
                                        value: true
                                        }],
                                    ref: "bartotal.useoffset",
                                    defaultValue: false
                                },
                                offsetby: {
                                    type: "number",
                                    expression: "optional",
                                    ref: "bartotal.offsetby",
                                    show: true
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
																		show: true
																		//show: function (d) {
                                    //    return d.bartotal.total;
                                    //}
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
																		show: true
                                  //  show: function (d) {
                                  //      return d.bartotal.total;
                                  //  }
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
                        }
		}
	};

	// Return values
	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: dimensions,
			measures: measures,
			sorting: sorting,
			//addons: addons,
			// appearance: appearancePanel

		}
	};

} );
