import React, { useContext } from 'react'
import {BrowserView, MobileView} from 'react-device-detect'
import { RouterContext, AppContext, LoadingContext, NotificationContext, DataContext } from '../app_contexts';
import PeopleTable from './people_table'
import AppLink from '../common/app_link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class PeopleIndexMain extends React.Component {

    constructor(props){
        super(props);
        this.router = props.router;
        this.app = props.app;
        this.notification = props.notification;
        this.loading = props.loading;
        this.data = props.data;
        this.state = {
            people: []
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    getData(){
        this.data.getData('/app/people',
            (json)=>{
                this.setState({people: json})
            }
        )
        // $.ajax({
        //     type: "get",
        //     url: '/app/people',
        //     data: {},
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRF-Token': this.csrf_token
        //     },
        //     success:(data)=>{
        //         this.setState({people: data, status: "ready"})
        //     }
        // });
    }

    render(){        
        return(
            <div>
                <h2>
                    People{'\u00A0'}
                    <small>
                        <AppLink path={"/new_person"}>
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
            </div>   
        );
    };
}
function PeopleIndex(props) {
    var app = useContext(AppContext);
    var router = useContext(RouterContext);
    var loading = useContext(LoadingContext);
    var notification = useContext(NotificationContext);
    var data = useContext(DataContext);
    return(<PeopleIndexMain {...props} app={app} router={router} loading={loading} notification={notification} data={data}/>)
}

export default PeopleIndex