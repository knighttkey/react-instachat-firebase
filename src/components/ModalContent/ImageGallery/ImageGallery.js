import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./ImageGallery.scss";
import context, { Provider } from "./../../context";
import * as R from "ramda";


const ImageGallery = (props) => {
    const contextValue = useContext(context);
    const { } = contextValue;
    const { imageGalleryUrl, closeModal, msgList, imageGalleryTargetId, setImageGalleryTargetId, imageBoxListRef } = props;
    const [imageList, setImageList] = useState([]);
    const [imageTarget, setImageTarget] = useState([]);

    useEffect(() => {
        let imageTempList = msgList.filter((item)=>{
            return item.type === "image";
        })
        setImageList(imageTempList);

        let pickedImage = imageTempList.filter((item)=>{
            return item.msgId === imageGalleryTargetId;
        })
        setImageTarget(pickedImage[0]);
    }, [msgList]);

    useEffect(() => {
        if(imageGalleryTargetId) {
            let pickedImage = imageList.filter((item)=>{
                return item.msgId === imageGalleryTargetId;
            })
            setImageTarget(pickedImage[0]);
            let targetThumbnailRef = document.getElementById(imageGalleryTargetId);
            let rect = imageBoxListRef.current.getBoundingClientRect();

            setTimeout(() => {
                if(targetThumbnailRef.offsetTop - 150 < imageBoxListRef.current.clientWidth) {
                    
                } else {
                    imageBoxListRef.current.scrollTo({left: ((targetThumbnailRef.offsetTop-150) - imageBoxListRef.current.clientWidth)/2, behavior:"auto"})

                }
                
            }, 0);
        }
    }, [imageGalleryTargetId]);

    useEffect(() => {
        if(imageBoxListRef) {
            let item = imageBoxListRef.current;
        
            window.addEventListener("wheel", function (e) {
              if (e.deltaY > 0) item.scrollLeft += 100;
              else item.scrollLeft -= 100;
            });

        }
      }, [imageBoxListRef]);

    return (
        <Provider value={contextValue}>
            <div className={`image_gallery_container`}>
                <div className="image_gallery">
                    <div className="close_btn" onClick={closeModal}></div>
                    {/* <div className="title"></div> */}
                    <div className="image_box">
                        <img className="target_image" src={imageTarget ? imageTarget.url : imageGalleryUrl} alt="image"/>

                    </div>
                    <div className="image_list_box" ref={imageBoxListRef}>
                    {imageList.map((item, index)=>{
                        return (
                            <img className={`each_image ${imageGalleryTargetId === item.msgId ? "current":""}`} id={item.msgId} src={item.url} alt="image" key={index} onClick={()=>setImageGalleryTargetId(item.msgId)}/>
                        )
                    })}
                    </div>
                    
                </div>
            </div>
        </Provider>
    );
};
export default ImageGallery;
