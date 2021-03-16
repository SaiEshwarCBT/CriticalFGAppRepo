sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("stocklevel.CriticalStockLevelFG.controller.CriticalStockLevel", {
		onInit : function(ab){
			sap.ui.core.BusyIndicator.show();
			this.getView().byId("refreshIcon").setVisible(false);
			var oFormat = sap.ui.core.format.DateFormat.getInstance({
				format: "yMMMd"
			});
			var capitalizeFirstLetter = function (str) {
				var pieces = str.split(" ");
				for (var i = 0; i < pieces.length; i++) {
					var j = pieces[i].charAt(0).toUpperCase();
					pieces[i] = j + pieces[i].substr(1).toLowerCase();
				}
				return pieces.join(" ");
			};
			var that = this;
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_CRITSTOCKFG_FINAL_CDS/");
			oModel.read("/Z_CRITSTOCKFG_FINAL", {
				success: function (data, response) {
					var oResults = data.results;
					for (var i = 0; i < oResults.length; i++) {
						var documentDateData = oResults[i].DocumentDate;
						documentDateData = new Date(documentDateData);
						stockLevelFGArray.push({
							material: oResults[i].MatNumber,
							shortExcessStock: oResults[i].ShortExcessStock,
							daysofstock: oResults[i].Daysofstock,
							rMDaysofstock: oResults[i].RMDaysofstock,
							unit: oResults[i].Unit,
							plantDesc: oResults[i].PlantDesc,
							materialDesc: oResults[i].MaterialDesc,
							matGroup: oResults[i].MatGroup,
							matGroupDesc: oResults[i].MatGroupDesc,
							saleOrderQty: oResults[i].SaleOrdQty,
							plantDepot: oResults[i].PlantDepot,
							plant: oResults[i].Plant,
							unRestStock: oResults[i].UnRestStock,
							qualityInspStock: oResults[i].QualityInspStock,
							totalStock: oResults[i].TotalStock,
							safetyStock: oResults[i].SafetyStock,
							leadTime: oResults[i].LeadTime,
							avgDayConsumption: oResults[i].AvgDayConsumption
						});
					}
					
					var plant = stockLevelFGArray[0].plant;
					
					plantComboData = [];
					var warehouseData = [];
					var warehouseData1 = [];
					for (var m = 0; m < stockLevelFGArray.length; m++) {
						if (warehouseData.indexOf(stockLevelFGArray[m].plant) === -1) {
							warehouseData.push(stockLevelFGArray[m].plant);
							warehouseData1.push(stockLevelFGArray[m].plantDesc);
						}
					}
					for (var n = 0; n < warehouseData.length; n++) {
						var object = {};
						object.plantDataCom = warehouseData[n];
						object.plantDescData = warehouseData1[n];
						object.key = n;
						plantComboData.push(object);
					}
					var plantComboModel = new sap.ui.model.json.JSONModel();
					plantComboModel.setData(plantComboData);
					plantComboModel.setSizeLimit(500);
					that.getView().setModel(plantComboModel, "plant");
					
					that.getView().byId("plant").setSelectedKey(0);
					var materialData = [];
					var materialData1 = [];
					materialComboData = [];
					for (var m = 0; m < stockLevelFGArray.length; m++) {
						if (materialData.indexOf(stockLevelFGArray[m].material) === -1 && materialData1.indexOf(stockLevelFGArray[m].materialDesc) ===
							-1 && stockLevelFGArray[m].plant == plant) {
							materialData.push(stockLevelFGArray[m].material);
							materialData1.push(stockLevelFGArray[m].materialDesc);
						}
					}
					for (var n = 0; n < materialData.length; n++) {
						var object1 = {};
						object1.materialDataCom = materialData[n];
						object1.materialDescData = materialData1[n];
						object1.key = n;
						materialComboData.push(object1);
					}
					var materialComboModel = new sap.ui.model.json.JSONModel();
					materialComboModel.setData(materialComboData);
					materialComboModel.setSizeLimit(500);
					that.getView().setModel(materialComboModel, "material");
					var defArray = [];
					for(var j = 0;j<stockLevelFGArray.length;j++){
						if(stockLevelFGArray[j].plant == plant){
							defArray.push({
								material: stockLevelFGArray[j].material,
							shortExcessStock: stockLevelFGArray[j].shortExcessStock,
							daysofstock: stockLevelFGArray[j].daysofstock,
							rMDaysofstock: stockLevelFGArray[j].rMDaysofstock,
							unit: stockLevelFGArray[j].unit,
							plantDesc: stockLevelFGArray[j].plantDesc,
							materialDesc: stockLevelFGArray[j].materialDesc,
							matGroup: stockLevelFGArray[j].matGroup,
							matGroupDesc: stockLevelFGArray[j].matGroupDesc,
							saleOrderQty: stockLevelFGArray[j].saleOrderQty,
							plantDepot: stockLevelFGArray[j].plantDepot,
							plant: stockLevelFGArray[j].plant,
							unRestStock: stockLevelFGArray[j].unRestStock,
							qualityInspStock: stockLevelFGArray[j].qualityInspStock,
							totalStock: stockLevelFGArray[j].totalStock,
							safetyStock: stockLevelFGArray[j].safetyStock,
							leadTime: stockLevelFGArray[j].leadTime,
							avgDayConsumption: stockLevelFGArray[j].avgDayConsumption
							});
						}
					}
					var	tableModel = new sap.ui.model.json.JSONModel();
					tableModel.setData(defArray);
					that.getView().setModel(tableModel, "fgTable");
					var vizModel = new sap.ui.model.json.JSONModel();
					vizModel.setData(defArray);
					that.getView().setModel(vizModel, "stockLevelVizframe");
					var stockLevelVizframe = that.getView().byId("stockLevelVizframe");
					stockLevelVizframe.setVizProperties({
						"interaction": {
							"noninteractiveMode": false,
							"selectability": {
								"legendSelection": false,
								"axisLabelSelection": false,
								"mode": "EXCLUSIVE",
								"plotLassoSelection": false,
								"plotStdSelection": true
							}
						},
						tooltip: { visible: true},
						plotArea: {
							gap : { barSpacing: 1 },
							gridline: {
								visible: true
							},
							dataPointSize: {
								min: 30,
								max: 30
							},
							dataPointStyle: {
								'rules': [{
									"dataContext": {
										"StockInDays": {
											min: "15",
											max: "15"
										}
									},
									"properties": {
										"color": "#007dff",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "14",
											max: "14"
										}
									},
									"properties": {
										"color": "#436EEE",
										"dataLabel": {
											"visible": true
										}
									}
								},{
									"dataContext": {
										"StockInDays": {
											min: "13",
											max: "13"
										}
									},
									"properties": {
										"color": "#0000CD",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "12",
											max: "12"
										}
									},
									"properties": {
										"color": "#23238E",
										"dataLabel": {
											"visible": true
										}
									}
								},{
									"dataContext": {
										"StockInDays": {
											min: "11",
											max: "11"
										}
									},
									"properties": {
										"color": "#6b8e23",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "10",
											max: "10"
										}
									},
									"properties": {
										"color": "#556b2f",
										"dataLabel": {
											"visible": true
										}
									}
								},{
									"dataContext": {
										"StockInDays": {
											min: "9",
											max: "9"
										}
									},
									"properties": {
										"color": "#eedd82",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "8",
											max: "8"
										}
									},
									"properties": {
										"color": "#ffd700",
										"dataLabel": {
											"visible": true
										}
									}
								},{
									"dataContext": {
										"StockInDays": {
											min: "7",
											max: "7"
										}
									},
									"properties": {
										"color": "#FFA500",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "6",
											max: "6"
										}
									},
									"properties": {
										"color": "#FF8C00",
										"dataLabel": {
											"visible": true
										}
									}
								},{
									"dataContext": {
										"StockInDays": {
											min: "5",
											max: "5"
										}
									},
									"properties": {
										"color": "#FF7F50",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "4",
											max: "4"
										}
									},
									"properties": {
										"color": "#FF6347",
										"dataLabel": {
											"visible": true
										}
									}
								},{
									"dataContext": {
										"StockInDays": {
											min: "3",
											max: "3"
										}
									},
									"properties": {
										"color": "#CD5C5C",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "2",
											max: "2"
										}
									},
									"properties": {
										"color": "#DC143C",
										"dataLabel": {
											"visible": true
										}
									}
								}, {
									"dataContext": {
										"StockInDays": {
											min: "1",
											max: "1"
										}
									},
									"properties": {
										"color": "	#FF4500",
										"dataLabel": {
											"visible": true
										}
									}
								}]
							},
							dataLabel: {
								visible: true,
								style: {
									fontSize: "12px",
									fontFamily: "Segoe UI Semibold"
								}
							}
						},
						legend: {
							visible: false
						},
						legendGroup: {
							layout: {
								position: "bottom",
								alignment: "center"
							}
						},
						categoryAxis: {
							visible: true,
							axisTick: {
								visible: true
							},
							label: {
								angle: 30,
								style: {
									fontSize: "12px",
									fontFamily: "Segoe UI Semibold"
								},
								visible: true
							},
							title: {
								visible: true,
								text: "Material",
								style: {
									fontSize: "14px",
									fontFamily: "Segoe UI Semibold",
									color: "#000000"
								}
							}
						},
						valueAxis: {
							axisLine: {
								visible: false
							},
							title: {
								visible: true,
								text: "Stock in Days",
								style: {
									fontSize: "14px",
									fontFamily: "Segoe UI Semibold",
									color: "#000000"
								}
							},
							axisTick: {
								visible: false
							}
						},
						title: {
							visible: false,
							text: "",
							style: {
								fontSize: "14px",
								fontFamily: "Segoe UI Semibold"
							}
						}
					});
					sap.ui.core.BusyIndicator.hide();
				}
			});	
		},
		changePlantViz : function(oEvent){
			var that = this;
			that.getView().byId("material").setSelectedItem(null);
			plantComboText = oEvent.oSource.getSelectedItem().mProperties.text;
			var defArray = [];
			for(var j = 0;j<stockLevelFGArray.length;j++){
				if(stockLevelFGArray[j].plant == plantComboText){
					defArray.push({
						material: stockLevelFGArray[j].material,
							shortExcessStock: stockLevelFGArray[j].shortExcessStock,
							daysofstock: stockLevelFGArray[j].daysofstock,
							rMDaysofstock: stockLevelFGArray[j].rMDaysofstock,
							unit: stockLevelFGArray[j].unit,
							plantDesc: stockLevelFGArray[j].plantDesc,
							materialDesc: stockLevelFGArray[j].materialDesc,
							matGroup: stockLevelFGArray[j].matGroup,
							matGroupDesc: stockLevelFGArray[j].matGroupDesc,
							saleOrderQty: stockLevelFGArray[j].saleOrderQty,
							plantDepot: stockLevelFGArray[j].plantDepot,
							plant: stockLevelFGArray[j].plant,
							unRestStock: stockLevelFGArray[j].unRestStock,
							qualityInspStock: stockLevelFGArray[j].qualityInspStock,
							totalStock: stockLevelFGArray[j].totalStock,
							safetyStock: stockLevelFGArray[j].safetyStock,
							leadTime: stockLevelFGArray[j].leadTime,
							avgDayConsumption: stockLevelFGArray[j].avgDayConsumption
					});
				}
			}
			var	tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData(defArray);
			that.getView().setModel(tableModel, "fgTable");
			var vizModel = new sap.ui.model.json.JSONModel();
			vizModel.setData(defArray);
			that.getView().setModel(vizModel, "stockLevelVizframe");
			
			var materialData = [];
			var materialData1 = [];
			var materialComboData = [];
			for (var m = 0; m < stockLevelFGArray.length; m++) {
				if (materialData.indexOf(stockLevelFGArray[m].material) === -1 && materialData1.indexOf(stockLevelFGArray[m].materialDesc) ===
					-1 && stockLevelFGArray[m].plant === plantComboText) {
					materialData.push(stockLevelFGArray[m].material);
					materialData1.push(stockLevelFGArray[m].materialDesc);
				}
			}
			for (var n = 0; n < materialData.length; n++) {
				var object1 = {};
				object1.materialDataCom = materialData[n];
				object1.materialDescData = materialData1[n];
				object1.key = n;
				materialComboData.push(object1);
			}
			var materialComboModel = new sap.ui.model.json.JSONModel();
			materialComboModel.setData(materialComboData);
			that.getView().setModel(materialComboModel, "material");
			
		},
		changeMaterialViz : function(oEvent){
			if(plantComboText === ''){
			var that = this;
			var matComboText = oEvent.oSource.getSelectedItem().mProperties.text;
			var defArray = [];
			for(var j = 0;j<stockLevelFGArray.length;j++){
				if(stockLevelFGArray[j].plant == plant && stockLevelFGArray[j].material == matComboText){
					defArray.push({
						material: stockLevelFGArray[j].material,
							shortExcessStock: stockLevelFGArray[j].shortExcessStock,
							daysofstock: stockLevelFGArray[j].daysofstock,
							rMDaysofstock: stockLevelFGArray[j].rMDaysofstock,
							unit: stockLevelFGArray[j].unit,
							plantDesc: stockLevelFGArray[j].plantDesc,
							materialDesc: stockLevelFGArray[j].materialDesc,
							matGroup: stockLevelFGArray[j].matGroup,
							matGroupDesc: stockLevelFGArray[j].matGroupDesc,
							saleOrderQty: stockLevelFGArray[j].saleOrderQty,
							plantDepot: stockLevelFGArray[j].plantDepot,
							plant: stockLevelFGArray[j].plant,
							unRestStock: stockLevelFGArray[j].unRestStock,
							qualityInspStock: stockLevelFGArray[j].qualityInspStock,
							totalStock: stockLevelFGArray[j].totalStock,
							safetyStock: stockLevelFGArray[j].safetyStock,
							leadTime: stockLevelFGArray[j].leadTime,
							avgDayConsumption: stockLevelFGArray[j].avgDayConsumption
					});
				}
			}
			var	tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData(defArray);
			that.getView().setModel(tableModel, "fgTable");
			var vizModel = new sap.ui.model.json.JSONModel();
			vizModel.setData(defArray);
			that.getView().setModel(vizModel, "stockLevelVizframe");
			}
			else {
				var that = this;
			var matComboText = oEvent.oSource.getSelectedItem().mProperties.text;
			var defArray = [];
			for(var j = 0;j<stockLevelFGArray.length;j++){
				if(stockLevelFGArray[j].plant == plantComboText && stockLevelFGArray[j].material == matComboText){
					defArray.push({
						material: stockLevelFGArray[j].material,
							shortExcessStock: stockLevelFGArray[j].shortExcessStock,
							daysofstock: stockLevelFGArray[j].daysofstock,
							rMDaysofstock: stockLevelFGArray[j].rMDaysofstock,
							unit: stockLevelFGArray[j].unit,
							plantDesc: stockLevelFGArray[j].plantDesc,
							materialDesc: stockLevelFGArray[j].materialDesc,
							matGroup: stockLevelFGArray[j].matGroup,
							matGroupDesc: stockLevelFGArray[j].matGroupDesc,
							saleOrderQty: stockLevelFGArray[j].saleOrderQty,
							plantDepot: stockLevelFGArray[j].plantDepot,
							plant: stockLevelFGArray[j].plant,
							unRestStock: stockLevelFGArray[j].unRestStock,
							qualityInspStock: stockLevelFGArray[j].qualityInspStock,
							totalStock: stockLevelFGArray[j].totalStock,
							safetyStock: stockLevelFGArray[j].safetyStock,
							leadTime: stockLevelFGArray[j].leadTime,
							avgDayConsumption: stockLevelFGArray[j].avgDayConsumption
					});
				}
			}
			var	tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData(defArray);
			that.getView().setModel(tableModel, "fgTable");
			var vizModel = new sap.ui.model.json.JSONModel();
			vizModel.setData(defArray);
			that.getView().setModel(vizModel, "stockLevelVizframe");
			
			
			}
		},
		getTableIcon : function(oEvent){
			var table = oEvent.getSource().getSelectedContent().mProperties.title;
			if(table == "Table"){
				this.getView().byId("refreshIcon").setVisible(true);
			}
			else {
				this.getView().byId("refreshIcon").setVisible(false);
			}
		},
		refreshMainTab : function(){
			this.getView().byId("plant").setSelectedItem(null);
			this.getView().byId("material").setSelectedItem(null);
			var that = this;
			var	tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData(stockLevelFGArray);
			that.getView().setModel(tableModel, "fgTable");
		}
	});
});