import * as R from "ramda";
import API from "./api-client";
import { type } from "os";



/**
 * @summary 跟時間有關之函數
 */

/**
 * @description 抓今年年分
 * @returns {number}
 */
export const getThisYear = () => {
  const thisYear = new Date().getFullYear();
  return thisYear;
};


/**
 * @description 抓現在時間(毫秒數)
 * @returns {number}
 */
export const getTimeNow = () => {
  const timeNow = new Date().getTime();
  return timeNow;
};

/**
 * @description 抓某一天的凌晨零點(毫秒數)
 * @param  {number} addDayNum 參數addDayNum，正值代表往後加幾天，負值代表往前加幾天
 * @returns {number}
 */
export const getMidnightTime = (addDayNum) => {
  const timeMidnight = new Date(new Date().setDate(new Date().getDate() + addDayNum)).setHours(0, 0, 0, 0);
  return timeMidnight;
}

/**
 * @description 生日最大只抓到今天
 * @returns {string}
 */
export const getBirthdayMax = () => {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month =
    dateNow.getMonth() + 1 < 10
      ? "0" + (dateNow.getMonth() + 1)
      : dateNow.getMonth() + 1;
  const day =
    dateNow.getDate() < 10 ? "0" + dateNow.getDate() : dateNow.getDate();
  return year + "-" + month + "-" + day;
};


/**
 * @summary 數字相關
 */

/**
 * @description prizeOrder轉成中文
 * @param  {number} order
 * @returns {string}
 */
export const intToChinese = (order) => {
  order = order + "";
  let len = order.length - 1;
  let idxs = [
    "",
    "十",
    "百",
    "千",
    "萬",
    "十",
    "百",
    "千",
    "億",
    "十",
    "百",
    "千",
    "萬",
    "十",
    "百",
    "千",
    "億",
  ];
  let num = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return order.replace(/([1-9]|0+)/g, function ($, $1, idx, full) {
    let pos = 0;
    if ($1[0] !== "0") {
      pos = len - idx;
      if (idx === 0 && $1[0] === 1 && idxs[len - idx] === "十") {
        return idxs[len - idx];
      }
      return num[$1[0]] + idxs[len - idx];
    } else {
      let left = len - idx;
      let right = len - idx + $1.length;
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - (left % 4);
      }
      if (pos) {
        return idxs[pos] + num[$1[0]];
      } else if (idx + $1.length >= len) {
        return "";
      } else {
        return num[$1[0]];
      }
    }
  });
};

/**
 * @description 數字轉千分位
 * @param  {number} num
 * @returns {string}
 */
export const toCurrency = (num) => {
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * @description 創建一個不重複的ID
 * @returns {string}
 */
export const createId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * @description 檔案大小換算成MB
 * @param  {number} fileSize
 */
export const getFileSize = (fileSize) => {
  const finalFileSize = (fileSize / Math.pow(1024, 2)).toFixed(2);
  return finalFileSize < 0.01 ? 0.01 : finalFileSize;
};

/**
 * @summary 正規表達式相關
 */

/**
 * @description 判斷是否為單獨一個emoji的正規表達式
 * @type {regexp}
 */
export const single_emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*$/;



export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};
export const NumberToChinese = num => {
  switch (num) {
    case 0:
      return "日";
    case 1:
      return "一";
    case 2:
      return "二";
    case 3:
      return "三";
    case 4:
      return "四";
    case 5:
      return "五";
    case 6:
      return "六";
  }
};

export const GenerateStars = starInfo => {
  let stars = [];
  for (let i = 0; i < starInfo.starRatingView[0]; i++) {
    stars.push(
      <img
        src="/ap/static/star.svg"
        alt=""
        key={starInfo.itemInfo["name_en-US"] + i}
      />
    );
  }
  for (let i = 0; i < starInfo.starRatingView[1]; i++) {
    stars.push(
      <img
        className="half-start"
        src="/ap/static/half-star.svg"
        alt=""
        key={`half${starInfo.itemInfo.property_id + i}`}
      />
    );
  }
  return stars;
};

export const judgeStar = number => {
  if (number) {
    number = number.split(".");
    number[0] = Number(number[0]);
    if (number[1] === "5") {
      number[1] = 1;
    } else {
      number[1] = 0;
    }
  } else {
    number = [0, 0];
  }
  return number;
};

const filterList = {
  avbl:{
    title:"可訂飯店",
    content: ["僅顯示可預訂的飯店"],
    id: [1],
    filterType: "isCheckBox",
  },
  view: {
    title: "熱門商圈",
    content: [],
    id: [],
    filterType: "isCheckBox",
    hotelCount: []
  },
  price: {
    title: "每晚價格",
    content: ["0-10000"], //資料沒有的話抓這裡
    filterType: "isSlider"
  },
  star: {
    title: "星級評等",
    content: ["3星級 +", "4星級 +", "5星級 +"],
    filterType: "isRadio"
  },
  comment: {
    title: "住客評價",
    content: ["3.5+ 很好！", "4+ 非常好！", "4.5+ 超讚！"],
    filterType: "isRadio"
  },
  service: {
    title: "飯店設施",
    content: [],
    id: [],
    filterType: "isCheckBox"
  },
  theme: {
    title: "主題飯店",
    content: [],
    id: [],
    filterType: "isCheckBox"
  }
};

const mobileFilterList = {
  view: {
    title: "熱門商圈",
    content: [],
    id: [],
    filterType: "isCheckBox",
    hotelCount: []
  },
  price: {
    title: "每晚價格",
    content: ["0-10000"], //資料沒有的話抓這裡
    filterType: "isSlider"
  },
  star: {
    title: "星級評等",
    content: ["3星級 +", "4星級 +", "5星級 +"],
    filterType: "isRadio"
  },
  comment: {
    title: "住客評價",
    content: ["3.5+ 很好！", "4+ 非常好！", "4.5+ 超讚！"],
    filterType: "isRadio"
  },
  service: {
    title: "飯店設施",
    content: [],
    id: [],
    filterType: "isCheckBox"
  },
  theme: {
    title: "主題飯店",
    content: [],
    id: [],
    filterType: "isCheckBox"
  }
};


export const generateCollectOption = filterInfo => {
  if (filterInfo.collect_options) {
    if (!filterList.theme.content.length && filterInfo.collect_options.themes) {
      filterInfo.collect_options.themes.map(item => {
        filterList.theme.content.push(item.name);
        filterList.theme.id.push(item.id);
      });
    }
    if (
      !filterList.service.content.length &&
      filterInfo.collect_options.amenities
    ) {
      filterInfo.collect_options.amenities.map(item => {
        filterList.service.content.push(item.name);
        filterList.service.id.push(item.id);
      });
    }
    if (
      !filterList.view.content.length &&
      filterInfo.collect_options.popular_destination
    ) {
      filterInfo.collect_options.popular_destination.map(item => {
        filterList.view.content.push(item.name);
        filterList.view.id.push(item.id);
        filterList.view.hotelCount.push(item.hotelCount);
      });
    }
  }

  return filterList;
};

export const generateCollectOptionMobile = filterInfo => {
  if (filterInfo.collect_options) {
    if (!mobileFilterList.theme.content.length && filterInfo.collect_options.themes) {
      filterInfo.collect_options.themes.map(item => {
        mobileFilterList.theme.content.push(item.name);
        mobileFilterList.theme.id.push(item.id);
      });
    }
    if (
      !mobileFilterList.service.content.length &&
      filterInfo.collect_options.amenities
    ) {
      filterInfo.collect_options.amenities.map(item => {
        mobileFilterList.service.content.push(item.name);
        mobileFilterList.service.id.push(item.id);
      });
    }
    if (
      !mobileFilterList.view.content.length &&
      filterInfo.collect_options.popular_destination
    ) {
      filterInfo.collect_options.popular_destination.map(item => {
        mobileFilterList.view.content.push(item.name);
        mobileFilterList.view.id.push(item.id);
        mobileFilterList.view.hotelCount.push(item.hotelCount);
      });
    }
  }

  return mobileFilterList;
};
export const generateByOrderAry = (object, array) => {
  const temp = [];
  const newArray = [];
  Object.keys(object).map(item => {
    temp.push(object[item]);
  });
  for (let i of array) {
    newArray.push(R.find(R.propEq("category", i))(temp));
  }
  return newArray;
};

export const generatePeopleInfo = searchOccupancy => {
  let tempAdult = "";
  let tempChild = "";
  searchOccupancy.map((item, i) => {
    if (tempAdult.length) {
      tempAdult += `,${item.split("-")[0]}`;
    } else {
      tempAdult += item.split("-")[0];
    }

    if (item.split("-")[1]) {
      const temp = item.split("-")[1].split(",");
      temp.map(elm => {
        if (tempChild.length) {
          tempChild += `,${i + 1}_${elm}`;
        } else {
          tempChild += `${i + 1}_${elm}`;
        }
      });
    }
  });

  const peopleInfo = {
    adult: tempAdult,
    child: tempChild
  };

  return peopleInfo;
};

export const generateShortSearchType = searchType => {
  let shortSearchType = "";
  switch(searchType){
    case "hotel":
      shortSearchType = "h";
      break
    case "region":
      shortSearchType = "r";
      break
    case "airport":
      shortSearchType = "a";
      break
    case "aiport":    //  待後端修正後清除
      shortSearchType = "a";
      break
    default:
      shortSearchType = "r";
  }

  return shortSearchType;
};

export const generateFilterQueue = (target, filterCollection) => {
  Object.keys(filterCollection).map((item, i) => {
    switch (filterCollection[item].filterType) {
      case "isRadio":
        target[i] = {
          equal: true,
          queue: 0
        };
        break;
      case "isCheckBox":
        target[i] = {
          equal: true,
          queue: [],
          id: filterCollection[item].id
        };
        filterCollection[item].content.map(() => {
          target[i].queue.push(false);
        });
        break;
      case "isSlider":
        target[i] = {
          equal: true,
          queue: [`0-10000`]
        };
        break;
      default:
        break;
    }
  });
  return target;
};
export const generateFilterQueueMobile = (target, filterCollection) => {
  Object.keys(filterCollection).map((item, i) => {
    switch (filterCollection[item].filterType) {
      case "isRadio":
        target[i] = {
          equal: true,
          queue: 0
        };
        break;
      case "isCheckBox":
        target[i] = {
          equal: true,
          queue: [],
          id: filterCollection[item].id
        };
        filterCollection[item].content.map(() => {
          target[i].queue.push(false);
        });
        break;
      case "isSlider":
        target[i] = {
          equal: true,
          queue: [`0-10000`]
        };
        break;
      default:
        break;
    }
  });
  return target;
};




// export const generateOccupancy = (rooms,adults,children) => {
//   const occupancy = [];
//   if(rooms && adults){
//     let adultsInfo = adults.split(',');
//     const childrenList = children?children.split(','):[];
//     for(let i = 0 ; i<rooms ; i++ ){
//       let temp = '';
//       temp+= adultsInfo[i];
//       childrenList.map((item,j)=>{
//         if(item.substring(0,1) === String(i+1)){
//           if(temp.indexOf('-') === -1){
//             temp+= '-';
//           }else{
//             temp+= ',';
//           }
//           temp+=item.split('_')[1];
//         }
//       });
//       occupancy.push(temp);
//     };
//   }else{
//     occupancy.push("2");
//   }
//   return occupancy;
// }

export const generateOccupancy = (rooms,adults,children) => {
  const occupancy = [];
  if(rooms && adults){

  if(rooms > 8) {
    rooms = 8;
  }

  if(rooms < 1 || rooms % 1 !== 0 ) { 
    rooms = 1;
  }

  let adultsInfo = adults.split(',')

  if(rooms < adultsInfo.length) {
    adultsInfo.splice(rooms);
  }
  if(rooms > adultsInfo.length) {
    let gap = rooms-adultsInfo.length;
    for(let i=0; i < gap; i++) {
      adultsInfo.push(2)
    }
  }

  adultsInfo.map((item, i) => {

    if( Number(item) > 14 ) {
      let indexMore = R.indexOf(item, adultsInfo)
      adultsInfo.splice(indexMore,1,14)
    }
    if( Number(item) < 1 || Number(item) % 1 !== 0 ) { 
      let indexLess = R.indexOf(item, adultsInfo)
      adultsInfo.splice(indexLess,1,2)
    }
  })
  
    let childrenList = children?children.split(','):[];
    for(let i = 0 ; i<rooms ; i++ ){
    let temp = '';

    temp+= adultsInfo[i];
    childrenList.map((item,j)=>{

    let childRoomsNo = item.substr(0,1)

    let newChildList = childrenList.sort()
    let childGroup = R.groupWith((a, b) => a.substr(0,1) === b.substr(0,1), newChildList)
    childGroup.map((item,k)=>{
      if(item.length > 6) {
        item.splice(6)
      }
    })
    childrenList=(R.flatten(childGroup))

    if(childRoomsNo > rooms) {
      let indexChild = R.indexOf(item, childrenList)
      childrenList.splice(indexChild,1)
    }
    let childrenAge = item.substr(2)
    if(childrenAge > 17) {
      let indexChildAgeMore = R.indexOf(item, childrenList)
      childrenList.splice(indexChildAgeMore,1,childRoomsNo + "_17")
    }
    if(childrenAge < 0 || childrenAge % 1 !== 0) {
      let indexChildAgeLess = R.indexOf(item, childrenList)
      childrenList.splice(indexChildAgeLess,1,childRoomsNo + "_0")
    }
    if(childrenList[j] !== undefined) {
      if(childrenList[j].substring(0,1) === String(i+1)){
        if(temp.indexOf('-') === -1){
          temp+= '-';
        }else{
          temp+= ',';
        }
        temp+=childrenList[j].split('_')[1];
      }
    }
  });

    occupancy.push(temp);
    };
  }else{
    occupancy.push("2");
  }

  return occupancy;
}

export const generateOrderBy = sortAry => {
  let orderBy = "";
  switch (R.indexOf(true, sortAry)) {
    case 0:
      orderBy = "promo";
      break;
    case 1:
      orderBy = "price";
      break;
    case 2:
      orderBy = "review";
      break;
    case 3:
      orderBy = "star";
      break;
    default:
      orderBy = "promo";
      break;
  }
  return orderBy;
};

export const generateFilterPostData = (postData, filterQueue) => {
  if (isTrueIdContent(filterQueue[1].queue, filterQueue[1].id).length) {
    postData.filterPopularDestination = isTrueIdContent(
      filterQueue[1].queue,
      filterQueue[1].id
    );
  }
  if (filterQueue[3].queue) {
    postData.filterStarType = filterQueue[3].queue;
  }
  if (filterQueue[4].queue) {
    postData.filterReviewType = filterQueue[4].queue;
  }
  if (isTrueIdContent(filterQueue[5].queue, filterQueue[5].id).length) {
    postData.filterAmenities = isTrueIdContent(
      filterQueue[5].queue,
      filterQueue[5].id
    );
  }
  if (isTrueIdContent(filterQueue[6].queue, filterQueue[6].id).length) {
    postData.filterTheme = isTrueIdContent(
      filterQueue[6].queue,
      filterQueue[6].id
    );
  }
  if (filterQueue[2].queue[0].split("-")[1] !== "10000") {
    postData.filterMaxPrice = filterQueue[2].queue[0].split("-")[1];
  }
};


export const generateFilterPostDataMobile = (postData, filterQueue) => {
  if (isTrueIdContent(filterQueue[0].queue, filterQueue[0].id).length) {
    postData.filterPopularDestination = isTrueIdContent(
      filterQueue[0].queue,
      filterQueue[0].id
    );
  }
  if (filterQueue[2].queue) {
    postData.filterStarType = filterQueue[2].queue;
  }
  if (filterQueue[3].queue) {
    postData.filterReviewType = filterQueue[3].queue;
  }
  if (isTrueIdContent(filterQueue[4].queue, filterQueue[4].id).length) {
    postData.filterAmenities = isTrueIdContent(
      filterQueue[4].queue,
      filterQueue[4].id
    );
  }
  if (isTrueIdContent(filterQueue[5].queue, filterQueue[5].id).length) {
    postData.filterTheme = isTrueIdContent(
      filterQueue[5].queue,
      filterQueue[5].id
    );
  }
  if (filterQueue[1].queue[0].split("-")[1] !== "10000") {
    postData.filterMaxPrice = filterQueue[1].queue[0].split("-")[1];
  }
};


export const generateSortArray = orderBy => {
  let temp = [];
  switch (orderBy) {
    case "promo":
      temp = [true, false, false, false];
      break;
    case "price":
      temp = [false, true, false, false];
      break;
    case "review":
      temp = [false, false, true, false];
      break;
    case "star":
      temp = [false, false, false, true];
      break;
    default:
      break;
  }
  return temp;
};

export const generateViewFilterQueue = (
  original,
  filterPopularDestination,
  filterMinPrice,
  filterMaxPrice,
  filterStarType,
  filterReviewType,
  filterAmenities,
  filterTheme,
  avbl
) => {
  const tempfilterMinPrice = filterMinPrice || "0";
  const tempfilterMaxPrice = filterMaxPrice || "10000";
  const rangeString = `${tempfilterMinPrice}-${tempfilterMaxPrice}`;
   
  if(typeof filterPopularDestination === "object"){
    filterPopularDestination.map(item=>{
      let tempIndex = R.indexOf((item),original[1].id);
      if(tempIndex>=0){
        original[1].queue[tempIndex] = true;
      }
    })
  }
  original[1].equal = R.indexOf(true,original[1].queue) === -1;
  
  original[2].queue[0] = rangeString;
  original[2].equal = rangeString === "0-10000";

  if (filterStarType) {
    original[3].queue = filterStarType;
    original[3].equal = false;
  }

  if (filterReviewType) {
    original[4].queue = filterReviewType;
    original[4].equal = false;
  }

  if(typeof filterAmenities === "object"){
    filterAmenities.map(item=>{
      let tempIndex = R.indexOf(Number(item),original[5].id);
      if(tempIndex>=0){
        original[5].queue[tempIndex] = true;
      }
    })
  }
  original[5].equal = R.indexOf(true,original[5].queue) === -1;
  
  if(typeof filterTheme === "object"){
    filterTheme.map(item=>{
      let tempIndex = R.indexOf(Number(item),original[6].id);
      if(tempIndex>=0){
        original[6].queue[tempIndex] = true;
      }
    })
    original[6].equal = false;
  }
  original[6].equal = R.indexOf(true,original[6].queue) === -1;
  
  if(avbl === "1"){
    original[0].equal = false;
    original[0].queue[0] = true;
  }

  return original;
};

export const generateViewFilterQueueMobile = (
  original,
  filterPopularDestination,
  filterMinPrice,
  filterMaxPrice,
  filterStarType,
  filterReviewType,
  filterAmenities,
  filterTheme
) => {
  const tempfilterMinPrice = filterMinPrice || "0";
  const tempfilterMaxPrice = filterMaxPrice || "10000";
  const rangeString = `${tempfilterMinPrice}-${tempfilterMaxPrice}`;
   
  if(typeof filterPopularDestination === "object"){
    filterPopularDestination.map(item=>{
      let tempIndex = R.indexOf((item),original[0].id);
      if(tempIndex>=0){
        original[0].queue[tempIndex] = true;
      }
    })
  }
  original[0].equal = R.indexOf(true,original[0].queue) === -1;
  
  original[1].queue[0] = rangeString;
  original[1].equal = rangeString === "0-10000";

  if (filterStarType) {
    original[2].queue = filterStarType;
    original[2].equal = false;
  }

  if (filterReviewType) {
    original[3].queue = filterReviewType;
    original[3].equal = false;
  }

  if(typeof filterAmenities === "object"){
    filterAmenities.map(item=>{
      let tempIndex = R.indexOf(Number(item),original[4].id);
      if(tempIndex>=0){
        original[4].queue[tempIndex] = true;
      }
    })
  }
  original[4].equal = R.indexOf(true,original[4].queue) === -1;
  
  if(typeof filterTheme === "object"){
    filterTheme.map(item=>{
      let tempIndex = R.indexOf(Number(item),original[5].id);
      if(tempIndex>=0){
        original[5].queue[tempIndex] = true;
      }
    })
    original[5].equal = false;
  }
  original[5].equal = R.indexOf(true,original[5].queue) === -1;
  

  return original;
};

export const generateResultTitle = region_info => {
  let name = "";
  if (typeof region_info !== "undefined") {
    const { country, multi_city_vicinity, region } = region_info;

    if (typeof region !== "undefined") {
      name = region.name;
    } else if (typeof multi_city_vicinit !== "undefined") {
      name = multi_city_vicinity.name;
    } else if (typeof country !== "undefined") {
      name = country.name;
    }
  }

  return name;
};

export const getQueryStringValue = key => {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
};

export const isTrueIdContent = (tfAry, id) => {
  const res = [];
  tfAry.map((item, i) => {
    if (item) {
      res.push(String(id[i]));
    }
  });
  return res;
};

export const trim = strvalue => {
  const ptntrim = /(^\s*)|(\s*$)/g;
  return strvalue.replace(ptntrim, "");
};

export const langCategory = (value) => {
  var regExpEn = /^[\d|a-zA-Z]+$/;
  var regExpCn = /^[\u4e00-\u9fa5]+$/;
  var regExpIncludeCn = /.*[\u4e00-\u9fa5]+.*$/;
  if (regExpEn.test(value)){
    return "allEn"
  }else if(regExpCn.test(value)){
    return "allCn"
  }else if(regExpIncludeCn.test(value)){
    return "includeCn"
  }else{
    return "other"
  }
}
export const isRequired = str => {
  return trim(str).length > 0;
};

export const isEmail = strEmail => {
  return (
    strEmail.search(
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    ) != -1
  );
};

export const isPhone = str => {
  return str.match(/^\d{10}$/g);
}

export const isPassword = str => {
  return str.match(/^\w{6,12}$/g);
}

export const getVerify = async (KaMemberNo) => {
  const postData = {
    "KaMemberNo": KaMemberNo,
  };
  const getData = await API.post("/ap/api/Verify/Register", { comment: postData });
  return getData.data.Data;
};
  
export const onlyNum = num => {
  let re = /^[0-9]+$/;
  return re.test(num);
};

export const onlyEng = str => {
  let re = /[^a-z^A-Z]/g;
  return !re.test(str);
};

export const onlyEngAndNum = str => {
  let re = /[a-zA-Z0-9]/g;
  return re.test(str);
};

export const isExistDate = dateStr => {
  // yyyy/mm/dd
  let dateObj = dateStr.split("/");

  //列出12個月，每月最大日期限制
  let limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let theYear = parseInt(dateObj[0]);
  let theMonth = parseInt(dateObj[1]);
  let theDay = parseInt(dateObj[2]);
  let isLeap = new Date(theYear, 1, 29).getDate() === 29; // 是否為閏年?

  // 若為閏年，最大日期限制改為 29
  if (isLeap) {
    limitInMonth[1] = 29;
  }

  // 比對該日是否超過每個月份最大日期限制
  return theDay <= limitInMonth[theMonth - 1];
};

export const isFreeBreakfast = n =>
  n.filter_room_amenities.free_breakfast === true;

export const isNonSmoking = n => n.non_smoking !== true;

export const isPromotionRoom = n =>
  n.filter_room_amenities.promotion_room === true;

export const isFreeRefund = n => n.filter_room_amenities.free_refund === true;

export const generateTabInfo = (area, city, data, targetId = "") => {
  Object.keys(data).map((item, index) => {
    area.push(item);
    city[index] = [];
    
    Object.keys(data[item]).map(elm => {
      Object.values(data[item][elm]).map((ele, index, array) => {
        const dataID = ele.id;
        if (dataID === targetId) {
          array[index].isTarget = true;
        } else {
          array[index].isTarget = false;
        }
      });
      city[index].push(data[item][elm]);
    });
  });
};

export const reducer = (accumulator,currentValue) => accumulator + currentValue;

export const isIos = (userAgent) => !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export const stopScrollOver = (dom) => {//指定特定區塊禁止任何穿透滾動，dom不能有scroll bar
  const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  document.body.addEventListener("touchstart", () => {
    dom && isIos ? iosTrouchFn(dom) : null;
  });
  const iosTrouchFn = (el) => {
    el.addEventListener("touchmove", (e) => {
      e.isSCROLL = true;
    });
    document.body.addEventListener(
      "touchmove",
      function(e) {
        if (e.isSCROLL) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  };

  return ()=>{
    document.body.removeEventListener("touchstart", () => {
      let divEl;
      divEl = searchPeopleScrollBox.current
      divEl ? isIosStopScroll(divEl) : null;
    });
  }
};
export const iosScrollFixed = (type, isIos) => {
  let touchType = 1;

  let conf = {
    passive: false
  };
  let startY;
  let startX;

  let oldY;
  let oldX;

  const getParentList = dom => {
    let target = dom;
    let list = [];

    while (target) {
      list.push(target);
      target = target.parentElement;
    }

    return list;
  };

  const positionTop = dom => {
    return dom.scrollTop <= 1;
  };

  const positionBottom = dom => {
    return dom.scrollTop + dom.clientHeight >= dom.scrollHeight;
  };
  const positionCenter = dom => {
    return (
      dom.scrollTop + dom.clientHeight < dom.scrollHeight && dom.scrollTop > 1
    );
  };

  const init = (type) => {
    // if (window.$$_no_bounce_inited) return;
    // window.$$_no_bounce_inited = 1;
    let body = document.body;
    body.addEventListener(
      "touchstart",
      (e) => {
        startY = e.touches[0].pageY;
        startX = e.touches[0].pageX;
        oldY = startY;
        oldX = startX;

        if (e.touches[1]) {
          touchType = 0;
          return;
        }

        let scollDoms = getParentList(e.target);

        if (!scollDoms.length) {
          touchType = 0;
          return;
        }

        let topCnt = 0;
        let bottomCnt = 0;
        let centerCnt = 0;
        scollDoms.forEach((dom) => {
          if (positionTop(dom)) topCnt++;
          if (positionBottom(dom)) bottomCnt++;
          if (positionCenter(dom)) centerCnt++;
        });
        let len = scollDoms.length;

        if (topCnt === len && bottomCnt === len && centerCnt === 0) {
          touchType = 3;
          return;
        }
        if (len - topCnt === 1 && centerCnt === 0) {
          touchType = 2;
          return;
        }

        if (topCnt == len && bottomCnt < len && centerCnt === 0) {
          touchType = 1;
          return;
        } else if (touchType == 3) {
          e.preventDefault();
        }

        if (centerCnt > 0) {
          touchType = 0;
          return;
        }

        touchType = 0;

        return;
      },
      conf
    );
    body.addEventListener(
      "touchmove",
      function(e) {
        let endY = e.touches[0].pageY;
        let endX = e.touches[0].pageX;
        if (touchType == 1 && type) {
          if (endY > startY && Math.abs(endX - startX) < Math.abs(endY - startY)) {
            e.preventDefault();
          }
        } else if (touchType == 2 && type) {
          if (endY < startY) {
            e.preventDefault();
          }
        } else if (touchType == 3 && type) {
          e.preventDefault();
        }

        oldY = endY;
      },
      conf
    );
    body.addEventListener(
      "touchend",
      (e) => {
        touchType = 0;
      },
      conf
    );
  };
  isIos ? init(type) : null;
};

