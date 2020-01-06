import React from 'react'
import AppLink from '../common/app_link'

class App extends React.Component{

    constructor(props){
        super(props);
    } 

    render(){
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <AppLink
                        className="navbar-brand"
                        path="/"
                        text="Stoic Quote Book"/>
                    <button 
                        className="navbar-toggler"
                        type="button" 
                        data-toggle="collapse" 
                        data-target="#collapsableNav" 
                        aria-controls="collapsableNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsableNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <AppLink
                                    className="nav-link"
                                    path="/quotes"
                                    text="Quotes"/>
                            </li>
                            <li className="nav-item">
                                <AppLink
                                    className="nav-link"
                                    path="/people"
                                    text="People"/>
                            </li>
                            <li className="nav-item">
                                <AppLink
                                    className="nav-link"
                                    path="/publications"
                                    text="Publications"/>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    <div className="mainsection col-sm-12" style={{paddingTop: "50px"}}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default App