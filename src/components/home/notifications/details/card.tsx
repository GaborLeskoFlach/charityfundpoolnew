import * as React from 'react'
import { NotificationStatus, NotificationType, IJobActions } from '../../../interfaces'

interface ICard{
    detail1 : string
    detail2 : string
    detail3 : string
    detail4 : string
    detail5 : string
    status : NotificationStatus
    type : NotificationType
    acceptJob : IJobActions
    deleteJob : IJobActions
    cancelJob : IJobActions       
}

export class Card extends React.Component<ICard, {}>{

    constructor(props) {
        super(props)
    }

    acceptJob = () => {
        this.props.acceptJob('123', NotificationStatus.Approved)
    }

    deleteJob = () => {
         this.props.deleteJob('123', NotificationStatus.Deleted)
    }

    cancelJob = () => { 
         this.props.cancelJob('123', NotificationStatus.Cancelled)
    }

    renderActionButtons = () => {
        let buttonsToRender : any
        const { status, type } = this.props

        switch(type){
            case NotificationType.Received:
                switch(status){
                    case NotificationStatus.Pending:
                        buttonsToRender = (
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-success" onClick={this.acceptJob} >Accept Job</button>
                                <button type="button" className="btn btn-warning" onClick={this.cancelJob}>Cancel Job</button>
                            </div>
                        )
                    break
                    case NotificationStatus.Approved:
                        buttonsToRender = (
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-warning" onClick={this.cancelJob}>Cancel Job</button>
                            </div>
                        )
                    break
                    case NotificationStatus.Cancelled:
                        buttonsToRender = (
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-success" onClick={this.acceptJob}>Accept Job</button>
                                <button type="button" className="btn btn-danger" onClick={this.deleteJob}>Delete Job</button>
                            </div>
                        )
                    break
                }
            break
            case NotificationType.Sent:
                switch(status){
                    case NotificationStatus.Pending:
                        buttonsToRender = (
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-warning" onClick={this.cancelJob}>Cancel Job</button>
                            </div> 
                        )
                    break
                    case NotificationStatus.Approved:
                        buttonsToRender = (
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-warning" onClick={this.cancelJob}>Cancel Job</button>
                            </div> 
                        )
                    break
                    case NotificationStatus.Cancelled:
                        buttonsToRender = (
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-danger" onClick={this.deleteJob}>Delete Job</button>
                            </div> 
                        )
                    break
                }
            break
        }

        return(
            buttonsToRender
        )
    }

    render() {

        const { detail1, detail2, detail3, detail4, detail5} = this.props 

        return (
            <div className="well well-sm">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="profileCard hovercard">
                            <div className="cardheader">
                            </div>
                            <div className="avatar">                        
                                {/* Display Profile photo? */}                                
                            </div>                    
                            <div className="cardinfo">
                                <div className="title">
                                    <h4>{detail1}</h4>
                                </div>
                                <div className="desc">Email: {detail2}</div>
                                <div className="desc">Phone: {detail3}</div>
                                <div className="desc">PostCode: {detail4}</div>
                                <div className="desc">City/Suburb: {detail5}</div>
                            </div>
                            <div className="cardbottom">
                                {
                                    this.renderActionButtons()
                                }
                            </div>                                                   
                        </div>                       
                    </div>
                </div>
            </div>
        )
    }
}