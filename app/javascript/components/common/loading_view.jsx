import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class LoadingView extends React.Component{

    constructor(props){
        super(props);
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
                this.props.children
            )
        }
    }
}

export default LoadingView