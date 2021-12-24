import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./PageTemplate.scss";
import { Provider } from "../context";
import * as R from "ramda";

import context from "../context";

const PageTemplate = () => {
    const contextValue = useContext(context);
    const { } = contextValue;

    const fff = () => {

    }
    return (
        <div className={`_container`}>
            <Provider value={contextValue}>
                <div className="____">
                    <div className="img"></div>
                    <div className="text"></div>
                    <div className="btn" onClick={fff}></div>
                </div>
            </Provider>
        </div>
    );
};
export default PageTemplate;
