import * as React from 'react'
import { Card } from './card'
import { IRegistrationNeedHelpOrg, DataFilter, RegistrationType } from '../../interfaces'
import { AdministrationController } from '../controller'
import { convertData } from '../../../utils/utils'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Loader from 'react-loaders'

interface INeedHelpOrganisationRegistrations{
    filters : Array<any>
    active : boolean
    showArchivedItemsOnly : boolean
    onEditRegistration : (id : string, registrationType : RegistrationType ) => void
    onRegisterUser : (id : string, email : string, registrationType : RegistrationType, register : boolean) => void
    onArchiveRegistration : (id : string, registrationType : RegistrationType ) => void    
    onActivateRegistration : (id : string, registrationType : RegistrationType) => void
    onDeleteRegistration : (id : string, registrationType : RegistrationType) => void
}

@observer
export class NeedHelpOrganisationRegistrations extends React.Component<INeedHelpOrganisationRegistrations,{}>{
     data : Array<IRegistrationNeedHelpOrg>
     controller : AdministrationController
    @observable loaded : boolean

    constructor(props){
        super(props)
        this.controller = new AdministrationController()
        this.data = []
        this.loaded = false
    }

    fetchData = () => {
        this.loaded = false
        this.controller.getRegistrationsForNeedHelpOrg().then(response =>{
           this.data = convertData(response, this.dataFilterConfig())
            this.loaded = true
        })  
    }
    
    componentWillReceiveProps(newProps : INeedHelpOrganisationRegistrations){
        if(newProps.active){
            this.fetchData()
        }
     }

    componentWillMount(){
        this.fetchData()
    }          

    renderCard = (registration : IRegistrationNeedHelpOrg, index : number) => {
        return(
            <li key={index} className="col-sm-3">
                <Card 
                    registration={registration} 
                    onArchiveRegistration={this.props.onArchiveRegistration}
                    onEditRegistration={this.props.onEditRegistration}
                    onRegisterUser={this.props.onRegisterUser} 
                    onActivateRegistration={this.props.onActivateRegistration}
                    onDeleteRegistration={this.props.onDeleteRegistration}
                    isArchived={this.props.showArchivedItemsOnly} />
            </li>
        )
    }

    dataFilterConfig = () : DataFilter => {
        if(this.props.showArchivedItemsOnly){
            return DataFilter.InActiveOnly
        }else{
            return DataFilter.ActiveOnly
        }
    }

    render(){
        if(this.data.length > 0 && this.props.active && this.loaded){
            return(
                <ul className="fancy-label row">
                    {
                        this.data.map((registration, index) => {
                            return this.renderCard(registration, index)
                        })
                    }              
                </ul>            
            )
        } else if(this.data.length === 0 && this.props.active && this.loaded){
            return <h1>No data to display</h1>
        }else{
            return <Loader type="ball-pulse" active />
        }
    }
}