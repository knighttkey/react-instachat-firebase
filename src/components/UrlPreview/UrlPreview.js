import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import "./UrlPreview.scss";
import { Provider } from "../context";
import context from "../context";
import * as R from "ramda";

const UrlPreview = ({ previewItem }) => {
  return previewItem.map((metaItem, metaIndex) => {
    if(metaItem) {
      return (
        <div className="url_preview_container" key={metaIndex}>
          {metaItem.metaImage ? (
            <div className="preview_image">
              <img
                src={metaItem.metaImage ? metaItem.metaImage : null}
                alt="preview_image"
              />
            </div>
          ) : (
            <div className="preview_image preview_default"></div>
          )}
          <div className="preview_content">
            {/* <div className="preview_url">
                {metaItem.metaUrl ? metaItem.metaUrl : null}
              </div> */}
            <div className="preview_title">
              {metaItem.metaTitle ? metaItem.metaTitle : null}
            </div>
            <div className="preview_desc">
              {metaItem.metaDesc ? metaItem.metaDesc : null}
            </div>
            <div className="preview_site_name">
              {metaItem.metaSiteName ? metaItem.metaSiteName : null}
            </div>
          </div>
        </div>
      );

    }

    
  });
};
export default UrlPreview;
