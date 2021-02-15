/* eslint-plugin-disable react */
import React, { Component } from 'react';
import { Col, Dropdown } from 'react-bootstrap';
import Matches from './../events/index';
import { slide as Sidebar } from 'react-burger-menu';
import stylesIn from './styles.module.scss';

class Content extends Component{
    constructor(props){
        super(props)

        this.state = {
            sportsData: [], // Entire json file downloaded
            options: [], // Options list in Dropdown selector
            matchesByOption:{}, // All matches devided by option
            matchDetails:[],
            itemSelected:'', // Match details according to the option selected by user
            mobile: false,
            isOpen: false
        }
    }

    componentDidMount(){
        let init = this.state;
        init.options = ["ALL","Result","Live","Upcoming","Cancelled"];
        init.matchesByOption = {
            "ALL": [],
            "Result": [],
            "Live": [],
            "Upcoming": [],
            "Cancelled": []
        }
        init.sportsData = require("../../api/master_data_sports.json");
        init.isOpen = false;
        this.setState(init);

        this.initializeCountersAndLabels(); // initialized counters by options and lables as props
        this.setMobile(); // check mobile screen size
        console.log('render comp is open: ', this.state.isOpen);
    }

    //manage lables/key here
    initializeCountersAndLabels = () => {
        let updateState = this.state;
        let option = '';
        let lable ='';
        Object.values(updateState.sportsData).map(time => {
            switch(time.status.type.toLowerCase()){
                case 'finished': 
                    option='Result'; // Dropdown Option
                    lable = 'ended'; // Label Match
                    break; 
                case 'inprogress': 
                    option='Live'; // Dropdown Option
                    lable = 'live'; // Label Match
                    break;
                case 'notstarted': 
                    option='Upcoming'; // Dropdown Option
                    lable = 'timestamp'; // Label Match
                    break;
                case 'canceled' || 'cancelled': 
                    option='Cancelled'; // Dropdown Option
                    lable = 'cancelled'; // Label Match
                    break;
                    default: 
                        option='default';
                        break;
            }

            // Added new property to properties sending to children comp
            time['lable'] = lable;
            updateState.matchesByOption[option].push(time);
            return 0;
        })

        //first run - do not remove -
        updateState.matchesByOption[Object.keys(updateState.matchesByOption)[0]] = this.state.sportsData;
        
        //first run - do not remove -
        updateState.matchDetails = updateState.matchesByOption[Object.keys(updateState.matchesByOption)[0]];

        this.setState(updateState);
    }

    //check the mobile screen
    setMobile = () => {
        let mobileWidth = document.getElementById('main').clientWidth;
        let isMobile = false;
        if(mobileWidth < 768){ //breakpoint mobile
            isMobile = true;
        }
        let updateState = this.state;
        updateState.mobile = isMobile;
        this.setState(updateState);
    }

    //handle action dropdown
    handleAction = event => {
        let updateState = this.state;
        updateState.matchDetails = updateState.matchesByOption[event];
        this.setState(updateState);
    }

    //open and close sidebar
    handleStateChange = () => {
        let updateState  = this.state;
        updateState.isOpen = !this.state.isOpen;
        this.setState(updateState);
      }

    //handle action sidebar menu
    handleItem = value => {
        let updateState = this.state;
        updateState.itemSelected = value;
        updateState.isOpen = !this.state.isOpen;
        updateState.matchDetails = updateState.matchesByOption[value];
        this.setState(updateState);
    }

    render(){
        const { options, matchDetails, matchesByOption, mobile, isOpen } = this.state;
        return(
            <Col>
                <Col className={stylesIn.headerBox}>
                    <div className={stylesIn.title} >
                        <h1>Sport Events</h1>
                    </div>
                    {mobile ? (
                        <Sidebar
                            right
                            noOverlay 
                            isOpen={isOpen}
                            onOpen={state => this.handleStateChange(state)} 
                            >
                                <div className={stylesIn.headerList}>
                                    <div style={{ margin: 'auto' }}>
                                        Select Time
                                    </div>
                                </div>
                                <div className={stylesIn.bodyList}>
                                   {options.map((action, index) => (
                                       <div 
                                        className={stylesIn.item}
                                        key={index}
                                        onClick = {() => this.handleItem(action)}>
                                            <div 
                                                className={stylesIn.action}>{action}
                                            </div>
                                            <div 
                                                className={stylesIn.counter}>{matchesByOption[action].length}
                                            </div>
                                        </div>
                                   ))}
                                </div>
                        </Sidebar>
                    ) : (
                        <div className={stylesIn.selector} >
                            <Dropdown>
                                <Dropdown.Toggle 
                                    id="dropdown-option"
                                    style={{ boxShadow: 'none', width: '200px' }} >
                                    Select Time
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {options.map((action, index) => (
                                        <Dropdown.Item  
                                            key={index}
                                            eventKey={action}
                                            onSelect = {this.handleAction}
                                            style={{ width: '200px' }}
                                            id="action-list"
                                            >
                                                <div className={stylesIn.list}>
                                                    <div 
                                                        className={stylesIn.action}>
                                                            {action}
                                                    </div>
                                                    <div 
                                                        className={stylesIn.counter}>
                                                            {matchesByOption[action].length}
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    )}
                </Col>
                <Col>
                    <Matches matchInfo={matchDetails} />
                </Col>
            </Col>
        )
    }
}

export default Content;