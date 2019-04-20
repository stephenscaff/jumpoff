/**
 * WhoDis.js
 * A simple little sniffer. Mostly Using UA (Yikes! 😜)
 * for conditional checks.
 *
 * @return {boolean}
 * @author stephen scaff
 */
const WhoDis = (() => {

  const ua = navigator.userAgent

  return {

    Android() {
      return ua.match(/Android/i)
    },
    BlackBerry() {
      return ua.match(/BlackBerry/i)
    },
    Chrome() {
      return ua.match(/Chrome/i)
    },
    Edge() {
      return ua.match(/Edge/i)
    },
    Firefox() {
      return ua.match(/Firefox/i)
    },
    IE() {
      return ua.match(/Trident/i)
    },
    IEMobile() {
      return ua.match(/IEMobile/i)
    },
    IE10() {
      return ua.match(/MSIE/i)
    },
    iOS() {
      return ua.match(/iPhone|iPad|iPod/i)
    },
    Opera() {
      return ua.match(/Opera Mini/i)
    },
    OperaMini() {
      return ua.match(/Opera Mini/i)
    },
    Safari() {
      return !!ua.match(/Version\/[\d\.]+.*Safari/)
    },
    Touch() {
      return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
    },

    /**
     * Any Microsoft
     */
    anyMS() {
      return (
        WhoDis.IE10() ||
        WhoDis.IE()   ||
        WhoDis.Edge()
      )
    },

    /**
     * Any Mobile
     */
    anyMobile() {
      return (
        WhoDis.Android()    ||
        WhoDis.BlackBerry() ||
        WhoDis.iOS()        ||
        WhoDis.OperaMini()  ||
        WhoDis.IEMobile()
      )
    },

    /**
     * Any Modern Browser
     */
    anyModern() {
      return (
        WhoDis.Chrome()  ||
        WhoDis.Firefox() ||
        WhoDis.Safari()
      )
    }
  }
})()

// Export
export default WhoDis;
