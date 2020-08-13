import React from 'react'
import AppLink from '../common/app_link'

class PeopleTable extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    transition(event){
        this.props.transition(event,{person: p});
    }

    render(){
        let rows = "";
        let content = "";
        if(this.props.people != null && this.props.people.length > 0){
            rows = this.props.people.map((p)=>{return(
                <tr key={p.id}>
                    <td>
                        <AppLink
                            path={`/person?id=${p.id}`}
                            text={p.name}/>
                    </td>
                    <td>{p.description}</td>
                    <td>{p.wikipedia_link}</td>
                </tr>
            )})
        } else {
            rows = (
                <tr><td colSpan="7">No results.</td></tr>
            )
        }

        content = (
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Wikipedia Link</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )

        return (
            <div>{content}</div>
        )
    }
}

export default PeopleTable