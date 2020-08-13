import React from 'react'
import QueryString from 'query-string'

class Route{
    constructor(params){
        this.path = params.path;
        this.regex = params.regex;
        this.default_routing_options = params.default_routing_options;
        this.view = params.view;
    }

    matchPath(path){
        let matches = path.match(this.regex);
        return matches && matches.length > 0;
    }

    getRouteOptions(){
        let routing_options;

        // Get routing options if there are any. 
        if(this.location && this.location.state && this.location.state.routing_options){
            // Routing options passed in state override any defaults, if they exist.
            if(this.default_routing_options){
                routing_options = {...this.default_routing_options, ...this.location.state.routing_options }
            } else {
                routing_options = location.state.routing_options;
            }
        } else {
            // Could be undefined.
            routing_options = this.default_routing_options;
        }
        return routing_options;
    }

    /*
        The component for a route is rendered with the given props:

        1. Query string props.
        2. State from history.location.state.
    */
    getProps(){
        return this.location ? 
            {...QueryString.parse(this.location.search), ...this.location.state} : {}
    }

    getBreadCrumb(){
        let route_options = this.getRouteOptions();

        // If a breadcrumb name is configured, use that. Otherwise, use the path.
        if(route_options && route_options.breadcrumb_name){
            return route_options.breadcrumb_name(this.getProps());
        } else {
            return route.path;
        }
    }

    // Get the view for the route and render it with the appropriate props.
    // This is a little bit of indirection, and the view will be some React compoonent
    // as configured by the Route.
    render(){
        const DynamicComponent = this.view;
        return <DynamicComponent {...this.getProps()}/>
    }
}

export default Route