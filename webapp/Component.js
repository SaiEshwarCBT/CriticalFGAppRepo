sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"stocklevel/CriticalStockLevelFG/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("stocklevel.CriticalStockLevelFG.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			window.stockLevelFGArray = [];
			window.plantComboText = '';
			window.matComboText = '';
			window.plantComboData = [];
			window.materialComboData = [];
			window.plantFilter = '';
			window.defArray = [];
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});