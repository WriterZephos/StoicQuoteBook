import React from 'react'
import AppRouter from '../components/app_router'
import { AppContext } from './app_contexts';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        this.csrf_token = document.getElementsByName('csrf-token')[0].content;
    }

    render(){
        return (
            <AppContext.Provider 
                value={{csrf_token: this.csrf_token}}>
                <AppRouter/>
            </AppContext.Provider>
        );
    }
}

export default App