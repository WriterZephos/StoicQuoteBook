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

class App extends React.Component{

    constructor(props){
        super(props);
        
        this.default_route = {
            path: '/',
            regex: /^\/$/,
            action: (props) => <HomeIndex {...props}/>
        }

        this.state = {current_route: {...this.default_route}};
        
        this.routes = [
            {...this.default_route},
            {
                path: '/quotes',
                regex: /^\/quotes$/g,
                action: (props) => <QuotesIndex {...props}/>
            },
            {
                path: '/quote',
                regex: /^\/quote$/g,
                action: (props) => <QuoteShow {...props}/>
            },
            {
                path: '/quote_form',
                regex: /^\/quote_form$/g,
                action: (props) => <QuoteForm {...props}/>
            },
            {
                path: '/people',
                regex: /^\/people$/g,
                action: (props) => <PeopleIndex {...props}/>
            },
            {
                path: '/person',
                regex: /^\/person$/g,
                action: (props) => <PersonShow {...props}/>
            },
            {
                path: '/person_form',
                regex: /^\/person_form$/g,
                action: (props) => <PersonForm {...props}/>
            },
            {
                path: '/publications',
                regex: /^\/publications$/g,
                action: (props) => <PublicationsIndex {...props}/>
            },
            {
                path: '/publication',
                regex: /^\/publication$/g,
                action: (props) => <PublicationShow {...props}/>
            },
            {
                path: '/publication_form',
                regex: /^\/publication_form$/g,
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
        if(route){
            this.setState({current_route: {...route}});
        } else {
            this.setState({current_route: {...this.default_route}});
        }
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

export default App