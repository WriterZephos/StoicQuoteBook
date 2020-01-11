import React from 'react'
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/*
    There are two ways to render the PersonShow.

    2. With a person, by passing it in, for editing that person: <PersonForm person={person}/>
    3. With a person, by passing in an id (the person will be retrieved), for editing that person: <PersonForm id={person}>

    If a person and an id are passed in, no request will be made to get the person.
*/
class PublicationShow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            publication: props.publication,
            publication_id: props.id,
            status: props.publication_id && !props.publication ? "loading" : "ready"
        }
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        if(this.state.publication_id && !this.state.publication){
            $.ajax({
                type: "get",
                url: `/app/publications/${this.state.person_id}`,
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

    isTranslated(){
        return this.state.publication.is_translated === true || this.state.publication.is_translated === "true";
    }

    getTranslationFields(){
        let translation_fields = this.state.publication.translations_attributes.map((translation, index) => {
            return (
                <tr key={index}>
                    <td>
                        {translation.translator}
                    </td>
                    <td>
                        {translation.description}
                    </td>
                </tr>
            );
        });

        let translations_fields_table = (
            <div className="row">
                <div className="col-sm-12 col-md-12 mx-auto">
                    <h5>Translations</h5>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Translator</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {translation_fields}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        return translations_fields_table;
    }

    getCitationFields(){
        let citation_fields = this.state.publication.citation_fields.map((field, index) => {
            return (
                <tr key={index}>
                    <td>
                        {field}
                    </td>
                </tr>
            );
        });

        let citation_table = (
            <div className="row">
                <div className="col-sm-12 col-md-12 mx-auto">
                    <h5>Citation Fields</h5>
                    <table className="table table-sm">
                        <tbody>
                            {citation_fields}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        return citation_table;
    }

    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h2>
                            {this.state.publication.title}{'\u00A0'}
                            <AppLink path={"/publication_form"} state={{publication: this.state.publication, routing_options: {breadcrumb_name: `Edit ${this.state.publication.title}`}}} style={{float: "right"}}>
                                <FontAwesomeIcon icon="edit"/>
                            </AppLink>
                        </h2>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h5>Author</h5>
                        <p>{this.state.publication.person.name}</p>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <p><a href={this.state.publication.wikipedia_link}>Wikipedia Link</a></p>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h5>Description</h5>
                        <p>{this.state.publication.description}</p>
                    </div>
                </div>
                {this.isTranslated() && <br/>}
                {this.isTranslated() && this.getTranslationFields()}
                <br/>
                {this.getCitationFields()}
            </div>
        );
    }
}

export default PublicationShow;