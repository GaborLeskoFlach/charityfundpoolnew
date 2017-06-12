import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Loader from 'react-loaders'
import { toast } from 'react-toastify'
import { IContactUs, DataFilter } from '../../interfaces'
import { ContactUsController } from '../controller'
import { convertData } from '../../../utils/utils'

import './styles.css'

const ToastrMsg = ({ message }) => <div>{message}</div>

interface IContactRequests {
    controller : ContactUsController
}

@observer
export class ContactRequestsComponent extends React.Component<IContactRequests,{}>{    
    @observable isLoading : boolean = false
    @observable contactUsRequests : Array<IContactUs>

    constructor(props){
        super(props)
    }

    componentWillMount(){
        this.isLoading = true
        this.props.controller.getContactUsRequests().then((response)=>{
            this.contactUsRequests = convertData<IContactUs>(response, DataFilter.ActiveOnly)
            this.isLoading = false
        })
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

    renderRequests = () => {
        return(
            this.contactUsRequests.map((item : IContactUs) => {
                return(
                    <tr data-status={item.subject}>
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
                    </tr>                    
                )
            })
        )
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
                                                <button type="button" className="btn btn-danger btn-filter" data-target="outstanding">Outstanding Items</button>
                                                <button type="button" className="btn btn-success btn-filter" data-target="processed">Processed Items</button>
                                            </div>
                                        </div>
                                        <div className="pull-right">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default btn-filter" data-target="general">General Enquiry</button>
                                                <button type="button" className="btn btn-primary btn-filter" data-target="suggestions">Suggestions</button>
                                                <button type="button" className="btn btn-info btn-filter" data-target="support">Support</button>

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
                </div>               

            )
        }
    }

}