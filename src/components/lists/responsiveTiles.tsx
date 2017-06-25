import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { BookJob } from '../jobs/modals/bookJob'
import { IRegistrationNeedHelpInd, IPosition, IIndividualNeedHelpWithListItem } from '../interfaces'
let ModalContainer = require('react-modal-dialog').ModalContainer
let ModalDialog = require('react-modal-dialog').ModalDialog

interface IResponsiveTiles{    
    data : Array<IRegistrationNeedHelpInd>
    navigateToMarker : () => void
}

@observer
export class ResponsiveTiles extends React.Component<IResponsiveTiles,{}>{
    @observable isShowingModal : boolean = false
    @observable registration : IRegistrationNeedHelpInd = null

    constructor(){
        super()
    }

    showDetails = (e, registration : IRegistrationNeedHelpInd) => {
        e.preventDefault()
        this.isShowingModal = true
        this.registration = registration     
    }

    navigateToMarker = (e, addressLocation:IPosition) => {
        e.preventDefault()
        this.props.navigateToMarker()
    }


    renderTile = (item : IRegistrationNeedHelpInd, index : number) => {
        return(
            <li key={index} className="col-sm-3">
                <div className="well well-sm need-card">
                    <div className="row">
                        <div className="col-sm-6">
                            <h4>{item.fullName}</h4>

                            <div className="btn-group btn-group-sm">
                                {/*
                                <button onClick={() => this.navigateToMarker(this, item.addressLocation)} className="btn btn-default btn-xs pull-right" role="button">
                                    <i className="glyphicon glyphicon-edit"></i>
                                </button> 
                                */}
                                <button onClick={(e) => this.showDetails(e, item)} className="btn btn-default btn-xs" role="button">Show Details</button>                     
                            </div>                        
                        </div>
                    </div>
                </div>
            </li>
        )
    }

    handleCloseModal = () => {
        this.isShowingModal = false
    }

    render(){
        return(
            <div>
                <section id="portfolio" className="bg-light-gray">
                    <div className="container">
                        <div className="row">
                            <ul>
                                { this.props.data.map((item : IRegistrationNeedHelpInd, index) => {
                                    return this.renderTile(item, index)
                                })}
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                            {
                                this.isShowingModal &&
                                <ModalContainer onClose={this.handleCloseModal} >
                                    <ModalDialog onClose={this.handleCloseModal}>
                                        <BookJob  closeModal={this.handleCloseModal} registration={this.registration} />
                                    </ModalDialog>
                                </ModalContainer>                            
                            }  
                            </div>
                        </div>
                    </div>
                </section>                               
            </div>
        )
    }
}