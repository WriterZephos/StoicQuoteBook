import React, { useContext } from 'react'
import { AppContext, RouterContext } from '../app_contexts';
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingView from '../common/loading_view'

/*
    There are two ways to render the PersonShow.

    2. With a person, by passing it in, for editing that person: <PersonForm person={person}/>
    3. With a person, by passing in an id (the person will be retrieved), for editing that person: <PersonForm id={person}>

    If a person and an id are passed in, no request will be made to get the person.
*/
class PersonShowMain extends React.Component {

    constructor(props){
        super(props);
        this.router = props.router;
        this.state = {
            person: props.person ? props.person : this.getBlankPerson(),
            person_id: props.id,
            status: props.person ? "ready" : "loading"
        }
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    getBlankPerson(){
        return {name: "", description: "", wikipedia_link: "", approved: false};
    }

    getData(){
        if(this.state.person_id && !this.state.person.id){
            $.ajax({
                type: "get",
                url: `/app/people/${this.state.person_id}`,
                data: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                success:(data)=>{
                    this.setState({person: data.person, status: "ready"});
                }
            });
        }
    }

    cancel(){
        this.router.goBack();
    }

    render(){
        return (
            <LoadingView loading={this.state.status === "loading"}>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h2>
                            {this.state.person.name}{'\u00A0'}
                            <AppLink path={"/edit_person"} state={{person: this.state.person }} style={{float: "right"}}>
                                <FontAwesomeIcon icon="edit"/>
                            </AppLink>
                            <span style={{float: "right"}}>{'\u00A0'}</span>
                            <AppLink path="" onClick={this.cancel} style={{float: "right"}}>
                                <FontAwesomeIcon icon="arrow-left"/>
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
            </LoadingView>
        );
    }
}

function PersonShow(props) {
    var app = useContext(AppContext);
    var router = useContext(RouterContext);
    return(<PersonShowMain {...props} app={app} router={router}/>)
}

export default PersonShow;