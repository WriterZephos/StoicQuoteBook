class Route{
    constructor(params){
        this.path = params.path;
        this.regex = params.regex;
        this.default_routing_options = params.default_routing_options;
        this.action = params.action;
    }

    matchPath(path){
        let matches = path.match(this.regex);
        return matches && matches.length > 0;
    }

    routeOptions(){
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
}

export default Route