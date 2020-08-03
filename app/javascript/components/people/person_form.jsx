import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RouterContext, AppContext } from '../app_contexts';
import AppLink from '../common/app_link'
import NotificationView from '../common/notification_view'
import LoadingView from '../common/loading_view'

/*
    There are three ways to render the PersonForm.

    1. Blank, for creating a new Person: <PersonForm/>
    2. With a person, by passing it in, for editing that person: <PersonForm person={person}/>
    3. With a person, by passing in an id (the person will be retrieved), for editing that person: <PersonForm id={person}>

    If a person and an id are passed in, no request will be made to get the person.
*/
class PersonFormMain extends React.Component {

    constructor(props){
        super(props);
        this.router = props.router;
        this.app = props.app;
        this.state = {
            person: props.person ? JSON.parse(JSON.stringify(props.person)) : this.getBlankPerson(),
            original_person: props.person ? JSON.parse(JSON.stringify(props.person)) : this.getBlankPerson(),
            person_id: props.id,
            warnings: {},
            status: (props.person || (!props.person && !props.id)) ? "ready" : "loading",
            notifications: [],
            notification_options: {}
        }
        this.changeValue = this.changeValue.bind(this);
        this.delete = this.delete.bind(this);
        this.cancel = this.cancel.bind(this);
        this.reset = this.reset.bind(this);
        this.empty = this.empty.bind(this);
        this.clear_notifications = this.clear_notifications.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        if(this.state.person_id && !this.state.person.id){
            $.ajax({
                type: "get",
                url: `/app/people/${this.state.person_id}`,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrf_token
                },
                success: (data) => {
                    this.setState({
                        person: JSON.parse(JSON.stringify(data.person)), 
                        original_person: JSON.parse(JSON.stringify(data.person)), 
                        status: "ready"});
                },
                error: (data) => {
                    let notifications = [{message: `An error ocurred. The requested person could not be loaded!`, type: "error"}];
                    if(data.errors){
                        data.errors.forEach((error) => {
                            notifications.push({message: error, type: "error"});
                        });
                    }
                    let notification_options = [{verb: "Back", callback: this.cancel}]
                    this.setState({
                        notifications: notifications, 
                        notification_options: notification_options});
                }
            });
        }
    }

    getBlankPerson(){
        return {name: "", description: "", wikipedia_link: "", approved: false};
    }
 
    getWarning(input_id){
        if(this.state.warnings[input_id]){
            return this.state.warnings[input_id];
        }
        return "";
    }

    validateData(){
        let valid = true;
        let warnings = {};

        if(!this.state.person.name || this.state.person.name === ""){
            warnings["name"] = "Please add a name."
            valid = false;
        }

        if(!this.state.person.wikipedia_link || this.state.person.wikipedia_link === ""){
            warnings["wikipedia_link"] = "Please add a wikipedia link."
            valid = false;
        }

        if(!this.state.person.description || this.state.person.description === ""){
            warnings["description"] = "Please add a short description."
            valid = false;
        }

        this.setState({warnings: warnings});
        return valid;
    }

    changeValue(event){
        let temp = {...this.state.person}
        temp[event.target.id] = event.target.value;
        this.setState({person: temp});
    }

    reset(event){
        event.preventDefault();
        this.setState({person: JSON.parse(JSON.stringify(this.state.original_person)), notification_options: [], notifications: []});
    }

    cancel(event){
        this.router.go_back();
    }

    empty(event){
        event.preventDefault();
        this.setState({person: this.getBlankPerson(), notification_options: [], notifications: []});
    }

    delete(){
        event.preventDefault();
        if(this.state.person.id){
            $.ajax({
                type: "delete",
                url: `/app/people/${this.state.person.id}`, 
                data: JSON.stringify({person: this.state.person}),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.app.csrf_token
                },
                success:(data)=>{
                    // TODO fix this IO function to use notifications, etc.
                    this.router.route('/people');
                }
            });
        }
    }

    save(){
        if(this.validateData()){
            if(this.state.person.id){
                $.ajax({
                    type: "patch",
                    url: `/app/people/${this.state.person.id}`, 
                    data: JSON.stringify({person: this.state.person}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': this.app.csrf_token
                    },
                    success:(data)=>{
                        let notifications = [
                            {message: `${this.state.person.name} was successfully updated!`, type: "success"}
                        ]
                        let notification_options = [{verb: "Return", callback: this.cancel}]
                        this.setState({
                            person: JSON.parse(JSON.stringify(data.person)), 
                            original_person: JSON.parse(JSON.stringify(data.person)), 
                            notifications: notifications, 
                            notification_options: notification_options});
                    },
                    error: (data) => {
                        let notifications = [{message: `An error ocurred. ${this.state.person.name} could not be updated!`, type: "error"}];
                        if(data.responseJSON.errors){
                            data.responseJSON.errors.forEach((error) => {
                                notifications.push({message: error, type: "error"});
                            });
                        }
                        let notification_options = [{verb: "Cancel", callback: this.cancel},{verb: "Return", callback: this.clear_notifications}]
                        this.setState({
                            notifications: notifications, 
                            notification_options: notification_options});
                    }
                });
            } else {
                $.ajax({
                    type: "post",
                    url: '/app/people', 
                    data: JSON.stringify({person: this.state.person}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': this.app.csrf_token
                    },
                    success:(data)=>{
                        let notifications = [{message: `${this.state.person.name} was successfully saved!`, type: "success"}]
                        let notification_options = [{verb: "Save Another", callback: this.empty},{verb: "Return", callback: this.cancel}]
                        this.setState({
                            person: JSON.parse(JSON.stringify(data.person)), 
                            original_person: JSON.parse(JSON.stringify(data.person)), 
                            notifications: notifications,
                            notification_options: notification_options});
                    },
                    error: (data) => {
                        let notifications = [{message: `An error ocurred. ${this.state.person.name} could not be saved!`, type: "error"}];
                        if(data.responseJSON.errors){
                            data.responseJSON.errors.forEach((error) => {
                                notifications.push({message: error, type: "error"});
                            });
                        }
                        let notification_options = [{verb: "Cancel", callback: this.cancel},{verb: "Return", callback: this.clear_notifications}]
                        this.setState({
                            notifications: notifications, 
                            notification_options: notification_options});
                    }
                });
            }
        }
    }

    clear_notifications(){
        this.setState({notifications: [], notification_options: {}});
    }

    render(){
        return (
            <NotificationView notifications={this.state.notifications} notification_options={this.state.notification_options}>
                <LoadingView loading={this.state.status === "loading" && this.state.notifications.length === 0}>
                    <form>
                        <div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <h2>
                                        {(this.state.original_person && this.state.original_person.id) ? `Editing ${this.state.original_person.name}` : "New Person"}
                                        {this.state.original_person.id && <AppLink path="" onClick={this.delete} style={{float: "right", color: "red"}}>
                                            <FontAwesomeIcon icon="trash"/>
                                        </AppLink>}
                                        <span style={{float: "right"}}>{'\u00A0'}</span>
                                        <AppLink path="" onClick={this.cancel} style={{float: "right"}}>
                                            <FontAwesomeIcon icon="ban"/>
                                        </AppLink>
                                        <span style={{float: "right"}}>{'\u00A0'}</span>
                                        <AppLink path="" onClick={this.reset} style={{float: "right"}}>
                                            <FontAwesomeIcon icon="undo"/>
                                        </AppLink>
                                    </h2>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-sm-12 col-md-6 form-group">
                                    <label htmlFor="name">Full Name (including title)</label>
                                    <input 
                                        id="name" 
                                        className="form-control" 
                                        type="text"
                                        value={this.state.person.name}
                                        onChange={this.changeValue}/>
                                    <span style={{color: "red"}}>{this.getWarning("name")}</span>
                                </div>
                                <div className="col-sm-12 col-md-6 form-group">
                                    <label htmlFor="name">Wikipedia Link</label>
                                    <input
                                        id="wikipedia_link" 
                                        className="form-control" 
                                        type="text"
                                        value={this.state.person.wikipedia_link} 
                                        onChange={this.changeValue}/>
                                    <span style={{color: "red"}}>{this.getWarning("wikipedia_link")}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 form-group">
                                    <label htmlFor="description">Short Description</label>
                                    <textarea
                                        maxLength="400"
                                        id="description"
                                        className="form-control" 
                                        value={this.state.person.description} 
                                        onChange={this.changeValue}></textarea>
                                    <span style={{color: "red"}}>{this.getWarning("description")}</span>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <input type="button" className="btn btn-primary" value="Save" onClick={() => {this.save()}}/>
                    </form>
                </LoadingView>
            </NotificationView>
        );
    }
}

function PersonForm(props) {
    var app = useContext(AppContext);
    var router = useContext(RouterContext);
    return(<PersonFormMain {...props} app={app} router={router}/>)
}

export default PersonForm