import React from 'react'
import QueryString from 'query-string'
import { createBrowserHistory } from 'history'
import { CSSTransition } from "react-transition-group";
import { RouterContext } from './app_contexts';
import HomeIndex from './home/home_index'
import IndexLayout from './layouts/index_layout'
import NotificationView from './common/notification_view'
import LoadingView from './common/loading_view'
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
        this.app_history = createBrowserHistory();
        this.history_unlisten = this.app_history.listen(this.routingListener.bind(this));

        this.default_route = {
            path: '/',
            regex: /^\/$/,
            default_routing_options: {breadcrumb_index: 0, breadcrumb_name: "Home"},
            action: (props) => <HomeIndex {...props}/>
        }

        this.state = {
            current_route: {...this.default_route}, 
            breadcrumbs:[{...this.default_route}],
            display: true
        };
        
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

        this.routeFromLink = this.routeFromLink.bind(this);
        this.route = this.route.bind(this);
        this.goBack = this.goBack.bind(this);
        this.go = this.go.bind(this);
        
    }

    routeFromLink(event,state){
        event.preventDefault();
        this.app_history.push(
            {
                pathname: event.currentTarget.pathname, 
                search: event.currentTarget.search,
                state: state
            }
        );
    };

    route(path,search,state){
        event.preventDefault();
        this.app_history.push(
            {
                pathname: path, 
                search: search,
                state: state
            }
        );
    };

    goBack(){
        event.preventDefault();
        this.app_history.goBack();
    }

    go(delta){
        event.preventDefault();
        this.app_history.go(delta);
    }

    /*
        This is the callback that gets called when a new location is pushed to history.
    */
    routingListener(location, action){
        // Set display to false.
        this.setState({display: false}, () => {
            // Find route configuration.
            let route = this.getMatchingRoute(location);
            
            // Use default route if no configuration was found.
            if(!route){
                route = {...this.default_route};
            }

            // Update breadcrumbs, then update the current route.
            this.updateBreadcrumbs(route, location, action, () => {
                // Log breadcrumbs to console.
                let bc_array = this.breadcrumbs();
                console.log(bc_array.join(", "));
                // Update current route.
                this.setState({current_route: {...route}, display: true});
            });
        });
    }

    /*
        Finds a matching route, if it exists, based on the route's regex.
    */
    getMatchingRoute(location){
        return this.routes.find((route) => {
            let matches = location.pathname.match(route.regex);
            return matches && matches.length > 0;
        });
    }

    /*
        Updates the router's breadcrumbs.
    */
    updateBreadcrumbs(route, location, action, callback){

        // Get the last route indexs already in the breadcrumbs.
        let last_index = this.state.breadcrumbs.length - 1;

        // Shallow copy route configuration.
        let instance_route = {...route}
        // Add the current location to the current route, to preserve any custom options, etc.
        instance_route.location = {...location}

        let routing_options = this.routingOptionsForRoute(instance_route);

        // Reset the breadcrumbs for main pages (Home, Home > Quotes, etc) where routing options specify to do so.
        // breadcrumb_index === 0 for root breadcrumb.
        // breadcrumb_index === 1 for immediate childgren of the default_route.
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
        } 
        // If breadcrumb_index is not set, the breadcrumbs will be determined relatively based on the action verb.
        else {
            // If action is PUSH, it's a new breadcrumb not appended to existing breadcrumbs.
            if(action === "PUSH"){
                this.setState({breadcrumbs: [...this.state.breadcrumbs, instance_route]}, callback);
            } 
            // POP happens on forward and backward browser navigation, 
            // so we need to see if the current location path (the one getting popped)
            // is the one we are already on, and handle accordingly.
            else if (action === "POP"){
                // If the new route is the previous route, it is a back button navigation.
                if(instance_route.path === this.state.breadcrumbs[last_index - 1].path){
                    // Remove last route from breadcrumbs.
                    this.setState({breadcrumbs: this.state.breadcrumbs.slice(0,last_index)}, callback);
                }
                // Otherwise, it is a forward button navigation.
                else {
                    // Append new route to breadcrumbs.
                    this.setState({breadcrumbs: [...this.state.breadcrumbs, instance_route]}, callback);
                }
            } 
            // POP replaces the current route, so we merely swap out the last breadcrumb.
            else if (action === "REPLACE"){
                // Swap current route with new route.
                this.setState({breadcrumbs: this.state.breadcrumbs.splice(last_index, 1, {...instance_route})}, callback);
            } else {
                console.error("Breadcrumbs could not be updated. The route may have a problem.");
                if(callback){
                    callback();
                }
            }
        }
    }

    breadcrumbs(){
        let bc_array = this.state.breadcrumbs.map((route) => {

            // Get routing options for the route.
            let routing_options = this.routingOptionsForRoute(route);

            // If a breadcrumb name is configured, use that. Otherwise, use the path.
            if(routing_options && routing_options.breadcrumb_name){
                return routing_options.breadcrumb_name;
            } else {
                return route.path;
            }
        });

        return bc_array;
    }

    routingOptionsForRoute(route){
        let routing_options;

        // Get routing options if there are any. 
        if(route.location && route.location.state && route.location.state.routing_options){
            // Routing options passed in state override any defaults, if they exist.
            if(route.default_routing_options){
                routing_options = {...route.default_routing_options, ...route.location.state.routing_options }
            } else {
                routing_options = location.state.routing_options;
            }
        } else {
            // Could be undefined.
            routing_options = route.default_routing_options;
        }
        return routing_options;
    }

    /*
        The component for a route is rendered with the given props:

        1. Query string props.
        2. State from history.location.state.
    */
    renderRoute(){
        let props = QueryString.parse(this.app_history.location.search);
        props = {...props, ...this.app_history.location.state}
        return this.state.current_route.action(props);
    }

    render(){
        return (
            <RouterContext.Provider 
                value={{
                    routeFromLink: this.routeFromLink, 
                    route: this.route,
                    goBack: this.goBack,
                    go: this.go
                }}>
                <IndexLayout>
                    <NotificationView>
                        <LoadingView>
                            <CSSTransition classNames="app" timeout={300} in={this.state.display} appear> 
                                {this.renderRoute()}
                            </CSSTransition>
                        </LoadingView>
                    </NotificationView>
                </IndexLayout>
            </RouterContext.Provider>
            
        );
    }
}

export default AppRouter