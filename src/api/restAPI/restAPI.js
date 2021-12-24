"use strict";
import axios from "axios";
import { indexOf } from "ramda";



const fetchPreview = async (data) => {
  console.log("fetchPreview_data", data);
    
    let result;
    let previewMetaData;
    await axios({
      method: "get",
      url: `http://localhost:3001/fetch_preview`,
      headers: {
        // "Accept": "text/html",
        // "Content-Type": "text/html",
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "url":data.url
      },
    })
      .then((response) => {
        console.log("fetch_preview_response", response);
        result = response;
        console.log('restAPI_result', result)


      if(response.status === 200) {
        previewMetaData = {
          metaSiteName:response.data["og:site_name"],
          metaUrl:response.data["url"],
          metaTitle:response.data["og:title"],
          metaImage:response.data["og:image"] ? response.data["og:image"] : "",
          metaDesc:response.data["og:description"]
        }
      } else {
        previewMetaData = ""
      }
        console.log('previewMetaData', previewMetaData)
      })
      .catch((error) => {
        console.log('fetch_preview_error', error)
      });
      return previewMetaData;
};


export { fetchPreview };
