import * as React from 'react'

interface IListFilterWantToHelpRegistrations{

}

export class ListFilterWantToHelpRegistrations extends React.Component<IListFilterWantToHelpRegistrations, {}>{

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div>
                <div className="well">
                    All sorts of filters we can put in here to filter Individuals who want to help
                </div>

            </div>   
        )
    }
}