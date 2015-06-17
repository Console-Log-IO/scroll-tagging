
/*jslint browser: true*/
var ScrollTagging = function (options) {
  var scrollPos = null,
    dir,
    lastPos = 0,
    elemsToTag = [],
    edgeElemsToTag = [];

  options = $.extend({
    className: 'scrollTagMe',
    dataAttr: 'data-scrollSpec',
    multiTag: false
  }, options);

  function setTaggingData() {
    var pageHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight,
      taggableEl = {};
    elemsToTag = []; //variable global to ScrollTagging
    edgeElemsToTag = []; //variable global to ScrollTagging

    $('.' + options.className).each(function () {
      taggableEl = {};
      //Set our taggable element object
      taggableEl = {
        'el': $(this),
        'elCenter': $(this).offset().top + ($(this).height() / 2),
        'elBottom': $(this).offset().top + $(this).height(),
        'elTop': $(this).offset().top,
        'tagged': false
      };

      if ($(this).attr('data-tagged') === '1') {
        taggableEl.tagged = true;
      }
      //Add the object to either the array of edge elements or array of non-edge elements
      if (($(this).offset().top + ($(this).height() / 2)) < $(window).height() / 2 ||
          $(this).offset().top > (pageHeight - ($(window).height() / 2))) {
        edgeElemsToTag.push(taggableEl);
      } else {
        elemsToTag.push(taggableEl);
      }
    });
  }

  function tagEl(elToTag) {
    //tag element
    elToTag.tagged = true;
    elToTag.el.attr('data-tagged', '1');
    console.log(elToTag.el.attr(options.dataAttr));
  }


  function checkScrollDir() {
    //determine direction user is scrolling in
    if (scrollPos >= lastPos) {
      dir = 'D';
    } else {
      dir = 'U';
    }
  }

  function isElTaggable() {
    //check if element should be tagged
    var viewportMiddle, i, curEl;
    viewportMiddle = scrollPos + ($(window).height() / 2);

    for (i = 0; i < elemsToTag.length; i++) {
      curEl = elemsToTag[i];
      if (curEl.elCenter <= viewportMiddle && dir === 'D' && viewportMiddle < curEl.elBottom) {
        if (!curEl.tagged) {
          tagEl(curEl);
        }
        break;
      }
      if (curEl.elCenter >= viewportMiddle && dir === 'U' && viewportMiddle > curEl.elTop) {
        if (!curEl.tagged) {
          tagEl(curEl);
        }
        break;
      }

      if (options.multiTag) {
        curEl.tagged = false;
        curEl.el.attr('data-tagged', '0');
      }
    }
  }
  

  function isEdgeElTaggable() {
    //check if element should be tagged
    var curEl,
      windowHeight = $(window).height(),
      i;
    for (i = 0; i < edgeElemsToTag.length; i++) {
      curEl = edgeElemsToTag[i];
      if (curEl.elTop >= scrollPos && curEl.elBottom <= scrollPos + windowHeight) {
        if (!curEl.tagged) {
          tagEl(curEl);
        }
      } else {
        if (options.multiTag) {
          curEl.tagged = false;
          curEl.el.attr('data-tagged', '0');
        }
      }
    }
  }

  function checkTags() {
    //set variables
    scrollPos = $(window).scrollTop();
    checkScrollDir();
    lastPos = scrollPos;

    //parse elements
    isElTaggable();
    isEdgeElTaggable();
  }

  function setListeners() {
    $(window).on('scroll touchmove', function () {
      checkTags(); // function that will handle iterating through our tagged elements
    });
    $(window).on('resize', function () {
      setTaggingData(); // set arrays containing our taggable data
    });
  }

  function init() {
    setListeners();
    setTaggingData();
  }
  init();
};