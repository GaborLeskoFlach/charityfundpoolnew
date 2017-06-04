import * as React from 'react'
import { IRegistrationNeedHelpOrg, RegistrationType } from '../../interfaces'
import Loader from 'react-loaders'

interface ICard{
    registration : IRegistrationNeedHelpOrg
    onEditRegistration : (id : string, registrationType : RegistrationType ) => void
    onRegisterUser : (id : string, email : string, registrationType : RegistrationType, register : boolean) => void
    onArchiveRegistration : (id : string, registrationType : RegistrationType ) => void   
    onActivateRegistration : (id : string, registrationType : RegistrationType) => void
    onDeleteRegistration : (id : string, registrationType : RegistrationType) => void
    isArchived : boolean
}

export class Card extends React.Component<ICard, {}>{

    constructor(props) {
        super(props)
    }

    archiveRegistration = (e) => {
        e.preventDefault()
        this.props.onArchiveRegistration(this.props.registration.ID, RegistrationType.NeedHelpOrg)
    }

    editRegistration = (e) => {
        e.preventDefault()
        this.props.onEditRegistration(this.props.registration.ID,RegistrationType.NeedHelpOrg)
    }

    registerUser = (e) => {
        e.preventDefault()
        this.props.onRegisterUser(this.props.registration.ID,this.props.registration.email, RegistrationType.NeedHelpOrg, !this.props.registration.uid)
    }

    activateRegistration = (e) => {
        e.preventDefault()
        this.props.onActivateRegistration(this.props.registration.ID,RegistrationType.NeedHelpOrg)
    } 

    deleteRegistration = (e) => {
        e.preventDefault()
        this.props.onDeleteRegistration(this.props.registration.ID,RegistrationType.NeedHelpOrg)
    }

    renderRegisteredFlag = (val : string) => {
        let glyphiconColor : React.CSSProperties = null
        if(val && val !== 'null'){
            glyphiconColor = { color : 'green'}     
            return(                
                <span className="glyphicon glyphicon-ok" style={glyphiconColor}></span>
            ) 
        }else{
            glyphiconColor = { color : 'red'}
            return(
                <span className="glyphicon glyphicon-remove" style={glyphiconColor}></span>
            ) 
        }       
    }

    renderArchiveButton = () =>{
        return(
            <div className="btn-group" role="group" aria-label="...">
                <button className="btn btn-default" onClick={this.activateRegistration}>Activate</button>  
                <button className="btn btn-danger" onClick={this.deleteRegistration}>Erase</button>
            </div>          
        )
    }

    renderActionButtons = () => {
        const userAction : string = !this.props.registration.uid ? 'Enable' : 'Disable'
        return(
            <div className="btn-group" role="group" aria-label="...">
                <button className="btn btn-default" onClick={this.editRegistration}>Edit</button>                
                <button className="btn btn-default" onClick={this.registerUser}>{userAction}</button>
                <button className="btn btn-danger" onClick={this.archiveRegistration}>Remove</button>
            </div>   
        )
    }

    render() {

        const registration = this.props.registration

        return (
            <div className="well well-sm need-card">
                <div className="row">
                    <div className="col-sm-12">
                        <h4>{registration.charityName}</h4>
                        <p><div>Email:</div> {registration.email}</p>
                        <p><div>Phone:</div> {registration.phoneNo}</p>
                        <p><div>Full name:</div> {registration.fullName}</p>
                        <p><div>Website:</div> {registration.websiteLink}</p>

                        <p>Organisation registered: { this.renderRegisteredFlag(registration.uid) }</p>

                        {
                            this.props.isArchived ? 
                                this.renderArchiveButton()
                            :
                                this.renderActionButtons()
                        }


                    </div>
                </div>
            </div>
        )
    }
}