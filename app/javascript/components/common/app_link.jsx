import React from 'react'
import { RouterContext } from '../app_contexts';

class AppLink extends React.Component {
    static contextType = RouterContext;

    constructor(props){
        super(props);
        this.state = props.state;
    }

    navigate(event){
        if(this.props.onClick){
            this.props.onClick(event,this.state);
        } else {
            this.context.routeFromLink(event, this.state);
        }
    }

    render(){
        return (
            <a href={this.props.path} className={this.props.className} style={this.props.style}onClick={this.navigate.bind(this)}>{this.props.text}{this.props.children}{this.props.after_text}</a>
        )
    }

}

export default AppLink