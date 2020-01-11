import React from 'react'
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/*
    There are two ways to render the PersonShow.

    2. With a person, by passing it in, for editing that person: <PersonForm person={person}/>
    3. With a person, by passing in an id (the person will be retrieved), for editing that person: <PersonForm id={person}>

    If a person and an id are passed in, no request will be made to get the person.
*/
class PersonShow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            person: props.person,
            person_id: props.id,
            status: props.person_id && !props.person ? "loading" : "ready"
        }
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
                    'Content-Type': 'application/json'
                },
                success:(data)=>{
                    this.setState({person: data, status: "ready"});
                }
            });
        }
    }

    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h2>
                            {this.state.person.name}{'\u00A0'}
                            <AppLink path={"/person_form"} state={{person: this.state.person, routing_options: {breadcrumb_name: `Edit ${this.state.person.name}`}}} style={{float: "right"}}>
                                <FontAwesomeIcon icon="edit"/>
                            </AppLink>
                        </h2>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <p><a href={this.state.person.wikipedia_link}>Wikipedia Link</a></p>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h5>Description</h5>
                        <p>{this.state.person.description}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default PersonShow;