import * as React from 'react'
import { RegistrationType } from '../../interfaces'
import { AdministrationController } from '../controller'
import { NeedHelpIndividualRegistrations } from '../NeedHelpIndividual/list'
import { NeedHelpOrganisationRegistrations } from '../NeedHelpOrganization/list'
import { WantToHelpRegistrations } from '../WantToHelp/list'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

interface IArchivedRegistrations{
    filters : Array<any>
    active : boolean
    onActivateRegistration : (id : string, registrationType : RegistrationType ) => void
    onDeleteRegistration : (id : string, registrationType : RegistrationType) => void
}

@observer
export class ArchivedRegistrations extends React.Component<IArchivedRegistrations,{}>{
    controller : AdministrationController
    @observable loaded : boolean
    @observable tabIndActive : boolean
    @observable tabOrgActive : boolean
    @observable tabWantActive : boolean 
    @observable selectedTab : string = '0'   

    constructor(props){
        super(props)
        this.controller = new AdministrationController()
        this.loaded = false
        this.tabIndActive = true
        this.tabOrgActive = false
        this.tabWantActive = false      
    }

    componentDidMount = () =>{
        this.loaded = false
        this.controller.getRegistrationsForNeedHelpInd().then(response =>{
            this.loaded = true
        })         
    }

    shouldComponentUpdate(nextProps : IArchivedRegistrations, nextState){
        if (nextProps.active){
            return true
        }else{
            return false
        }
    }
 
    handleTabSelection = (e) => {        
        switch(e.target.id)
        {
            case '0':
                this.tabIndActive = true
                this.tabOrgActive = false
                this.tabWantActive = false         
            break            
            case '1':
                this.tabIndActive = false
                this.tabOrgActive = true
                this.tabWantActive = false        
            break
            case '2':
                this.tabIndActive = false
                this.tabOrgActive = false
                this.tabWantActive = true         
            break
        }
        this.selectedTab = e.target.id 
    }

    render(){
        if(this.props.active && this.loaded){

            return(
                <div className="container">
                    <div className="row">
                        <div id="donate-section">   
                            <div className="container">
                                <div className="donate-section padding">				
                                    <div className="donate-tab text-center">
                                        <div id="donate">
                                            <ul className="tab-list list-inline" role="tablist" onClick={this.handleTabSelection} value={this.selectedTab}>
                                                <li className={ this.selectedTab === '0' ? 'active' : ''}><Link id="0" to="/administration/archivedRegistrations/peopleNeedHelp" role="tab" data-toggle="tab">People who need help</Link></li>
                                                <li className={ this.selectedTab === '1' ? 'active' : ''}><Link id="1" to="/administration/archivedRegistrations/organizationsNeedHelp" role="tab" data-toggle="tab">Organizations need help</Link></li>
                                                <li className={ this.selectedTab === '2' ? 'active' : ''}><Link id="2" to="/administration/archivedRegistrations/peopleWantToHelp" role="tab" data-toggle="tab">People who want to help</Link></li>
                                            </ul>
                                        
                                            <fieldset className="tab-content">
                                                <Switch>
                                                    <Route exact path="/administration/archivedRegistrations/peopleNeedHelp" render={() => <ArchivedIndividualRegistrationsTab
                                                                                                                                                selectedTab={this.selectedTab}
                                                                                                                                                tabIndActive={this.tabIndActive}
                                                                                                                                                onDeleteRegistration={this.props.onDeleteRegistration}
                                                                                                                                                onActivateRegistration={this.props.onActivateRegistration}/> } />

                                                    <Route exact path="/administration/archivedRegistrations/organizationsNeedHelp" render={() => <ArchivedOrganisationRegistrationsTab
                                                                                                                                                    selectedTab={this.selectedTab}
                                                                                                                                                    tabOrgActive={this.tabOrgActive}
                                                                                                                                                    onDeleteRegistration={this.props.onDeleteRegistration}
                                                                                                                                                    onActivateRegistration={this.props.onActivateRegistration} /> } />

                                                    <Route exact path="/administration/archivedRegistrations/peopleWantToHelp" render={() => <ArchivedWantToHelpRegistrationsTab
                                                                                                                                                selectedTab={this.selectedTab}
                                                                                                                                                tabWantActive={this.tabWantActive} 
                                                                                                                                                onDeleteRegistration={this.props.onDeleteRegistration}
                                                                                                                                                onActivateRegistration={this.props.onActivateRegistration} /> } />

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


        }else{
            return (
                <div className="container">
                    <div className="section-title">
                        <h1>Loading...</h1>
                    </div>
                </div>
            )
        }
    }
}

const ArchivedIndividualRegistrationsTab = ({selectedTab, tabIndActive, onDeleteRegistration, onActivateRegistration}) => {
    return(
        <div className={ selectedTab === '0' ? 'tab-pane fade in active' : 'tab-pane fade '} id="peopleNeedHelpArchived">            
            <NeedHelpIndividualRegistrations 
                filters={null}
                showArchivedItemsOnly={true} 
                active={tabIndActive}
                onArchiveRegistration={() => {}}
                onEditRegistration={() => {}}
                onRegisterUser={() => {}}
                onDeleteRegistration={onDeleteRegistration}
                onActivateRegistration={onActivateRegistration} />
            
        </div>
    )
}

const ArchivedOrganisationRegistrationsTab = ({selectedTab, tabOrgActive, onDeleteRegistration, onActivateRegistration}) => {
    return(
        <div className={ selectedTab === '1' ? 'tab-pane fade in active' : 'tab-pane fade '} id="organizationsNeedHelpArchived">            
            <NeedHelpOrganisationRegistrations 
                filters={null}
                showArchivedItemsOnly={true}
                active={tabOrgActive}
                onArchiveRegistration={() => {}}
                onEditRegistration={() => {}}
                onRegisterUser={() => {}}
                onDeleteRegistration={onDeleteRegistration}
                onActivateRegistration={onActivateRegistration} />                                                 
            
        </div>
    )
}

const ArchivedWantToHelpRegistrationsTab = ({selectedTab, tabWantActive, onDeleteRegistration, onActivateRegistration}) => {
    return(
        <div className={ selectedTab === '2' ? 'tab-pane fade in active' : 'tab-pane fade '} id="peopleWantToHelpArchived">                                                                                                          
            <WantToHelpRegistrations 
                filters={null}
                showArchivedItemsOnly={true}
                active={tabWantActive}
                onArchiveRegistration={() => {}}
                onEditRegistration={() => {}}
                onRegisterUser={() => {}}
                onDeleteRegistration={onDeleteRegistration}
                onActivateRegistration={onActivateRegistration} />
            
        </div>
    )
}