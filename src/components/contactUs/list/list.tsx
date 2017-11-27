import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Loader from 'react-loaders'
import { toast } from 'react-toastify'
import { IContactUs, DataFilter } from '../../interfaces'
import { ContactUsController } from '../controller'
import { convertFromObservable } from '../../../utils/utils'

//let ModalContainer = require('react-modal-dialog').ModalContainer
//let ModalDialog = require('react-modal-dialog').ModalDialog

import { CreateEmailResponse } from '../createEmail/createEmail'

import './styles.css'

enum ContactRequestFilter{
    Outstanding,
    Processed
}

enum ContactRequestTypeFilter {
    all,
    enquiry,
    suggestions,
    support    
}

const ToastrMsg = ({ message }) => <div>{message}</div>

interface IContactRequests {
    controller : ContactUsController
}

@observer
export class ContactRequestsComponent extends React.Component<IContactRequests,{}>{    
    @observable isLoading : boolean = false
    @observable contactUsRequests : Array<IContactUs>
    @observable filteredContactUsRequests : Array<IContactUs>
    @observable mainFilter : ContactRequestFilter
    @observable typeFilter : ContactRequestTypeFilter
    @observable isShowingModal : boolean = false
    @observable selectedContactRequest : IContactUs = null

    constructor(props){
        super(props)

        this.mainFilter = ContactRequestFilter.Outstanding
        this.typeFilter = ContactRequestTypeFilter.enquiry
    }

    fetchData = () => {
        this.isLoading = true
        this.props.controller.getContactUsRequests().then((response)=>{
            this.contactUsRequests = convertFromObservable<IContactUs>(response)
            if(this.contactUsRequests){
                this.filteredContactUsRequests = this.contactUsRequests.
                                            filter(x => x.outstanding === (this.mainFilter === ContactRequestFilter.Outstanding))
            }
            this.isLoading = false
        })        
    }

    componentWillMount(){
       this.fetchData()
    }

    getSubjectByType = (type : string) => {
        switch(type){
            case 'enquiry':
                return 'General Enquiry'
            case 'suggestions':
                return 'Suggestions'
            case 'support':
                return 'Support'
        }
    }

    handleCloseModal = () => {
        this.isShowingModal = false
        this.fetchData()
    }

    replyToContactRequest = (e,contactRequest : IContactUs) => {
        this.selectedContactRequest = contactRequest
        this.isShowingModal = true
    }

    showReply = (e, contactRequest : IContactUs) => {
        this.selectedContactRequest = contactRequest
        this.isShowingModal = true        
    }

    deleteContactRequest = (e, id : string) => {
        this.isLoading = true 
        this.props.controller.deleteContactUsRequest(id).then(() => {
            const index = this.filteredContactUsRequests.indexOf(this.filteredContactUsRequests.find(x => x.ID === id))
            this.filteredContactUsRequests.splice(index, 1)
            toast(<ToastrMsg message="Request has been successfully deleted!" />);
            this.isLoading = false
        })
    }  

    renderRequests = () => {
        return(
            this.filteredContactUsRequests.map((item : IContactUs, i) => {
                return(
                    <tr key={i} data-status={item.subject}>
                        <td>
                            <div className="ckbox">
                                <input type="checkbox" id="checkbox1" />
                                <label></label>
                            </div>
                        </td>
                        <td>
                        </td>
                        <td>
                            <div className="media">

                                <div className="media-body">
                                    <span className="media-meta pull-right">{item.date}</span>
                                    <h4 className="title">
                                        {item.name}
                                        <span className="pull-center">{item.email}</span>
                                        <span className="pull-right general">({this.getSubjectByType(item.subject)})</span>
                                    </h4>
                                    <p className="summary">{item.subject}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            {
                                !item.active && !item.outstanding ? 
                                    <button type="button" className="btn btn-success btn-filter" onClick={(e) => this.showReply(e,item)}>Show reply</button>
                                :
                                    <button type="button" className="btn btn-success btn-filter" onClick={(e) => this.replyToContactRequest(e,item)}>Reply</button>
                            }                            
                        </td>                           
                        <td>
                            <button type="button" className="btn btn-danger btn-filter" onClick={(e) => this.deleteContactRequest(e,item.ID)}>Delete</button>
                        </td>                     
                    </tr>                    
                )
            })
        )
    }

    filterItems = (filter : ContactRequestFilter) => {
        this.mainFilter = filter

        if(filter === ContactRequestFilter.Outstanding){
            this.filteredContactUsRequests = this.contactUsRequests.filter(x => x.outstanding === true && x.active === true)
        }else{
            this.filteredContactUsRequests = this.contactUsRequests.filter(x => x.outstanding === false && x.active === false)
        }

        
    }

    filterItemsByType = (filter : ContactRequestTypeFilter) => {
        this.typeFilter = filter
        if(filter === ContactRequestTypeFilter.all){
            this.filteredContactUsRequests = this.contactUsRequests.filter(x => x.outstanding === (this.mainFilter === ContactRequestFilter.Outstanding))            
        }else{     
            this.filteredContactUsRequests = this.contactUsRequests.filter(x => x.outstanding === (this.mainFilter === ContactRequestFilter.Outstanding) && x.subject === ContactRequestTypeFilter[filter])
        }
    }

    render(){

        if(this.isLoading){
            return <Loader type="ball-pulse" active />
        }else{
            return(
                <div className="container">
                    <div className="row">

                        <section className="content">
                            <h1>Contact Requests</h1>
                            <div className="col-sm-12">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <div className="pull-left">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-danger btn-filter" data-target="outstanding" onClick={() => this.filterItems(ContactRequestFilter.Outstanding)}>Outstanding Items</button>
                                                <button type="button" className="btn btn-success btn-filter" data-target="processed" onClick={() => this.filterItems(ContactRequestFilter.Processed)}>Processed Items</button>
                                            </div>
                                        </div>
                                        <div className="pull-right">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default btn-filter" data-target="general" onClick={() => this.filterItemsByType(ContactRequestTypeFilter.enquiry)}>General Enquiry</button>
                                                <button type="button" className="btn btn-primary btn-filter" data-target="suggestions" onClick={() => this.filterItemsByType(ContactRequestTypeFilter.suggestions)}>Suggestions</button>
                                                <button type="button" className="btn btn-info btn-filter" data-target="support" onClick={() => this.filterItemsByType(ContactRequestTypeFilter.support)}>Support</button>
                                                <button type="button" className="btn btn-warning btn-filter" data-target="general" onClick={() => this.filterItemsByType(ContactRequestTypeFilter.all)}>All</button>

                                            </div>
                                        </div>
                                        <div className="table-container">
                                            <table className="table table-filter">
                                                <tbody>

                                                    {
                                                        this.renderRequests()
                                                    }

                                                </tbody>
                                            </table>
                                        </div>                                            
                                    </div>
                                </div>                              
                            </div>
                        </section>                        
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            {
                                this.isShowingModal && this.selectedContactRequest && true
                                /*
                                <ModalContainer onClose={this.handleCloseModal}>
                                    <ModalDialog onClose={this.handleCloseModal}>
                                        <CreateEmailResponse contactRequest={this.selectedContactRequest} closeModal={this.handleCloseModal} controller={this.props.controller}/>
                                    </ModalDialog>
                                </ModalContainer>*/
                            }                                     
                        </div>
                    </div>                                     
                </div>                                 
            )
        }
    }

}