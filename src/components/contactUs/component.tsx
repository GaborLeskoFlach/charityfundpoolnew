import * as React from 'react'
import { IContactUs} from '../interfaces'
import { ContactUsController } from './controller'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Loader from 'react-loaders'
import { toast } from 'react-toastify'

import { ContactRequestsComponent } from './list/list'

const ToastrMsg = ({ message }) => <div>{message}</div>

@observer
export class ContactUsComponent extends React.Component<{},{}>{
    controller : ContactUsController

    constructor(props){
        super(props)
        this.controller = new ContactUsController()
    }

    showToastrMsg = () => {
        toast(<ToastrMsg message="Thanks for contacting us, we will get back to you soon!" />);
    }
        
    handleChange = (e : any) => {
        switch(e.target.id)
        {
            case 'name':
                this.controller.name = e.target.value
                this.controller.contactUsFormState.name.fieldValidationError = ''
                break
            case 'email':
                this.controller.email = e.target.value
                this.controller.contactUsFormState.email.fieldValidationError = ''
                break
            case 'subject':
                this.controller.subject = e.target.value
                this.controller.contactUsFormState.subject.fieldValidationError = ''
                break
            case 'message':
                this.controller.message = e.target.value
                this.controller.contactUsFormState.message.fieldValidationError = ''
                break

        }
    }

    handleBlur = (event) => {
        switch(event.target.id)
        {
            case 'name':
                this.controller.contactUsFormState.name.touched = true
                break
            case 'email':
                this.controller.contactUsFormState.email.touched = true
                break
            case 'subject':
                this.controller.contactUsFormState.subject.touched = true
                break
            case 'message':
                this.controller.contactUsFormState.message.touched = true
                break
        }
    }

    shouldMarkError = (control:string) => {
        let hasError : boolean = false
        let shouldShow : boolean = false

        switch(control)
        {
            case 'name':
                hasError = this.controller.contactUsFormState.name.fieldValidationError.length > 0
                shouldShow =  this.controller.contactUsFormState.name.touched
                break
            case 'email':
                hasError  =  this.controller.contactUsFormState.email.fieldValidationError.length > 0
                shouldShow =  this.controller.contactUsFormState.email.touched
                break
            case 'subject':
                hasError  =  this.controller.contactUsFormState.subject.fieldValidationError.length > 0
                shouldShow =  this.controller.contactUsFormState.subject.touched
                break
            case 'message':
                hasError  =  this.controller.contactUsFormState.message.fieldValidationError.length > 0
                shouldShow =  this.controller.contactUsFormState.message.touched
                break                             

        }    
        return hasError ? shouldShow : false
    }

    validate = () => {
        const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/
        const lettersOnlyPatter = /[a-zA-Z]+/
        const numericOnlyPatter = /^[0-9]*$/
       
        this.controller.contactUsFormState.name.touched = true
        this.controller.contactUsFormState.email.touched = true
        this.controller.contactUsFormState.subject.touched = true
        this.controller.contactUsFormState.message.touched = true    

        if(this.controller.name.length == 0){
            this.controller.contactUsFormState.name.fieldValidationError = 'Required'
        }else if (!lettersOnlyPatter.test(this.controller.name)) {
            this.controller.contactUsFormState.name.fieldValidationError = 'Name can contain valid characters only'
        }else{
            this.controller.contactUsFormState.name.fieldValidationError = ''
        }  

        if(this.controller.email.length == 0){
            this.controller.contactUsFormState.email.fieldValidationError = 'Required'
        }else if (!emailPattern.test(this.controller.email)) {
            this.controller.contactUsFormState.email.fieldValidationError = 'Invalid email address'
        }else{
            this.controller.contactUsFormState.email.fieldValidationError = ''
        }   

        if(this.controller.subject.length == 0){
            this.controller.contactUsFormState.subject.fieldValidationError = 'Required'        
        }else{
            this.controller.contactUsFormState.subject.fieldValidationError = ''
        }       

        if(this.controller.message.length == 0){
            this.controller.contactUsFormState.message.fieldValidationError = 'Required'
        }else if (!lettersOnlyPatter.test(this.controller.message)) {
            this.controller.contactUsFormState.message.fieldValidationError = 'Message can contain valid characters only'
        }else{
            this.controller.contactUsFormState.message.fieldValidationError = ''
        }     
                                                                         
        
    }

    handleClick = (e) => {
        e.preventDefault()
        
        this.validate()

        if(this.controller.contactUsFormState.name.fieldValidationError.length === 0 &&
            this.controller.contactUsFormState.email.fieldValidationError.length === 0 &&
            this.controller.contactUsFormState.subject.fieldValidationError.length === 0 &&
            this.controller.contactUsFormState.message.fieldValidationError.length === 0) {

                this.controller.isLoading = true

                const contactUs : IContactUs = {
                    active : true,
                    outstanding : true,
                    name : this.controller.name,
                    email : this.controller.email,
                    subject : this.controller.subject,
                    message : this.controller.message,
                    date : new Date().toDateString()
                }
                
                this.controller.saveContactUsRequest(contactUs).then((response) => {            
                    this.controller.resetForm()
                    this.controller.isLoading = false
                    this.showToastrMsg()
                })
            }
    }

    render(){

        if(this.controller.isLoading){
            return <Loader type="ball-pulse" active />
        }else{
            return(
                <div>
                    <div className="container">
                        <div className="section-title">
                            <h1>Contact Us</h1>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <form onSubmit={this.handleClick}>
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className={this.shouldMarkError('name') ? "form-group has-error has-feedback" : "form-group"}>
                                                <span className="mandatory-asterix">
                                                    <label htmlFor="fullName">Your Name</label>
                                                </span>
                                                <span className='validationErrorMsg'>{this.controller.contactUsFormState.name.fieldValidationError}</span>
                                                <input
                                                    autoComplete="off"
                                                    className={this.shouldMarkError('name') ? "form-control error" : "form-control"}                        
                                                    id="name" 
                                                    type="text" 
                                                    placeholder="Full Name"
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleBlur}
                                                    value={this.controller.name}/>

                                            </div>                                        
                                                                                    
                                            <div className={this.shouldMarkError('email') ? "form-group has-error has-feedback" : "form-group"}>
                                                <span className="mandatory-asterix">
                                                    <label htmlFor="fullName">Email</label>                                               
                                                </span>
                                                <span className='validationErrorMsg'>{this.controller.contactUsFormState.email.fieldValidationError}</span>
                                                <div className="input-group">
                                                    <span className="input-group-addon"><span className="glyphicon glyphicon-envelope"></span>
                                                    </span>                                            
                                                    <input
                                                        autoComplete="off"
                                                        className={this.shouldMarkError('email') ? "form-control error" : "form-control"}                        
                                                        id="email" 
                                                        type="text" 
                                                        placeholder="Email"
                                                        onChange={this.handleChange}
                                                        onBlur={this.handleBlur}
                                                        value={this.controller.email}/>
                                                </div>
                                            </div>
                                                                                
                                            <div className={this.shouldMarkError('subject') ? "form-group has-error has-feedback" : "form-group"}>
                                                <span className="mandatory-asterix"><label htmlFor="country">Subject</label></span>
                                                <span className='validationErrorMsg'>{this.controller.contactUsFormState.subject.fieldValidationError}</span>
                                                <div>
                                                    <select className={this.shouldMarkError('subject') ? "form-control error" : "form-control"} id="subject" 
                                                        onChange={this.handleChange} 
                                                        onBlur={this.handleBlur} 
                                                        value={this.controller.subject} >
                                                        <option value="">Please select an option...</option>
                                                        <option value="enquiry">General Enquiry</option>
                                                        <option value="suggestions">Suggestions</option>
                                                        <option value="support">Support</option>
                                                    </select>
                                                </div>
                                            </div>                                        

                                        </div>

                                        <div className="col-md-6">
                                            <div className={this.shouldMarkError('message') ? "form-group has-error has-feedback" : "form-group"}>
                                                <span className="mandatory-asterix"><label htmlFor="message">Message</label></span>
                                                <span className='validationErrorMsg'>{this.controller.contactUsFormState.message.fieldValidationError}</span>
                                                <textarea
                                                    autoComplete="off" 
                                                    className={this.shouldMarkError('message') ? "form-control error" : "form-control"}
                                                    rows={5} 
                                                    id="message"
                                                    onChange={this.handleChange} 
                                                    onBlur={this.handleBlur}
                                                    value={this.controller.message}></textarea>
                                            </div>
                                            
                                        </div>

                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-primary submit pull-right" id="btnContactUs">Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <ContactRequestsComponent controller={this.controller}/>
                </div>
            )
        }
    }

}