import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/*
    There are three ways to render the PublicationForm.

    1. Blank, for creating a new Publication: <PublicationForm/>
    2. With a publication, by passing it in, for editing that publication: <PublicationForm person={publication}/>
    3. With a publication, by passing in an id (the publication will be retrieved), for editing that publication: <PublicationForm id={publication_id}>

    If a publication and an id are passed in, no request will be made to get the publication.
*/
class PublicationForm extends React.Component {

    constructor(props){
        super(props);

        this.state = { 
            publication: props.publication ? props.publication : this.getBlankPublication(),
            publication_id: props.id,
            translations: [],
            people: [],
            translations_loaded: false,
            people_loaded: false,
            warnings: {},
            status: (props.publication && !props.publication) ? "ready" : "loading"
        };

        this.csrf_token = this.props.csrf_token;

        this.changeValue = this.changeValue.bind(this);
        this.save = this.save.bind(this);
        this.addCitationField = this.addCitationField.bind(this);
        this.addTranslationField = this.addTranslationField.bind(this);
        this.removeCitationField = this.removeCitationField.bind(this);
        this.removeTranslationField = this.removeTranslationField.bind(this);
        this.changeCitationValue = this.changeCitationValue.bind(this);
        this.changeTranslationValue = this.changeTranslationValue.bind(this);
    }

    componentDidMount = () => {
        this.getData();
    };

    // IO Functions
    getData(){

        $.ajax({
            type: "get",
            url: '/app/people', 
            data: {},
            headers: {
                'Content-Type': 'application/json'
            },
            success:(data)=>{
                this.setState({people: data, people_loaded: true});
            }
        });

        if(this.state.publication_id && !this.state.publication){
            $.ajax({
                type: "get",
                url: `/app/publications/${this.state.publication_id}`,
                data: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                success:(data)=>{
                    this.setState({publication: data, status: "ready"});
                }
            });
        }
    }

    // Helper Functions
    getBlankPublication(){
        return {
            title: "", 
            description: "", 
            person_id: "",
            is_translated: false,
            wikipedia_link: "",
            citation_fields: [],
            translations_attributes: []
        }
    }

    isIsTranslatedDisabled(){
        let temp = this.state.publication.translations_attributes.find((t) => { return t.id !== null })
        if(temp){
            return true;
        }
        return false;
    }

    getWarning(input_id){
        if(this.state.warnings[input_id]){
            return this.state.warnings[input_id];
        }
        return "";
    }

    isTranslated(){
        return this.state.publication.is_translated === true || this.state.publication.is_translated === "true";
    }

    validateData(){
        let valid = true;
        let warnings = {};

        if(!this.state.publication.title || this.state.publication.title === ""){
            warnings["title"] = "Please add a title."
            valid = false;
        }

        if(!this.state.publication.person_id || this.state.publication.person_id === "" || isNaN(parseInt(this.state.publication.person_id))){
            warnings["person_id"] = "Please select the author."
            valid = false;
        }

        if(!this.state.publication.description || this.state.publication.description === ""){
            warnings["description"] = "Please add a short description."
            valid = false;
        }

        if(!this.state.publication.wikipedia_link || this.state.publication.wikipedia_link === ""){
            warnings["wikipedia_link"] = "Please add a short description."
            valid = false;
        }

        if(this.state.publication.is_translated !== "true" && this.state.publication.is_translated !== "false" && this.state.publication.is_translated !== true && this.state.publication.is_translated !== false){
            warnings["is_translated"] = "Please specify if this is a translated work."
            valid = false;
        } else {
            if(this.isTranslated()){
                this.state.publication.translations_attributes.forEach((translation, index) => {
                    if(!translation.translator || translation.translator == ""){
                        warnings[index + "|translator"] = "Please specify a translator."
                        valid = false;
                    }

                    if(!translation.description || translation.description == ""){
                        warnings[index + "|description"] = "Please add a short description."
                        valid = false;
                    }
                });
            }
        }

        this.state.publication.citation_fields.forEach((citation_field, index) => {
            if(!citation_field || citation_field === ""){
                warnings[index + "|citation_field"] = "Please specify a name for the citation field."
                valid = false;
            }
        });

        this.setState({warnings: warnings});
        return valid;

    }

    //Event Handlers
    addCitationField(event){
        let temp = [...this.state.publication.citation_fields];
        temp.push("");
        this.setState({publication: {...this.state.publication, citation_fields: temp}});
        if(event){
            event.preventDefault();
        }
    }

    addTranslationField(event){
        let temp = [...this.state.publication.translations_attributes];
        temp.push({id: null, translator: "", description: ""});
        this.setState({publication: {...this.state.publication, translations_attributes: temp}});
        if(event){
            event.preventDefault();
        }
    }

    removeCitationField(event){
        event.preventDefault();
        let tokens = event.currentTarget.id.split("|");
        let temp = [...this.state.publication.citation_fields];

        if(temp[tokens[0]].id){
            temp[tokens[0]]._destroy = true;
        } else {
            temp.splice(tokens[0],1);
        }
        this.setState({publication: {...this.state.publication, citation_fields: temp}});
    }

    removeTranslationField(event){
        event.preventDefault();
        let tokens = event.currentTarget.id.split("|");
        let temp = [...this.state.publication.translations_attributes];
        
        if(temp[tokens[0]].id){
            temp[tokens[0]]._destroy = true;
        } else {
            temp.splice(tokens[0],1);
        }
        this.setState({publication: {...this.state.publication, translations_attributes: temp}});
    }

    changeValue(event){
        let temp = {...this.state.publication}
        temp[event.target.id] = event.target.value;

        // ensure there is at least one translation if is_translated is true.
        let callback;
        if(temp.is_translated ==="true" && temp.translations_attributes.length === 0){
            callback = this.addTranslationField;
        }
        
        this.setState({publication: temp},callback);
    }

    changeCitationValue(event){
        let tokens = event.target.id.split("|");
        let temp = [...this.state.publication.citation_fields];
        temp[tokens[0]] = event.target.value;
        this.setState({publication: {...this.state.publication, citation_fields: temp}});
    }

    changeTranslationValue(event){
        let tokens = event.target.id.split("|");
        let temp = [...this.state.publication.translations_attributes];
        temp[tokens[0]][tokens[1]] = event.target.value;
        this.setState({publication: {...this.state.publication, translations_attributes: temp}});
    }

    save(event){
        event.preventDefault();
        if(this.validateData()){
            if(this.state.publication.id){
                $.ajax({
                    type: "patch",
                    url: `/app/publications/${this.state.publication.id}`,
                    data: JSON.stringify({publication: this.state.publication}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': window.app_vars.csrf_token
                    },
                    success:(data)=>{
                            this.setState({publication: data});
                    }
                });
            } else {
                $.ajax({
                    type: "post",
                    url: '/app/publications',
                    data: JSON.stringify({publication: this.state.publication}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': window.app_vars.csrf_token
                    },
                    success:(data)=>{
                            this.setState({publication: data});
                    }
                });
            }
        }
    }

    // Render Functions
    getPeopleOptions(){
        let options = this.state.people.map((person) => {
            return (
                <option key={person.id} value={person.id}>{person.name}</option>
            )
        });
        return options;
    }

    getCitationFields(){
        let citation_fields = this.state.publication.citation_fields.map((field, index) => {
            if(field._destroy){
                return null;
            }
            return (
                <div className="row" key={index}>
                    <div className="col-sm-12 form-group">
                        <label htmlFor={index + "|citation_field"}>Field Name</label>
                        <input id={index + "|citation_field"} className="form-control" type="text" value={field} onChange={this.changeCitationValue}/>
                        <span style={{color: "red"}}>{this.getWarning(index + "|citation_field")}</span>
                    </div>
                    <div className="form-group" style={{ paddingTop: "40px", marginRight: "-50px", width: "50px" }}>
                        <a href="" id={index + "|remove"} style={{ color: "red" }} onClick={this.removeCitationField}>
                            <FontAwesomeIcon icon="minus-circle"/>
                        </a>
                    </div>
                </div>
            );
        });
        return citation_fields;
    }

    getTranslationFields(){

        let translation_fields = this.state.publication.translations_attributes.map((translation, index) => {
            if(translation._destroy){
                return null;
            }
            return (
                <div className="row" key={index}>
                    <div className="col-sm-12 col-md-6 form-group">
                        <label htmlFor={index + "|translator"}>Translator Name</label>
                        <input disabled={translation.id} value={translation.translator} id={index + "|translator"} className="form-control" type="text" value={translation.translator} onChange={this.changeTranslationValue}/>
                        <span style={{color: "red"}}>{this.getWarning(index + "|translator")}</span>
                    </div>
                    <div className="col-sm-12 col-md-6 form-group">
                        <label htmlFor={index + "|description"}>Description</label>
                        <input disabled={translation.id} value={translation.description} id={index + "|description"} className="form-control" type="text" value={translation.description} onChange={this.changeTranslationValue}/>
                        <span style={{color: "red"}}>{this.getWarning(index + "|description")}</span>
                    </div>
                    {index > 0 && !translation.id && <div className="form-group" style={{ paddingTop: "40px", marginRight: "-50px", width: "50px" }}>
                        <a href="" id={index + "|remove"} style={{ color: "red" }} onClick={this.removeTranslationField}>
                            <FontAwesomeIcon icon="minus-circle"/>
                        </a>
                    </div>}
                </div>
            );
        });
        return translation_fields;
    }

    render(){
        return (
            <div>
                <form>
                    <div>
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <h2>
                                    {(this.state.publication && this.state.publication.id) ? `Editing ${this.state.publication.title}` : "New Publication"}
                                </h2>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-sm-12 col-md-6 form-group">
                                <label htmlFor="name">Title</label>
                                <input id="title" className="form-control" type="text" value={this.state.publication.title} onChange={this.changeValue}/>
                                <span style={{color: "red"}}>{this.getWarning("title")}</span>
                            </div>
                            <div className="col-sm-12 col-md-6 form-group">
                                <label htmlFor="person_id">By</label>
                                <select id="person_id" className="form-control" value={this.state.publication.person_id} onChange={this.changeValue}>
                                    <option value="">- Select -</option>
                                    {this.getPeopleOptions()}
                                </select>
                                <span style={{color: "red"}}>{this.getWarning("person_id")}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" className="form-control" value={this.state.publication.description} onChange={this.changeValue}></textarea>
                                <span style={{color: "red"}}>{this.getWarning("description")}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-6 form-group">
                                <label htmlFor="is_translated">Is this a translated work?</label>
                                <select id="is_translated" className="form-control" value={this.state.publication.is_translated} onChange={this.changeValue} disabled={this.isIsTranslatedDisabled()}>
                                    <option value={false}>No</option>
                                    <option value={true}>Yes</option>
                                </select>
                                <span style={{color: "red"}}>{this.getWarning("is_translated")}</span>
                            </div>
                            <div className="col-sm-12 col-md-6 form-group">
                                <label htmlFor="wikipedia_link">Wikipedia Link</label>
                                <input id="wikipedia_link" className="form-control" value={this.state.publication.wikipedia_link} onChange={this.changeValue}></input>
                                <span style={{color: "red"}}>{this.getWarning("wikipedia_link")}</span>
                            </div>
                        </div>
                        {this.isTranslated() && <br/>}
                        {this.isTranslated() && <h5>Translations{'\u00A0'}<a href="" onClick={this.addTranslationField}><FontAwesomeIcon icon="plus-circle"/></a></h5>}
                        {this.isTranslated() && this.getTranslationFields()}
                        <br/>
                        <h5>Citation Fields{'\u00A0'}<a href="" onClick={this.addCitationField}><FontAwesomeIcon icon="plus-circle"/></a></h5>
                        {this.getCitationFields()}
                        <br/>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Save" onClick={this.save}/>
                </form>
            </div>
        );
    };
}

export default PublicationForm