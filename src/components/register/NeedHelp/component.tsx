import * as React from 'react'
import * as RegistrationFields from '../formFields'

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import { observer} from 'mobx-react'
import { observable } from 'mobx'

import { RegisterNeedHelpController } from './controller'
import { CreateNewNeedForOrgsComponent } from './addNewNeedForOrganisations/component'
import { CreateNewNeedForIndividualsComponent } from './addNewNeedForIndividuals/component'
import Loader from 'react-loaders'
import { _firebaseAuth } from '../../firebaseAuth/component'
import GoogleAddress from '../../googleMaps/autoCompleteWithoutForm'

import './styles.css'
const Mask = require('react-masking').default

import { IOrgNeedHelpWithListItem, RegistrationType, IAddressDetails } from '../../interfaces'

interface IRegisterNeedHelpComponentProps{
    params : any
}
interface IRegistrationProps{
    controller : RegisterNeedHelpController
}

@observer
export class RegisterNeedHelpComponent extends React.Component<IRegisterNeedHelpComponentProps,{}>{
    controller : RegisterNeedHelpController
    requestURL_ID : string

    static contextTypes: React.ValidationMap<any> = {
        router: React.PropTypes.func.isRequired
    }

    constructor(props : IRegisterNeedHelpComponentProps){
        super(props)

        this.controller = new RegisterNeedHelpController() 

        //check URL Query
        if(props.params){
            this.requestURL_ID = props.params.params.id
        }
    }

    getRegistrationType = () : RegistrationType => {                
        switch(this.props.params.path){
            case '/register/NeedHelp/individual/:id':
                return RegistrationType.NeedHelpInd
            case '/register/NeedHelp/organisation/:id':
                return RegistrationType.NeedHelpOrg
        }
        
        return RegistrationType.NeedHelpInd
    }

    async componentWillMount(){
        this.controller.isLoading = true
        await this.controller.getWhatINeedHelpWith()
        await this.controller.getTypesOfWork()

        if(_firebaseAuth.currentUser !== null){
            this.controller.getWhatWeNeedForOrganisation().then(response => {
                if(this.requestURL_ID){
                    this.controller.getRegistrationByTypeAndID(this.getRegistrationType(),this.requestURL_ID).then(response => {                
                        this.controller.isLoading = false
                    })
                }else if(!this.requestURL_ID && _firebaseAuth.currentUser){
                    this.controller.getRegistrationByID('NeedHelp',_firebaseAuth.currentUser.uid).then(response => {                
                        this.controller.isLoading = false
                    })
                }
            })
        }else{
            this.controller.isLoading = false
        }
                
    }

    validate = (registrationType : string) => {
        const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/
        const lettersOnlyPatter = /[a-zA-Z]+/
        const numericOnlyPatter = /^[0-9]*$/
       
        
        switch(registrationType){
            case "Individual":

                this.controller.registerIndividualFormState.email.touched = true
                this.controller.registerIndividualFormState.fullName.touched = true
                this.controller.registerIndividualFormState.phoneNo.touched = true
                this.controller.registerIndividualFormState.country.touched = true
                this.controller.registerIndividualFormState.addressLine1.touched = true
                this.controller.registerIndividualFormState.addressLine2.touched = true
                this.controller.registerIndividualFormState.citySuburb.touched = true
                this.controller.registerIndividualFormState.state.touched = true
                this.controller.registerIndividualFormState.postCode.touched = true

                //Email validation
                if(this.controller.registrationNeedHelpInd.email.length == 0){
                    this.controller.registerIndividualFormState.email.fieldValidationError = 'Required'
                }else if (!emailPattern.test(this.controller.registrationNeedHelpInd.email)) {
                    this.controller.registerIndividualFormState.email.fieldValidationError = 'Invalid email address'
                }else{
                    this.controller.registerIndividualFormState.email.fieldValidationError = ''
                }

                //FullName
                if(this.controller.registrationNeedHelpInd.fullName.length == 0){
                    this.controller.registerIndividualFormState.fullName.fieldValidationError = 'Required'
                }else if (!lettersOnlyPatter.test(this.controller.registrationNeedHelpInd.fullName)) {
                    this.controller.registerIndividualFormState.fullName.fieldValidationError = 'Name can contain valid characters only'
                }else{
                    this.controller.registerIndividualFormState.fullName.fieldValidationError = ''
                }        

                //Phone no
                if(this.controller.registrationNeedHelpInd.phoneNo.length == 0){
                    this.controller.registerIndividualFormState.phoneNo.fieldValidationError = 'Required'
                //}else if (!numericOnlyPatter.test(this.controller.registrationNeedHelpInd.phoneNo)) {
                 //   this.controller.registerIndividualFormState.phoneNo.fieldValidationError = 'Phone No can contain numbers only'
                }else{
                    this.controller.registerIndividualFormState.phoneNo.fieldValidationError = ''
                }   

                //Country
                if(this.controller.registrationNeedHelpInd.country.length == 0){
                    this.controller.registerIndividualFormState.country.fieldValidationError = 'Required'
                }else{
                    this.controller.registerIndividualFormState.country.fieldValidationError = ''
                }      

                //AddressLine1
                if(this.controller.registrationNeedHelpInd.addressLine1.length == 0){
                    this.controller.registerIndividualFormState.addressLine1.fieldValidationError = 'Required'
                }else{
                    this.controller.registerIndividualFormState.addressLine1.fieldValidationError = ''
                }      

                //AddressLine2
                if(this.controller.registrationNeedHelpInd.addressLine2.length == 0){
                    this.controller.registerIndividualFormState.addressLine2.fieldValidationError = 'Required'
                }else{
                    this.controller.registerIndividualFormState.addressLine2.fieldValidationError = ''
                }         

                //City/Suburb
                if(this.controller.registrationNeedHelpInd.citySuburb.length == 0){
                    this.controller.registerIndividualFormState.citySuburb.fieldValidationError = 'Required'
                }else{
                    this.controller.registerIndividualFormState.citySuburb.fieldValidationError = ''
                }      

                //State
                if(this.controller.registrationNeedHelpInd.state.length == 0){
                    this.controller.registerIndividualFormState.state.fieldValidationError = 'Required'
                }else{
                    this.controller.registerIndividualFormState.state.fieldValidationError = ''
                }      

                //PostCode
                if(this.controller.registrationNeedHelpInd.postCode.length == 0){
                    this.controller.registerIndividualFormState.postCode.fieldValidationError = 'Required'
                }else if (!numericOnlyPatter.test(this.controller.registrationNeedHelpInd.postCode)) {
                    this.controller.registerIndividualFormState.postCode.fieldValidationError = 'Post code can contain numbers only'
                }else{
                    this.controller.registerIndividualFormState.postCode.fieldValidationError = ''
                }            

                //Password

                //PasswordConfirm                                                                                                                                
            break
            case "Org":

                this.controller.registerOrganisationFormState.email.touched = true
                this.controller.registerOrganisationFormState.fullName.touched = true
                this.controller.registerOrganisationFormState.phoneNo.touched = true
                this.controller.registerOrganisationFormState.charityName.touched = true
                //this.controller.registerOrganisationFormState.websiteLink.touched = true
                this.controller.registerOrganisationFormState.whatWeDo.touched = true      

                //Email
                if(this.controller.registrationNeedHelpOrg.email.length == 0){
                    this.controller.registerOrganisationFormState.email.fieldValidationError = 'Required'
                }else if (!emailPattern.test(this.controller.registrationNeedHelpOrg.email)) {
                    this.controller.registerOrganisationFormState.email.fieldValidationError = 'Invalid email address'
                }else{
                    this.controller.registerOrganisationFormState.email.fieldValidationError = ''
                }   

                //FullName
                if(this.controller.registrationNeedHelpOrg.fullName.length == 0){
                    this.controller.registerOrganisationFormState.fullName.fieldValidationError = 'Required'
                }else if (!lettersOnlyPatter.test(this.controller.registrationNeedHelpOrg.fullName)) {
                    this.controller.registerOrganisationFormState.fullName.fieldValidationError = 'Name can contain valid characters only'
                }else{
                    this.controller.registerOrganisationFormState.fullName.fieldValidationError = ''
                }        

                //Phone no
                if(this.controller.registrationNeedHelpOrg.phoneNo.length == 0){
                    this.controller.registerOrganisationFormState.phoneNo.fieldValidationError = 'Required'
                //}else if (!numericOnlyPatter.test(this.controller.registrationNeedHelpOrg.phoneNo)) {
                //    this.controller.registerOrganisationFormState.phoneNo.fieldValidationError = 'Phone No can contain numbers only'
                }else{
                    this.controller.registerOrganisationFormState.phoneNo.fieldValidationError = ''
                }     

                //CharityName
                if(this.controller.registrationNeedHelpOrg.charityName.length == 0){
                    this.controller.registerOrganisationFormState.charityName.fieldValidationError = 'Required'
                }else{
                    this.controller.registerOrganisationFormState.charityName.fieldValidationError = ''
                }     

                //WebsiteLink
                /*
                if(this.controller.registrationNeedHelpOrg.websiteLink.length == 0){
                    this.controller.registerOrganisationFormState.websiteLink.fieldValidationError = 'Required'
                }else if (!urlPattern.test(this.controller.registrationNeedHelpOrg.websiteLink)) {
                    this.controller.registerOrganisationFormState.websiteLink.fieldValidationError = 'Not a valid URL'                    
                }else{
                    this.controller.registerOrganisationFormState.websiteLink.fieldValidationError = ''
                }*/

                //WhatWeDo
                if(this.controller.registrationNeedHelpOrg.whatWeDo.length == 0){
                    this.controller.registerOrganisationFormState.whatWeDo.fieldValidationError = 'Required'
                }else{
                    this.controller.registerOrganisationFormState.whatWeDo.fieldValidationError = ''
                }                                                                           
            break
        }
    }

    register = (event:any) => {
        event.preventDefault()
        this.validate(this.controller.registrationType)
        
        switch(this.controller.registrationType){
            case "Individual":
                if(this.controller.registerIndividualFormState.email.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.fullName.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.phoneNo.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.country.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.citySuburb.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.postCode.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.state.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.addressLine1.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.addressLine2.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.password.fieldValidationError.length == 0 &&
                    this.controller.registerIndividualFormState.passwordConfirm.fieldValidationError.length == 0){       
                        
                        if(this.controller.isExistingRegistration && this.controller.submitBtnCaption === 'Save'){
                            this.controller.updateRegistrationNeedHelpInd().then(response => {
                                (this.refs[RegistrationFields.registrationForm] as HTMLFormElement).reset()      
                                this.context.router.history.push('/confirm/?Save=1')
                            }).catch((error) => {
                                this.controller.registerIndividualFormState.validationError = JSON.stringify(error)
                            })                            
                        }else{
                            this.controller.addNewRegistrationNeedHelpInd().then(response => {
                                (this.refs[RegistrationFields.registrationForm] as HTMLFormElement).reset()      
                                this.context.router.history.push('/confirm/?Save=0')
                            }).catch((error) => {
                                this.controller.registerIndividualFormState.validationError = JSON.stringify(error)
                            })
                        }
                    }
                break
            case "Org":
                if(this.controller.registerOrganisationFormState.email.fieldValidationError.length == 0 &&
                this.controller.registerOrganisationFormState.fullName.fieldValidationError.length == 0 &&
                this.controller.registerOrganisationFormState.phoneNo.fieldValidationError.length == 0 &&
                this.controller.registerOrganisationFormState.charityName.fieldValidationError.length == 0 &&
                //this.controller.registerOrganisationFormState.websiteLink.fieldValidationError.length == 0 &&
                this.controller.registerOrganisationFormState.whatWeDo.fieldValidationError.length == 0 &&
                this.controller.registerOrganisationFormState.whatWeNeed.fieldValidationError.length == 0){
                    
                    if(this.controller.isExistingRegistration && this.controller.submitBtnCaption === 'Save'){
                        this.controller.updateRegistrationNeedHelpOrg().then(response => {
                            (this.refs[RegistrationFields.registrationForm] as HTMLFormElement).reset()      
                            this.context.router.history.push('/confirm')
                        }).catch((error) => {
                            this.controller.registerOrganisationFormState.validationError = JSON.stringify(error)
                        })
                    }else{
                        this.controller.addNewRegistrationNeedHelpOrg().then(response => {
                            (this.refs[RegistrationFields.registrationForm] as HTMLFormElement).reset()      
                            this.context.router.history.push('/confirm')
                        }).catch((error) => {
                            this.controller.registerOrganisationFormState.validationError = JSON.stringify(error)
                        })
                    }
                }
                break
        }
    }

    handleRegistrationTypeChange = (e) => {
        this.controller.setRegistrationType(e.target.value)
    }

    resetForm = (event) => {
        event.preventDefault()
        this.controller.resetForm()
        this.context.router.history.push('/home/registrations')
    }

    getRegistrationTypeText = () => {
        return this.controller.registrationTypeText
    }

    handleTabSelection = (e) => {
        this.controller.setRegistrationType(e.target.id)
    }

    shouldTabBeDisabled = () : string => {
        if(this.controller.isExistingRegistration){
            return 'disabled'
        }else{
            return ''
        }
    }

    renderRegistrationTypeSelectionTabs = () => {        

        const innerStyle : React.CSSProperties = {
            marginBottom : 0,
            textAlign : 'left'
        }
        return (
    
            <div className="row">

                <div className="col-sm-12">
                    <div className="donate-tab text-center">
                        <div id="donate">
                            <Router>
                                <div>
                                    <ul className="tab-list list-inline" role="tablist" onClick={this.handleTabSelection} value={this.controller.registrationType} >
                                        <li className={ (this.controller.registrationType === 'Individual') ? 'active' : this.shouldTabBeDisabled()}><Link id='Individual' to='/register/NeedHelp/individual' role="tab" data-toggle="tab">I need help for myself</Link></li>
                                        <li className={ (this.controller.registrationType === 'Org') ? 'active' : this.shouldTabBeDisabled()}><Link id='Org' to='/register/NeedHelp/organisation' role="tab" data-toggle="tab">I need help for my charity</Link></li>
                                    </ul>
                                    <fieldset className="tab-content" style={innerStyle}>
                                        <Switch>
                                            <Route path="/register/NeedHelp/individual" render={() => <RegisterIndividualComponent controller={this.controller}/>}/>
                                            <Route path="/register/NeedHelp/organisation" render={() => <RegisterOrganisationComponent controller={this.controller}/> }/>
                                        </Switch>
                                    </fieldset>
                                </div>
                            </Router>
                        </div>
                    </div>
                </div>

            </div>
        )      
    }


    render(){

        const myStyle : React.CSSProperties = {
            float : 'right'
        }

        if(this.controller.isLoading)
        {
            return <Loader type="ball-pulse" active />
        }else{      
            return(
                <div className="container">
                    <div className="section-title">
                        {/*<h1>Register (I need help - { this.getRegistrationTypeText() })</h1>*/}
                        <h1>Register</h1>
                        {
                            !this.controller.isExistingRegistration &&
                            <h3>Please fill in the form below and wait for a C.F.P. Member to contact you to arrange access to the site</h3>
                        }
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="contact-form">
                                <form ref="registrationForm" onSubmit={this.register.bind(this)}>                                    
                                    {
                                        this.renderRegistrationTypeSelectionTabs()
                                    }
                                    {
                                        this.controller.hasRegistered &&
                                        <div className="section-title">
                                            <h3>As you are now registered as someone needing help, you are also eligible to help if you would like</h3>
                                        </div>
                                    }

                                    <div className="form-group">
                                        <button className="btn btn-primary submit" type="submit">{this.controller.submitBtnCaption}</button>
                                        <button style={myStyle} className="btn btn-secondary" type="button" onClick={this.resetForm}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
            
        }        
    }
}

@observer
export class RegisterIndividualComponent extends React.Component<IRegistrationProps, {}>{
    @observable whatINeedHelpWith : Array<any> = []

    constructor(props){
        super(props)
    }

    handleChange = (event:any) => {
        switch(event.target.id)
        {
            case RegistrationFields.fullName:
                this.props.controller.registrationNeedHelpInd.fullName = event.target.value
                this.props.controller.registerIndividualFormState.fullName.fieldValidationError = ''
                break
            case RegistrationFields.phoneNo:
                this.props.controller.registrationNeedHelpInd.phoneNo = event.target.value
                this.props.controller.registerIndividualFormState.phoneNo.fieldValidationError = ''
                break
            case RegistrationFields.email:
                this.props.controller.registrationNeedHelpInd.email = event.target.value
                this.props.controller.registerIndividualFormState.email.fieldValidationError = ''
                break
            case RegistrationFields.state:
                this.props.controller.registrationNeedHelpInd.state = event.target.value
                this.props.controller.registerIndividualFormState.state.fieldValidationError = ''
                break
            case RegistrationFields.country:
                this.props.controller.registrationNeedHelpInd.country = event.target.value
                this.props.controller.registerIndividualFormState.country.fieldValidationError = ''
                break
            case RegistrationFields.addressLine1:
                this.props.controller.registrationNeedHelpInd.addressLine1 = event.target.value
                this.props.controller.registerIndividualFormState.addressLine1.fieldValidationError = ''
                break
            case RegistrationFields.addressLine2:
                this.props.controller.registrationNeedHelpInd.addressLine2 = event.target.value
                this.props.controller.registerIndividualFormState.addressLine2.fieldValidationError = ''
                break
            case RegistrationFields.citySuburb:
                this.props.controller.registrationNeedHelpInd.citySuburb = event.target.value
                this.props.controller.registerIndividualFormState.citySuburb.fieldValidationError = ''
                break
            case RegistrationFields.postCode:
                this.props.controller.registrationNeedHelpInd.postCode = event.target.value
                this.props.controller.registerIndividualFormState.postCode.fieldValidationError = ''
                break 
                /*                         
            case RegistrationFields.whenINeedHelpFlexible:
                this.props.controller.registrationNeedHelpInd.whenINeedHelp.flexible = event.target.checked
                break
            case RegistrationFields.singleDateReoccurring:
                this.props.controller.registrationNeedHelpInd.whenINeedHelp.singleDate.reoccurring = event.target.checked
                break
            case RegistrationFields.dateRangeReoccurring:
                this.props.controller.registrationNeedHelpInd.whenINeedHelp.dateRange.reoccurring = event.target.checked*/
        }
    }

    handleBlur = (event) => {
        switch(event.target.id)
        {
            case RegistrationFields.fullName:
                this.props.controller.registerIndividualFormState.fullName.touched = true
                break
            case RegistrationFields.phoneNo:
                this.props.controller.registerIndividualFormState.phoneNo.touched = true
                break
            case RegistrationFields.email:
                this.props.controller.registerIndividualFormState.email.touched = true
                break
            case RegistrationFields.whatINeedHelpWith:
                this.props.controller.registerIndividualFormState.whatINeedHelpWith.touched = true
                break
            case RegistrationFields.state:
                this.props.controller.registerIndividualFormState.state.touched = true
                break
            case RegistrationFields.country:
                this.props.controller.registerIndividualFormState.country.touched = true
                break
            case RegistrationFields.addressLine1:
                this.props.controller.registerIndividualFormState.addressLine1.touched = true
                break
            case RegistrationFields.addressLine2:
                this.props.controller.registerIndividualFormState.addressLine2.touched = true
                break
            case RegistrationFields.citySuburb:
                this.props.controller.registerIndividualFormState.citySuburb.touched = true
                break
            case RegistrationFields.postCode:
                this.props.controller.registerIndividualFormState.postCode.touched = true
                break
        }
    }

    handleKeyPress = (event) => {
        const re = /[0-9A-F:]+/g
        if (!re.test(event.key)) {
            event.preventDefault()
        }        
    }

    shouldMarkError = (control:string) => {
        let hasError : boolean = false
        let shouldShow : boolean = false

        switch(control)
        {
            case RegistrationFields.fullName:
                hasError = this.props.controller.registerIndividualFormState.fullName.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.fullName.touched
                break
            case RegistrationFields.phoneNo:
                hasError  = this.props.controller.registerIndividualFormState.phoneNo.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.phoneNo.touched
                break
            case RegistrationFields.email:
                hasError  = this.props.controller.registerIndividualFormState.email.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.email.touched
                break
            case RegistrationFields.whatINeedHelpWith:
                hasError  = this.props.controller.registerIndividualFormState.whatINeedHelpWith.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.whatINeedHelpWith.touched
                break
            case RegistrationFields.state:
                hasError  = this.props.controller.registerIndividualFormState.state.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.state.touched
                break
            case RegistrationFields.country:
                hasError  = this.props.controller.registerIndividualFormState.country.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.country.touched
                break
            case RegistrationFields.addressLine1:
                hasError  = this.props.controller.registerIndividualFormState.addressLine1.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.addressLine1.touched
                break
            case RegistrationFields.addressLine2:
                hasError  = this.props.controller.registerIndividualFormState.addressLine2.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.addressLine2.touched
                break
            case RegistrationFields.citySuburb:
                hasError  = this.props.controller.registerIndividualFormState.citySuburb.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.citySuburb.touched
                break
            case RegistrationFields.postCode:
                hasError  = this.props.controller.registerIndividualFormState.postCode.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerIndividualFormState.postCode.touched
                break            

        }    
        return hasError ? shouldShow : false
    }

    onPlaceSelected = (address : IAddressDetails) => {
        if(address){
            if(address.streetNumber){
                this.props.controller.registrationNeedHelpInd.addressLine1 = address.streetNumber
            }
            if(address.route){
                this.props.controller.registrationNeedHelpInd.addressLine2 = address.route
            }
            if(address.postalCode){
                this.props.controller.registrationNeedHelpInd.postCode = address.postalCode
            }
            if(address.locality){
                this.props.controller.registrationNeedHelpInd.citySuburb = address.locality
            }
            if(address.country){
                this.props.controller.registrationNeedHelpInd.country = address.country
            }
            if(address.administrativeAreaLevel1){
                this.props.controller.registrationNeedHelpInd.state = address.administrativeAreaLevel1
            }

            //Longitude and Latitude to save into DB
             this.props.controller.registrationNeedHelpInd.addressLocation = address.position
        }
    }

    onResetPlaceSelected = () => {
        this.props.controller.registrationNeedHelpInd.addressLine1 = ''
        this.props.controller.registrationNeedHelpInd.addressLine2 = ''
        this.props.controller.registrationNeedHelpInd.postCode = ''
        this.props.controller.registrationNeedHelpInd.citySuburb = ''
        this.props.controller.registrationNeedHelpInd.country = ''
        this.props.controller.registrationNeedHelpInd.state = ''
        this.props.controller.registrationNeedHelpInd.addressLocation = null
    }

    newNeedAdded = () => {
        console.log('New Need Added')
    }

    render(){

        const { controller } = this.props

        return (
            <div className={ controller.registrationType === 'Individual' ? 'tab-pane fade in active' : 'tab-pane fade '} id="individualTab">

                <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.validationError}</span>

                <div className={this.shouldMarkError('fullName') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="fullName">Your Name</label></span>
                    <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.fullName.fieldValidationError}</span>
                    <input
                        maxLength={30}
                        autoComplete="off"
                        className={this.shouldMarkError('fullName') ? "form-control error" : "form-control"}                        
                        id="fullName" 
                        type="text" 
                        ref="fullName" 
                        placeholder="Full Name"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpInd.fullName}/>
                </div>
                
                <div className={this.shouldMarkError('phoneNo') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="phoneNo">Phone No</label></span>
                    <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.phoneNo.fieldValidationError}</span>
                    <Mask mask="(09)99 999 999" maskCharacter="_" onChange={this.handleChange}>
                        <input
                            autoComplete="off"
                            className={this.shouldMarkError('phoneNo') ? "form-control error" : "form-control"}
                            id="phoneNo" 
                            type="text" 
                            ref="phoneNo"                         
                            onBlur={this.handleBlur}
                            value={controller.registrationNeedHelpInd.phoneNo}/>
                    </Mask>
                </div>
               
                <div className={this.shouldMarkError('email') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="email">Email</label></span>
                    <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.email.fieldValidationError}</span>
                    <input
                        maxLength={30}
                        autoComplete="off"
                        className={this.shouldMarkError('email') ? "form-control error" : "form-control"}
                        id="email" 
                        type="text"
                        placeholder="Email"
                        disabled={controller.isExistingRegistration}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpInd.email}/>
                </div>                

                <div className="well">
                    <GoogleAddress onPlaceSelected={this.onPlaceSelected} onResetPlaceSelected={this.onResetPlaceSelected}/>

                    <div className="well">

                    <div className={this.shouldMarkError('country') ? "form-group has-error has-feedback" : "form-group"}>
                        <span className="mandatory-asterix"><label htmlFor="country">Country</label></span>
                        <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.country.fieldValidationError}</span>
                        <div>
                            <select ref="country" className={this.shouldMarkError('country') ? "form-control error" : "form-control"} id="country" onChange={this.handleChange} onBlur={this.handleBlur} value={controller.registrationNeedHelpInd.country} >
                                <option value=''>Please select an option...</option>
                                <option value="Afganistan">Afghanistan</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="American Samoa">American Samoa</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Anguilla">Anguilla</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Aruba">Aruba</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bermuda">Bermuda</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bonaire">Bonaire</option>
                                <option value="Bosnia &amp Herzegovina">Bosnia &amp Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Brazil">Brazil</option>
                                <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
                                <option value="Brunei">Brunei</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Canary Islands">Canary Islands</option>
                                <option value="Cape Verde">Cape Verde</option>
                                <option value="Cayman Islands">Cayman Islands</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Channel Islands">Channel Islands</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Christmas Island">Christmas Island</option>
                                <option value="Cocos Island">Cocos Island</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Cook Islands">Cook Islands</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote DIvoire">Cote D'Ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Curaco">Curacao</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="East Timor">East Timor</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Falkland Islands">Falkland Islands</option>
                                <option value="Faroe Islands">Faroe Islands</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="French Guiana">French Guiana</option>
                                <option value="French Polynesia">French Polynesia</option>
                                <option value="French Southern Ter">French Southern Ter</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Gibraltar">Gibraltar</option>
                                <option value="Great Britain">Great Britain</option>
                                <option value="Greece">Greece</option>
                                <option value="Greenland">Greenland</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Guam">Guam</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hong Kong">Hong Kong</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran">Iran</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Isle of Man">Isle of Man</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="Korea North">Korea North</option>
                                <option value="Korea Sout">Korea South</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Laos">Laos</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libya">Libya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macau">Macau</option>
                                <option value="Macedonia">Macedonia</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Midway Islands">Midway Islands</option>
                                <option value="Moldova">Moldova</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Nambia">Nambia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherland Antilles">Netherland Antilles</option>
                                <option value="Netherlands">Netherlands (Holland, Europe)</option>
                                <option value="Nevis">Nevis</option>
                                <option value="New Caledonia">New Caledonia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Niue">Niue</option>
                                <option value="Norfolk Island">Norfolk Island</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Palau Island">Palau Island</option>
                                <option value="Palestine">Palestine</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Phillipines">Philippines</option>
                                <option value="Pitcairn Island">Pitcairn Island</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Republic of Montenegro">Republic of Montenegro</option>
                                <option value="Republic of Serbia">Republic of Serbia</option>
                                <option value="Reunion">Reunion</option>
                                <option value="Romania">Romania</option>
                                <option value="Russia">Russia</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="St Barthelemy">St Barthelemy</option>
                                <option value="St Eustatius">St Eustatius</option>
                                <option value="St Helena">St Helena</option>
                                <option value="St Kitts-Nevis">St Kitts-Nevis</option>
                                <option value="St Lucia">St Lucia</option>
                                <option value="St Maarten">St Maarten</option>
                                <option value="St Pierre &amp Miquelon">St Pierre &amp Miquelon</option>
                                <option value="St Vincent &amp Grenadines">St Vincent &amp Grenadines</option>
                                <option value="Saipan">Saipan</option>
                                <option value="Samoa">Samoa</option>
                                <option value="Samoa American">Samoa American</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome &amp Principe">Sao Tome &amp Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia">Serbia</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sudan">Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Syria">Syria</option>
                                <option value="Tahiti">Tahiti</option>
                                <option value="Taiwan">Taiwan</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania">Tanzania</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Togo">Togo</option>
                                <option value="Tokelau">Tokelau</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Trinidad &amp Tobago">Trinidad &amp Tobago</option>
                                <option value="Tunisia">Tunisia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Turks &amp Caicos Is">Turks &amp Caicos Is</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Erimates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States of America">United States of America</option>
                                <option value="Uraguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Vatican City State">Vatican City State</option>
                                <option value="Venezuela">Venezuela</option>
                                <option value="Vietnam">Vietnam</option>
                                <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
                                <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
                                <option value="Wake Island">Wake Island</option>
                                <option value="Wallis &amp Futana Is">Wallis &amp Futana Is</option>
                                <option value="Yemen">Yemen</option>
                                <option value="Zaire">Zaire</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </select>
                        </div>
                    </div>
                                        
                    <div className={this.shouldMarkError('addressLine1') ? "form-group has-error has-feedback" : "form-group"}>
                        <span className="mandatory-asterix"><label htmlFor="addressLine1">Address Line 1</label></span>
                        <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.addressLine1.fieldValidationError}</span>
                        <input
                            maxLength={30}
                            className={this.shouldMarkError('addressLine1') ? "form-control error" : "form-control"}
                            id="addressLine1" 
                            type="text" 
                            ref="addressLine1" 
                            placeholder="Address Line 1" 
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            value={controller.registrationNeedHelpInd.addressLine1}/>
                    </div>
                    
                    <div className={this.shouldMarkError('addressLine2') ? "form-group has-error has-feedback" : "form-group"}>
                        <span className="mandatory-asterix"><label htmlFor="addressLine2">Address Line 2</label></span>
                        <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.addressLine2.fieldValidationError}</span>
                        <input
                            maxLength={30}
                            className={this.shouldMarkError('addressLine2') ? "form-control error" : "form-control"}
                            id="addressLine2" 
                            type="text" 
                            ref="addressLine2" 
                            placeholder="Address Line 2" 
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            value={controller.registrationNeedHelpInd.addressLine2}/>
                    </div>
                    
                    <div className={this.shouldMarkError('citySuburb') ? "form-group has-error has-feedback" : "form-group"}>
                        <span className="mandatory-asterix"><label htmlFor="citySuburb">City/Suburb</label></span>
                        <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.citySuburb.fieldValidationError}</span>
                        <input
                            maxLength={30}
                            className={this.shouldMarkError('citySuburb') ? "form-control error" : "form-control"}
                            id="citySuburb" 
                            type="text" 
                            ref="citySuburb" 
                            placeholder="City/Suburb" 
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            value={controller.registrationNeedHelpInd.citySuburb}/>
                    </div>
                                        
                    <div className={this.shouldMarkError('state') ? "form-group has-error has-feedback" : "form-group"}>
                        <span className="mandatory-asterix"><label htmlFor="state">State/Province</label></span>
                        <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.state.fieldValidationError}</span>
                        <div>
                            <select className={this.shouldMarkError('state') ? "form-control error" : "form-control"} ref="state" id="state" onChange={this.handleChange} onBlur={this.handleBlur} value={controller.registrationNeedHelpInd.state}>
                                <option value=''>Please select an option..</option>
                                <option value="Victoria">VIC</option>
                                <option value="New South Wales">NSW</option>
                                <option value="Queensland">QLD</option>
                                <option value="Western Australia">WA</option>
                                <option value="South Australia">SA</option>
                                <option value="Australian Capital Territory">ACT</option>
                                <option value="Tasmania">TAS</option>
                                <option value="Northern Territory">NT</option>
                                <option value="Other">OTHER</option>
                            </select>
                        </div>                                
                    </div>
                    
                    <div className={this.shouldMarkError('postCode') ? "form-group has-error has-feedback" : "form-group"}>
                        <span className="mandatory-asterix"><label htmlFor="postCode">Zip/Postcode</label></span>
                        <span className='validationErrorMsg'>{this.props.controller.registerIndividualFormState.postCode.fieldValidationError}</span>
                        <input 
                            maxLength={4}                       
                            className={this.shouldMarkError('postCode') ? "form-control error" : "form-control"}
                            id="postCode"
                            type="text" 
                            ref="postCode" 
                            placeholder="PostCode/postCode" 
                            onKeyPress={(e) => this.handleKeyPress(e)}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            value={controller.registrationNeedHelpInd.postCode}/>
                    </div>  
                    
                    
                    </div>
                </div>

                <CreateNewNeedForIndividualsComponent controller={this.props.controller} onChanged={this.newNeedAdded} />
                
            </div>                   
        )
    }
}

@observer
export class RegisterOrganisationComponent extends React.Component<IRegistrationProps, {}>{
      
    constructor(props){
        super(props)     
    }

    newCauseAdded = (cause:IOrgNeedHelpWithListItem) => {
        this.props.controller.getWhatWeNeedForOrganisation()
    }

    handleChange = (event:any) => {
        switch(event.target.id)
        {
            case RegistrationFields.charityName: 
                this.props.controller.registrationNeedHelpOrg.charityName = event.target.value
                this.props.controller.registerOrganisationFormState.charityName.fieldValidationError = ''
                break
            case RegistrationFields.fullName:
                this.props.controller.registrationNeedHelpOrg.fullName = event.target.value
                this.props.controller.registerOrganisationFormState.fullName.fieldValidationError = ''
                break
            case RegistrationFields.phoneNo:
                this.props.controller.registrationNeedHelpOrg.phoneNo = event.target.value
                this.props.controller.registerOrganisationFormState.phoneNo.fieldValidationError = ''
                break
            case RegistrationFields.email:
                this.props.controller.registrationNeedHelpOrg.email = event.target.value
                this.props.controller.registerOrganisationFormState.email.fieldValidationError = ''
                break
            case RegistrationFields.websiteLink:
                this.props.controller.registrationNeedHelpOrg.websiteLink = event.target.value
                //this.props.controller.registerOrganisationFormState.websiteLink.fieldValidationError = ''
                break
            case RegistrationFields.whatWeDo:
                this.props.controller.registrationNeedHelpOrg.whatWeDo = event.target.value
                this.props.controller.registerOrganisationFormState.whatWeDo.fieldValidationError = ''
                break
        }
    }

    handleBlur = (event) => {
       switch(event.target.id)
        {
            case RegistrationFields.charityName: 
                this.props.controller.registerOrganisationFormState.charityName.touched = true
                break
            case RegistrationFields.fullName:
                this.props.controller.registerOrganisationFormState.fullName.touched = true
                break
            case RegistrationFields.phoneNo:
                this.props.controller.registerOrganisationFormState.phoneNo.touched = true
                break
            case RegistrationFields.email:
                this.props.controller.registerOrganisationFormState.email.touched = true
                break
            //case RegistrationFields.websiteLink:
            //    this.props.controller.registerOrganisationFormState.websiteLink.touched = true
            //    break
            case RegistrationFields.whatWeDo:
                this.props.controller.registerOrganisationFormState.whatWeDo.touched = true
                break
            case RegistrationFields.whatWeNeed:
                this.props.controller.registerOrganisationFormState.whatWeNeed.touched = true
                break
        }
    }

    shouldMarkError = (control:string) => {
        let hasError : boolean = false
        let shouldShow : boolean = false
        
        switch(control){
            case RegistrationFields.charityName: 
                hasError = this.props.controller.registerOrganisationFormState.charityName.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerOrganisationFormState.charityName.touched
                break
            case RegistrationFields.fullName:
                hasError = this.props.controller.registerOrganisationFormState.fullName.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerOrganisationFormState.fullName.touched
                break
            case RegistrationFields.phoneNo:
                hasError = this.props.controller.registerOrganisationFormState.phoneNo.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerOrganisationFormState.phoneNo.touched
                break
            case RegistrationFields.email:
                hasError = this.props.controller.registerOrganisationFormState.email.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerOrganisationFormState.email.touched
                break
            //case RegistrationFields.websiteLink:
            //    hasError = this.props.controller.registerOrganisationFormState.websiteLink.fieldValidationError.length > 0
            //    shouldShow = this.props.controller.registerOrganisationFormState.websiteLink.touched
            //    break
            case RegistrationFields.whatWeDo:
                hasError = this.props.controller.registerOrganisationFormState.whatWeDo.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerOrganisationFormState.whatWeDo.touched
                break
            case RegistrationFields.whatWeNeed:
                hasError = this.props.controller.registerOrganisationFormState.whatWeNeed.fieldValidationError.length > 0
                shouldShow = this.props.controller.registerOrganisationFormState.whatWeNeed.touched
                break            
        }

        return hasError ? shouldShow : false
    }

    needHelpWithListItemSelected = (e : any, id : string) => {
        e.preventDefault()

    }
    
    render(){

        const { controller } = this.props

        return (
            <div className={ controller.registrationType === 'Org' ? 'tab-pane fade in active' : 'tab-pane fade '} id="organisationTab">

                <span className='validationErrorMsg'>{controller.registerOrganisationFormState.validationError}</span>

                <div className={this.shouldMarkError('fullName') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="fullName">Your Name</label></span>
                    <span className='validationErrorMsg'>{controller.registerOrganisationFormState.phoneNo.fieldValidationError}</span>
                    <input
                        maxLength={30}
                        autoComplete="off"
                        className={this.shouldMarkError('fullName') ? "form-control error" : "form-control"}
                        id="fullName" 
                        type="text" 
                        ref="fullName" 
                        placeholder="Full Name"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpInd.fullName === '' ? controller.registrationNeedHelpOrg.fullName : controller.registrationNeedHelpInd.fullName}/>
                </div>
                
                
                <div className={this.shouldMarkError('phoneNo') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="phoneNo">Phone No</label></span>
                    <span className='validationErrorMsg'>{controller.registerOrganisationFormState.phoneNo.fieldValidationError}</span>
                    <Mask mask="(09)99 999 999" maskCharacter="_" onChange={this.handleChange}>
                        <input
                            autoComplete="off"
                            className={this.shouldMarkError('phoneNo') ? "form-control error" : "form-control"}
                            id="phoneNo" 
                            type="text" 
                            ref="phoneNo" 
                            placeholder="Phone no"
                            onBlur={this.handleBlur}
                            value={controller.registrationNeedHelpInd.phoneNo === '' ? controller.registrationNeedHelpOrg.phoneNo : controller.registrationNeedHelpInd.phoneNo}/>
                    </Mask>
                </div>
                
                
                <div className={this.shouldMarkError('email') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="email">Email</label></span>
                    <span className='validationErrorMsg'>{controller.registerOrganisationFormState.email.fieldValidationError}</span>
                    <input
                        maxLength={30}
                        autoComplete="off"
                        className={this.shouldMarkError('email') ? "form-control error" : "form-control"}
                        id="email" 
                        type="text" 
                        ref="email" 
                        placeholder="Email"
                        disabled={controller.isExistingRegistration}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpInd.email === '' ? controller.registrationNeedHelpOrg.email : controller.registrationNeedHelpInd.email}/>
                </div>
                

                <div className={this.shouldMarkError('charityName') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="charityName">Charity Name</label></span>
                    <span className='validationErrorMsg'>{controller.registerOrganisationFormState.charityName.fieldValidationError}</span>
                    <input
                        maxLength={30}
                        autoComplete="off"
                        className={this.shouldMarkError('charityName') ? "form-control error" : "form-control"}
                        id="charityName" 
                        type="text" 
                        ref="charityName" 
                        placeholder="Charity Name" 
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpOrg.charityName}/>
                </div>                
                
                
                <div className="form-group">
                    <label htmlFor="websiteLink">Website Link</label>
                    <input
                        maxLength={30}
                        autoComplete="off" 
                        className="form-control"
                        id="websiteLink" 
                        type="text" 
                        ref="websiteLink" 
                        placeholder="Website Link" 
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpOrg.websiteLink}/>                        
                </div>                

                <div className={this.shouldMarkError('whatWeDo') ? "form-group has-error has-feedback" : "form-group"}>
                    <span className="mandatory-asterix"><label htmlFor="whatWeDo">What we do</label></span>
                    <span className='validationErrorMsg'>{controller.registerOrganisationFormState.whatWeDo.fieldValidationError}</span>
                    <textarea
                        maxLength={300}
                        autoComplete="off" 
                        className={this.shouldMarkError('whatWeDo') ? "form-control error" : "form-control"}
                        ref="whatWeDo" 
                        rows={5} 
                        id="whatWeDo"
                        onChange={this.handleChange} 
                        onBlur={this.handleBlur}
                        value={controller.registrationNeedHelpOrg.whatWeDo}></textarea>
                </div>
                        

                <div className={this.shouldMarkError('whatWeDo') ? "form-group has-error has-feedback" : "form-group"}>
                    <label htmlFor="whatWeNeed">What we need</label>
                    <span className='validationErrorMsg'>{controller.registerOrganisationFormState.whatWeNeed.fieldValidationError}</span>   
                    <div>
                        <CreateNewNeedForOrgsComponent controller={this.props.controller}  onChanged={this.newCauseAdded}/>
                    </div>     
                </div>
                             
            </div>                          
        )
    }
}



