import * as React from 'react'
import './styles.css'
import { IOrgNeedHelpWithListItem, DataFilter } from '../interfaces'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { CauseController } from './controller'
import { NeedCard } from './needCard'
import { convertData } from '../../utils/utils'
import { observer } from 'mobx-react'
import { observable } from 'mobx' 

@observer
export class NeedList extends React.Component<{},{}>{
    controller: CauseController
    @observable selectedTab : string = '0'

    constructor(props : any)
    {
        super(props)
        this.controller = new CauseController()
    }

    componentWillMount() {
        this.controller.isLoading = true
        this.controller.getCauses().then(response => {
            this.controller.getArchivedCauses().then(response => {
                this.controller.isLoading = false
            })            
        })
    }

    handleTabSelection = (e) => {
        this.selectedTab = e.target.id
    }

    /*
    onClickArchiveNeed = (need : ICause) => {
        event.preventDefault()
        this.controller.archiveCause(need.ID).then(response => {
            console.log('Awesome')
        })
    }

    onClickEditNeed = (need : ICause) => {
        event.preventDefault()
        console.log('Edit Cause => {0}', need.ID)
    }

    onClickDonateNeed = (need : ICause) => {
        this.context.router.history.push('')
    }

    renderNeedCard = (need : ICause, index : number) => {
        return(
            <li key={index} className="col-sm-3">
                <NeedCard need={need} onClickArchive={this.onClickArchiveNeed} onClickDonate={this.onClickDonateNeed} onClickEdit={this.onClickEditNeed}/>
            </li>  
        )
    }
    */

    render(){
        return(
            <div className="container">
                <div className="section-title">
                    <h1>Needs</h1>
                </div>
                <div className="row">
                    <div id="donate-section">   
                        <div className="container">
                            <div className="donate-section padding">				
                                <div className="donate-tab text-center">
                                    <div id="donate">
                                        <ul className="tab-list list-inline" role="tablist"  onClick={this.handleTabSelection} value={this.selectedTab}>
                                            <li className={ this.selectedTab === '0' ? 'active' : ''}><Link id='0' to="/viewNeeds/activeNeeds" role="tab" data-toggle="tab">Currently active Needs</Link></li>
                                            <li className={ this.selectedTab === '1' ? 'active' : ''}><Link id='1' to="/viewNeeds/archivedNeeds" role="tab" data-toggle="tab">Archived Needs</Link></li>
                                        </ul>  
                                        <fieldset className="tab-content" >                            
                                            <Switch>
                                                <Route exact path="/viewNeeds/activeNeeds" render={() => <TabContent selectedTab={this.selectedTab} controller={this.controller} />} />
                                                <Route exact path="/viewNeeds/archivedNeeds" render={() => <TabContent selectedTab={this.selectedTab} controller={this.controller}/>} />
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

interface ITabContent{    
    controller : CauseController
    selectedTab : string
}

@observer
export class TabContent extends React.Component<ITabContent, {}>{
    
    constructor(props){
        super(props)
    }

    onClickArchiveNeed = (need : IOrgNeedHelpWithListItem, e : any) => {
        event.preventDefault()
        this.props.controller.archiveCause(need.ID).then(response => {
            console.log('Awesome')
        })                
    }

    onClickEditNeed = (need : IOrgNeedHelpWithListItem, e : any) => {
        event.preventDefault()
        console.log('EDIT NEED => {0}', need)
    }

    onClickDonateNeed = (need : IOrgNeedHelpWithListItem, e : any) => {
        event.preventDefault()
        this.context.router.history.push('/donate/' + need.ID)
    }

    renderNeedCard = (need : IOrgNeedHelpWithListItem, index : number) => {
        return(
            <li key={index} className="col-sm-3">
                <NeedCard 
                    need={need} 
                    onClickArchive={this.onClickArchiveNeed} 
                    onClickDonate={this.onClickDonateNeed} 
                    onClickEdit={this.onClickEditNeed} 
                />
            </li>  
        )
    }

    render(){

        const { controller, selectedTab } = this.props

        if(controller.isLoading){
            return null
        }else{
            return(
                    <fieldset className="tab-content">
                        <div className={ selectedTab === '0' ? 'tab-pane fade in active' : 'tab-pane fade '} id="activeNeeds">
                            <div className="well">
                                All sorts of filters we can put in here to filter Need Cards below
                            </div>
                            
                            <ul className="fancy-label row">
                                {
                                    convertData(controller.causes, DataFilter.ActiveOnly).map((need, index) => {
                                        return this.renderNeedCard(need, index)
                                    })
                                }                                                                      
                            </ul>
                        </div>
                        <div className={ selectedTab === '1' ? 'tab-pane fade in active' : 'tab-pane fade '} id="archivedNeeds">

                            <div className="well">
                                All sorts of filters we can put in here to filter Need Cards below
                            </div>                                            

                            <ul className="fancy-label row">
                                {
                                    convertData(controller.archivedCauses, DataFilter.InActiveOnly).map((need, index) => {
                                        return this.renderNeedCard(need, index)
                                    })
                                }                                                                      
                            </ul>                                                                                                                                                     

                        </div>
                    </fieldset>
                )
        }        
    }
}