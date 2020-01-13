import React from 'react'
import { render } from 'react-dom';
import AppRouter from './app_router'

class AppRepository extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            quotes: [],
            publications: [],
            people: []
        };
    }



    render(){
        return(
            <AppRouter repoository={this.state.repoository}/>
        );
    }

}