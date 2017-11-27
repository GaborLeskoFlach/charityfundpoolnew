import * as React from 'react'
import { signOut } from '../../firebaseAuth/component'
import { PropTypes } from 'prop-types'

export class SignOut extends React.Component<any,any>{

    constructor(props){
        super(props)
    }

    static contextTypes: React.ValidationMap<any> = {
        router: PropTypes.func.isRequired
    }

    componentWillMount(){
        signOut().then(response => {
            if(response){
                this.context.router.history.push('/home/registrations')
            }
        })
    }

    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3>Signing out...</h3>
                    </div>
                </div>
            </div>
        )
    }

}