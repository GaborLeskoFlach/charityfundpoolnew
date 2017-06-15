import * as React from 'react'
import { resetPassword } from '../../firebaseAuth/component'

import { IAuthValidationError } from '../../interfaces'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { NavLink } from 'react-router-dom'

import '../styles.css'

interface IPasswordReset{
    email : string
    emailValidationError:string
    touched : boolean
}

@observer
export class PasswordReset extends React.Component<any,any>{
    @observable formState : IPasswordReset
    @observable isFormSubmitted : boolean = false

    constructor(props){
        super(props)

        this.formState = {
            email : '',
            emailValidationError : '',
            touched : false
        }
    }

    validate = (email : string) => {
        const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/
        
        if(email.length == 0){
            this.formState.emailValidationError = 'Email is mandatory'
        }else if (!emailPattern.test(email)) {
            this.formState.emailValidationError = 'Invalid email address'
        }else{
            this.formState.emailValidationError = ''
        }
    }

    handleChange = (e) => {
        if(e.target.name === 'email'){
            this.formState.email = e.target.value
            this.formState.emailValidationError = ''
        }
    }

    handleBlur = (e) => {
        this.formState.touched = true
    }

    resetPassword = () => {
        this.formState.touched = true
        this.validate(this.formState.email)

        if(this.formState.emailValidationError.length == 0){
            let email: string = this.formState.email
            resetPassword(email).then(response => {
                if(response){
                    //TODO => Re-sign the user
                    this.isFormSubmitted = true
                }else{
                    //TODO => handle here
                    this.formState.emailValidationError = 'Unable to reset password'
                }
            }).catch((error : IAuthValidationError) => {
                this.formState.emailValidationError = error.message
            })
        }
    }

    shouldMarkError = () => {    
        const hasError : boolean = this.formState.emailValidationError.length > 0
        const shouldShow = this.formState.touched
        return hasError ? shouldShow : false
    }

    render(){   

        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">                                    
                        {
                            this.isFormSubmitted ? 
                                <PasswordResetSuccess /> 
                            : 
                                <PasswordResetForm 
                                    handleBlur={this.handleBlur} 
                                    handleChange={this.handleChange} 
                                    shouldMarkError={this.shouldMarkError} 
                                    resetPassword={this.resetPassword} 
                                    email={this.formState.email}
                                    emailValidationError={this.formState.emailValidationError}
                                />
                        }                                                                            
                        
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>                
        )
    }
}

const PasswordResetSuccess = () => {

    return(
        <div className="form">
            <br/>
            <div className="text-center">
                <h3><i className="fa fa-lock fa-4x"></i></h3>
                <h2 className="text-center">Password Reset</h2>
                <p>
                    Email has been sent to your email address to reset your password.
                </p>
                <br/>
                <NavLink to='/' activeClassName='btn btn-default'>Home</NavLink>
                <hr/>
            
            </div>
        </div>        
    )
}

interface IPasswordResetForm{
    handleChange : (e : any) => void
    handleBlur : (e : any) => void
    email : string
    shouldMarkError : () => boolean
    emailValidationError : string
    resetPassword : () => void
}

const PasswordResetForm = (props : IPasswordResetForm) => {
    return(
        <div className="form">
            <br/>
            <div className="text-center">
                <h3><i className="fa fa-lock fa-4x"></i></h3>
                <h2 className="text-center">Forgot Password?</h2>
                <p>You can reset your password here.</p>

                <div className="input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-lock color-blue"></i></span>
                    <input 
                        maxLength={30}
                        id="email" 
                        name="email" 
                        placeholder="Email"
                        required
                        type="email" 
                        onChange={props.handleChange} 
                        onBlur={props.handleBlur}
                        value={props.email}
                        className={props.shouldMarkError() ? "form-control error" : "form-control"} />                                                        
                </div>
                <span className='validationErrorMsg'>{props.emailValidationError}</span>
                <br/>
                <button className="btn btn-primary btn-block" onClick={props.resetPassword} >RESET</button>
                <hr/>
            
            </div>
        </div>
    )
}