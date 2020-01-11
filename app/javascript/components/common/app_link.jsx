import React from 'react'

class AppLink extends React.Component {

    constructor(props){
        super(props);
        this.state = props.state;
    }

    navigate(event){
        if(this.props.onClick){
            this.props.onClick(event,this.state);
        } else {
            window.app_func.route_from_link(event, this.state);
        }
    }

    render(){
        return (
            <a href={this.props.path} className={this.props.className} style={this.props.style}onClick={this.navigate.bind(this)}>{this.props.text}{this.props.children}{this.props.after_text}</a>
        )
    }

}

export default AppLink