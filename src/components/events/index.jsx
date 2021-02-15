/* eslint-plugin-disable react */
import React from 'react';
import { Carousel, Card } from 'react-bootstrap';
import moment from 'moment';
import ProgressBar from '../progressbar/index';
import PropTypes from 'prop-types';
import stylesIn from './styles.module.scss';

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