import React from 'react'
import AppLink from '../common/app_link'

class PublicationsTable extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        let rows = "";
        let content = "";
        if(this.props.publications != null && this.props.publications.length > 0){
            rows = this.props.publications.map((p)=>{
                return(
                    <tr key={p.id}>
                        <td>
                            <AppLink
                                path={`/publication?id=${p.id}`}
                                text={p.title}
                                state={{publication: p}}/>
                        </td>
                        <td>{p.person.name}</td>
                        <td>{p.description}</td>
                        <td>{p.wikipedia_link}</td>
                    </tr>
            )});
        } else {
            rows = (
                <tr><td colSpan="3">No results.</td></tr>
            )
        }

        content = (
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
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

export default PublicationsTable
