import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./ModalTool.scss";
import { Provider } from "../context";
import * as R from "ramda";
import context from "../context";

const ModalTool = (props) => {

    const contextValue = useContext(context);
    const {  } = contextValue;
    const {
        modalShow,
        modalCloseFunction,
        modalWidth,
        modalHeight,
        backgroundOpacity,
        modalInnerBackground
    } = props;


    return (
        <Provider value={contextValue}>
            <div className={`modal_container ${modalShow ? "component_show" : "component_hide"}`}>
                <div className={`modal_inner ${modalShow ? "modal_show" : "modal_hide"}`} 
                    style={{width:modalWidth, height:modalHeight, background:modalInnerBackground}}
                >
                    {props.children}
                </div>
                <div
                    className={`background`} 
                    style={{opacity:backgroundOpacity}}
                    onClick={modalCloseFunction}
                ></div>
            </div>
        </Provider>

    );
};
export default ModalTool;
