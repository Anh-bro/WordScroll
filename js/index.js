var doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector("ul"),
  container: document.querySelector(".container"),
};
/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象：
 * {time:开始时间,words:歌词内容}
 *  */
function parseLrc() {
  var lines = lrc.split("\n");
  var result = [];
  //   console.log(lines);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // console.log(line);
    var part = line.split("]");
    var timeStr = part[0].substring(1);
    var timeObj = parseTime(timeStr);
    // console.log(parseTime(timeStr));
    var obj = {
      time: timeObj,
      words: part[1],
    };
    //   console.log(obj);
    result.push(obj);
  }
  return result;
  //   console.log(result);
}

/**将一个时间字符串解析为数字（秒 ）
 *@param {String} timeStr 时间字符串
 *@returns
 */
function parseTime(timeStr) {
  var min = timeStr.split(":")[0];
  var sec = timeStr.split(":")[1];
  return parseFloat(min) * 60 + parseFloat(sec);
}

/***
 * 计算出当前播放器播放情况下
 * lrcData数组中应该高亮的歌词下标
 */
function findIndex() {
  // console.log(doms.audio.currentTime);
  var currentTime = doms.audio.currentTime;
  for (var i = 0; i < lrcData.length; i++) {
    if (currentTime < lrcData[i].time) {
      return i - 1;
    }
  }
  return lrcData.length - 1;
}

var lrcData = parseLrc();
// console.log(lrcData);
//界面

/***
 * 创建歌词元素li
 */
function createLrcElements() {
  var frag = document.createDocumentFragment();
  for (var i = 0; i < lrcData.length; i++) {
    var li = document.createElement("li");
    li.textContent = lrcData[i].words;
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag);
}
createLrcElements();

/***
 * 设置ul元素的偏移量
 */
var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
var maxOffset = doms.ul.clientHeight - containerHeight;
function setOffset() {
  var index = findIndex();
  var offSet = liHeight * index + liHeight / 2 - containerHeight / 2;
  if (offSet < 0) {
    offSet = 0;
  } else if (offSet > maxOffset) {
    offSet = maxOffset;
  }
  doms.ul.style.transform = "translateY(" + -offSet + "px)";

  var li = doms.ul.querySelector(".active");
  if (li) {
    li.classList.remove("active");
  }
  var li = doms.ul.children[index];
  if (li) {
    li.classList.add("active");
  }
}

doms.audio.addEventListener("timeupdate", setOffset);
