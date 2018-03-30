/**
 * Global Utilities
 */

var Util = (function() {

  return {

    /**
     * Render function
     * React-likeish.     
     */
    render: function (template, node) {
      if (!node) return;
      node.innerHTML = (typeof template === 'function' ? template() : template);
      var event = new CustomEvent('elementRenders', {
          bubbles: true
      });
      node.dispatchEvent(event);
      return node;
    },



    /**
     * ForEach Utility
     * Ensure we can loop over a object or nodelist
     * @see https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
     */
    forEach: function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    },

    /**
     * Throttle Util
     * Stoopid simple throttle util to control scroll events and so on.
     *
     * @param  {Function}  Function call to throttle.
     * @param  {int}       milliseconds to throttle  method
     * @return {Function}  Returns a throttled function
     */
    throttle: function(callback, ms) {
      var wait = false;
      return function () {
          if (!wait) {
              callback.call();
              wait = true;
              setTimeout(function () {
                  wait = false;
              }, ms);
          }
      };
    },

    /**
     * Has Class
     */
    hasClass: function(el, className) {
      if (el.classList.contains(className)){
        return true;
      }
    },

    /**
     * Returns the index of a given element in relation to its siblings,
     * optionally restricting siblings to those matching a provided selector
     * @param   {Element}   el
     * @param   {string}    [selector]
     * @return  {number}
     */

    index: function(el, selector) {
      var i = 0;

      while ((el = el.previousElementSibling) !== null) {
        if (!selector || el.matches(selector)) {
          ++i;
        }
      }

      return i;
    },

    /**
     * Toggle State
     * A reuseable method to change a data-state attribute
     * (instead of adding/removing classes for state based interactions)
     * @param   {Element}   el
     * @param   {string}    [selector]
     * @param   {string}    [selector]
     */
    toggleState: function (elem, one, two) {
      var el = document.querySelector(elem);
      el.setAttribute('data-state', el.getAttribute('data-state') === one ? two : one);
    },


    /**
     * Enables transitioning from display none to block
     * @param   {Element}   el
     */
    transitionState: function(elem){
      var el = document.querySelector(elem);
      var stateEl = el.getAttribute('data-state');

      if (stateEl  === 'open') {
        elem.setAttribute('data-state', 'closing');
        setTimeout(function(){
          elem.setAttribute('data-state', 'closed');
        }, 800);
      }
      if (stateEl  === 'closed') {
        elem.setAttribute('data-state', 'opening');
        setTimeout(function(){
          elem.setAttribute('data-state', 'open');
        }, 10);
      }
    },

  /**
   * Animation detection util
   */
  whichAnimationEvent: function(){
    var t,
        el = document.createElement("fakeelement");

    var animations = {
      "animation"      : "animationend",
      "OAnimation"     : "oAnimationEnd",
      "MozAnimation"   : "animationend",
      "WebkitAnimation": "webkitAnimationEnd"
    }

    for (t in animations){
      if (el.style[t] !== undefined){
        return animations[t];
      }
    }
  },

  /**
   * JSONP Helper to get around cors issues
   * Essentially like jquery's getJSON
   */
   loadJSONP: function(url, callback, context){
     var unique = 0;
     var name = "_jsonp_" + unique++;
      if (url.match(/\?/)) url += "&callback="+name;
      else url += "?callback="+name;
      // Create script
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

       window[name] = function(data){
         callback.call((context || window), data);
         document.getElementsByTagName('head')[0].removeChild(script);
         script = null;
         delete window[name];
       };

      // Load JSON
      document.getElementsByTagName('head')[0].appendChild(script);
    },
  };
 })();
