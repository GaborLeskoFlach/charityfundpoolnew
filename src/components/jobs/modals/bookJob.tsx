import * as React from 'react'
import { IIndividualNeedHelpWithListItem, DataFilter, IRegistrationNeedHelpInd } from '../../interfaces'
import { convertData } from '../../../utils/utils'

import '../styles.css'

interface IBookJob{
    closeModal : (e) => void
    registration : IRegistrationNeedHelpInd
}

export class BookJob extends React.Component<IBookJob,any>{

    handleBookJob = (e) => {
        e.preventDefault()
        //TODO - do stuff
        this.props.closeModal(e)
    }


    renderUserNeedHelpListItems = (needHelpWithList : Array<IIndividualNeedHelpWithListItem>) => {
        return (            
            <div className="form-group">                        
                <div className="panel table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Need help with</th>
                                <th className="text-center">Type of Work</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {
                                convertData(needHelpWithList,DataFilter.ActiveOnly).map((item, index) => {                                    
                                    return(
                                        <tr key={index} >
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

                    <div className="desc">Email: </div>
                    <div className="desc">Phone: </div>
                    <div className="desc">PostCode: </div>
                    <div className="desc">City/Suburb: </div>
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