import * as React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { DashboardController } from './controller'
import { _firebaseAuth, _firebaseApp } from '../../firebaseAuth/component'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Loader from 'react-loaders'

import './styles.css'

@observer
export class Dashboard extends React.Component<{}, {}>{
    controller: DashboardController
    @observable selectedTab : string = '0'
    
    static contextTypes: React.ValidationMap<any> = {
        router: React.PropTypes.func.isRequired
    }

    constructor() {
        super()
        this.controller = new DashboardController()
    }

    componentWillMount(){
        this.controller.isLoading = true
        _firebaseApp.auth().onAuthStateChanged((user) => {
            if (_firebaseAuth.currentUser !== null) {                
                this.controller.getUserRegistrationLocationByUID(_firebaseAuth.currentUser.uid).then((response) => {
                    this.controller.isLoading = false
                    this.forceUpdate()
                })
            }
        })
    }

    renderRegistrationLinks = (): any => {
        if (this.controller.userRegistrations.length > 0) {
            return (
                this.controller.userRegistrations.map((item, i) => {
                    return <Link key={i} to={item.redirectLink} className="list-group-item">{item.displayText}</Link>
                })
            )
        } else {
            return <a className="list-group-item">Currently no registration</a>
        }
    }

    handleTabSelection = (e) => {
        this.selectedTab = e.target.id
        this.forceUpdate()
    }

    renderDashboardRoutes = ({registrations}) => {        
        return(
            <Switch>
                <Route exact path="/home/registrations" render={() => <MyRegistrations selectedTab={this.selectedTab} registrations={registrations} />} />
                <Route exact path="/home/notificationsReceived" render={() => <MyNotificationsReceived selectedTab={this.selectedTab} />} />
                <Route exact path="/home/notificationsSent" render={() => <MyNotificationsSent selectedTab={this.selectedTab} />} />
            </Switch>            
        )    
    }

    render() {

        const registrations = this.renderRegistrationLinks()

        if (!_firebaseAuth.currentUser || !this.controller.userRegistrations) {
            return null
        } else if (this.controller.isLoading) {
            return(
                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-6"><Loader type="ball-pulse" active /></div>
                    <div className="col-sm-3"></div>
                </div>
            )
        } else {

            const innerStyle : React.CSSProperties = {
                marginBottom : 0
            }

            return (
                <div className="row">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                        <div className="donate-tab text-center">
                            <div id="donate">
                                <ul className="tab-list list-inline" role="tablist"  onClick={this.handleTabSelection} value={this.selectedTab}>
                                    <li className={ this.selectedTab === '0' ? 'active' : ''}><Link id='0' to="/home/registrations" role="tab" data-toggle="tab">Registrations</Link></li>
                                    <li title='Notifications Received' className={ this.selectedTab === '1' ? 'active' : ''}><Link id='1' to="/home/notificationsReceived" role="tab" data-toggle="tab"><i className="glyphicon glyphicon-log-in" /> Notifications (Received)</Link></li>
                                    <li title='Notifications Sent' className={ this.selectedTab === '2' ? 'active' : ''}><Link id='2' to="/home/notificationsSent" role="tab" data-toggle="tab"><i className="glyphicon glyphicon-log-out" /> Notifications (Sent)</Link></li>
                                </ul>  
                                <fieldset className="tab-content" style={innerStyle}>
                                    {
                                        this.renderDashboardRoutes({registrations})
                                    }
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2" />
                </div>
            )
        }
    } 
}

const MyRegistrations = ({selectedTab, registrations}) => {

    return(
        <div className={ selectedTab === '0' ? 'tab-pane fade in active' : 'tab-pane fade '} id="registrations">
            <div className="list-group">
                <div className="list-group-item active">
                    You are currently registered as someone who:
                </div>
                {registrations}
            </div>
        </div>
    )
}

const MyNotificationsReceived = ({selectedTab}) => {

    return(
        <div className={ selectedTab === '1' ? 'tab-pane fade in active' : 'tab-pane fade '} id="notifications">
            <div className="list-group-custom">
                <Link to="/notifications/received/approved" className="list-group-item"><span className="badge">0</span><i className="glyphicon glyphicon-ok" /> Job Requests approved </Link>
                <Link to="/notifications/received/pending" className="list-group-item"><span className="badge">0</span><i className="glyphicon glyphicon-hourglass" /> Job Requests pending </Link>
                <Link to="/notifications/received/cancelled" className="list-group-item"><span className="badge">0</span><i className="glyphicon glyphicon-remove" /> Job Requests cancelled </Link>
            </div>                                                                  
        </div>
    )
}

const MyNotificationsSent = ({selectedTab}) => {

    return(
        <div className={ selectedTab === '2' ? 'tab-pane fade in active' : 'tab-pane fade '} id="notifications">
            <div className="list-group-custom">
                <Link to="/notifications/sent/approved" className="list-group-item"><span className="badge">0</span><i className="glyphicon glyphicon-ok" /> Job Requests approved </Link>
                <Link to="/notifications/sent/pending" className="list-group-item"><span className="badge">0</span><i className="glyphicon glyphicon-hourglass" /> Job Requests pending </Link>
                <Link to="/notifications/sent/cancelled" className="list-group-item"><span className="badge">0</span><i className="glyphicon glyphicon-remove" /> Job Requests cancelled </Link>
            </div>                                                                  
        </div>
    )
}