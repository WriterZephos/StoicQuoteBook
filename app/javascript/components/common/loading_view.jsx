import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadingContext } from '../app_contexts';

class LoadingView extends React.Component{

    constructor(props){
        super(props);
        this.state = {pending_requests: 0};
        this.startRequest = this.startRequest.bind(this);
        this.endRequest = this.endRequest.bind(this);
    }

    startRequest(){
        this.setState({pending_requests: this.state.pending_requests++});
    }
    
    endRequest(){
        this.setState({pending_requests: this.state.pending_requests--});
    }

    render(){
        if(this.state.pending_requests > 0){
            return(
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto" style={{textAlign: "center"}}><FontAwesomeIcon icon="spinner" spin /></div> 
                </div>       
            )   
        } else {
            return(
                <LoadingContext.Provider 
                value={{
                    startRequest: this.startRequest,
                    endRequest: this.endRequest
                }}>
                    {this.props.children}
                </LoadingContext.Provider>
            )
        }
    }
}

export default LoadingView