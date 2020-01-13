import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppLink from './app_link'

/*
    This class accepts a list of notifications and options for how to display them,
    as well as options determining the behavior for confirmations, etc.

    Notifications can be of the following types: 

    info: just plain text.
    error: red text.
    process: blue text with a loading icon.
    
    other options: 
    
    option_1: true/false
    option_1_verb: ""
    option_1_function:

    option_2: true/false
    option_2_verb: ""
    option_2_function:

    option_3: true/false
    option_3_verb: ""
    option_3_function:

    option_4: true/false
    option_4_verb: ""
    option_4_function:

*/
class NotificationView extends React.Component{
    constructor(props){
        super(props);
        this.render_notifications = this.render_notifications.bind(this);
    }

    render_notifications(){
        return this.props.notifications.map((notification, index) => {
            switch(notification.type){
                case "success":
                    return this.render_success(notification, index);
                case "process": 
                    return this.render_process(notification, index);
                case "error":
                    return this.render_error(notification, index);
                default: 
                    return this.render_info(notification, index);
            }
        });
    }

    render_info(notification, index){
        return (
            <p key={index} style={{textAlign: "center"}}><FontAwesomeIcon icon="info-circle"/>{'\u00A0'}{notification.message}{notification.html}</p>
        );
    }

    render_success(notification, index){
        return (
            <p key={index} style={{color: "green", textAlign: "center"}}><FontAwesomeIcon icon="check-circle"/>{'\u00A0'}{notification.message}{notification.html}</p>
        );
    }

    render_error(notification, index){
        return (
            <p key={index} style={{color: "red", textAlign: "center"}}><FontAwesomeIcon icon="exclamation-circle"/>{'\u00A0'}{notification.message}{notification.html}</p>
        );
    }

    render_process(notification, index){
        return (
            <p key={index} style={{color: "blue", textAlign: "center"}}>
                <FontAwesomeIcon icon="spinner" spin />{'\u00A0'}{notification.message}{notification.html}
            </p>
        );
    }

    render_options(){
        return this.props.notification_options.map((option, index) => {
            return (
                <p key={index} style={{textAlign: "center"}}>
                    <input type="button" className="btn btn-primary" value={option.verb} onClick={option.callback}/>
                </p>
            );
        });
    }

    render(){
        if(this.props.notifications.length > 0){
            return(
                <div>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 mx-auto">
                            {this.render_notifications()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 mx-auto">
                            {this.render_options()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return(
                this.props.children
            )
        }

    }
}

export default NotificationView;