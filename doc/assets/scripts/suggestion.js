(function() {
  console.log('suggestion.js');

  // suggestion 결과를 보여주는 html
  var suggestionView = function (config) {
    var inputElement = config.input;
    var suggestionListDivision = null;
    var currentFocus = null;
    var inputValueKeep = '';

    var closeAllLists = function(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      currentFocus = null;
      inputValueKeep = '';
      if(suggestionListDivision) suggestionListDivision.remove();
      suggestionListDivision = null; 
    };

    var removeActive = function() {
      for (var i= 0; i < suggestionListDivision.children.length; i++) {
        suggestionListDivision.children[i].classList.remove("suggestion-active");
      }
    };

    var addActive = function() {
      if (!suggestionListDivision || !suggestionListDivision.children) return false;
      /*start by removing the "active" class on all items:*/
      removeActive();
      // console.log(currentFocus)
      if (currentFocus >= suggestionListDivision.children.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (suggestionListDivision.children.length - 1);
      console.log(currentFocus)
      /*add class "autocomplete-active":*/
      suggestionListDivision.children[currentFocus].classList.add('suggestion-active');
      inputElement.value = suggestionListDivision.children[currentFocus].getElementsByTagName('input')[0].value; 
    };

    return {
      closeAllLists: closeAllLists,
      create: function(results) {
        if(!results || results.length === 0) return;

        /*create a DIV element that will contain the items (values):*/
        suggestionListDivision = document.createElement('DIV');
        suggestionListDivision.setAttribute('id', inputElement.id + '-suggestion-list');
        suggestionListDivision.setAttribute('class', 'suggestion-items');
        /*append the DIV element as a child of the autocomplete container:*/
        inputElement.parentNode.appendChild(suggestionListDivision);
        currentFocus = -9;
        results.forEach(function(result, idx) {
          /*create a DIV element for each matching element:*/
          var elDiv = document.createElement("DIV");
          /*make the matching letters bold:*/
          elDiv.innerHTML = "<strong>" + result.substr(0, result.length) + "</strong>";
          /*insert a input field that will hold the current array item's value:*/
          elDiv.innerHTML += "<input type='hidden' value='" + result + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          elDiv.addEventListener("click", function(e) {
            /*insert the value for the autocomplete text field:*/
            inputElement.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          suggestionListDivision.appendChild(elDiv);
        });
      },
      selectMove: function(direction){

        // create 될 때 -9, 방향키를 누르면 0 부터 시작 
        if (currentFocus === -9) {
          currentFocus = 0;
          inputValueKeep = inputElement.value;
        } else {
          if(direction === 'UP') {
            currentFocus -= 1;
          } else {
            currentFocus += 1;
          }
        }
        addActive()
      },
      hasSuggestion: function() {
        return suggestionListDivision !== null;
      },
      isSelected: function(){
        return currentFocus === null ? false : currentFocus !== -9;
      },
      inject: function() {
        inputElement.value = suggestionListDivision.children[currentFocus].getElementsByTagName('input')[0].value; 
        closeAllLists();
      },
      restore: function() {
        inputElement.value = inputValueKeep;
      },
      actionEsc: function() {
        inputElement.value = inputValueKeep;
        closeAllLists();
      }
    };
  }

  var suggestion = function(config) {
    var resultDatas = [];

    // 결과의 순서나 결과의 개수를 filtering 
    var filterResultDatas = function(queryResults) {

      var result = [];
      var total = queryResults.reduce(function(acc, cur, idx, arr) {
        return acc += cur.length;
      }, 0);
      if(total > config.RESULT_SHOW_LIMIT_NUM.TOTAL) {
        // 필요하면 정의되는 조건에 맞게 구현

      } else {
        queryResults.forEach(function(queryResult) {
          queryResult.forEach(function(val) {
            result.push(val);
          });
        });
      }
      return result;
    };

    for(var i= 0; i < config.elements.length; i++) {
      var el = config.elements[i]; 
    //   console.log(el);
    // }
    // config.elements.forEach(function(el){
      var view = config.view({
        input: el
      });
      var makeSuggestion = function(e) {
        var searchValue = this.value; 
        resultDatas = [];
        view.closeAllLists();
        if(!searchValue) return;

        var queryResults = [];
        config.queryCallbacks.forEach(function(queryCallback, callbackIndex){
          queryResults[callbackIndex] = queryCallback(searchValue);
          // queryCallback(searchValue).forEach(function(resultData){
          //   resultQuery.push([]);
          // })
        });
        resultDatas = filterResultDatas(queryResults);
        if(resultDatas.length > 0) view.create(resultDatas);
      };
      el.addEventListener("input", makeSuggestion);
      el.addEventListener("keydown", function(e) {
        // console.log(e.keyCode);
        if(e.keyCode === 13){ // enter
          // enter 에 대한 정의를 변경하고자 할때 여기 수정
          // console.log('!!ENTER!!')
          // if(view.isSelected()) {
          //   e.preventDefault();
          //   view.inject();
          // }
        } else if(e.keyCode === 27){ // esc 
          if(view.isSelected()) {
            view.actionEsc();
          }
        } else if(e.keyCode === 38){ //상
          e.preventDefault();
          view.selectMove('UP');
        } else if(e.keyCode === 40){ //하
          if(!view.hasSuggestion()) {
            makeSuggestion.call(this, e);
          } else {
            view.selectMove('DOWN');
            e.preventDefault();
          }
        }
      });
    };
  }

  window.addEventListener('load', function() {
    console.log('window.onload suggestion.js');

    // suggestion ( event listener 추가 포함 )
    suggestion({ 
      elements: document.querySelectorAll(".inp_search"), 
      queryCallbacks: [
        window.suggestionDataIndex.getSuggest,
        window.suggestionDataIndex.getRelated,
      ],
      view: suggestionView,
      RESULT_SHOW_LIMIT_NUM: {
        // 보여지는 결과의 개수 
        TOTAL: 7,
        EACH_QUERY: []
      },
    });
  });
}());
