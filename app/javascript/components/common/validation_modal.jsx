import React from 'react'

class ValidationModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <div className="modal fade" id={this.props.modal_attributes.modal_id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{this.props.modal_attributes.title}</h5>
                        </div>  
                        <div className="modal-body">
                            {this.props.message}
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ValidationModal