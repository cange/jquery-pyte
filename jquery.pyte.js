/*!
 * Pyte is a JavaScript dependency management and deployment library. v1.0RC3
 *
 * @required jQuery v1.4.*
 *
 * Copyright (c) 2010 Christian Angermann
 * @link http://github.com/psyk/pyte
 *
 * This script is an adaptation of the extension for pyte prototypejs
 * by Martin Kleppe
 * @link http://github.com/aemkei/pyte
 *
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */ 
(function($) {
  
  $.pyte = {
    /**
     * If a root directory to load the javascripts used by ajax
     * @type {String}
     */
    _basePath: "/javascripts/",

    /**
     * Append one or more classes to the document.
     * @example $.pyte.include("foo.bar.Map", "foo.bar.Settings");
     * @param {String} classPaths Path to classes e.g. "foo.bar.GeoCoder"
     */
    include: function(classPaths) {
      $.each(arguments, function(i, classPath) {
        if (!$.grep($.pyte.includedScripts, function(value) { 
          return value.match(classPath); }).length
        ) {
          $.pyte.Namespace.create(classPath);
          $.pyte.load(classPath.replace(/\./g, "/") + '.js');
          $.pyte.includedScripts.push(classPath);
        }
      });
    },

    /**
     * Dynamically loads a script file.
     * @param {String} script Path to script e.g. "javascripts/foo/bar/GeoCoder.js"
     */  
    load: function (script) {
      // find script in _loadedScripts and stopt load request
      if (!!$.grep(this._loadedScripts, function(loadedScripts) {
        return loadedScripts.match(script); }).length
      ) { 
        return !1; // false 
      }

      var code = $.ajax({url: $.pyte._basePath + script, async: false}).responseText + 
        '\n//@ sourceURL=' + script; // guarantees the debug in Firebug

      if (!$.support.leadingWhitespace) { // msie
        window.execScript(code);
      } else if (!$.support.checkOn) { // webkit
        $('head').first()
          .append('<script type="text/javascript">' + code + '</script>');
      } else {
        window.eval(code);
      }
      $.pyte._loadedScripts.push(script);
    }
  };

  /**
   * Contains all loaded script urls and prevents double ajax requests
   * @type {Array} 
   */
  $.pyte._loadedScripts = [];
  $.grep($("head script"), function(script) {
    if(!!script.src.length && script.src.match(document.location.host)) {
      $.pyte._loadedScripts.push(script.src); }
    else { return; }
  });

  $.pyte.includedScripts = (typeof pyte_preloaded != 'undefined') ?
    pyte_preloaded :
    [];

  $($.pyte.includedScripts).each($.pyte.Namespace);

})(jQuery);


$.pyte.Namespace = {

  /**
   * Provides a package namespace. 
   * 
   * @example $.pyte.Namespace.create("for.bar.events");
   * @param {String} namespace  Namespace e.g. "for.bar.events".
   * @return {Object} Returns the base package.
   */
  create: function(namespace) {
    return this.inject(namespace.split("."), window, function(base){
      return (base = base[this] || (base[this] = {}));
    });
  },

  /** 
   * Inspired by Xavier Shay
   * @link http://github.com/xaviershay/jquery-enumerable
   * Enumerable helper method
   * @example $.inject([1,2,3], 0, function(a) { return a + this }) // => 6
   * @param {Array/Object} enumerable
   * @param {Array/Object} initialValue
   * @param {Function} callback
   */
  inject: function (enumerable, initialValue, callback) {
    var accumulator = initialValue;
    $.each(enumerable, function (index) {
        accumulator = callback.call(this, accumulator, index);
    });
    return accumulator;
  },
  
  /**
   * Incluses a list of classes.
   * @param {Array} classes Classes to include.
   */
  include: function(classes) {
    $.each(arguments, $.pyte.include);
  }
};

/**
 * Page module constructed via it's class literal.
 *
 * @constructor
 * @example new $.pyte.Module("foo.bar.Map", {container: "map1"});
 * @param {String} klass Class literal.
 * @param {Object} [options]  Options to pass to constructor.
 * @param {Function} [callback]  Callback when module is initialized.
 */
$.pyte.Module = $.inherit({
  __constructor: function(klass, options, callback) {
    this.args = $(arguments).slice(1);
    this.klass = klass;
    this.options = this.args[0];
    this.callback = this.args[1];
    $.pyte.include(klass);
    $.pyte.Module._modules.push(this);
  }
});

$.pyte.Module._modules = [];

/**
 * Initialize all modules on DOM load.
 */
$.pyte.Module._initialize = function() {
  $.each($.pyte.Module._modules, function(index, module) {
    window.eval("var Klass = " + module.klass);
    var instance = new Klass(module.options);
    if (module.callback) {
      module.callback.apply(instance);
    }
  });
};


/**
 * Load and run an application class. The application will be global
 * accessible as "application".
 * 
 * @constructor
 * @example new Application("foo.bar.app.MyApp");
 * @param {String} klass Class reference as string pattern.
 * @param {mixed} [options/callback] Some parameter for initial class.
 * @param {Function} [callback]  Callback method to run when app is initialized.
 */
var Application = $.inherit({
  __constructor: function(klass, options, callback) {
    if($.isFunction(options)){
      callback = options;      
      options = {};
    }
    new $.pyte.Module(klass, options, function() {
      window.application = this;
      if (callback) {
        callback.apply(this);
      }
    });
  }
});

$(document).ready(function() {
  $.pyte.Module._initialize();
});