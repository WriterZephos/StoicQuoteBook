import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadingContext } from '../app_contexts';

class LoadingView extends React.Component{

    constructor(props){
        super(props);
        this.state = {loading: false};
        this.setLoading = this.setLoading.bind(this);
    }

    setLoading(loading){
        this.setState({loading: loading})
    }

    render(){
        if(this.props.loading){
            return(
                <div className="row">
                    <div className="col-sm-12 col-md-12 mx-auto" style={{textAlign: "center"}}><FontAwesomeIcon icon="spinner" spin /></div> 
                </div>       
            )   
        } else {
            return(
                <LoadingContext.Provider 
                value={{
                    setLoading: this.setLoading
                }}>
                    {this.props.children}
                </LoadingContext.Provider>
            )
        }
    }
}

export default LoadingView