import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./ModalContentTemplate.scss";
import { Provider } from "../context";
import * as R from "ramda";

import context from "../context";

const ModalContentTemplate = (props) => {
    const contextValue = useContext(context);
    const { } = contextValue;
    const { } = props;

    const fff = () => {
    }

    return (
        <Provider value={contextValue}>
            <div className={`_container`}>
                <div className="_">
                    <div className="close_btn"></div>
                    <div className="title"></div>
                    <div className="btn"></div>
                    {/* <div className="header"></div>
                    <div className="content"></div>
                    <div className="footer"></div> */}
                </div>
            </div>
        </Provider>
    );
};
export default ModalContentTemplate;
