import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppLink from '../common/app_link'

/*
    There are three ways to render the QuoteForm.

    1. Blank, for creating a new Quote: <QuoteForm/>
    2. With a quote, by passing it in, for editing that quote: <QuoteForm quote={quote}/>
    3. With a quote, by passing in an id (the quote will be retrieved), for editing that quote: <QuoteForm id={quote_id}>

    If a quote and an id are passed in, no request will be made to get the quote.
*/
class QuoteForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            quote: props.quote ? JSON.parse(JSON.stringify(props.quote)) : this.getBlankQuote(),
            original_quote: props.quote ? JSON.parse(JSON.stringify(props.quote)) : this.getBlankQuote(),
            quote_id: props.id,
            publications: [],
            people: [],
            warnings: {},
            status: (props.quote || (!props.quote && !props.id)) ? "ready" : "loading"
        };

        if(props.quote){
            this.original_quote = {...props.quote};
        }

        this.changeValue = this.changeValue.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.cancel = this.cancel.bind(this);
        this.reset = this.reset.bind(this);
        this.changeCitationValue = this.changeCitationValue.bind(this);
        this.changeQuoteTextValue = this.changeQuoteTextValue.bind(this);
        this.getPublications = this.getPublications.bind(this);
        this.addQuoteText = this.addQuoteText.bind(this);
        this.removeQuoteTextField = this.removeQuoteTextField.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    // Helper Functions
    getBlankQuote(){
        return {
            id: null,
            key_words: "",
            citation: {},
            publication_id: "",
            person_id: "",
            quote_texts_attributes: [
                {
                    id: null,
                    text: "",
                    translation_id: "" 
                }
            ],
            approved: false
        }
    }

    getPublication(){
        let publication = this.state.publications.find((p) => { return p.id === parseInt(this.state.quote.publication_id); })
        return publication;
    }

    getPerson(){
        let person = this.state.people.find((p) => { return p.id === parseInt(this.state.quote.person_id); })
        return person;
    }

    canHaveMultipleQuoteTexts(){
        let temp = false;
        if(this.getPerson()){
            let pub = this.getPublication();
            if(pub && pub.is_translated && this.state.quote.quote_texts_attributes.length < pub.translations_attributes.length){
                temp = true;
            }
        }
        return temp;
    }

    publicationRequired(){
        return this.getPerson() && this.state.publications.length > 0
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

        if(!this.state.quote.person_id || this.state.quote.person_id === "" || isNaN(parseInt(this.state.quote.person_id))){
            warnings["person_id"] = "Please select the attributed person."
            valid = false;
        }

        if(this.publicationRequired() || this.getPublication()){
            if(!this.state.quote.publication_id || this.state.quote.publication_id === "" || isNaN(parseInt(this.state.quote.publication_id))){
                warnings["publication_id"] = "Please select the attributed publication."
                valid = false;
            } else {
                if(this.citationsNeeded()){
                    this.getPublication().citation_fields.forEach((citation_field) => {
                        if(!this.state.quote.citation[citation_field] || this.state.quote.citation[citation_field] === ""){
                            warnings[citation_field] = "Please add the required citation."
                            valid = false;
                        }
                    });
                }
            }
        }

        if(!this.state.quote.key_words || this.state.quote.key_words === ""){
            warnings["key_words"] = "Please add at least one key word (topic or theme of the quote)."
            valid = false;
        }

        this.state.quote.quote_texts_attributes.forEach((quote_text, index) => {

            if(!quote_text.text || quote_text.text === ""){
                warnings[index + "|text"] = "Please add the quote text."
                valid = false;
            }


            if(this.getPublication() && this.getPublication().is_translated){
                if(!quote_text.translation_id || quote_text.translation_id === "" || isNaN(parseInt(quote_text.translation_id)) ){
                    warnings[index + "|translation_id"] = "Please select a translation."
                    valid = false;
                }
            }
        });

        this.setState({warnings: warnings});

        return valid;
    }

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
                this.setState({people: data})
            }
        });

        if(this.state.quote_id && !this.state.quote.id){
            $.ajax({
                type: "get",
                url: `/app/quotes/${this.state.quote_id}`,
                data: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                success:(data)=>{
                    this.setState({quote: JSON.parse(JSON.stringify(data)), original_quote: JSON.parse(JSON.stringify(data)), status: "ready"}, this.getPublications);
                }
            });
        } else if(this.state.quote.id){
            this.getPublications();
        }
    }

    getPublications(){
        $.ajax({
            type: "get",
            url: `/app/publications_by/${this.state.quote.person_id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            success:(data)=>{
                this.setState({publications: data})
            }
        });
    }

    // Event Handlers
    changeValue(event){
        let temp = {...this.state.quote}
        temp[event.target.id] = event.target.value;

        let callback;

        if(event.target.id === "publication_id"){
            temp.citation = this.getBlankQuote().citation;
            temp.quote_texts_attributes = this.getBlankQuote().quote_texts_attributes;
            let publication = this.state.publications.find((p) => { return p.id === parseInt(event.target.value); })
            if(publication){
                publication.citation_fields.forEach((citation_field) => {
                    temp.citation[citation_field] = ""
                });
            }
        }

        let temp_publications = [...this.state.publications];

        if(event.target.id === "person_id"){
            if(event.target.value !== ""){
                callback = this.getPublications;
            }
            temp = this.getBlankQuote();
            temp.person_id = event.target.value;
            temp_publications = [];
        }

        this.setState({quote: temp, publications: temp_publications}, callback);
    }

    reset(event){
        event.preventDefault();
        this.setState({quote: JSON.parse(JSON.stringify(this.state.original_quote))});
    }

    cancel(){
        event.preventDefault();
        window.app_vars.app_history.goBack();
    }

    delete(){
        event.preventDefault();
        if(this.state.quote.id){
            $.ajax({
                type: "delete",
                url: `/app/quotes/${this.state.quote.id}`, 
                data: JSON.stringify({quote: this.state.quote}),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': window.app_vars.csrf_token
                },
                success:(data)=>{
                    window.app_func.route('/quotes');
                }
            });
        }
    }

    save(event){
        event.preventDefault();

        if(this.validateData()){
            if(this.state.quote.id){
                $.ajax({
                    type: "patch",
                    url: `/app/quotes/${this.state.quote.id}`, 
                    data: JSON.stringify({quote: this.state.quote}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': window.app_vars.csrf_token
                    },
                    success:(data)=>{
                            this.setState({quote: data});
                    }
                });
            } else {
                $.ajax({
                    type: "post",
                    url: '/app/quotes', 
                    data: JSON.stringify({quote: this.state.quote}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': window.app_vars.csrf_token
                    },
                    success:(data)=>{
                            this.setState({quote: data});
                    }
                });
            }
        }
    }

    changeCitationValue(event){
        let temp = {...this.state.quote.citation};
        temp[event.target.id] = event.target.value;
        this.setState({quote: {...this.state.quote, citation: temp}});
    }

    changeQuoteTextValue(event){
        let tokens = event.target.id.split("|");
        let temp = [...this.state.quote.quote_texts_attributes];
        temp[tokens[0]][tokens[1]] = event.target.value;
        this.setState({quote: {...this.state.quote, quote_texts_attributes: temp}});
    }

    addQuoteText(event){
        let temp = [...this.state.quote.quote_texts_attributes];
        temp.push({
            id: null,
            text: "",
            translation_id: "" 
        });
        this.setState({quote: {...this.state.quote, quote_texts_attributes: temp}});
        event.preventDefault();
    }

    removeQuoteTextField(event){
        let tokens = event.currentTarget.id.split("|");
        let temp = [...this.state.quote.quote_texts_attributes];
        
        if(temp[tokens[0]].id){
            temp[tokens[0]]["_destroy"] = true;
        } else {
            temp.splice(tokens[0],1);
        }

        this.setState({quote: {...this.state.quote, quote_texts_attributes: temp}});
        event.preventDefault();
    }

    citationsNeeded(){
        return this.getPublication() && this.getPublication().citation_fields.length > 0;
    }

    getCitationInputs(){
        return Object.keys(this.state.quote.citation).map((key) => {
            let citation_value = this.state.quote.citation[key];
            return (
                <div className="col-sm-12 col-md-6 form-group" key={key}>
                    <label htmlFor="chapter">{key}</label>
                    <input id={key} className="form-control" type="text" value={citation_value} onChange={this.changeCitationValue}/>
                    <span style={{color: "red"}}>{this.getWarning(key)}</span>
                </div>
            )
        });
    }

    getQuoteTextFields(){
        return this.state.quote.quote_texts_attributes.map((quote_text, index) => {

            if(quote_text._destroy){
                return null;
            }

            return(
                <div className="row" key={index}>
                    <div className="col-sm-12 col-md-8 form-group">
                        <label htmlFor={index + "|text"}>Text</label>
                        <textarea id={index + "|text"} className="form-control" value={quote_text.text} onChange={this.changeQuoteTextValue}></textarea>
                        <span style={{color: "red"}}>{this.getWarning(index + "|text")}</span>
                    </div>
                    {this.getPublication() && this.getPublication().is_translated && 
                        <div className="col-sm-12 col-md-4 form-group">
                            <label htmlFor={index + "|translation_id"}>Translation</label>
                            <select id={index + "|translation_id"} className="form-control" value={quote_text.translation_id} onChange={this.changeQuoteTextValue} disabled={quote_text.id}>
                                <option value="">- Select -</option>
                                {this.getTranslationOptions()}
                            </select>
                            <span style={{color: "red"}}>{this.getWarning(index + "|translation_id")}</span>
                        </div>
                    }
                    {index > 0 && <div className="form-group" style={{ paddingTop: "40px", marginRight: "-50px", width: "50px" }}>
                        <a href="" id={index + "|remove"} style={{ color: "red" }} onClick={this.removeQuoteTextField}>
                            <FontAwesomeIcon icon="minus-circle"/>
                        </a>
                    </div>}
                </div>
            )
        });
    }

    getPublicationsOptions(){
        let options = this.state.publications.map((publication) => {
            return (
                <option key={publication.id} value={publication.id}>{publication.title}</option>
            )
        });
        return options;
    }

    getPeopleOptions(){
        let options = this.state.people.map((person) => {
            return (
                <option key={person.id} value={person.id}>{person.name}</option>
            )
        });
        return options;
    }

    getTranslationOptions(){
        let translations = [];
        let publication = this.getPublication()
        if(publication){
            translations = publication.translations_attributes;
        }

        return translations.map((translation) => {

            let quote_text_usage = this.state.quote.quote_texts_attributes.find((quote_text) => {return parseInt(quote_text.translation_id) === translation.id});

            return (
                <option disabled={quote_text_usage} key={translation.id} value={translation.id}>{translation.translator}</option>
            )
        });
    }

    render(){
        return (
            <div>
                <form>
                    <div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <h2>
                                    {(this.state.quote && this.state.quote.id) ? `Editing Quote by ${this.state.quote.person.name}` : "New Quote"}
                                    {this.state.quote.id && <AppLink path="" onClick={this.delete} style={{float: "right", color: "red"}}>
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
                                <label htmlFor="by">By</label>
                                <select id="person_id" className="form-control" value={this.state.quote.person_id}  onChange={this.changeValue} disabled={this.state.quote.id}>
                                    <option value="">- Select -</option>
                                    {this.getPeopleOptions()}
                                </select>
                                <span style={{color: "red"}}>{this.getWarning("person_id")}</span>
                            </div>
                            {this.state.publications.length > 0 && <div className="col-sm-12 col-md-6 form-group">
                                <label htmlFor="publication">Publication</label>
                                <select id="publication_id" className="form-control" value={this.state.quote.publication_id} onChange={this.changeValue} disabled={this.state.quote.id}>
                                    <option value="">- Select -</option>
                                    {this.getPublicationsOptions()}
                                </select>
                                <span style={{color: "red"}}>{this.getWarning("publication_id")}</span>
                            </div>}
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-6 form-group">
                                <label htmlFor="key_words">Key Words (comma separated list)</label>
                                <input name="key_words" id="key_words" className="form-control" value={this.state.quote.key_words} onChange={this.changeValue}/>
                                <span style={{color: "red"}}>{this.getWarning("key_words")}</span>
                            </div>
                        </div>
                        {this.citationsNeeded() && <br/>}
                        {this.citationsNeeded() && <h5>Citation{'\u00A0'}</h5>}
                        {this.citationsNeeded() && <div className="row">
                            {this.getCitationInputs()}
                        </div>}
                        <br/>
                        <h5>Quote Text{'\u00A0'}{ this.canHaveMultipleQuoteTexts() && <a href="" onClick={this.addQuoteText}><FontAwesomeIcon icon="plus-circle"/></a> }</h5>
                        {this.getQuoteTextFields()}
                    </div>
                    <br/>
                    <input type="submit" className="btn btn-primary" value="Save" onClick={this.save}/>
                </form>
            </div>
        );
    };
}

export default QuoteForm