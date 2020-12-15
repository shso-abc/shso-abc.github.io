(function() {
  function displaySearchResults(results) {
    var searchResults = document.getElementById('search-results');
    var searchResultTitle = document.querySelector('.title_result');

    if (results.length) { // Are there any results?
      var appendString = '';

      results.forEach(function (el){
        var resultContent = el.content.substring(0, 500);
        appendString += `<li><a href="${el.url}" class="link_result"><strong class="tit_result">${el.title}</strong>`;
        searchTerm.split(' ').forEach(function(_searchTerm) {
          resultContent = resultContent.replaceAll(_searchTerm, `<span class="txt_target">${_searchTerm}</span>`);
        });
        appendString += `<p class="desc_result">${resultContent}...</p>`;
        appendString += `<span class="path_search">${el.path}</span></a></li>`;
      });
      searchResultTitle.innerHTML = `'${searchTerm}'관련 문서가 ${results.length}건 검색되었습니다.`;
      searchResults.innerHTML = appendString;
    } else {
      searchResultTitle.innerHTML = `'${searchTerm}'관련 검색결과가 없습니다.`;
      searchResults.innerHTML = '<li>검색 결과가 없습니다.</li>';
    } 
  }
  
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);
    var searchResult = window.searchDataIndex.search(searchTerm);
    displaySearchResults(searchResult);
  }

})();
