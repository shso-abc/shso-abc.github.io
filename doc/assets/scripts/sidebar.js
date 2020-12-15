
/**
 * @date 2020-12-07
 * @type function
 * @description `objectDistance`간의 거리에 맞추어 아웃링크 아이콘의 위치를 재정렬한다. CSS로 해결이 안되기 때문에 JS로 작업하였다.
 * @author sherlock.code
 */
function setOutLinkIcon() {
  var externalLinks = document.querySelectorAll(".external_link");
  var objectDistance = -8;

  externalLinks.forEach(function (externalLink) {
    var externalWrapper = externalLink.querySelector(".external_wrapper");
    var externalTitle = externalLink.querySelector(".external_title");
    var externalIcon = externalLink.querySelector(".external_icon");

    var externalWrapperWidth = externalWrapper.offsetWidth;
    var externalTitleWidth = externalTitle.getBoundingClientRect().width;
    var fontSize = window.getComputedStyle(externalTitle, null).getPropertyValue('font-size');
    var parsedFontSize = parseInt(fontSize, 10);

    var relateWidth = externalWrapperWidth - externalTitleWidth;
    externalIcon.style.right = (relateWidth - parsedFontSize + objectDistance) + "px";
  })
}

/**
 * @date 2020-12-04
 * @type function
 * @description 엘리먼트의 하위 리스트들의 클래스 "on"을 제거한다.
 * @author sherlock.code
 */
function offClassListChildren(element) {
  var childrenList = element.querySelector("ul");
  if (!childrenList) { return; }
  childrenList.querySelectorAll("li").forEach(function(listItem) {
    listItem.classList.remove("on");
  })
}

/**
 * @date 2020-12-04
 * @type function
 * @description 사용자가 클릭한 엘리먼트의 이웃한 엘리먼트들과 그 엘리먼트들의 하위 엘리먼트들의 클래스 "on"을 제거한다.
 * @author sherlock.code
 */
function offClassListSiblingsAndChildren(element) {
  (function offClassListNextSibling(element) {
    var nextElementSibling = element.nextElementSibling;
    if (!nextElementSibling) { return; }
    nextElementSibling.classList.remove("on");
    offClassListChildren(nextElementSibling);
    if (nextElementSibling.nextElementSibling) {
      offClassListNextSibling(nextElementSibling);
    }
  }(element));

  (function offClassListPreviousSibling(element) {
    var previousElementSibling = element.previousElementSibling;
    if (!previousElementSibling) { return; }
    previousElementSibling.classList.remove("on");
    offClassListChildren(previousElementSibling);
    if (previousElementSibling.previousElementSibling) {
      offClassListPreviousSibling(previousElementSibling);
    }
  }(element));
}

/**
 * @date 2020-12-04
 * @type event
 * @description 카테고리 GNB 펼치기/접기 기능을 부여한다.
 * @author sherlock.code
 */
document.addEventListener("DOMContentLoaded", function () {
  var categories = document.querySelectorAll('#gnbContent .tit_category');
  categories.forEach(function (element) {
    element.addEventListener("click", function (event) {
      var closestTargetElement = window.GuideCenterTool.Element.getParentClosestElement(event.target, 'li');
      offClassListSiblingsAndChildren(closestTargetElement);
      closestTargetElement.classList.toggle("on");
      setOutLinkIcon();
    })
  });
})

/**
 * @date 2020-12-04
 * @type event
 * @description SVG의 로딩이 필요하기 때문에 window 로드 후에 아이콘을 설정한다.
 * 만약 리소스 양이 많아져서 안될 경우 SVG를 인터널로 교체하는 방법을 고려.
 * @author sherlock.code
 */
window.addEventListener("load", function() {
  setOutLinkIcon();
})