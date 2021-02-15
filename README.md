# Livematch

Livematch is a sports-event carousel component. The component is designed in react by using react-bootstrap for the styling.
The livematch component includes:
  1) a Dropdown, which contains a list of Game Timing. The dropdown pass-down the items selected by user to the event-carousel
  2) a Carousel of sport events, which contain: Country name, Competition name, Game lable, Game score, Time of the match and the competitors.
      The Carousel receive a prop from the dropdown item selected and shows the match accordently
  3) a Progressbar circle, which indicates the current timing of each match

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Run on browser
```
localhost:3000
```

### Compiles and minifies for production
```
npm build
```

### Description

## content
The Content component allows to select different options such as: All Matches, Result Matches, Live Matches, Upcoming Mathces and Cancelled from the Dropdown and 
it passes-down the selected one to the child component. 
The Content component is also responsive.

|       State       |   Type    |                       Description                       |
|-------------------|-----------|---------------------------------------------------------|
|  sportsData       |   Array   |   fetch sports data                                     |
|  options          |   Array   |   match selection types                                 |
|  matchesByOption  |   Object  |   All matches grouped by option                         |
|  matchDetails     |   Array   |   list of specific matches selected by option           |
|  itemSelected     |   String  |   option selected from dropdown                         |
|  mobile           |   Bool    |   check if mobile (screen size < 768 px)                |
|  isOpen           |   Bool    |   check if sidebar is open                              |


## events
The Event component is a react-bootstrap carousel which receives a list of match details (according to the optpion selected by user) and it shows them as slides.
The Event component also formats the timestamp into date by using moment as library.
For each single match, the Event component passes-down specific match details to the Progressbar child component.

|       Props       |   Type    |                       Description                       |
|-------------------|-----------|---------------------------------------------------------|
|  matchInfo        |   Array   |   list of specific matches selected by option           |


## progressbar
The ProgressBar is a component which shows a progress bar circle containing the Match timing.

|       Props       |   Type    |   Description    |
|-------------------|-----------|------------------|
|  details          |   Object  |   match details  |


## Main Components:
### App.js
```js
//import logo from './logo.svg';
import React, { Component } from 'react';
import Content from '../src/components/content';
import { Container } from 'react-bootstrap';
import './App.module.scss';

class App extends Component{
  constructor(){
    super()
    this.inputRef = React.createRef();
  }

  componentDidMount(){
    this.inputRef.current.focus();
  }

  render(){
    return(
      <Container fluid ref={this.inputRef} id="main">
        <Content />
      </Container>
    )
  }
}
export default App;
```

### content/index.jsx
```js
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
```

### events/index.jsx
```js
/* eslint-plugin-disable react */
import React from 'react';
import { Button, Carousel, Card } from 'react-bootstrap';
import moment from 'moment';
import ProgressBar from '../progressbar/index';
import PropTypes from 'prop-types';
import stylesIn from './styles.module.scss';
import { getByDisplayValue } from '@testing-library/react';

const MatchCarousel = ({
    matchInfo
}) => {

    //convert timestamp to date using moment as format
    const dateFormat = timestamp => {
        const milliseconds = timestamp * 1000;
        const dateObject = new Date(milliseconds);
        let newdate = dateObject.toLocaleString();
        return moment(newdate).format('MMMM Do, hh:mm A').toUpperCase();
    }

        return(
            <div
                className={stylesIn.eventsBox}>
                <Carousel 
                    indicators={false}
                    interval={10000}
                    className={stylesIn.eventCarousel}
                    style={{ margin: 'auto'}} 
                    id="carouselMatch">
                    {matchInfo.length > 0 && matchInfo.map(match => (
                        <Carousel.Item key={match.id}>
                            <Card
                                className={stylesIn.matchBox}
                                id="cardmatch">
                                <Card.Body>
                                    <Card.Title className={stylesIn.matchTitle}>
                                        <div className={stylesIn.country}>{match.country.toUpperCase()}</div>
                                        <div className={stylesIn.league}>{match.competition}</div>
                                    </Card.Title>
                                    <div className={stylesIn.matchLables}>
                                        {match.lable === 'timestamp' ? (
                                            <div className={stylesIn[`lable-${match.lable}`]}>{dateFormat(match.timestamp)}</div>
                                        ):(
                                            <div className={stylesIn[`lable-${match.lable}`]}>{match.lable.toUpperCase()}</div>
                                        )}
                                    </div>
                                    <div className={stylesIn.matchScores}>
                                        {match.lable !== 'timestamp' ? (
                                            <div className={stylesIn.score}>
                                                <div className={stylesIn.homeScore}>{match.homeScore.current}</div>
                                                <div className={stylesIn.separator}> - </div>
                                                <div className={stylesIn.awayScore}>{match.awayScore.current}</div>
                                            </div>
                                        ) : (
                                            <div className={stylesIn.score}>
                                                <div className={stylesIn.homeScore}>{match.lable !== 'cancelled' ? 0 : ''}</div>
                                                <div className={stylesIn.separator}> - </div>
                                                <div className={stylesIn.awayScore}>{match.lable !== 'cancelled' ? 0 : ''}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={stylesIn.matchDetails}>
                                            <div className={stylesIn.homeTeam}>{match.homeTeam.name}</div>
                                            <ProgressBar 
                                                details={match}
                                                style={{ width: '25%' }}/>
                                            <div className={stylesIn.awayTeam}>{match.awayTeam.name}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        )
    }

MatchCarousel.propTypes = {
    matchInfo: PropTypes.any
}

export default MatchCarousel;
```

### progressbar/index.jsx
```js
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import stylesIn from './styles.module.scss';

const ProgressbarCircle = ({
    details
}) => {

    const setCss = () => {
        let liveStatus = details.liveStatus;
        if(details.liveStatus.slice(-1) === '+'){
            liveStatus = details.liveStatus.replace(/.$/,"p");
        }
        return liveStatus.toLowerCase();
    }

    return(
        <div className={classnames(stylesIn.setSize, stylesIn.chartsContainer)}>
            <div className={classnames(stylesIn.pieWrapper, stylesIn[`progress-${setCss()}`], stylesIn.style2)}>
                <span className={stylesIn.label}>
                    {details.lable && details.lable === 'live' ? (
                        <div className={stylesIn.time}>
                            {details.liveStatus}
                            {details.liveStatus !== 'HT' && details.liveStatus !== '45+' && details.liveStatus !== '90+' ? (
                                <span>'</span>
                            ):null}
                        </div>
                    ) : (
                        <>
                            {details.lable === 'ended' ? (
                                <div className={stylesIn.time}>
                                    {details.liveStatus}
                                </div>
                            ):null}
                        </>
                    )}
                </span>

                <div className={stylesIn.pie}>
                    <div className={classnames(stylesIn.leftSide, stylesIn.halfCircle)}></div>
                    <div className={classnames(stylesIn.rightSide, stylesIn.halfCircle)}></div>
                </div>
                <div className={stylesIn.shadow}></div>
            </div>
        </div>
    )
}

ProgressbarCircle.propTypes = {
    details: PropTypes.any
}

export default ProgressbarCircle;
```

## Libraries
    "bootstrap": "^4.6.0",
    "moment": "^2.29.1",
    "node-sass": "^4.14.1",
    "react": "^17.0.1",
    "react-bootstrap": "^1.4.3",
    "react-burger-menu": "^3.0.3",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.2"
    
