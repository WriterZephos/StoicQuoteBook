import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppLink from '../common/app_link'

/*
    There are three ways to render the PersonForm.

    1. Blank, for creating a new Person: <PersonForm/>
    2. With a person, by passing it in, for editing that person: <PersonForm person={person}/>
    3. With a person, by passing in an id (the person will be retrieved), for editing that person: <PersonForm id={person}>

    If a person and an id are passed in, no request will be made to get the person.
*/
class PersonForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            person: props.person ? JSON.parse(JSON.stringify(props.person)) : this.getBlankPerson(),
            original_person: props.person ? JSON.parse(JSON.stringify(props.person)) : this.getBlankPerson(),
            person_id: props.id,
            warnings: {},
            status: (props.person && !props.id) ? "ready" : "loading"
        }
        this.changeValue = this.changeValue.bind(this);
        this.delete = this.delete.bind(this);
        this.cancel = this.cancel.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        if(this.state.person_id && !this.state.person){
            $.ajax({
                type: "get",
                url: `/app/people/${this.state.person_id}`,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrf_token
                },
                success:(data)=>{
                    this.setState({person: JSON.parse(JSON.stringify(data)), original_person: JSON.parse(JSON.stringify(data)), status: "ready"});
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
        this.setState({person: JSON.parse(JSON.stringify(this.state.original_person))});
    }

    cancel(){
        event.preventDefault();
        window.app_vars.app_history.goBack();
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
                    'X-CSRF-Token': window.app_vars.csrf_token
                },
                success:(data)=>{
                    window.app_func.route('/people');
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
                        'X-CSRF-Token': window.app_vars.csrf_token
                    },
                    success:(data)=>{
                        this.setState({person: data});
                    }
                });
            } else {
                $.ajax({
                    type: "post",
                    url: '/app/people', 
                    data: JSON.stringify({person: this.state.person}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': window.app_vars.csrf_token
                    },
                    success:(data)=>{
                        this.setState({person: data});
                    }
                });
            }
        }
    }

    render(){
        return (
            <div>
                <form>
                    <div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <h2>
                                    {(this.state.person && this.state.person.id) ? `Editing ${this.state.person.name}` : "New Person"}
                                    {this.state.person.id && <AppLink path="" onClick={this.delete} style={{float: "right", color: "red"}}>
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
            </div>
        );
    }
}

export default PersonForm