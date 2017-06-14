import * as React from 'react'
import { IContactUs, IContactUsReply } from '../../interfaces'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { ContactUsController } from '../controller'
import { toast } from 'react-toastify'

import '../list/styles.css'

interface ICreateEmailResponse {
    controller : ContactUsController
    contactRequest : IContactUs
    closeModal : () => void
}

const ToastrMsg = ({ message }) => <div>{message}</div>

@observer
export class CreateEmailResponse extends React.Component<ICreateEmailResponse,{}>{
    @observable message : string

    constructor(props){
        super(props)
    }

    handleChange = (e) => {
        this.message = e.target.value
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const reply : IContactUsReply = {
             ID : this.props.contactRequest.ID,
             date : new Date().toDateString(),
             message : this.message
        }
        
        this.props.controller.sendReplyToContactUsRequest(this.props.contactRequest, reply).then((response) => {
            if(response){
                toast(<ToastrMsg message="Email has been sent successfully!" />)            
                this.props.closeModal()
            }else{
                toast(<ToastrMsg message="Email has not been sent successfully! Please try again later." />)
                this.props.closeModal()
            }
        }).catch((error) => {
            toast(<ToastrMsg message="An error occured during sending the email." />)
            this.props.closeModal()
        })           
    }

    render(){
        return(
            <div className="createEmailModal">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                                                
                        <div className="form-group">
                            <span className="mandatory-asterix">
                                <label htmlFor="fullName">Name</label>
                            </span>                            
                            <input
                                autoComplete="off"
                                disabled
                                className="form-control"                      
                                id="name" 
                                type="text" 
                                placeholder="Full Name"
                                onChange={this.handleChange}
                                value={this.props.contactRequest.name}/>
                        </div> 
                    
                        <div className="form-group">
                            <span className="mandatory-asterix">
                                <label htmlFor="fullName">Email</label>
                            </span>                            
                            <input
                                autoComplete="off"
                                disabled
                                className="form-control"                      
                                id="email" 
                                type="text" 
                                placeholder="Email"
                                onChange={this.handleChange}
                                value={this.props.contactRequest.email}/>
                        </div> 

                         <div className="form-group">
                             <span className="mandatory-asterix"><label htmlFor="message">Message</label></span>
                            <textarea
                                autoComplete="off" 
                                className="form-control"
                                rows={5}
                                id="message"
                                onChange={this.handleChange} 
                                value={this.props.contactRequest.message ? 'TODO - show Reply message here' : this.message}></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary submit pull-right" id="btnContactUs">Send Message</button>
                    </div> 
                </form>
            </div>
        )
    }

}
