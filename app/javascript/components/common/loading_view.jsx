import React from 'react'

class LoadingView extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        if(this.props.loading){
            return(
                <div>
                    <div>Loading...</div>
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