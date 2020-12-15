(function() {
  var utils = {
    findSibling: function(element, selector) {
      if(/^./.test(selector)) {
        var className = selector.substring(1);
        var nextElementSibling = element.nextElementSibling;
  
        if (!nextElementSibling) {
          return null;
        }
  
        var hasClassElement = nextElementSibling.classList.contains(className)
  
        if (hasClassElement) {
          return nextElementSibling;
        }
  
        return utils.findSibling(nextElementSibling, selector);
      }
    }
  }
  
  
  var PostsHandler = {
    parseSearchPosts: function (response) {
      return response.json();
    },
    setDataInWindow: function (responseBody) {
      window.iCloud = window.iCloud || {};
      window.iCloud.posts = responseBody.posts || [];
      window.iCloud.posts.forEach(post => {
        post.disassembledContent = encodeURI(post.content);
      })
      
      return responseBody;
    }
  }
  
  var fetchSearchPosts = function () {
    return fetch("/search.json")
      .then(PostsHandler.parseSearchPosts)
      .then(PostsHandler.setDataInWindow);
  }
  
  var addFilteringEvent = function () {
    /* filter 함수는 성능이 더러운 관계로 추후 수정 */
    var initialrizeFiltering = function() {
      window.iCloud = window.iCloud || {};
      window.iCloud.filtering = window.iCloud.filtering || {};
      window.iCloud.filtering.posts = window.iCloud.posts || [];
    }
  
    initialrizeFiltering();
  
    var createSearchSelectorElement = function (filteredValues) {
      var ListItems = filteredValues.map((filteredValue) => {
        return `<li><a href="${filteredValue.url}">${filteredValue.title}</a></li>`
      }).join("");
  
      return `<ul>${ListItems}</ul>`
    }
    
    var filterSelector = document.querySelector(".filter_select");
    if (!filterSelector) {
      return;
    }
    filterSelector.addEventListener("change", function (event) {
      window.iCloud.filtering.value = event.target.value || '';
      if (window.iCloud.filtering.value) {
        window.iCloud.filtering.posts = window.iCloud.posts.filter((post) => post.categories.includes(window.iCloud.filtering.value));
      } else {
        window.iCloud.filtering.posts = window.iCloud.posts;
      }
      
      console.log(window.iCloud.filtering.posts);
    });
  
    var searchBoxs = document.querySelectorAll(".inp_search");
    searchBoxs.forEach(function (searchBox) {
      searchBox.addEventListener("input", function (event) {
        var searchValue = event.target.value;
  
        if(!searchValue.trim()) {
          return console.log([]);
        }
  
        var searchedPosts =  window.iCloud.filtering.posts.filter((post) => {
          var disassembledSearchValue = encodeURI(searchValue);
          var isIncludeContent = post.disassembledContent.includes(disassembledSearchValue);
          var isIncludeTitle = post.title.includes(searchValue);
          return isIncludeContent || isIncludeTitle;
        })
  
        var SearchSelectorElement = createSearchSelectorElement(searchedPosts);
        var SearchSelectorWrapper = utils.findSibling(filterSelector.nextElementSibling, ".search_selector");
        
        if (!SearchSelectorWrapper) {
          var createSearchSelectorWrapper = document.createElement("div");
          createSearchSelectorWrapper.classList.add("search_selector");
          filterSelector.parentElement.appendChild(createSearchSelectorWrapper);
          SearchSelectorWrapper = createSearchSelectorWrapper;
        }
  
        SearchSelectorWrapper.innerHTML = SearchSelectorElement;
      })
    })
  };
  
  fetchSearchPosts()
    .then(addFilteringEvent);
}());