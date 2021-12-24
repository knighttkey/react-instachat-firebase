import React, { Fragment, useEffect } from "react";
import "./EnterModal.scss";

const EnterModal = (props) => {
  const {
    show,
    close,
    action,
    sourcePage,
    popupWindow,
  } = props;


  return (
    <div className="EnterModal_container">
      <div className="EnterModal_background"></div>
      <div className="EnterModal_body">
        <div className="loading_block">
          <div className="enter_button">
            <div className="inner">
              <div className="text">開始</div>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterModal;
