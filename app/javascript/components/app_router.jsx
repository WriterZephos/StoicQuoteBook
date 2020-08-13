import React from 'react'
import { createBrowserHistory } from 'history'
import { CSSTransition } from "react-transition-group";
import { RouterContext } from './app_contexts';
import RouteList from '../models/route_list'
import SiteMap from '../models/site_map'
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
        this.site_map = new SiteMap(this.route_list);

        let default_route = this.route_list.getDefaultRoute();

        this.state = {
            current_route: default_route,
            breadcrumbs:[default_route],
            display: true
        };
        
        this.state.current_route = this.prepareCurrentRoute(this.app_history.location);

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
            let route = this.prepareCurrentRoute(location)
            this.site_map.updateCurrentBranch(route);
            this.setState({current_route: route, display: true});
            console.log(this.site_map.getBreadCrumbs().join(", "));
        });
    }

    prepareCurrentRoute(location){
        let route = this.route_list.getMatchingOrDefaultRoute(location.pathname);
        // Add the current location to the current route, to preserve any custom options, etc.
        route.location = {...location}
        return route;
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