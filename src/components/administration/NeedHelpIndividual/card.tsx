import * as React from 'react'
import { getMappingInfoForUser } from '../../firebaseAuth/component'
import { IRegistrationNeedHelpInd, RegistrationType, UserStatus, IUserMapping } from '../../interfaces'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { FirebaseFileUpload } from '../ImageUpload/component'
import { AdministrationController } from '../controller'
import Loader from 'react-loaders'
import '../styles.css'

//let ModalContainer = require('react-modal-dialog').ModalContainer
//let ModalDialog = require('react-modal-dialog').ModalDialog

interface ICard{
    controller : AdministrationController
    registration : IRegistrationNeedHelpInd
    onEditRegistration : (id : string, registrationType : RegistrationType ) => void
    onRegisterUser : (id : string, email : string, registrationType : RegistrationType, register : boolean) => void
    onArchiveRegistration : (id : string, registrationType : RegistrationType ) => void
    onActivateRegistration : (id : string, registrationType : RegistrationType) => void
    onDeleteRegistration : (id : string, registrationType : RegistrationType) => void
    isArchived : boolean
}

@observer
export class Card extends React.Component<ICard, {}>{
    @observable isShowingModal : boolean = false
    @observable uploadedPhotoURL : string
    @observable mappingInfo : IUserMapping
    @observable isLoading : boolean = false

    constructor(props) {
        super(props)
        this.mappingInfo = null
    }

    componentDidMount(){
        if(this.props.registration.uid){
            this.isLoading = true
            getMappingInfoForUser(this.props.registration.uid).then((response) => {
                this.mappingInfo = response
                this.isLoading = false
            })
        }
    }

    componentWillReceiveProps(nextProps : ICard){
        if(nextProps.registration.uid){
            this.isLoading = true
            getMappingInfoForUser(nextProps.registration.uid).then((response) => {
                this.mappingInfo = response
                this.isLoading = false
            })
        }
    }

    archiveRegistration = (e) => {
        e.preventDefault()
        this.props.onArchiveRegistration(this.props.registration.ID, RegistrationType.NeedHelpInd)
    }

    editRegistration = (e) => {
        e.preventDefault()
        this.props.onEditRegistration(this.props.registration.ID,RegistrationType.NeedHelpInd)
    }

    registerUser = (e) => {
        e.preventDefault()
        this.props.onRegisterUser(this.props.registration.ID,this.props.registration.email, RegistrationType.NeedHelpInd, !this.props.registration.uid)
    }

    activateRegistration = (e) => {
        e.preventDefault()
        this.props.onActivateRegistration(this.props.registration.ID,RegistrationType.NeedHelpInd)
    } 

    deleteRegistration = (e) => {
        e.preventDefault()
        this.props.onDeleteRegistration(this.props.registration.ID,RegistrationType.NeedHelpInd)
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

    isEmpty = (value) => {
        return (value === '' || value === null || value === undefined || value.length == 0)
    }

    renderActionButtons = () => {
        const userAction : string = !this.props.registration.uid ? 'Enable' : 'Disable'
        
        return(
            <div className="btn-group" role="group" aria-label="...">
                <button className="btn btn-default" onClick={this.editRegistration}>Edit</button>
                <button 
                    className="btn btn-default" 
                    onClick={this.registerUser}
                    disabled={this.isEmpty(this.props.registration.profileImageURL)}
                    title={this.isEmpty(this.props.registration.profileImageURL) ? 'Please upload a Profile Image first' : ''}> 
                    {userAction}
                </button>
                <button className="btn btn-danger" onClick={this.archiveRegistration}>Remove</button>
            </div>   
        )
    }

    handleClick = () => {
        this.isShowingModal = true
    }

    handleClose = () => {
        this.isShowingModal = false
    }

    handleFileUploaded = ( uploadedImageURL : string) => {
        this.uploadedPhotoURL = uploadedImageURL
        this.props.controller.setProfileImageForRegistration(RegistrationType.NeedHelpInd, this.props.registration.ID, uploadedImageURL).then(response => {            
            this.handleClose()
        })        
    }

    handleFileUploadFailed = (error : string) => {
        console.log('File Upload Failed => {0}', error)
        this.handleClose()
    }

    setUserStatusIndicator = () : string => {
        if(this.mappingInfo){
            if(this.props.registration.uid && this.mappingInfo.status === UserStatus.Enabled){
                return 'avatar-status-enabled'
            }else if(!this.props.registration.uid && this.mappingInfo.status === UserStatus.Disabled){
                return 'avatar-status-disabled'
            }else if(this.mappingInfo.status === UserStatus.Pending){
                return 'avatar-status-pending'
            }
        }else{
            return 'avatar-status-disabled'
        }
    }

    render() {
        const registration = this.props.registration 

        if(this.isLoading){
            return <Loader type="ball-pulse" active />
        }else{
            return (
                <div className="well well-sm">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="profileCard hovercard">
                                <div className="cardheader">
                                </div>
                                <div className="avatar">                        
                                    {
                                        registration.profileImageURL ?
                                            <img className={this.setUserStatusIndicator()} src={registration.profileImageURL} />
                                        :                                 
                                            <img className={this.setUserStatusIndicator()} src="/templates/images/profileImageBlank.jpg" />
                                    }                                
                                </div>
                                <div className="profile-upload">
                                    <a onClick={this.handleClick}>Upload Image</a>
                                </div>                     
                                <div className="cardinfo">
                                    <div className="title">
                                        <h4>{registration.fullName}</h4>
                                    </div>
                                    <div className="desc">Email: {registration.email}</div>
                                    <div className="desc">Phone: {registration.phoneNo}</div>
                                    <div className="desc">PostCode: {registration.postCode}</div>
                                    <div className="desc">City/Suburb: {registration.citySuburb}</div>
                                </div>
                                <div className="cardbottom">
                                    {
                                        this.props.isArchived ? 
                                            this.renderArchiveButton()
                                        :
                                            this.renderActionButtons()
                                    }
                                </div>
                                {
                                    this.isShowingModal && true
                                    /*
                                    <ModalContainer onClose={this.handleClose}>
                                        <ModalDialog onClose={this.handleClose}>
                                            <strong>Photo Upload</strong>
                                            <div>
                                                <FirebaseFileUpload 
                                                    onFileUploaded={this.handleFileUploaded} 
                                                    onFileUploadFailed={this.handleFileUploadFailed} 
                                                />
                                            </div>
                                        </ModalDialog>
                                    </ModalContainer>*/
                                }                            
                            </div>                       
                        </div>
                    </div>
                </div>
            )     
        }  
    }
}