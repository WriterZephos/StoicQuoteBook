import React from 'react'
import PublicationsTable from './publications_table'
import LoadingView from '../common/loading_view'
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class PublicationsIndex extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            publications: [],
            people: [],
            tab: "list",
            status: "loading"
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    getData(){
        $.ajax({
            type: "get",
            url: '/app/publications', 
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': this.csrf_token
            },
            success:(data)=>{
                this.setState({publications: data, status: "ready"});
            }
        });
    }

    render(){
        return(
            <div>
                <LoadingView loading={this.state.status === "loading"}>
                    <h2>
                        Publications{'\u00A0'}
                        <small>
                            <AppLink path={"/publication_form"} state={{routing_options: {breadcrumb_name: `New Publication`}}}>
                                <FontAwesomeIcon icon="plus-circle"/>
                            </AppLink>
                        </small>
                    </h2>
                    <div>Search Form - Under Construction</div>
                    <PublicationsTable publications={this.state.publications}/>
                </LoadingView>
            </div>
        );
    };
}

export default PublicationsIndex