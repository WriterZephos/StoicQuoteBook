import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NotificationContext } from '../app_contexts';

/*
    This class accepts a list of notifications with settings to determine how
    they are displayed and options for the user (confirm, cancel, etc) with callbacks.

    Notifications have the following settings: 

    type: what type of value.
        Valid options are: 
            info = just plain text.
            error = red text.
            process = blue text with a loading icon.
    
    User options have the following attributes: 
    
        verb: the text that will appear on the button.
        callback: the callback function that will be called when the button is pressed.

*/
class NotificationView extends React.Component{
    constructor(props){
        super(props);
        this.state = {notifications: [], notification_options: []}
        this.setNotifications = this.setNotifications.bind(this);
        this.resetNotifications = this.resetNotifications.bind(this);
    }

    setNotifications(notifications, notification_options){
        this.setState({
            notifications: notifications, 
            notification_options: notification_options});
    }

   resetNotifications(){
        this.setState({notifications: [], notification_options: {}});
    }

    renderNotifications(){
        return this.state.notifications.map((notification, index) => {
            switch(notification.type){
                case "success":
                    return this.renderSuccess(notification, index);
                case "process": 
                    return this.renderProcess(notification, index);
                case "error":
                    return this.renderError(notification, index);
                default: 
                    return this.renderInfo(notification, index);
            }
        });
    }

    renderInfo(notification, index){
        return (
            <p key={index} style={{textAlign: "center"}}><FontAwesomeIcon icon="info-circle"/>{'\u00A0'}{notification.message}{notification.html}</p>
        );
    }

    renderSuccess(notification, index){
        return (
            <p key={index} style={{color: "green", textAlign: "center"}}><FontAwesomeIcon icon="check-circle"/>{'\u00A0'}{notification.message}{notification.html}</p>
        );
    }

    renderError(notification, index){
        return (
            <p key={index} style={{color: "red", textAlign: "center"}}><FontAwesomeIcon icon="exclamation-circle"/>{'\u00A0'}{notification.message}{notification.html}</p>
        );
    }

    renderProcess(notification, index){
        return (
            <p key={index} style={{color: "blue", textAlign: "center"}}>
                <FontAwesomeIcon icon="spinner" spin />{'\u00A0'}{notification.message}{notification.html}
            </p>
        );
    }

    render_options(){
        return this.state.notification_options.map((option, index) => {
            return (
                <p key={index} style={{textAlign: "center"}}>
                    <input type="button" className="btn btn-primary" value={option.verb} onClick={option.callback}/>
                </p>
            );
        });
    }

    render(){
        if(this.state.notifications.length > 0){
            return(
                <div>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 mx-auto">
                            {this.renderNotifications()}
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
                <NotificationContext.Provider 
                value={{
                    setNotifications: this.setNotifications,
                    resetNotifications: this.resetNotifications
                }}>
                    {this.props.children}
                </NotificationContext.Provider>
            )
        }

    }
}

export default NotificationView;