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
    default_routing_options: { 
        breadcrumb_name: (props) => { return "Home" } },
    view: HomeIndex
});

const ROUTES = [
    new Route({...DEFAULT_ROUTE}),
    new Route({
        path: '/quotes',
        regex: /^\/quotes$/g,
        default_routing_options: { 
            breadcrumb_name: (props) => { return "Quotes" },
            parent: "/"
        },
        view: QuotesIndex
    }),
    new Route({
        path: '/quote',
        regex: /^\/quote$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Quote" }, 
            parent: "/quotes"},
        view: QuoteShow
    }),
    new Route({
        path: '/quote_form',
        regex: /^\/quote_form$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Quote Form" }, 
            parent: "/quote"},
        view: QuoteForm
    }),
    new Route({
        path: '/people',
        regex: /^\/people$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "People" },
            parent: "/"
        },
        view: PeopleIndex
    }),
    new Route({
        path: '/person',
        regex: /^\/person$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Person" },
            parent: "/people"
        },
        view: PersonShow
    }),
    new Route({
        path: '/new_person',
        regex: /^\/new_person$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "New Person" },
            parent: "/people"
        },
        view: PersonForm
    }),
    new Route({
        path: '/edit_person',
        regex: /^\/edit_person$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Edit Person" },
            parent: "/person"
        },
        view: PersonForm
    }),
    new Route({
        path: '/publications',
        regex: /^\/publications$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Publications" },
            parent: "/"
        },
        view: PublicationsIndex
    }),
    new Route({
        path: '/publication',
        regex: /^\/publication$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Publication" },
            parent: "/publications"
        },
        view: PublicationShow
    }),
    new Route({
        path: '/publication_form',
        regex: /^\/publication_form$/g,
        default_routing_options: {
            breadcrumb_name: (props) => { return "Publication Form" },
            parent: "/publication"
        },
        view: PublicationForm
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