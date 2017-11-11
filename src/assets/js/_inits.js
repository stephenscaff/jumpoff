/*jshint -W030*/
/*globals feature: false */


/**
 * Global Site inits1
 */
var site = {
  test: function(text) {
    console.log(text);
  }
};

let greeting = 'Bruv';
site.test(`Yeah ${greeting}. Them Components are importing.`);
