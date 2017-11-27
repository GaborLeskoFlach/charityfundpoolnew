import * as React from 'react'
import { IIndividualNeedHelpWithListItem, DataFilter, IRegistrationNeedHelpInd, IDateRange } from '../../interfaces'
import { convertData } from '../../../utils/utils'
import { toast } from 'react-toastify'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import SingleDate from '../../common/dateComponents/singleDate'
import DateRange from '../../common/dateComponents/dateRange'

import '../styles.css'

interface IBookJob{
    closeModal : (e) => void
    registration : IRegistrationNeedHelpInd
}

const ToastrMsg = ({ message }) => <div>{message}</div>

@observer
export class BookJob extends React.Component<IBookJob,any>{
    @observable needHelpWithListItem = null
    @observable shouldDisplayAvailability : boolean = false

    handleBookJob = (e) => {
        e.preventDefault()
        //TODO - do stuff
        toast(<ToastrMsg message="Job has been booked successfully!" />)
        this.props.closeModal(e)
    }

    needHelpWithListItemSelected = (e, id : string) => {
        e.preventDefault()
        if(this.props.registration.needHelpWithList){
            const selectedItem = convertData(this.props.registration.needHelpWithList,DataFilter.ActiveOnly).filter(x => x.ID === id)[0]
            if(selectedItem){
                this.needHelpWithListItem = {
                    ID : id,
                    active : selectedItem.active,
                    whatINeedHelpWith : selectedItem.whatINeedHelpWith,
                    whenINeedHelp : {
                        singleDate : selectedItem.whenINeedHelp.singleDate,
                        dateRange : selectedItem.whenINeedHelp.dateRange,
                        flexible : selectedItem.whenINeedHelp.flexible
                    },
                    typeOfWork : selectedItem.typeOfWork
                }                
            }
        }

        this.shouldDisplayAvailability = true    
    }

    renderUserNeedHelpListItems = (needHelpWithList : Array<IIndividualNeedHelpWithListItem>) => {
        return (            
            <div className="form-group">                        
                <div className="panel table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr >
                                <th className="text-center">Need help with</th>
                                <th className="text-center">Type of Work</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {
                                convertData(needHelpWithList,DataFilter.ActiveOnly).map((item, index) => {                                    
                                    return(
                                        <tr key={index} onClick={(e) => this.needHelpWithListItemSelected(e,item.ID)}>
                                            <td className="col-sm-1 col-md-1 text-center">{item.whatINeedHelpWith}</td>
                                            <td className="col-sm-1 col-md-1 text-center">{item.typeOfWork}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>                                     
            </div>
        )
    }

    convertDateRange = (dateRange : { from : string, to : string}) : IDateRange => {
        let value : IDateRange = {
            from : dateRange.from ? new Date(dateRange.from) : null,
            to : dateRange.to ? new Date(dateRange.to) : null
        }
        return value
    }

    handleDaySelection = (day : Date) => {
        this.needHelpWithListItem.whenINeedHelp.singleDate = { 
            day : day.toString(), 
            reoccurring : this.needHelpWithListItem.whenINeedHelp.singleDate.reoccurring 
        }
    }

    handleDateRangeSelection = (dateRange : IDateRange ) => {
        this.needHelpWithListItem.whenINeedHelp.dateRange = { 
            from : dateRange.from ? dateRange.from.toString() : '', 
            to : dateRange.to ? dateRange.to.toString() : '', 
            reoccurring : this.needHelpWithListItem.whenINeedHelp.dateRange.reoccurring 
        }
    }

    convertSingleDate = (day : string) : Date => {
        return new Date(day)
    }

    render(){
        return(
            <div className="profileCard hovercard bookJobModal">
                <div className="cardheader">
                </div>
                <div className="avatar">                        
                    {/* Display Profile photo? */}                                
                </div>                    
                <div className="cardinfo">
                    <div className="title">
                        <h4>{this.props.registration.fullName}</h4>
                    </div>

                    {
                        this.props.registration && 
                        this.props.registration.needHelpWithList &&                                 
                        this.renderUserNeedHelpListItems(this.props.registration.needHelpWithList)
                    }

                    <hr/>

                    {
                        this.shouldDisplayAvailability && this.needHelpWithListItem.whenINeedHelp &&

                        <div className="form-group">
                            <div className="our-details-tab text-center">                                
                                <div className="tab-section">
                                    <ul className="tab-list list-inline" role="tablist">
                                        <li className="active"><a href="#singleDate" role="tab" data-toggle="tab">Select a single date</a></li>
                                        <li><a href="#dateRange" role="tab" data-toggle="tab">Select a date range</a></li>
                                        <li><a href="#flexible" role="tab" data-toggle="tab">Flexible</a></li>
                                    </ul>

                                    <fieldset className="tab-content">
                                        <div className="tab-pane fade in active" id="singleDate">
                                            <SingleDate onDayClick={this.handleDaySelection} setSingleDate={this.convertSingleDate(this.needHelpWithListItem.whenINeedHelp.singleDate.day) }/>
                                            <label><input type="checkbox" id="singleDateReoccurring" checked={this.needHelpWithListItem.whenINeedHelp.singleDate.reoccurring}/> Reoccurring</label>
                                        </div>
                                        <div className="tab-pane fade " id="dateRange">								
                                            <DateRange onDateRangeClick={this.handleDateRangeSelection} setDateRange={this.convertDateRange(this.needHelpWithListItem.whenINeedHelp.dateRange) }/>
                                            <br />
                                            <label><input type="checkbox" id="dateRangeReoccurring" checked={this.needHelpWithListItem.whenINeedHelp.dateRange.reoccurring}  /> Reoccurring</label>
                                        </div>
                                        <div className="tab-pane fade" id="flexible">
                                            <label><input type="checkbox" id="flexibleDates" checked={this.needHelpWithListItem.whenINeedHelp.flexible} /> Flexible</label>
                                        </div>                        
                                    </fieldset>
                                </div>
                            </div>                                
                        </div>                        
                    }

                    
                </div>
                <div className="cardbottom">
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-success" onClick={this.handleBookJob} >Book Job</button>
                    </div>
                </div>                                                   
            </div>
        )
    }
}