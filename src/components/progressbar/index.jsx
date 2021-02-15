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