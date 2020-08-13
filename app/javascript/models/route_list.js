import React from 'react'
import Route from './route'
import HomeIndex from '../components/home/home_index'
import PeopleIndex from '../components/people/people_index'
import PersonShow from '../components/people/person_show'
import PersonForm from '../components/people/person_form'
import QuotesIndex from '../components/quotes/quotes_index'
import QuoteShow from '../components/quotes/quote_show'
import QuoteForm from '../components/quotes/quote_form'
import PublicationsIndex from '../components/publications/publications_index'
import PublicationShow from '../components/publications/publication_show'
import PublicationForm from '../components/publications/publication_form'

const DEFAULT_ROUTE = new Route({
    path: '/',
    regex: /^\/$/,
    default_routing_options: {breadcrumb_index: 0, breadcrumb_name: "Home"},
    action: (props) => <HomeIndex {...props}/>
});

const ROUTES = [
    new Route({...DEFAULT_ROUTE}),
    new Route({
        path: '/quotes',
        regex: /^\/quotes$/g,
        default_routing_options: {breadcrumb_index: 1, breadcrumb_name: "Quotes"},
        action: (props) => <QuotesIndex {...props}/>
    }),
    new Route({
        path: '/quote',
        regex: /^\/quote$/g,
        default_routing_options: {breadcrumb_name: "Quote", parent: "/quote"},
        action: (props) => <QuoteShow {...props}/>
    }),
    new Route({
        path: '/quote_form',
        regex: /^\/quote_form$/g,
        default_routing_options: {breadcrumb_name: "Quote Form"},
        action: (props) => <QuoteForm {...props}/>
    }),
    new Route({
        path: '/people',
        regex: /^\/people$/g,
        default_routing_options: {breadcrumb_index: 1, breadcrumb_name: "People"},
        action: (props) => <PeopleIndex {...props}/>
    }),
    new Route({
        path: '/person',
        regex: /^\/person$/g,
        default_routing_options: {breadcrumb_name: "Person"},
        action: (props) => <PersonShow {...props}/>
    }),
    new Route({
        path: '/person_form',
        regex: /^\/person_form$/g,
        default_routing_options: {breadcrumb_name: "Person Form"},
        action: (props) => <PersonForm {...props}/>
    }),
    new Route({
        path: '/publications',
        regex: /^\/publications$/g,
        default_routing_options: {breadcrumb_index: 1, breadcrumb_name: "Publications"},
        action: (props) => <PublicationsIndex {...props}/>
    }),
    new Route({
        path: '/publication',
        regex: /^\/publication$/g,
        default_routing_options: {breadcrumb_name: "Publication"},
        action: (props) => <PublicationShow {...props}/>
    }),
    new Route({
        path: '/publication_form',
        regex: /^\/publication_form$/g,
        default_routing_options: {breadcrumb_name: "Publication Form"},
        action: (props) => <PublicationForm {...props}/>
    })
];

class RouteList{

    constructor(){
        // Use closure to make private fields
        let default_route = new Route({...DEFAULT_ROUTE});
        let routes = ROUTES.map(route => new Route({...route}));
        // Only provide copies
        this.getDefaultRoute = () => { return new Route({...default_route}); };
        this.getRoutes = () => { return routes.map(route => new Route({...route})); };
    }

    getMatchingOrDefaultRoute(path){
        let route = this.getRoutes().find((route) => { return route.matchPath(path);});
            
        // Use default route if no configuration was found.
        if(!route){
            route = this.getDefaultRoute();
        }
        return route;
    }
}

export default RouteList