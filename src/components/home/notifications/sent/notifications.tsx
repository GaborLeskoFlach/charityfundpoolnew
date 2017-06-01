import * as React from 'react'

import './styles.css'

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import { NotificationDetails } from '../details/list'
import { NotificationStatus, NotificationType, IJobActions } from '../../../interfaces'

interface INotificationsSent{
    active : boolean
    status? : NotificationStatus
    acceptJob : IJobActions
    deleteJob : IJobActions
    cancelJob : IJobActions
}

@observer
export class NotificationsSent extends React.Component<INotificationsSent,{}>{
    @observable selectedTab : number = 0
    @observable loaded : boolean = true

    constructor(props){
        super(props)
    }

    handleTabSelection = (e) => {
        e.preventDefault()
        this.selectedTab = parseInt(e.target.id)
        this.forceUpdate()
    }

    componentWillMount = () => {
        this.selectedTab = this.props.status
    }    

    render(){
        if(this.props.active && this.loaded){

            return(
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="btn-group" data-toggle="buttons">			
                                <div className="donate-section padding">				
                                    <div className="donate-tab text-center">
                                        <div id="donate">
                                            <ul className="tab-list list-inline" role="tablist" onClick={this.handleTabSelection} value={this.selectedTab} >
                                                <li className={ this.selectedTab === 0 ? 'active' : ''}><a href="" id="0" role="tab" data-toggle="tab">Pending</a></li>
                                                <li className={ this.selectedTab === 1 ? 'active' : ''}><a href="" id="1"  role="tab" data-toggle="tab">Approved</a></li>                                                
                                                <li className={ this.selectedTab === 2 ? 'active' : ''}><a href="" id="2" role="tab" data-toggle="tab">Cancelled</a></li>                                                    
                                            </ul>
                                        </div>
                                    </div>
                                </div>  		
                            </div>                            
                        </div>
                    </div>                    
                    <div className="row">
                        <div className="col-sm-12">
                            <NotificationDetails 
                                active={true} 
                                notificationStatus={this.selectedTab} 
                                notificationType={NotificationType.Sent}
                                acceptJob={this.props.acceptJob}
                                deleteJob={this.props.deleteJob}
                                cancelJob={this.props.cancelJob}                                
                            />
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

