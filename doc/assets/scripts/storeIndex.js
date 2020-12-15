(function(){
  console.log('storeIndex js file load');

  function trimmerEnKo(token) {
    return token
      .replace(/^[^\w가-힣]+/, '')
      .replace(/[^\w가-힣]+$/, '');
  };

  var searchDataIndex = (function(){
    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var index = lunr(function () {
      this.pipeline.reset();
      this.pipeline.add(
        // trimmerEnKo,
        lunr.stopWordFilter,
        lunr.stemmer
      );
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('content');
      this.field('path');
    });
    var rawData = new Map();
    var isCompleted = false;

    return {
      addRow: function (row) {
        rawData.set(row.id, row);
        index.add(row);
      }, 
      search: function (input) {
        var resultIndex = index.search(input);
        var resultFinal = [];
        resultIndex.forEach(function(el) {
          resultFinal.push(rawData.get(el.ref));
        });
        return resultFinal;
      },
      isCompleted: function () {
        return isCompleted;
      },
      setCompleted: function () {
        isCompleted = true;
      }
    };
  })();
  window.searchDataIndex = searchDataIndex;

  /**
   * suggestionType: 
   *  - suggest(일반 autocomplete)
   *  - related(연관 검색어)
   */
  var suggestionDataIndex = (function(){

    var indexSuggest = null;
    var indexRelated = null;
    var rawSuggest = new Set();
    var rawRelated = {
      key: new Set(),
      keyInfo: new Map(),
      values: [],
    };
    var lastSizeRawSuggest = 0;
    var isCompleted = false;

    var makeDataIndex = function (fildTypes) {
      return lunr(function () {
        this.pipeline.reset();
        this.pipeline.add(
          lunr.stopWordFilter,
          lunr.stemmer
        );
        this.field('id');
        var that = this;
        fildTypes.forEach(function (el) {
          that.field(el);
        });
      });
    };

    // init 
    indexSuggest = makeDataIndex(['suggest']);
    indexRelated = makeDataIndex(['related']);

    return {
      addRowToSuggest: function(row) {
        rawSuggest.add(row.suggest);
        if (rawSuggest.size > lastSizeRawSuggest) {
          indexSuggest.add({ 'id': rawSuggest.size - 1, 'suggest': row.suggest });
          lastSizeRawSuggest = rawSuggest.size;
        }
      },
      /**
       * key 가 중복인지 구별하여 중복인 경우에는 기존의 key 에 해당하는 values 에 추가한다. 
       * set 의 index 를 찾기 위한 keyInfo 를 사용하여 key 와 values 를 연결시켰다. 
       * @param {*} row 
       */
      addRowToRelated: function(row) {
        if(rawRelated.key.has(row.keyword)) {
          var thisKey = rawRelated.keyInfo.get(row.keyword);
          row.values.forEach(function (el) {
            rawRelated.values[thisKey].add(el);
          });
        } else {
          rawRelated.key.add(row.keyword);
          var id = rawRelated.key.size - 1; 
          rawRelated.keyInfo.set(row.keyword, id);
          var thisValues = new Set();
          row.values.forEach(function (el) {
            thisValues.add(el);
          });
          rawRelated.values.push(thisValues);
          indexRelated.add({ 'id': id, 'related': row.keyword });
        }
      },
      /**
       * data 추가가 끝난 뒤에는 중복을 방지하기 위해 사용했던 set 을 array 로 변경하다.
       */
      endAddingRow: function() {
        var arrayRawSuggest = [];
        rawSuggest.forEach(function(v) {arrayRawSuggest.push(v)});
        rawSuggest = arrayRawSuggest;
        var arrayRawRelatedKey = [];
        rawRelated.key.forEach(function(v) {arrayRawRelatedKey.push(v)});
        rawRelated.key = arrayRawRelatedKey;
      },
      getSuggest: function(input) {
        var resultIndex = indexSuggest.search(input);
        var resultFinal = []; 
        resultIndex.forEach(function(el) {
          resultFinal.push(rawSuggest[el.ref]);
        });
        return resultFinal;
      },
      getRelated: function(input) {
        var resultIndex = indexRelated.search(input);
        var resultFinal = []; 
        resultIndex.forEach(function(el) {
          var resultKey = rawRelated.key[el.ref];
          var valuesSet = rawRelated.values[el.ref];
          var valuesArr = [];
          valuesSet.forEach(function(v) {valuesArr.push(v)});
          valuesArr.forEach(function(el){
            resultFinal.push(resultKey + ' ' + el);
          });
        });
        return resultFinal;
      },
      isCompleted: function() {
        return isCompleted;
      },
      setCompleted: function () {
        isCompleted = true;
      }
    };
  })();
  window.suggestionDataIndex = suggestionDataIndex;

}())