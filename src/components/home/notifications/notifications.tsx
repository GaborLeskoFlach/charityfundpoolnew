import * as React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { NotificationStatus, IJobActions } from '../../interfaces'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { NotificationsReceived } from './received/notifications'
import { NotificationsSent } from './sent/notifications'

@observer
export class Notifications extends React.Component<{},{}>{

    @observable tabSentNotificationsActive : boolean
    @observable tabReceivedNotificationsActive : boolean
    @observable selectedTab : string = '0'

    static contextTypes: React.ValidationMap<any> = {
        router: React.PropTypes.func.isRequired
    }

    constructor(props)
    {
        super(props)

        this.tabSentNotificationsActive = false
        this.tabReceivedNotificationsActive = true
    }

    cancelJob = (id : string, toStatus:NotificationStatus) => {
        //TODO Cancel a job
        console.log('Job has been CANCELLED => ', id, NotificationStatus[toStatus])
    }

    acceptJob = (id : string, toStatus:NotificationStatus) => {
        //TODO Accept a Job
        console.log('Job has been ACCEPTED => ', id, NotificationStatus[toStatus])
    }

    deleteJob = (id : string, toStatus:NotificationStatus) => {
        //TODO Delete a Job (physically)
        console.log('Job has been DELETED => ', id, NotificationStatus[toStatus])
    }

    componentWillMount(){
        const path : string = this.context.router.route.location.pathname        
        if(path){            
            const paths : Array<string> = path.split('/')
            switch(paths[2]){
                case 'received':
                    this.selectedTab = '0'
                    this.tabSentNotificationsActive = false
                    this.tabReceivedNotificationsActive = true                  
                    switch(paths[3]){
                        case 'approved':                         
                            this.context.router.history.push('/notifications/received/approved')
                            break
                        case 'pending':
                            this.context.router.history.push('/notifications/received/pending')
                            break                    
                        case 'cancelled':
                            this.context.router.history.push('/notifications/received/cancelled')
                            break
                    }                
                    break
                case 'sent':
                    this.selectedTab = '1'
                    this.tabSentNotificationsActive = true
                    this.tabReceivedNotificationsActive = false
                    switch(paths[3]){
                        case 'approved':
                            this.context.router.history.push('/notifications/sent/approved')
                            break
                        case 'pending':
                            this.context.router.history.push('/notifications/sent/pending')
                            break                    
                        case 'cancelled':
                            this.context.router.history.push('/notifications/sent/cancelled')
                            break
                    }                
                    break
            }
        }
    }

    handleTabSelection = (e) => {
        switch(e.target.id)
        {
            case '0':
                this.tabSentNotificationsActive = false
                this.tabReceivedNotificationsActive = true          
            break             
            case '1':
                this.tabSentNotificationsActive = true
                this.tabReceivedNotificationsActive = false       
            break                      
        }
        this.selectedTab = e.target.id
        this.forceUpdate()  
    }

    render(){
        return(
            <div className="container">
                <div className="section-title">
                    <h1>Notifications</h1>
                </div>
                <div className="row">
                    <div id="donate-section">   
                        <div className="container">
                            <div className="donate-section padding">				
                                <div className="donate-tab text-center">
                                    <div id="donate">
                                        <ul className="tab-list list-inline" role="tablist" onClick={this.handleTabSelection} value={this.selectedTab} >
                                            <li className={ this.selectedTab === '0' ? 'active' : ''}><Link id="0" to="/notifications/received" role="tab" data-toggle="tab">Received</Link></li>
                                            <li className={ this.selectedTab === '1' ? 'active' : ''}><Link id="1" to="/notifications/sent" role="tab" data-toggle="tab">Sent</Link></li>
                                        </ul>                                            
                                       
                                        <fieldset className="tab-content">
                                            <Switch>
                                                <Route exact path="/notifications/sent" render={() => <SentNotificationsTab 
                                                                                                        selectedTab={this.selectedTab} 
                                                                                                        tabSentNotificationsActive={this.tabSentNotificationsActive}
                                                                                                        notificationStatus={NotificationStatus.Pending}
                                                                                                        acceptJob={this.acceptJob}
                                                                                                        deleteJob={this.deleteJob}
                                                                                                        cancelJob={this.cancelJob}
                                                                                                        />
                                                                                                } />
                                                <Route exact path="/notifications/received" render={() => <ReceivedNotificationsTab 
                                                                                                            selectedTab={this.selectedTab} 
                                                                                                            tabReceivedNotificationsActive={this.tabReceivedNotificationsActive}
                                                                                                            notificationStatus={NotificationStatus.Pending}
                                                                                                            acceptJob={this.acceptJob}
                                                                                                            deleteJob={this.deleteJob}
                                                                                                            cancelJob={this.cancelJob}                                                                                                            
                                                                                                            />
                                                                                                    } />
                                                <Route exact path="/notifications/sent/approved" render={() => <SentNotificationsTab 
                                                                                                        selectedTab={this.selectedTab} 
                                                                                                        tabSentNotificationsActive={this.tabSentNotificationsActive}
                                                                                                        notificationStatus={NotificationStatus.Approved}
                                                                                                        acceptJob={this.acceptJob}
                                                                                                        deleteJob={this.deleteJob}
                                                                                                        cancelJob={this.cancelJob}                                                                                                        
                                                                                                        />
                                                                                                } />
                                                <Route exact path="/notifications/sent/pending" render={() => <SentNotificationsTab 
                                                                                                        selectedTab={this.selectedTab} 
                                                                                                        tabSentNotificationsActive={this.tabSentNotificationsActive}
                                                                                                        notificationStatus={NotificationStatus.Pending}
                                                                                                        acceptJob={this.acceptJob}
                                                                                                        deleteJob={this.deleteJob}
                                                                                                        cancelJob={this.cancelJob}                                                                                                        
                                                                                                        />
                                                                                                } />
                                                <Route exact path="/notifications/sent/cancelled" render={() => <SentNotificationsTab 
                                                                                                        selectedTab={this.selectedTab} 
                                                                                                        tabSentNotificationsActive={this.tabSentNotificationsActive}
                                                                                                        notificationStatus={NotificationStatus.Cancelled}
                                                                                                        acceptJob={this.acceptJob}
                                                                                                        deleteJob={this.deleteJob}
                                                                                                        cancelJob={this.cancelJob}                                                                                                        
                                                                                                        />
                                                                                                } />

                                                <Route exact path="/notifications/received/approved" render={() => <ReceivedNotificationsTab 
                                                                                                            selectedTab={this.selectedTab} 
                                                                                                            tabReceivedNotificationsActive={this.tabReceivedNotificationsActive}
                                                                                                            notificationStatus={NotificationStatus.Approved}
                                                                                                            acceptJob={this.acceptJob}
                                                                                                            deleteJob={this.deleteJob}
                                                                                                            cancelJob={this.cancelJob}                                                                                                            
                                                                                                            />
                                                                                                    } />
                                                <Route exact path="/notifications/received/pending" render={() => <ReceivedNotificationsTab 
                                                                                                            selectedTab={this.selectedTab} 
                                                                                                            tabReceivedNotificationsActive={this.tabReceivedNotificationsActive}
                                                                                                            notificationStatus={NotificationStatus.Pending}
                                                                                                            acceptJob={this.acceptJob}
                                                                                                            deleteJob={this.deleteJob}
                                                                                                            cancelJob={this.cancelJob}                                                                                                            
                                                                                                            />
                                                                                                    } />
                                                <Route exact path="/notifications/received/cancelled" render={() => <ReceivedNotificationsTab 
                                                                                                            selectedTab={this.selectedTab} 
                                                                                                            tabReceivedNotificationsActive={this.tabReceivedNotificationsActive}
                                                                                                            notificationStatus={NotificationStatus.Cancelled}
                                                                                                            acceptJob={this.acceptJob}
                                                                                                            deleteJob={this.deleteJob}
                                                                                                            cancelJob={this.cancelJob}                                                                                                            
                                                                                                            />
                                                                                                    } />                  
                                                                    
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

const ReceivedNotificationsTab = ({selectedTab, tabReceivedNotificationsActive, notificationStatus, acceptJob, cancelJob, deleteJob}) => {
    return(
        <div className={ selectedTab === '0' ? 'tab-pane fade in active' : 'tab-pane fade '} id="0">
            <NotificationsReceived active={tabReceivedNotificationsActive} status={notificationStatus} acceptJob={acceptJob} cancelJob={cancelJob} deleteJob={deleteJob}/>
        </div>
    )
}

const SentNotificationsTab = ({selectedTab, tabSentNotificationsActive, notificationStatus, acceptJob, cancelJob, deleteJob}) => {
    return(
        <div className={ selectedTab === '1' ? 'tab-pane fade in active' : 'tab-pane fade '} id="1">
            <NotificationsSent active={tabSentNotificationsActive} status={notificationStatus} acceptJob={acceptJob} cancelJob={cancelJob} deleteJob={deleteJob}/>
        </div>
    )
}
