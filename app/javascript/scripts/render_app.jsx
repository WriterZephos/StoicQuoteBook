import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/app'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle, faMinusCircle, faEdit, faBan, faTrash, faUndo, faSpinner, faInfoCircle, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

document.addEventListener('DOMContentLoaded', () => {

    library.add(faPlusCircle, faMinusCircle, faEdit, faBan, faTrash, faUndo, faSpinner, faInfoCircle, faCheckCircle, faExclamationCircle);

    ReactDOM.render(
        <App/>,
        document.body.appendChild(document.createElement('div')),
    );
});
