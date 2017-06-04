import * as React from 'react'
import { Card } from './card'
import { IRegistrationNeedHelpInd, DataFilter, RegistrationType } from '../../interfaces'
import { AdministrationController } from '../controller'
import { convertData } from '../../../utils/utils'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Loader from 'react-loaders'

interface INeedHelpIndividualRegistrations{
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
export class NeedHelpIndividualRegistrations extends React.Component<INeedHelpIndividualRegistrations,{}>{
    controller : AdministrationController
    @observable loaded : boolean
    @observable data : Array<IRegistrationNeedHelpInd>

    constructor(props){
        super(props)
        this.controller = new AdministrationController()
        this.data = []
        this.loaded = false
    }

    fetchData = () => {
        this.loaded = false
        this.controller.getRegistrationsForNeedHelpInd().then(response =>{
            this.data = convertData(response, this.dataFilterConfig())
            this.loaded = true
        }) 
    }

    componentWillReceiveProps(newProps : INeedHelpIndividualRegistrations){
        if(newProps.active){
            this.fetchData()
        }
     }

    componentWillMount(){
        this.fetchData()
    }

    renderCard = (registration : IRegistrationNeedHelpInd, index : number) => {
        return(
            <li key={index} className="col-sm-3">
                <Card
                    key={index} 
                    controller={this.controller}
                    registration={registration} 
                    onArchiveRegistration={this.props.onArchiveRegistration}
                    onEditRegistration={this.props.onEditRegistration}
                    onRegisterUser={this.props.onRegisterUser}
                    isArchived={this.props.showArchivedItemsOnly}
                    onDeleteRegistration={this.props.onDeleteRegistration}
                    onActivateRegistration={this.props.onActivateRegistration} />
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