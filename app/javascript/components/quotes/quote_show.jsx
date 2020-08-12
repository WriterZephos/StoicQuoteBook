import React, { useContext } from 'react'
import { AppContext, RouterContext } from '../app_contexts';
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/*
    There are two ways to render the PersonShow.

    2. With a person, by passing it in, for editing that person: <PersonForm person={person}/>
    3. With a person, by passing in an id (the person will be retrieved), for editing that person: <PersonForm id={person}>

    If a person and an id are passed in, no request will be made to get the person.
*/
class QuoteShowMain extends React.Component {

    constructor(props){
        super(props);
        this.router = props.router;
        this.state = {
            quote: props.quote,
            quote_id: props.id,
            status: props.quote_id && !props.quote ? "loading" : "ready"
        }

        this.cancel = this.cancel.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        if(this.state.quote_id && !this.state.quote){
            $.ajax({
                type: "get",
                url: `/app/quotes/${this.state.quote_id}`,
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

    getTranslation(quote_text){
        let translation = this.state.quote.publication.translations_attributes.find((translation) => { return translation.id === quote_text.translation_id });
        return translation;
    }

    getQuoteTextFields(){
        let quoteTextRows = this.state.quote.quote_texts_attributes.map((quote_text, index) => {

            if(quote_text._destroy){
                return null;
            }

            return(
                <tr key={index}>
                    <td>
                        {quote_text.text}
                    </td>
                    {this.state.quote.publication && this.state.quote.publication.is_translated && 
                        <td>
                            {this.getTranslation(quote_text).translator}
                        </td>
                    }
                </tr>
            )
        });

        let quoteTextTable = (
            <div className="row">
                <div className="col-sm-12 col-md-12 mx-auto">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Quote Text</th>
                                {this.state.quote.publication && this.state.quote.publication.is_translated && <th>Translation</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {quoteTextRows}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        return quoteTextTable;
    }

    cancel(){
        this.router.goBack();
    }

    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        <h2>
                            {`Quote by ${this.state.quote.person.name}`}{'\u00A0'}
                            <AppLink path={"/quote_form"} state={{quote: this.state.quote, routing_options: {breadcrumb_name: `Edit Quote by ${this.state.quote.person.name}`}}} style={{float: "right"}}>
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
                        <h5>Attribution</h5>
                        <p>{this.state.quote.formatted_citation}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto">
                        {this.getQuoteTextFields()}
                    </div>
                </div>
            </div>
        );
    }
}
function QuoteShow(props) {
    var app = useContext(AppContext);
    var router = useContext(RouterContext);
    return(<QuoteShowMain {...props} app={app} router={router}/>)
}

export default QuoteShow;