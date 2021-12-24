import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./UrlPreviewSkeleton.scss";
import { Provider } from "../context";
import Draggable from "react-draggable";
import context from "../context";
import * as R from "ramda";

const UrlPreviewSkeleton = ({targetUrl}) => {

    return (
        <div className="preview_skeleton_container">
        {targetUrl.map((item, index) => {
          return (
            <div className="preview_skeleton_container">
              <div className="preview_skeleton_image"></div>
              <div className="preview_skeleton_content">
                <div className="preview_skeleton_title"></div>
                <div className="preview_skeleton_desc"></div>
                {/* <div className="preview_skeleton_site_name"></div> */}
              </div>
            </div>
          );
        })}
      </div>
    );
};
export default UrlPreviewSkeleton;
