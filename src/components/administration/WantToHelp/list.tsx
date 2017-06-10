import * as React from 'react'
import { Card } from './card'
import { IRegistrationWantToHelp, DataFilter, RegistrationType } from '../../interfaces'
import { AdministrationController } from '../controller'
import { convertData } from '../../../utils/utils'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Loader from 'react-loaders'


interface IWantToHelpRegistrations{
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
export class WantToHelpRegistrations extends React.Component<IWantToHelpRegistrations,{}>{
    controller : AdministrationController
    data : Array<IRegistrationWantToHelp>
    @observable loaded : boolean

    constructor(props){
        super(props)
        this.controller = new AdministrationController()
        this.data = []
        this.loaded = false
    }

    fetchData = () => {
        this.loaded = false
        this.controller.getRegistrationsForWantToHelp().then((response) => {
            this.data = convertData(response, this.dataFilterConfig())
            this.loaded = true
        })         
    }

    componentWillReceiveProps(newProps : IWantToHelpRegistrations){
        if(newProps.active){
            this.fetchData()           
        }
     }

    componentWillMount(){
        this.fetchData()        
    }     

    onEditRegistration = (id : string, registrationType : RegistrationType ) => {
        this.props.onEditRegistration(id, registrationType)
    }

    onRegisterUser = (id : string, email : string, registrationType : RegistrationType, register : boolean) => {
        this.props.onRegisterUser(id, email, registrationType, register)
    }

    onArchiveRegistration = (id : string, registrationType : RegistrationType ) => {
        this.props.onArchiveRegistration(id, registrationType)
    }

    onActivateRegistration = (id : string, registrationType : RegistrationType) => {
        this.props.onActivateRegistration(id,registrationType)
    }

    onDeleteRegistration = (id : string, registrationType : RegistrationType) => {
        this.props.onDeleteRegistration(id,registrationType)
    }

    renderCard = (registration : IRegistrationWantToHelp, index : number) => {
        return(
            <li key={index} className="col-sm-3">
                <Card 
                    controller={this.controller}
                    registration={registration} 
                    onArchiveRegistration={this.onArchiveRegistration}
                    onEditRegistration={this.onEditRegistration}                    
                    onRegisterUser={this.onRegisterUser}
                    onActivateRegistration={this.onActivateRegistration}
                    onDeleteRegistration={this.onDeleteRegistration}
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
        }else if(this.data.length === 0 && this.props.active && this.loaded){
            return(
                <h1>No data to display</h1>
            )
        }else{
            return <Loader type="ball-pulse" active />
        }
    }
}