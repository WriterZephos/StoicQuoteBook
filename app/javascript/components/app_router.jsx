import React from 'react'
import QueryString from 'query-string'
import { createBrowserHistory } from 'history'
import { CSSTransition } from "react-transition-group";
import { RouterContext } from './app_contexts';
import RouteList from '../models/route_list'
import IndexLayout from './layouts/index_layout'
import NotificationView from './common/notification_view'
import LoadingView from './common/loading_view'
import Data from './common/data'


class AppRouter extends React.Component{

    constructor(props){
        super(props);
        this.app_history = createBrowserHistory();
        this.history_unlisten = this.app_history.listen(this.routingListener.bind(this));
        this.route_list = new RouteList();

        let default_route = this.route_list.getDefaultRoute();

        this.state = {
            current_route: default_route,
            breadcrumbs:[default_route],
            display: true
        };
        
        this.state.current_route = this.route_list.getMatchingOrDefaultRoute(this.app_history.location.pathname);

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
            let route = this.route_list.getMatchingOrDefaultRoute(location.pathname);
            // Add the current location to the current route, to preserve any custom options, etc.
            route.location = {...location}

            // Update breadcrumbs, then update the current route.
            this.updateBreadcrumbs(route, action, () => {
                // Log breadcrumbs to console.
                let bc_array = this.breadcrumbs();
                console.log(bc_array.join(", "));
                // Update current route.
                this.setState({current_route: route, display: true});
            });
        });
    }

    /*
        Updates the router's breadcrumbs.
    */
    updateBreadcrumbs(route, action, callback){

        // Get the last route indexs already in the breadcrumbs.
        let last_index = this.state.breadcrumbs.length - 1;
        let routing_options = route.routeOptions();

        // Reset the breadcrumbs for main pages (Home, Home > Quotes, etc) where routing options specify to do so.
        // breadcrumb_index === 0 for root breadcrumb.
        // breadcrumb_index === 1 for immediate childgren of the default_route.
        if(routing_options && !isNaN(routing_options.breadcrumb_index)){
            if(routing_options.breadcrumb_index === 0){
                this.setState({breadcrumbs: [route]}, callback);
            } else if (routing_options.breadcrumb_index === 1){
                this.setState({breadcrumbs: [this.route_list.getDefaultRoute(), route]}, callback);
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
                this.setState({breadcrumbs: [...this.state.breadcrumbs, route]}, callback);
            } 
            // POP happens on forward and backward browser navigation, 
            // so we need to see if the current location path (the one getting popped)
            // is the one we are already on, and handle accordingly.
            else if (action === "POP"){
                // If the new route is the previous route, it is a back button navigation.
                if(route.path === this.state.breadcrumbs[last_index - 1].path){
                    // Remove last route from breadcrumbs.
                    this.setState({breadcrumbs: this.state.breadcrumbs.slice(0,last_index)}, callback);
                }
                // Otherwise, it is a forward button navigation.
                else {
                    // Append new route to breadcrumbs.
                    this.setState({breadcrumbs: [...this.state.breadcrumbs, route]}, callback);
                }
            } 
            // POP replaces the current route, so we merely swap out the last breadcrumb.
            else if (action === "REPLACE"){
                // Swap current route with new route.
                this.setState({breadcrumbs: this.state.breadcrumbs.splice(last_index, 1, route)}, callback);
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
            let routing_options = route.routeOptions();

            // If a breadcrumb name is configured, use that. Otherwise, use the path.
            if(routing_options && routing_options.breadcrumb_name){
                return routing_options.breadcrumb_name;
            } else {
                return route.path;
            }
        });

        return bc_array;
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
                            <Data>
                                <CSSTransition classNames="app" timeout={300} in={this.state.display} appear> 
                                    {this.state.current_route.render()}
                                </CSSTransition>
                            </Data>
                        </LoadingView>
                    </NotificationView>
                </IndexLayout>
            </RouterContext.Provider>
            
        );
    }
}

export default AppRouter