import React from 'react'

class AppLink extends React.Component {

    constructor(props){
        super(props);
        this.state = props.state;
    }

    navigate(event){
        window.app_vars.app_transition(event, this.state);
    }

    render(){
        return (
        <a href={this.props.path} className={this.props.className} style={this.props.style}onClick={this.navigate.bind(this)}>{this.props.text}{this.props.children}{this.props.after_text}</a>
        )
    }

}

export default AppLink