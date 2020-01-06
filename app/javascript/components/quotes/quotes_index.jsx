import React from 'react'
import QuotesTable from './quotes_table'
import LoadingView from '../common/loading_view'
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class QuotesIndex extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            quotes: [],
            publications:[],
            status: "loading"
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    getData(){
        $.ajax({
            type: "get",
            url: '/app/quotes',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': this.csrf_token
            },
            success:(data)=>{
                this.setState({quotes: data, status: "ready"});
            }
        });
    }

    render(){
        return(
            <div>
                <LoadingView loading={this.state.status === "loading"}>
                    <h2>
                        Quotes{'\u00A0'}
                        <small>
                            <AppLink path={"/quote_form"}>
                                <FontAwesomeIcon icon="plus-circle"/>
                            </AppLink>
                        </small>
                    </h2>
                    <div>Search Form - Under Construction</div>
                    <QuotesTable quotes={this.state.quotes} setModalAttributes={this.setModalAttributes}/>
                </LoadingView>
            </div>   
        );
    };
}

export default QuotesIndex