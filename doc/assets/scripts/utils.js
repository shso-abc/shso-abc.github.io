window.GuideCenterTool = window.GuideCenterTool || {};
window.GuideCenterTool.Element = {};
window.GuideCenterTool.Element.getParentClosestElement = (element, selector) => {
  var isTargetElement = false;
  var parentNodeElement = element.parentNode;

  if (selector.match(/^\w/)) {
    isTargetElement = parentNodeElement.tagName === selector.toUpperCase();
  }

  if (selector.match(/^\./)) {
    isTargetElement = parentNodeElement.classList.contains(selector.replace(/^\./, ''));
  }

  return isTargetElement ? parentNodeElement : window.GuideCenterTool.Element.getParentClosestElement(parentNodeElement, selector);
}