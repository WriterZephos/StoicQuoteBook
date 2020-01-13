import React from 'react'
import QueryString from 'query-string'
import HomeIndex from './home/home_index'
import IndexLayout from './layouts/index_layout'
import PeopleIndex from './people/people_index'
import PersonShow from './people/person_show'
import PersonForm from './people/person_form'
import QuotesIndex from './quotes/quotes_index'
import QuoteShow from './quotes/quote_show'
import QuoteForm from './quotes/quote_form'
import PublicationsIndex from './publications/publications_index'
import PublicationShow from './publications/publication_show'
import PublicationForm from './publications/publication_form'

class AppRouter extends React.Component{

    constructor(props){
        super(props);

        this.default_route = {
            path: '/',
            regex: /^\/$/,
            default_routing_options: {breadcrumb_index: 0, breadcrumb_name: "Home"},
            action: (props) => <HomeIndex {...props}/>
        }

        this.state = {current_route: {...this.default_route}, breadcrumbs:[{...this.default_route}]};
        
        this.routes = [
            {...this.default_route},
            {
                path: '/quotes',
                regex: /^\/quotes$/g,
                default_routing_options: {breadcrumb_index: 1, breadcrumb_name: "Quotes"},
                action: (props) => <QuotesIndex {...props}/>
            },
            {
                path: '/quote',
                regex: /^\/quote$/g,
                default_routing_options: {breadcrumb_name: "Quote"},
                action: (props) => <QuoteShow {...props}/>
            },
            {
                path: '/quote_form',
                regex: /^\/quote_form$/g,
                default_routing_options: {breadcrumb_name: "Quote Form"},
                action: (props) => <QuoteForm {...props}/>
            },
            {
                path: '/people',
                regex: /^\/people$/g,
                default_routing_options: {breadcrumb_index: 1, breadcrumb_name: "People"},
                action: (props) => <PeopleIndex {...props}/>
            },
            {
                path: '/person',
                regex: /^\/person$/g,
                default_routing_options: {breadcrumb_name: "Person"},
                action: (props) => <PersonShow {...props}/>
            },
            {
                path: '/person_form',
                regex: /^\/person_form$/g,
                default_routing_options: {breadcrumb_name: "Person Form"},
                action: (props) => <PersonForm {...props}/>
            },
            {
                path: '/publications',
                regex: /^\/publications$/g,
                default_routing_options: {breadcrumb_index: 1, breadcrumb_name: "Publications"},
                action: (props) => <PublicationsIndex {...props}/>
            },
            {
                path: '/publication',
                regex: /^\/publication$/g,
                default_routing_options: {breadcrumb_name: "Publication"},
                action: (props) => <PublicationShow {...props}/>
            },
            {
                path: '/publication_form',
                regex: /^\/publication_form$/g,
                default_routing_options: {breadcrumb_name: "Publication Form"},
                action: (props) => <PublicationForm {...props}/>
            }
        ];

        this.state.history_unlisten = window.app_vars.app_history.listen(this.routing_listener.bind(this));
    }

    /*
        This is the callback that gets called when a new location is pushed to history.
    */
    routing_listener(location, action){

        let route = this.get_matching_route(location);
        
        if(!route){
            route = {...this.default_route};
        }

        this.update_breadcrumbs(route, location, action, () => {
            let bc_array = this.state.breadcrumbs.map((route) => {

                let routing_options;

                // Get routing options if there are any. 
                if(route.location && route.location.state && route.location.state.routing_options){
                    // Routing options passed in state overrided any defaults.
                    if(route.default_routing_options){
                        routing_options = {...route.default_routing_options, ...route.location.state.routing_options }
                    } else {
                        routing_options = location.state.routing_options;
                    }
                } else {
                    // Could be undefined.
                    routing_options = route.default_routing_options;
                }

                if(routing_options && routing_options.breadcrumb_name){
                    return routing_options.breadcrumb_name;
                } else {
                    return route.path;
                }
            });
            console.log(bc_array.join(", "));
            this.setState({current_route: {...route}, });
        });
        
    }

    /*
        Finds a matching route, if it exists, based on the route's regex.
    */
    get_matching_route(location){
        return this.routes.find((route) => {
            let matches = location.pathname.match(route.regex);
            return matches && matches.length > 0;
        });
    }

    update_breadcrumbs(route, location, action, callback){

        let last_index = this.state.breadcrumbs.length - 1;

        // Add the current locations to the index we as saving, so we can reproduce the same view, etc.
        let instance_route = {...route}
        instance_route.location = {...location}

        let routing_options;
        
        // Get routing options if there are any. 
        if(location.state && typeof location.state.routing_options === 'object' && location.state.routing_option !== null){
            // Routing options passed in state overrided any defaults.
            if(route.default_routing_options){
                routing_options = {...route.default_routing_options, ...location.state.routing_options }
            } else {
                routing_options = location.state.routing_options;
            }
        } else {
            // Could be undefined.
            routing_options = route.default_routing_options;
        }

        // Reset the breadcrumbs for main pages (Home, Home > Quotes, etc) where routing options specify to do so.
        if(routing_options && !isNaN(routing_options.breadcrumb_index)){
            if(routing_options.breadcrumb_index === 0){
                this.setState({breadcrumbs: [{...instance_route}]}, callback);
            } else if (routing_options.breadcrumb_index === 1){
                this.setState({breadcrumbs: [{...this.default_route}, instance_route]}, callback);
            } else {
                console.error("Breadcrumbs could not be updated. The route may have a problem.");
                if(callback){
                    callback();
                }
            }
        } else {
            if(action === "PUSH"){
                this.setState({breadcrumbs: [...this.state.breadcrumbs, instance_route]}, callback);
            } else if (action === "POP"){
                // POP happens on forward and backward browser navigation, 
                // so we need to see if the current location path (the one getting popped)
                // is the one we are already on, and handle accordingly.
                if(instance_route.path === this.state.breadcrumbs[last_index - 1].path){
                    this.setState({breadcrumbs: this.state.breadcrumbs.slice(0,last_index)}, callback);
                } else {
                    this.setState({breadcrumbs: [...this.state.breadcrumbs, instance_route]}, callback);
                }
            } else if (action === "REPLACE"){
                this.setState({breadcrumbs: this.state.breadcrumbs.splice(last_index - 1, 1, {...instance_route})}, callback);
            } else {
                console.error("Breadcrumbs could not be updated. The route may have a problem.");
                if(callback){
                    callback();
                }
            }
        }
    }


    /*
        The component for a route is rendered with the given props:

        1. Query string props.
        2. State from history.location.state.
    */
    render_route(){
        let props = QueryString.parse(window.app_vars.app_history.location.search);
        props = {...props, ...window.app_vars.app_history.location.state}
        return this.state.current_route.action(props);
    }

    render(){
        return (
            <IndexLayout>
                {this.render_route()}
            </IndexLayout>
        );
    }
}

export default AppRouter