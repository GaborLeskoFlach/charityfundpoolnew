import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import './styles.css'

interface IDonationPaymentConfiguration {
    paymentTabConfigState : (configState : IPaymentSelect[]) => void
}

export interface IPaymentSelect{
    optionOne : string
    optionTwo : string
    optionThree : string
    optionOther : string
}

@observer
export class DonationPaymentConfiguration extends React.Component<IDonationPaymentConfiguration,{}>{
    @observable paymentSelectionConfig : IPaymentSelect[]
    @observable selectedTab : string = '0'

    constructor(props){
        super(props)

        this.paymentSelectionConfig = [
            {
                optionOne : ' active',
                optionTwo : '',
                optionThree : '',
                optionOther : ''
            },
            {
                optionOne : ' active',
                optionTwo : '',
                optionThree : '',
                optionOther : ''
            },
            {
                optionOne : ' active',
                optionTwo : '',
                optionThree : '',
                optionOther : ''
            }
        ]
    }
    
    updatePaymentTabConfigState = () => {
        this.props.paymentTabConfigState(this.paymentSelectionConfig)
    }

    getPaymentSelectionConfig = (target : string) => {
        let classToReturn : string
        switch(target){
            case 'optionOne':
                classToReturn = ('payment-select ' + this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOne)
                break
            case 'optionTwo':
                classToReturn = ('payment-select ' + this.paymentSelectionConfig[parseInt(this.selectedTab)].optionTwo)
                break
            case 'optionThree':
                classToReturn = ('payment-select ' + this.paymentSelectionConfig[parseInt(this.selectedTab)].optionThree)
                break
            case 'optionOther':
                classToReturn = ('payment-select ' + this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOther)
                break
        }

        //this.updatePaymentTabConfigState()
        return classToReturn
    }

    handlePaymentSelect = (event) => {
        switch(event.currentTarget.id)
        {
            case 'optionOne':
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOne = 'active'
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionTwo = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionThree = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOther = ''
                break   
            case 'optionTwo':
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOne = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionTwo = 'active'
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionThree = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOther = ''
                break
            case 'optionThree':
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOne = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionTwo = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionThree = 'active'
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOther = ''
                break
            case 'optionOther':
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOne = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionTwo = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionThree = ''
                this.paymentSelectionConfig[parseInt(this.selectedTab)].optionOther = 'active'
                break
        }
        this.forceUpdate()
        //this.updatePaymentTabConfigState()       
    }

    handleTabSelection = (e) => {
        this.selectedTab = e.target.id
        this.updatePaymentTabConfigState()
    }

    handleKeyPress = (event) => {
        const re = /[0-9A-F:]+/g
        if (!re.test(event.key)) {
            event.preventDefault()
        }        
    }

    render(){

        return(
            <div id="donate-section">
                <div className="container">
                    <div className="donate-section padding">				
                        <div className="donate-tab text-center">
                            <div id="donate">
                                <ul className="tab-list list-inline" role="tablist"  onClick={this.handleTabSelection} >
                                    <li className={ this.selectedTab === '0' ? 'active' : ''}><Link id='0' to="/donate/onetime" role="tab" data-toggle="tab">One time</Link></li>
                                    <li className={ this.selectedTab === '1' ? 'active' : ''}><Link id='1' to="/donate/monthlyrecurring" role="tab" data-toggle="tab">Monthly recurring</Link></li>
                                    <li className={ this.selectedTab === '2' ? 'active' : ''}><Link id='2' to="/donate/forgift" role="tab" data-toggle="tab">For gift</Link></li>
                                </ul>  
                                <fieldset className="tab-content">                            
                                    <Switch>
                                        <Route exact path="/donate/onetime" render={() => <DonationOneTime 
                                                                                            selectedTab={this.selectedTab} 
                                                                                            getPaymentSelectionConfig={this.getPaymentSelectionConfig} 
                                                                                            handlePaymentSelect={this.handlePaymentSelect} 
                                                                                            handleKeyPress={this.handleKeyPress}/>
                                                                                    } />
                                        <Route exact path="/donate/monthlyrecurring" render={() => <DonationMonthlyRecurring 
                                                                                                    selectedTab={this.selectedTab} 
                                                                                                    getPaymentSelectionConfig={this.getPaymentSelectionConfig} 
                                                                                                    handlePaymentSelect={this.handlePaymentSelect}
                                                                                                    handleKeyPress={this.handleKeyPress}/>
                                                                                            } />
                                        <Route exact path="/donate/forgift" render={() => <DonationForGift 
                                                                                            selectedTab={this.selectedTab} 
                                                                                            getPaymentSelectionConfig={this.getPaymentSelectionConfig} 
                                                                                            handlePaymentSelect={this.handlePaymentSelect}
                                                                                            handleKeyPress={this.handleKeyPress}/>
                                                                                    } />
                                    </Switch>
                                </fieldset>

                                <fieldset className="payment-method">
                                    <p>Donate using a credit card, PayPal, or Other Option.</p>							
                                    <ul className="list-inline">
                                        <li>
                                            <img className="img-resposive" src="../../../templates/images/donation-bg/visa.png" alt="" />
                                        </li>
                                        <li>
                                            <img className="img-resposive" src="../../../templates/images/donation-bg/master-card.png" alt="" />
                                        </li>
                                        <li>
                                            <img className="img-resposive" src="../../../templates/images/donation-bg/paypal.png" alt="" />
                                        </li>
                                        <li>
                                            <img className="img-resposive" src="../../../templates/images/donation-bg/amarican.png" alt="" />
                                        </li>
                                    </ul>
                                </fieldset>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const DonationOneTime = ({selectedTab, getPaymentSelectionConfig, handlePaymentSelect, handleKeyPress}) => {
    return(
        <div className={ selectedTab === '0' ? 'tab-pane fade in active' : 'tab-pane fade '} id="onetime">
            <ul className="fancy-label row">
                <li className="col-sm-3">
                    <div id='optionOne' className={getPaymentSelectionConfig('optionOne')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$50</span>
                            </div>
                            <div className="description">
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionTwo' className={getPaymentSelectionConfig('optionTwo')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$100</span>
                            </div>
                            <div className="description">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionThree' className={getPaymentSelectionConfig('optionThree')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$200</span>
                            </div>
                            <div className="description">
                                <p>Voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionOther' className={getPaymentSelectionConfig('optionOther')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <input id="amount" name="" placeholder="Enter Amount"maxLength={5} type="text" onKeyPress={(e) => handleKeyPress(e)} aria-invalid="false" />
                            </div>
                            <div className="description">
                                <h4>Other Amount</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
    )
}

const DonationMonthlyRecurring = ({selectedTab, getPaymentSelectionConfig, handlePaymentSelect, handleKeyPress}) => {
    return(
        <div className={ selectedTab === '1' ? 'tab-pane fade in active' : 'tab-pane fade '} id="monthly">								
            <ul className="fancy-label row">
                <li className="col-sm-3">
                    <div id='optionOne' className={getPaymentSelectionConfig('optionOne')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$10</span>
                            </div>
                            <div className="description">
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionTwo' className={getPaymentSelectionConfig('optionTwo')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$20</span>
                            </div>
                            <div className="description">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionThree' className={getPaymentSelectionConfig('optionThree')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$30</span>
                            </div>
                            <div className="description">
                                <p>Voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionOther' className={getPaymentSelectionConfig('optionOther')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <input  id="amount" name="" placeholder="Enter Amount" maxLength={5} type="text" onKeyPress={(e) => handleKeyPress(e)} aria-invalid="false" />
                            </div>
                            <div className="description">
                                <h4>Other Amount</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
    )
}

const DonationForGift = ({selectedTab, getPaymentSelectionConfig, handlePaymentSelect, handleKeyPress}) => {
    
   return(
        <div className={ selectedTab === '2' ? 'tab-pane fade in active' : 'tab-pane fade '} id="gift">
            <ul className="fancy-label row">
                <li className="col-sm-3">
                    <div id='optionOne' className={getPaymentSelectionConfig('optionOne')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$200</span>
                            </div>
                            <div className="description">
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionTwo' className={getPaymentSelectionConfig('optionTwo')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$300</span>
                            </div>
                            <div className="description">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionThree' className={getPaymentSelectionConfig('optionThree')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <span>$400</span>
                            </div>
                            <div className="description">
                                <p>Voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat</p>
                            </div>
                        </label>
                    </div>
                </li>
                <li className="col-sm-3">
                    <div id='optionOther' className={getPaymentSelectionConfig('optionOther')} onClick={handlePaymentSelect}>
                        <input type="radio" name="" value="" />
                        <label >
                            <div className="amount">
                                <input  id="amount" name="" placeholder="Enter Amount" maxLength={5} type="text" onKeyPress={(e) => handleKeyPress(e)}  aria-invalid="false" />
                            </div>
                            <div className="description">
                                <h4>Other Amount</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
   )
}