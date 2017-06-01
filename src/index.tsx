import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

//React 
import * as React from 'react'
import * as ReactDOM from 'react-dom'

//React Router
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import { AppFrame } from './appFrame'
import { LoginComponent } from './components/login/component'
import { NotFoundComponent } from './components/notFound/component'
import { ContactUsComponent } from './components/contactUs/component'
import { WhoWeAreComponent } from './components/whoWeAre/component' 
import { HomeComponent } from './components/home/component'
import { RegisterNeedHelpComponent  } from './components/register/NeedHelp/component' 
import { RegistrationConfirmation } from './components/register/registrationConfirmation'
import { Jobs } from './components/jobs/component'
import { Administration } from './components/administration/component'

import { RegisterWantToHelpComponent } from './components/register/WantToHelp/component'
import { PasswordReset } from './components/login/passwordReset/component'
import { SignOut } from './components/login/signOut/component'
import { DonateNowComponent } from './components/donateNow/component'
//import { requireAuth } from '../src/components/firebaseAuth/component'
import { NeedList } from './components/needs/needList'
import { Notifications } from './components/home/notifications/notifications'


const _Home = () => (
    <HomeComponent />
)

const _RegisterWantToHelp = ( match : any) => (
    <RegisterWantToHelpComponent params={match} />
)

const _RegisterNeedHelp = () => (
    <RegisterNeedHelpComponent params={ { ID : '', requestType : 'NeedHelp', Type : 'Ind'} } />
)

const _RegistrationConfirmation = () => (
    <RegistrationConfirmation />
)

const _WhoWeAre = () => (
    <WhoWeAreComponent />
)

const _DonateNow = ( match : any) => (
    <DonateNowComponent params={match} />
)

const _NeedList = () => (
    <NeedList />
)

const _ContactUs = () => (
    <ContactUsComponent />
)

const _Login = () => (
    <LoginComponent />
)

const _PasswordReset = () => (
    <PasswordReset />
)

const _SignOut = () => (
    <SignOut />
)

const _Jobs = () => (
    <Jobs />
)

const _Administration = () => (
    <Administration />
)

const _NotFound = () => (
    <NotFoundComponent />
)

const _AboutUsTab1 = () => (
    <h1>About Us Tab1</h1>
)

const _AboutUsTab2 = () => (
    <h1>About Us Tab2</h1>
)

const _Notifications = () => (
    <Notifications  />
)

const CharityFundPoolApp = () => (
    <Router>
        <div>
            <AppFrame children />

                <Redirect from="/" to="/home/registrations" />

                <Switch>
                    <Route exact path="/" component={_Home} />
                    <Route path="/home" component={_Home} />

                    <Route path="/register/NeedHelp" component={_RegisterNeedHelp}/>
                    <Route exact path="/register/NeedHelp/individual" component={_RegisterNeedHelp} />
                    <Route exact path="/register/WantToHelp" component={_RegisterWantToHelp} /> 
                    
                    <Route path="/register/WantToHelp(/:ID)" component={_RegisterWantToHelp} /> 
                    <Route path="/register/:requestType(/:Type)(/:ID)" component={_RegisterNeedHelp} />

                    <Route path="/confirm" component={_RegistrationConfirmation } />    
                    <Route path="/aboutUs/ourStory" component={_WhoWeAre} />

                    <Route path="/donate" component={_DonateNow} />
                    <Route path="/donate(/:causeId)" component={_DonateNow} />

                    <Route path="/viewNeeds" component={_NeedList}  />
                    
                    <Route exact path="/contactUs" component={_ContactUs} />
                    
                    <Route exact path="/login" component={_Login}/>
                    <Route exact path="/login/passwordReset" component={_PasswordReset}/>
                    <Route exact path="/login/signout" component={_SignOut}/>
                    <Route exact path="/jobs" component={_Jobs} />
                    
                    <Route path="/administration" component={_Administration}/>
                    <Route path="/notifications" component={_Notifications}/>>

                    <Route component={_NotFound}/>
                </Switch>
        </div>
    </Router>
)


ReactDOM.render(<CharityFundPoolApp />, document.getElementById('body'))

/* How to connect to Node API https://typescript-node-api-pyjfiuehfx.now.sh/api/v1/users */



export default CharityFundPoolApp