import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { NotificationStatus, NotificationType, IJobActions} from '../../../interfaces'
import { Card } from './card'

interface INotificationCardDetails{
    detail1 : string
    detail2 : string
    detail3 : string
    detail4 : string
    detail5 : string
    status : NotificationStatus
    type : NotificationType
}

interface INotificationsDetails{
    active : boolean
    notificationStatus : NotificationStatus
    notificationType : NotificationType
    acceptJob : IJobActions
    deleteJob : IJobActions
    cancelJob : IJobActions       
}

@observer
export class NotificationDetails extends React.Component<INotificationsDetails,{}>{
    @observable loaded : boolean

    data : Array<INotificationCardDetails> = [
        {
            detail1 : 'Sent 11',
            detail2 : 'Approved 12',
            detail3 : 'detail 13',
            detail4 : 'detail 14',
            detail5 : 'detail 15',
            type : NotificationType.Sent,
            status : NotificationStatus.Approved
        },
        {
            detail1 : 'Sent 21',
            detail2 : 'Approved 22',
            detail3 : 'detail 23',
            detail4 : 'detail 24',
            detail5 : 'detail 25',
            type : NotificationType.Sent,
            status : NotificationStatus.Approved
        },
        {
            detail1 : 'Received 31',
            detail2 : 'Approved 32',
            detail3 : 'detail 33',
            detail4 : 'detail 34',
            detail5 : 'detail 35',
            type : NotificationType.Received,
            status : NotificationStatus.Approved
        },
        {
            detail1 : 'Received 41',
            detail2 : 'Pending 42',
            detail3 : 'detail 43',
            detail4 : 'detail 44',
            detail5 : 'detail 45',
            type : NotificationType.Received,
            status : NotificationStatus.Pending
        },
        {
            detail1 : 'Sent 51',
            detail2 : 'Pending 52',
            detail3 : 'detail 53',
            detail4 : 'detail 54',
            detail5 : 'detail 55',
            type : NotificationType.Sent,
            status : NotificationStatus.Pending
        },
        {
            detail1 : 'Sent 61',
            detail2 : 'Pending 62',
            detail3 : 'detail 63',
            detail4 : 'detail 64',
            detail5 : 'detail 65',
            type : NotificationType.Sent,
            status : NotificationStatus.Pending
        },
        {
            detail1 : 'Received 71',
            detail2 : 'Cancelled 72',
            detail3 : 'detail 73',
            detail4 : 'detail 74',
            detail5 : 'detail 75',
            type : NotificationType.Received,
            status : NotificationStatus.Cancelled
        },
        {
            detail1 : 'Received 81',
            detail2 : 'Cancelled 82',
            detail3 : 'detail 83',
            detail4 : 'detail 84',
            detail5 : 'detail 85',
            type : NotificationType.Received,
            status : NotificationStatus.Cancelled
        },
        {
            detail1 : 'Sent 91',
            detail2 : 'Cancelled 92',
            detail3 : 'detail 93',
            detail4 : 'detail 94',
            detail5 : 'detail 95',
            type : NotificationType.Sent,
            status : NotificationStatus.Cancelled
        },
        {
            detail1 : 'Received 01',
            detail2 : 'Cancelled 02',
            detail3 : 'detail 03',
            detail4 : 'detail 04',
            detail5 : 'detail 05',
            type : NotificationType.Received,
            status : NotificationStatus.Cancelled
        }                                                                        
    ]

    @observable filteredData : Array<INotificationCardDetails> = []

    constructor(props){
        super(props)
        this.loaded = false
    }

    componentWillReceiveProps(newProps : INotificationsDetails){
        if(newProps.active){
            this.loaded = false
            const { notificationStatus, notificationType } = newProps
            this.filteredData = this.data.filter(x => x.type === notificationType && x.status === notificationStatus)
            this.loaded = true
        }
    }

    componentWillMount = () => {
        this.loaded = false
        const { notificationStatus, notificationType } = this.props
        this.filteredData = this.data.filter(x => x.type === notificationType && x.status === notificationStatus)
        this.loaded = true
    }

    renderCard = (index, data : INotificationCardDetails) => {
        return(
            <li key={index} className="col-sm-3">
                <Card 
                    detail1={data.detail1}
                    detail2={data.detail2} 
                    detail3={data.detail3} 
                    detail4={data.detail4} 
                    detail5={data.detail5}
                    status={this.props.notificationStatus}
                    type={this.props.notificationType}
                    acceptJob={this.props.acceptJob}
                    cancelJob={this.props.cancelJob}
                    deleteJob={this.props.deleteJob}
                     />
            </li>
        )
    }

    render(){
        if(this.props.active && this.loaded){
            return(
                <ul className="fancy-label row">
                    {
                        this.filteredData.map((item, i) => {
                            return this.renderCard(i, item)
                        })
                    }              
                </ul>            
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