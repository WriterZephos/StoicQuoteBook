import React from 'react'
import AppLink from '../common/app_link'

class QuotesTable extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        let rows = "";
        let content = "";
        if(this.props.quotes != null && this.props.quotes.length > 0){
            rows = this.props.quotes.map((q)=>{return(
                <tr key={q.id}>
                    <td>
                        <AppLink
                                path={"/quote"}
                                text={q.quote_texts_attributes[0].text}
                                state={{quote: q}}/>
                    </td>
                    <td>{q.formatted_citation}</td>
                    <td>{q.key_words}</td>
                    <td>{q.rating}</td>
                </tr>
            )})
        } else {
            rows = (
                <tr><td colSpan="6">No results.</td></tr>
            )
        }

        content = (
            <table className="table">
                <thead>
                    <tr>
                        <th>Quote</th>
                        <th>Attribution</th>
                        <th>Keywords</th>
                        <th>Rating</th>
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

export default QuotesTable
