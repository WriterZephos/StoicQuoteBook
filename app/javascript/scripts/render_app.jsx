import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/app'
import { createBrowserHistory } from 'history'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle, faMinusCircle, faEdit, faBan, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons'

document.addEventListener('DOMContentLoaded', () => {

    library.add(faPlusCircle, faMinusCircle, faEdit, faBan, faTrash, faUndo);

    window.app_vars = {
        app_history: createBrowserHistory(),
        csrf_token: document.getElementsByName('csrf-token')[0].content,
    };
    
    window.app_func = {};

    window.app_func.route_from_link = (event,state) => {
        event.preventDefault();
        window.app_vars.app_history.push(
            {
                pathname: event.currentTarget.pathname, 
                search: event.currentTarget.search,
                state: state
            }
        );
    };

    window.app_func.route = (path,search,state) => {
        event.preventDefault();
        window.app_vars.app_history.push(
            {
                pathname: path, 
                search: search,
                state: state
            }
        );
    };

    ReactDOM.render(
        <App/>,
        document.body.appendChild(document.createElement('div')),
    );

});
