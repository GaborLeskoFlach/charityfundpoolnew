import * as React from 'react'
import { IContactUs } from '../../interfaces'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

interface ICreateEmailResponse {
    contactRequest : IContactUs
}

@observer
export class CreateEmailResponse extends React.Component<ICreateEmailResponse,{}>{
    @observable message : string

    constructor(props){
        super(props)
    }

    handleChange = (e) => {
        this.message = e.target.value
    }

    render(){
        return(
            <div>
                <strong>Reply to Contact Us Request</strong>
                <div className="">
                    <div className="form-group">
                        <span className="mandatory-asterix"><label htmlFor="message">Message</label></span>
                        
                        <textarea
                            autoComplete="off" 
                            className="form-control"
                            rows={5} 
                            id="message"
                            onChange={this.handleChange} 
                            value={this.message}></textarea>
                    </div>
                    
                </div>                
            </div>
        )
    }

}
