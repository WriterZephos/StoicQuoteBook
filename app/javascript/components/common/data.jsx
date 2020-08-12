import React, { useContext } from 'react'
import { AppContext, LoadingContext, DataContext } from '../app_contexts';

class DataMain extends React.Component{

    constructor(props){
        super(props);
        this.app = props.app;
        this.loading = props.loading;
        this.getData = this.getData.bind(this);
    }

    getData(url, success_callback, error_callback){
        this.loading.startRequest();
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if(response.ok){
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        }).then(json => {
            success_callback(json);
        }).catch(error => {
            error_callback(error);
        }).finally(() => { this.loading.endRequest(); });
    }

    render(){
        return(
            <DataContext.Provider 
                value={{
                    getData: this.getData
            }}>
                {this.props.children}
            </DataContext.Provider>
        )
    }
}

function Data(props) {
    var app = useContext(AppContext);
    var loading = useContext(LoadingContext);
    return(<DataMain {...props} app={app} loading={loading}/>)
}

export default Data