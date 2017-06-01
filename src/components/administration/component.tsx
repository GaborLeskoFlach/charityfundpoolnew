import * as React from 'react'
import './styles.css'
import {  RegistrationType } from '../interfaces'
import { AdministrationController } from './controller'

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import { NeedHelpIndividualRegistrations } from './NeedHelpIndividual/list'
import { NeedHelpOrganisationRegistrations } from './NeedHelpOrganization/list'
import { WantToHelpRegistrations } from './WantToHelp/list'
import { ArchivedRegistrations } from './ArchivedRegistrations/list'

import { ListFilterIndividualRegistrations } from './NeedHelpIndividual/listFilter'
import { ListFilterOrganisationRegistrations } from './NeedHelpOrganization/listFilter'
import { ListFilterWantToHelpRegistrations } from './WantToHelp/listFilter'

import { observer } from 'mobx-react'
import { observable } from 'mobx'

@observer
export class Administration extends React.Component<{},{}>{
    controller: AdministrationController
    @observable tabIndActive : boolean
    @observable tabOrgActive : boolean
    @observable tabWantActive : boolean
    @observable tabArchivedActive : boolean
    @observable selectedTab : string = '0'

    static contextTypes: React.ValidationMap<any> = {
        router: React.PropTypes.func.isRequired
    }

    constructor(props)
    {
        super(props)
        this.controller = new AdministrationController()

        this.tabIndActive = true
        this.tabOrgActive = false
        this.tabWantActive = false
        this.tabArchivedActive = false
    }

    /*
    handleTabChange = (e) => {

        switch(e.target.attributes[0].value)
        {
            case '#organizationsNeedHelp':
                this.tabIndActive = false
                this.tabOrgActive = true
                this.tabWantActive = false
                this.tabArchivedActive = false            
            break
            case '#peopleNeedHelp':
                this.tabIndActive = true
                this.tabOrgActive = false
                this.tabWantActive = false
                this.tabArchivedActive = false            
            break
            case '#peopleWantToHelp':
                this.tabIndActive = false
                this.tabOrgActive = false
                this.tabWantActive = true
                this.tabArchivedActive = false            
            break
            case '#archivedRegistrations':
                this.tabIndActive = false
                this.tabOrgActive = false
                this.tabWantActive = false
                this.tabArchivedActive = true            
            break
        }
    }*/

    
    ///
    /// DeActivating a User (should not be already registered) setting Active and ArchiveDate Flags
    ///
    handleArchiveRegistration = (id : string, regType:RegistrationType) => {
        if(window.confirm('Are you sure you want to Archive this item?')){
            switch(regType){
                case RegistrationType.NeedHelpInd:
                this.controller.archiveRegistration(regType, id)
                break
                case RegistrationType.NeedHelpOrg:
                this.controller.archiveRegistration(regType,id)
                break
                case RegistrationType.WantToHelp:
                this.controller.archiveRegistration(regType,id)
                break
            }
        }        
    }

    ///
    /// Activating a previously disabled Registration (setting Active and ArchivedDate flags)
    ///
    handleActivateRegistration = (id : string, regType:RegistrationType) => {
        switch(regType){
            case RegistrationType.NeedHelpInd:            
            this.controller.activateRegistration(regType, id)
            break
            case RegistrationType.NeedHelpOrg:
            this.controller.activateRegistration(regType, id)
            break
            case RegistrationType.WantToHelp:
            this.controller.activateRegistration(regType, id)
            break
        }               
    }

    /// 
    /// Register User first time (creating user profile)
    ///
    handleRegisterUser = (id : string, email:string, regType : RegistrationType, register : boolean) => {
        const registerMsg : string = 'Email verification will be sent to user. Are you sure you want to continue?'
        const unRegisterMsg : string = 'User will not be able to access the system. Are you sure you want to continue?'
        const message : string = register ? registerMsg : unRegisterMsg

        if(window.confirm(message)){
            switch(regType){
                case RegistrationType.NeedHelpInd:
                this.controller.registerUser(regType, id, email, register)
                break
                case RegistrationType.NeedHelpOrg:
                this.controller.registerUser(regType, id, email, register)
                break
                case RegistrationType.WantToHelp:
                this.controller.registerUser(regType, id, email, register)
                break
            }
        }   
    }

    ///
    /// Redirects to particular Registation page to edit details and Save
    ///
    handleEditRegistration = (id : string, regType : RegistrationType) => {
        switch(regType){
                case RegistrationType.NeedHelpInd:
                    this.context.router.history.push('/register/NeedHelp/Ind/' + id)
                    break
                case RegistrationType.NeedHelpOrg:
                    this.context.router.history.push('/register/NeedHelp/Org/' + id)
                    break
                case RegistrationType.WantToHelp:
                    this.context.router.history.push('/register/WantToHelp/' + id)
                    break
            }    
    }
    
    ///
    /// Handles Physical Delete operation
    ///
    handleDeleteRegistration = (id : string, regType : RegistrationType) => {
        if(window.confirm('Are you sure you want to delete this registration?')){
            switch(regType){
                    case RegistrationType.NeedHelpInd:
                        this.controller.deleteRegistration(regType, id)
                        break
                    case RegistrationType.NeedHelpOrg:
                        this.controller.deleteRegistration(regType, id)
                        break
                    case RegistrationType.WantToHelp:
                        this.controller.deleteRegistration(regType, id)
                        break
            }
        }
    }

    handleTabSelection = (e) => {
        switch(e.target.id)
        {
            case '0':
                this.tabIndActive = true
                this.tabOrgActive = false
                this.tabWantActive = false
                this.tabArchivedActive = false            
            break            
            case '1':
                this.tabIndActive = false
                this.tabOrgActive = true
                this.tabWantActive = false
                this.tabArchivedActive = false            
            break
            case '2':
                this.tabIndActive = false
                this.tabOrgActive = false
                this.tabWantActive = true
                this.tabArchivedActive = false            
            break
            case '3':
                this.tabIndActive = false
                this.tabOrgActive = false
                this.tabWantActive = false
                this.tabArchivedActive = true            
            break
        }
        this.selectedTab = e.target.id      
    }

    render(){
        return(
            <div className="container">
                <div className="section-title">
                    <h1>Administration</h1>
                </div>
                <div className="row">
                    <div id="donate-section">   
                        <div className="container">
                            <div className="donate-section padding">				
                                <div className="donate-tab text-center">
                                    <div id="donate">
                                        <ul className="tab-list list-inline" role="tablist" onClick={this.handleTabSelection} value={this.selectedTab} >
                                            <li className={ this.selectedTab === '0' ? 'active' : ''}><Link id="0" to="/administration/peopleNeedHelp" role="tab" data-toggle="tab">People who need help</Link></li>
                                            <li className={ this.selectedTab === '1' ? 'active' : ''}><Link id="1" to="/administration/organizationsNeedHelp" role="tab" data-toggle="tab">Organizations need help</Link></li>
                                            <li className={ this.selectedTab === '2' ? 'active' : ''}><Link id="2" to="/administration/peopleWantToHelp" role="tab" data-toggle="tab">People who want to help</Link></li>
                                            <li className={ this.selectedTab === '3' ? 'active' : ''}><Link id="3" to="/administration/archivedRegistrations" role="tab" data-toggle="tab">Archived Registrations</Link></li>                    
                                        </ul>                                            
                                       
                                        <fieldset className="tab-content">

                                            <ListFilterIndividualRegistrations />

                                            <Switch>
                                                <Route exact path="/administration/peopleNeedHelp" render={() => <IndividualRegistrationsTab 
                                                                                                                    selectedTab={this.selectedTab}  
                                                                                                                    tabIndActive={this.tabIndActive}
                                                                                                                    handleArchiveRegistration={this.handleArchiveRegistration}
                                                                                                                    handleEditRegistration={this.handleEditRegistration}
                                                                                                                    handleRegisterUser={this.handleRegisterUser}  />} />
                                                
                                                <Route exact path="/administration/organizationsNeedHelp" render={() => <OrganisationRegistrationsTab 
                                                                                                                            selectedTab={this.selectedTab} 
                                                                                                                            tabOrgActive={this.tabOrgActive} 
                                                                                                                            handleArchiveRegistration={this.handleArchiveRegistration}
                                                                                                                            handleEditRegistration={this.handleEditRegistration} 
                                                                                                                            handleRegisterUser={this.handleRegisterUser} />} />
                                                
                                                <Route exact path="/administration/peopleWantToHelp" render={() => <WantToHelpRegistrationsTab 
                                                                                                                        selectedTab={this.selectedTab} 
                                                                                                                        tabWantActive={this.tabWantActive} 
                                                                                                                        handleArchiveRegistration={this.handleArchiveRegistration}
                                                                                                                        handleEditRegistration={this.handleEditRegistration} 
                                                                                                                        handleRegisterUser={this.handleRegisterUser} />} />
                                                
                                                <Route exact path="/administration/archivedRegistrations" render={() => <ArchivedRegistrationsTab 
                                                                                                                            selectedTab={this.selectedTab} 
                                                                                                                            tabArchivedActive={this.tabArchivedActive}
                                                                                                                            handleDeleteRegistration={this.handleDeleteRegistration}
                                                                                                                            handleActivateRegistration={this.handleActivateRegistration} />} />
                                            </Switch>
                                                                               
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                   
            </div>                      
        )        
    }
}

const IndividualRegistrationsTab = ({selectedTab, tabIndActive, handleArchiveRegistration, handleEditRegistration, handleRegisterUser}) => {
    return(
        <div className={ selectedTab === '0' ? 'tab-pane fade in active' : 'tab-pane fade '} id="peopleNeedHelp">
            <NeedHelpIndividualRegistrations 
                filters={null}
                showArchivedItemsOnly={false}
                active={tabIndActive}
                onArchiveRegistration={handleArchiveRegistration}
                onEditRegistration={handleEditRegistration}
                onRegisterUser={handleRegisterUser} 
                onDeleteRegistration={() => {}}
                onActivateRegistration={() => {}} />
        </div>
    )
}

const OrganisationRegistrationsTab = ({selectedTab, tabOrgActive, handleArchiveRegistration, handleEditRegistration, handleRegisterUser}) => {
    return(
        <div className={ selectedTab === '1' ? 'tab-pane fade in active' : 'tab-pane fade '} id="organizationsNeedHelp">
            <NeedHelpOrganisationRegistrations 
                filters={null}
                showArchivedItemsOnly={false}
                active={tabOrgActive}
                onArchiveRegistration={handleArchiveRegistration}
                onEditRegistration={handleEditRegistration}
                onRegisterUser={handleRegisterUser}
                onDeleteRegistration={() => {}}
                onActivateRegistration={() => {}} />
        </div>
    )
}

const WantToHelpRegistrationsTab = ({selectedTab, tabWantActive, handleArchiveRegistration, handleEditRegistration, handleRegisterUser}) => {
    return(
        <div className={ selectedTab === '2' ? 'tab-pane fade in active' : 'tab-pane fade '} id="peopleWantToHelp">
            <WantToHelpRegistrations 
                filters={null}
                showArchivedItemsOnly={false}
                active={tabWantActive}
                onArchiveRegistration={handleArchiveRegistration}
                onEditRegistration={handleEditRegistration}
                onRegisterUser={handleRegisterUser}
                onDeleteRegistration={() => {}}
                onActivateRegistration={() => {}} />            
        </div>
    )
}

const ArchivedRegistrationsTab = ({selectedTab, tabArchivedActive, handleDeleteRegistration, handleActivateRegistration}) => {
    return(
        <div className={ selectedTab === '3' ? 'tab-pane fade in active' : 'tab-pane fade '} id="archivedRegistrations">
            <ArchivedRegistrations 
                filters={null} 
                active={tabArchivedActive}
                onDeleteRegistration={handleDeleteRegistration}
                onActivateRegistration={handleActivateRegistration} />
        </div> 
    )
}
