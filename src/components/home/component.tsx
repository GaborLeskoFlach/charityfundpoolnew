import * as React from 'react'
import { Link } from 'react-router-dom'
import { Dashboard } from './dashboard/dashboard'
import './styles.css'

export class HomeComponent extends React.Component<{},{}>{

    constructor(props)
    {
        super(props)
    }

    render(){
        return(
            <div>

                <section>
                    <div className="container">
                        <div className="section-title-center">
                            <h1>Welcome to Charity Fund Pool</h1>				
                        </div>
                        <div className="text-center who-we-are">
                            <div className="row">
                                <div className="col-sm-12">
                                    <img className="homepageimage" src="/templates/images/home/CFPHomePageImage.png" alt="Logo" />                                    
                                </div>
                            </div>
                            <Dashboard />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading">Bringing the Community together</h2>
                                <hr className="primary"/>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <section className="main">
                        <ul className="ch-grid">
                            <li>
                                <Link to="/register/NeedHelp/individual">
                                    <div className="ch-item ch-img-1">
                                        <div className="ch-info">
                                            <h3>Need Help?</h3>                                        
                                        </div>
                                    </div>
                                </Link>
                            </li>                            
                            <li>
                                <Link to="/donate/onetime">
                                    <div className="ch-item ch-img-2">
                                        <div className="ch-info">
                                            <h3>Donate</h3>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/register/WantToHelp">
                                    <div className="ch-item ch-img-3">
                                        <div className="ch-info">
                                            <h3>Want to Help?</h3>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>                        
                    </section>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <hr className="primary"/>
                                <div className="description wow fadeInLeftBig animated" style={{ visibility: 'visible', animationName: 'fadeInLeftBig'}}>
                                    <h2 className="section-heading">
                                        C.F.P. is a community based not for profit website. We put people in need of help in touch with people who want to help and manage the whole process. Funds raised by the community go direct to provide goods and facilities for those in need through Charities and not for profit organisations.                                    
                                    </h2>
                                </div>                                
                                <hr className="primary"/>
                            </div>                            
                        </div>
                    </div>

                </section>
          
            </div>                
        )
    }

}