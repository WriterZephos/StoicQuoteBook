import React from 'react'
import {BrowserView, MobileView} from 'react-device-detect'
import PeopleTable from './people_table'
import LoadingView from '../common/loading_view'
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class PeopleIndex extends React.Component {

    constructor(props){
        super(props);
        this.state = {
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
            url: '/app/people',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': this.csrf_token
            },
            success:(data)=>{
                this.setState({people: data, status: "ready"})
            }
        });
    }

    render(){        
        return(
            <div>
                <LoadingView loading={this.state.status === "loading"}>
                    <h2>
                        People{'\u00A0'}
                        <small>
                            <AppLink path={"/person_form"} state={{routing_options: {breadcrumb_name: `New Person`}}}>
                                <FontAwesomeIcon icon="plus-circle"/>
                            </AppLink>
                        </small>
                    </h2>
                    <div>Search Form - Under Construction</div>
                    <BrowserView>
                        <PeopleTable people={this.state.people}/>
                    </BrowserView>
                    <MobileView>
                        <h1> This is rendered only on mobile </h1>
                    </MobileView>
                </LoadingView>
            </div>   
        );
    };
}

export default PeopleIndex