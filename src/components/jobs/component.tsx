import * as React from 'react'
import { _firebaseAuth } from '../firebaseAuth/component';
import { JobSearchController } from './controller'
import { map } from 'lodash'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { MultiSelectComponent } from '../common/multiselect/component'
import { IRegistrationNeedHelpInd, DataFilter, IMarker, IPosition, IWhatINeedHelpWith, ISearchFilters, ITypeOfWork} from '../interfaces'
import { convertData } from '../../utils/utils'
import { ResponsiveTiles } from './../lists/responsiveTiles'
import Loader from 'react-loaders'
import GoogleMarkers from './../googleMaps/clickableMarkers'

import './styles.css'

interface IColumnData {
    title : string
    prop : string
    render? : (val,row) => void
    className? : string
}

@observer
export class Jobs extends React.Component<{},{}> {
    @observable postCode : string
    @observable postCodeToSearch : string
    @observable reloadSearchResults : boolean  = false
    controller : JobSearchController
    @observable searchFilters : Array<ISearchFilters> = []
    includeSurroundingSuburbs : boolean = false


    constructor(props){
        super(props)
        this.controller = new JobSearchController()
    }

    async componentWillMount(){
        if(_firebaseAuth.currentUser){
            this.controller.isLoading = true
            this.postCode = await this.controller.getCurrentUserDetails(_firebaseAuth.currentUser.uid)                
            this.controller.isLoading = false
        }
    }

    searchByPostCode = (e) => {
        e.preventDefault()
        this.postCodeToSearch = ''
        this.validate()
        if(this.controller.registerIndividualFormState.postCode.fieldValidationError.length === 0){
            this.postCodeToSearch = this.postCode
        }
    }

    validate = () => {
        const numericOnlyPatter = /^[0-9]*$/
        this.controller.registerIndividualFormState.postCode.touched = true

        //PostCode
        if(this.postCode.length == 0){
            this.controller.registerIndividualFormState.postCode.fieldValidationError = 'Required'
        }else if (!numericOnlyPatter.test(this.postCode)) {
            this.controller.registerIndividualFormState.postCode.fieldValidationError = 'Post code can contain numbers only'
        }else{
            this.controller.registerIndividualFormState.postCode.fieldValidationError = ''
        }                                                                                                                                            
    }

    handleChange = (e) => {
        if(e.target.type === 'checkbox'){
            this.includeSurroundingSuburbs = e.target.checked
        }else{
            this.postCodeToSearch = ''
            this.postCode = e.target.value
        }
    }

    handleBlur = (e) => {
        this.controller.registerIndividualFormState.postCode.touched = true
    }

    handleKeyPress = (event) => {
        const re = /[0-9A-F:]+/g
        if (!re.test(event.key)) {
            event.preventDefault()
        }        
    }

    shouldMarkError = (control:string) => {
        let hasError : boolean = this.controller.registerIndividualFormState.postCode.fieldValidationError.length > 0
        let shouldShow : boolean = this.controller.registerIndividualFormState.postCode.touched

        return hasError ? shouldShow : false
    }

    handleFilterChange = (e, typeOfWork : string, whatINeedHelpWith : string) => {
        this.searchFilters = []
        this.searchFilters.push(
            { key : 'typeOfWork', value : typeOfWork},
            { key : 'whatINeedHelpWith', value : whatINeedHelpWith}
        )
        this.forceUpdate()
    }

    render() {

        if(this.controller.isLoading){
            return <Loader type="ball-pulse" active />
        }else{
            return (
                <div>
                    <div className="inner-bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h1 className="wow fadeInLeftBig animated" style={{ visibility : 'visible', animationName : 'fadeInLeftBig' }}><strong>Job search Form</strong></h1>
                                    <div className="description wow fadeInLeftBig animated" style={{ visibility: 'visible', animationName: 'fadeInLeftBig'}}>
                                        <h3>
                                            Use this form to search for available jobs in your area.
                                            Type in your postcode in the box below and pick jobs from the results
                                        </h3>
                                    </div>
                                    <div className="subscribe wow fadeInUp animated" style={{ visibility: 'visible', animationName: 'fadeInUp'}}>
                                        <form className="form-inline" onSubmit={this.searchByPostCode}>
                                            
                                            <div className={this.shouldMarkError('postcode') ? "form-group has-error has-feedback" : "form-group"}>
                                                <label className="sr-only" htmlFor="searchByPostCode">Post code</label>
                                                <input
                                                    autoComplete="off" 
                                                    className={this.shouldMarkError('postCode') ? "form-control error" : "subscribe form-control"}
                                                    id="searchByPostCode" 
                                                    type="text" 
                                                    placeholder="Enter post code..."
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleBlur}
                                                    onKeyPress={(e) => this.handleKeyPress(e)}
                                                    value={this.postCode}/>                            
                                            </div>
                                            <br/>
                                            <div>
                                                <div className="checkbox">
                                                <label><input type="checkbox" checked={this.controller.includeSurroundingSuburbs} onChange={this.handleChange}/>Include surrounding suburbs</label>
                                                </div>
                                            </div>
                                            <br />
                                        
                                            <JobSearchFilter controller={this.controller} reloadSearchResults={this.handleFilterChange}/>
                                                                                
                                            <button type="submit" className="btn btn-primary submit">Search</button>
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SearchResults postCode={this.postCodeToSearch} filters={this.searchFilters}/>

                    </div>                
                </div>
            )
        }
    }    
}

interface ISearchResults {
    postCode : string
    filters : Array<ISearchFilters>
}

@observer
export class SearchResults extends React.Component<ISearchResults,{}>{
    registrationNeedHelpIndColumns : Array<IColumnData>
    controller : JobSearchController
    defaultPosition : IPosition
    searchResults : Array<IRegistrationNeedHelpInd>

    constructor(){
        super()
        this.controller = new JobSearchController()
    }

    componentWillReceiveProps(nextProps : ISearchResults){
        if(nextProps.postCode){
            this.controller.isLoading = true                

            this.controller.getRegistrationsForNeedHelpInd(nextProps.postCode, nextProps.filters).then(response => {
                this.searchResults = response
                this.controller.isLoading = false
            }).catch((e) => {
                this.controller.isLoading = false
            })
        }
    }

    convertSearchResultsToGoogleMarkers = (searchResults : Array<IRegistrationNeedHelpInd>) : Array<IMarker> =>  {        
        let markers : Array<IMarker> = []
        searchResults.map((item) => {            
            markers.push({
                name : item.fullName,
                position : item.addressLocation,
                extraInfo : item.phoneNo
            })
        })

        //Set defaultPosition to the fist Marker position
        this.defaultPosition = markers[0].position

        return markers
    }

    navigateToMarker = () => {
        
    }

    render(){
        if(this.controller.isLoading){
            return <Loader type="ball-pulse" active />
        }else{
            if(this.props.postCode){

                if(this.searchResults && this.searchResults.length > 0){
                    return (
                        <div className="container">
                            <div className="section-title">
                                <h1>Results</h1>                            
                            </div>  

                            <GoogleMarkers data={this.convertSearchResultsToGoogleMarkers(this.searchResults)} defaultPosition={this.defaultPosition}/>

                            <hr />

                            <ResponsiveTiles data={this.searchResults} navigateToMarker={this.navigateToMarker}/>
                        </div>                                         
                    )
                }else{
                    return(
                    <div className="container">
                        <div className="section-title">
                            <h1>Nothing to display</h1>
                        </div>
                    </div>
                    )
                }
            }else{
                return null
            }       
        }
    }
}

interface IJobSearchFilter{
    controller : JobSearchController
    reloadSearchResults : (e : any, typeOfWork : string, whatINeedHelpWith : string) => void
}

@observer
export class JobSearchFilter extends React.Component<IJobSearchFilter,{}>{
    @observable whatINeedHelpWith : string
    @observable typeOfWork : string

    constructor(props){
        super(props)
    }

    async componentWillMount(){
        //this.props.controller.isLoading = true
        await this.props.controller.getWhatINeedHelpWith()
        await this.props.controller.getTypesOfWork()        
        //this.props.controller.isLoading = false 
    }

    handleChange = (e) => {
        switch(e.target.id){
            case 'whatINeedHelpWith':
                this.whatINeedHelpWith = e.target.value
                break
            case 'typeOfWork':
                this.typeOfWork = e.target.value
                break
        }

        this.props.reloadSearchResults(e, this.typeOfWork, this.whatINeedHelpWith)
    }


    onSelectionHasChanged = (e) => {

    }

    render(){
        if(!this.props.controller.typesOfWork ||
            this.props.controller.typesOfWork.length === 0 || 
            !this.props.controller.whatINeedHelpWith ||
            this.props.controller.whatINeedHelpWith.length === 0){
            return null
        }else{
            return(
                <div className="well">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="whatINeedHelpWith">What I need help with</label>
                                            {/*
                                            <div className="form-group">                                            
                                                <MultiSelectComponent 
                                                    defaultData={convertData(this.props.controller.whatINeedHelpWith,DataFilter.ActiveOnly)} 
                                                    userSetOptions={null}
                                                    onChange={this.onSelectionHasChanged}/>
                                            </div>
                                            */}
                                            
                                            <select className="form-control" id="whatINeedHelpWith" onChange={(e) => this.handleChange(e)} value={this.whatINeedHelpWith} >
                                                <option value="">Please select an option...</option>

                                                    {map(this.props.controller.whatINeedHelpWith, (need : IWhatINeedHelpWith, key) => (
                                                        <option key={key} value={need.value}>{need.label}</option>
                                                    ))}                                                                                        

                                            </select>                                                
                                            
                                    </div>
                            
                            </div>
                            <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="whatINeedHelpWith">Type of work</label>
                                            {/*
                                            <div className="form-group">                                            
                                                <MultiSelectComponent 
                                                    defaultData={convertData(this.props.controller.typesOfWork,DataFilter.ActiveOnly)} 
                                                    userSetOptions={null}
                                                    onChange={this.onSelectionHasChanged}/>
                                            </div>
                                            */}
                                            
                                            <select className="form-control" id="typeOfWork" onChange={(e) => this.handleChange(e)} value={this.typeOfWork} >
                                                <option value="">Please select an option...</option>

                                                    {map(this.props.controller.typesOfWork, (need : ITypeOfWork, key) => (
                                                        <option key={key} value={need.value}>{need.label}</option>
                                                    ))}                                                                                        

                                            </select>

                                    </div>                            
                            </div>                                               
                        </div>
                    </div>
                </div>
            )
        }

    }
}