import * as React from 'react'
import { NavLink } from 'react-router-dom'
import {  _firebaseApp, _currentRegistrationRole, getMappingInfoForUser, updateRegistrationToMapping, getUserRole, setCurrentRegistrationRole } from './components/firebaseAuth/component'
import { IUserMapping, UserStatus, RegistrationRoles, IRoleInfo } from './components/interfaces'
import {observer} from 'mobx-react'
import {observable } from 'mobx'
import './styles.css'
import Loader from 'react-loaders'
import * as firebase from 'firebase';

//Ugh...no no no....shouldn't be this way
//TODO Remove these guids immediately
const AdminUser1GUID : string = 'm7xAfRWPgyMmwjbhNT3gHudTuSJ3'  //PROD
const AdminUser2GUID : string = 'sdUQiPafYwavy7XEdyydU9mfg6C3'  //UAT

enum TabType {
    Home = 1,
    AboutUs = 2,
    Donate = 3,
    ViewNeeds = 4,
    ContactUs = 5,
    SearchForJobs = 6,
    Notifications = 7,
    Administration = 8,
    SignInOut = 9
}

interface INavigationComponentProps{
    children : any
}

interface ITabProps{
    tabProps : ITab
}

interface ITab{
    id : number
    name : string
    to? : string  
    tabType : TabType
    canSee : Array<RegistrationRoles>
}

let tabList : Array<ITab>  = [    
    { id: 1, name: 'Home', to:'/home/registrations', tabType : TabType.Home, canSee : [ RegistrationRoles.Admin, RegistrationRoles.User] },    
    { id: 2, name: 'About Us', to:'/aboutUs/ourStory', tabType : TabType.AboutUs, canSee : [ RegistrationRoles.Admin, RegistrationRoles.User]},
    { id: 3, name: 'Donate', to:'/donate/onetime', tabType : TabType.Donate, canSee : [ RegistrationRoles.Admin] },
    { id: 4, name: 'View Needs', to:'/viewNeeds/activeNeeds', tabType : TabType.ViewNeeds, canSee : [ RegistrationRoles.Admin] },   
    { id: 5, name: 'Contact Us', to:'/contactUs', tabType : TabType.ContactUs, canSee : [ RegistrationRoles.Admin, RegistrationRoles.User] },      
    { id: 6, name: 'Jobs',  to:'/jobs', tabType : TabType.SearchForJobs, canSee : [ RegistrationRoles.Admin, RegistrationRoles.User] },
    { id: 7, name: 'Notifications',  to:'/notifications/received', tabType : TabType.Notifications, canSee : [ RegistrationRoles.Admin, RegistrationRoles.User] },
    { id: 8, name: 'Administration',  to:'/administration/peopleNeedHelp', tabType : TabType.Administration, canSee : [ RegistrationRoles.Admin] },
    { id: 9, name: 'Sign In',  to:'/login', tabType : TabType.SignInOut, canSee : [ RegistrationRoles.Admin, RegistrationRoles.User] }   
]

class Tab extends React.Component<ITabProps,{}>{

    render(){        
        const { to, name }  : any = this.props.tabProps

        return(
                            
            <li className='active'>
                <NavLink activeClassName="active" to={to} >{ name }</NavLink>             
            </li>            
        )
    }
}

@observer
export class AppFrame extends React.Component<INavigationComponentProps,{}>{
    @observable userLoggedIn : boolean = false
    @observable currentUser : firebase.User
    @observable isLoading : boolean = false
    
    constructor(props : INavigationComponentProps){
        super(props)
         setCurrentRegistrationRole(RegistrationRoles.UnAuthenticated)         
    }

    componentDidMount(){
        this.isLoading = true

        _firebaseApp.auth().onAuthStateChanged((user) => {
            if(user){            
                //THis will run just once when User logs in
                //this way we can keep User Details being displayed in Navbar up-to-date
                getMappingInfoForUser(user.uid).then((response : IUserMapping) => {
                    if(response){
                        response.status = UserStatus.Enabled
                        response.loggedInFirstTime = true
                        response.loggedInFirstTimeDate = new Date()

                        updateRegistrationToMapping(response).then(() => {
                            user.updateProfile({
                                displayName: response.displayName,
                                photoURL: response.profileImageURL
                            }).then(response =>{
                                //this.userLoggedIn = true
                                //this.currentUser = user
                            }).catch(error => {
                                console.log('Exception occurred in UpdateProfile => {0}', error.message)
                            })
                        })                        
                    }else{
                        user.updateProfile({
                            displayName: 'Administrator',
                            photoURL : null
                        }).then(response =>{
                            //this.userLoggedIn = true
                            //this.currentUser = user
                        }).catch(error => {
                            console.log('Exception occurred in UpdateProfile => {0}', error.message)
                        })                        
                    }
                }).then(() => {
                    //Get User Role information so Tabs can be set based on role
                    getUserRole(user.uid).then((response : IRoleInfo) => {
                        if(response){
                            //Set Logged in User's Role globally
                            setCurrentRegistrationRole(response.registrationType)                             
                        }
                        this.userLoggedIn = true
                        this.currentUser = user                        
                        this.isLoading = false
                    })
                }).catch((error) => {
                    this.isLoading = false
                })                
            }else{
                this.userLoggedIn = false
                this.currentUser = null
                this.isLoading = false
                setCurrentRegistrationRole(RegistrationRoles.UnAuthenticated)
                this.forceUpdate()
            }
        })
    }

    hasAdminGUID = () => {
        if(this.currentUser){
            return (this.currentUser.uid === AdminUser1GUID || this.currentUser.uid === AdminUser2GUID)
        }else{
            return false
        }
    }

    renderTab = (index : number, tab : ITab) => {

        if(tab.tabType === TabType.SignInOut){
            if(this.userLoggedIn){
                tab.name = 'Sign Out'
                tab.to = '/login/signout'                
            }else{
                tab.name = "Sign In"
                tab.to = '/login'
            }
        }

        if(_currentRegistrationRole !== RegistrationRoles.UnAuthenticated){
            if(tab.canSee[_currentRegistrationRole]){
                return <Tab key={index} tabProps={tab}  />
            }else{
                return null
            }
        }else{
            if(tab.id === 1 || tab.id === 2 || tab.id === 5 || tab.id === 9 || this.hasAdminGUID()){
                return <Tab key={index} tabProps={tab} />
            }
        }
    }

    render(){
        if(this.isLoading){
            return <Loader type="ball-pulse" active />
        }else{
            return(
                <div>
                    <header id="navigation">
                        <div className="navbar navbar-fixed-top animated fadeIn" role="banner">
                            <div className="container">
                                <div className="navbar-header">
                                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                                        <span className="sr-only">Toggle navigation</span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                    <a className="navbar-brand" >
                                        {
                                            this.currentUser && !this.isLoading &&
                                            <Avatar user={this.currentUser} />
                                        }                                    
                                    </a>                    
                                </div>	

                                <nav className="collapse navbar-collapse navbar-right">					
                                    <ul className="nav navbar-nav">                                    
                                        
                                        {!this.isLoading && tabList.map((tab : ITab, index : number) => {
                                            return (this.renderTab(index, tab))
                                        })}
                                    </ul>		
                                </nav>      
                            </div>
                        </div>
                    </header>
                    
                    {this.props.children}

                </div>
            )
        }
    }
}

interface IAvatar{
    user : firebase.User
}

class Avatar extends React.Component<IAvatar,{}>{

    render(){
        return(
            <div className="profileCardNavbar hovercard">   
                <div className="avatar">                                   
                    <img className="profileCardNavbar hovercard avatar img" src={this.props.user.photoURL} title={this.props.user.displayName}/>
                </div>
            </div>
        )
    }
}