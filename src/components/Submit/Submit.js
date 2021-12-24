import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
// import MediaStream from "../MediaStream/MediaStream";
import "./Submit.scss";
import { Provider } from "../context";
import Draggable from "react-draggable";
import context from "../context";

import * as R from "ramda";

const Submit = () => {

    const contextValue = useContext(context);
    const { submitState, setSubmitState } = contextValue;

    const handleSubmitStart = () => {
        setSubmitState(1)
    }

    return (
        <div className={`submit_container`}>
            <Provider value={contextValue}>
                <div className="device_submit">
                    <div className="icon"></div>
                    <div className="text">初次使用請進行<br />裝置授權綁定</div>
                    <div className="btn" onClick={handleSubmitStart}>開始</div>
                </div>

            </Provider>
        </div>
    );
};
export default Submit;
