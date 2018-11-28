
"use strict";

class Router {
	constructor(routePath, app) {
		if (app == null)
			throw new Error("Missing required App");

		this.app = app;
		this.routePath = routePath;
		this._routes = [];
		this.registerServices();
	}

	get services() {
		return [{}];
	}

	registerServices() {
		var router_services = this.services;
		router_services.forEach(service => {
			let verb = (service.VERB.length > 1 ? service.VERB : 'get').toLowerCase();
			let path = this.routePath + (service.PATH.length > 1 ? service.PATH : service.PATH);
			if(service.MIDDLEWARE){
				this.app[verb](path,this[service.MIDDLEWARE].bind(this), this[service.FUNCTION_NAME].bind(this));
			}
			else{
				this.app[verb](path, this[service.FUNCTION_NAME].bind(this));
			}
		})
	}
}

module.exports = Router;