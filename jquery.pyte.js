/*!
 * Pyte is a JavaScript dependency management and deployment library.
 *
 * @required jQuery v1.4.*
 * @required jquery.inherit - Inheritance plugin by Filatov Dmitry
 *
 * Copyright (c) 2010 Christian Angermann
 * @link http://github.com/psyk/jquery-pyte
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
     * @public
     * Append one or more classes to the document.
     * @example $.pyte.include("foo.bar.Map", "foo.bar.Settings");
     * @param {String} classPaths Path to classes e.g. "foo.bar.GeoCoder"
     */
    include: function(classPaths) {
      $.each(arguments, function(i, classPath) {
        if (!$.grep($.pyte.includedScripts, function(value) { 
          return value.match(classPath); }).length
        ) {
          $.pyte.namespace(classPath);
          $.pyte._load(classPath.replace(/\./g, "/") + '.js');
          $.pyte.includedScripts.push(classPath);
        }
      });
    },

    /**
     * @public
     */
    load: function(sources){
      $.each(arguments, function(i, source) {
        $.pyte._load(source);
      });
    },

    /**
     * @private 
     * Dynamically loads a script file.
     * @param {String} script Path to script e.g. "javascripts/foo/bar/GeoCoder.js"
     */  
    _load: function (script) {
      script = $.pyte._basePath + script;
      
      // find script in _loadedScripts and stopt load request
      if (!!$.grep(this._loadedScripts, function(loadedScripts) {
        return loadedScripts.match(script); }).length
      ) { 
        return !1; // false 
      }
      
      var code = $.ajax({url: script, async: false}).responseText + 
        '\n//@ sourceURL=' + script; // guarantees the debug in Firebug

      // feature support is available on jquery version 1.4.*
      if (!$.support.leadingWhitespace) { // msie
        window.execScript(code);
      } else if (!$.support.checkOn) { // webkit
        $('head').append('<script type="text/javascript">' + code + '</script>');
      } else {
        window.eval(code);
      }
      $.pyte._loadedScripts.push(script);
    },
    
    /**
     * @private
     */
    _Namespace: {
      /**
       * Provides a package namespace. 
       * 
       * @param {String} namespace  Namespace e.g. "for.bar.events".
       * @return Returns the base package of namespace.
       * @type Object
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
       * @example $.inject([1,2,3], 0, function(a) { return a + this; }) // => 6
       * @param {Array/Object} enumerable
       * @param {Array/Object} initialValue
       * @param {Function} callback
       * @return 
       * @type Array/Object
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
    }

  };

  /**
   * Contains all loaded script urls and prevents double ajax requests
   * @type Array
   */
  $.pyte._loadedScripts = [];
  $.grep($("script"), function(script) {
    if(!!script.src.length && script.src.match(document.location.host)) {
      $.pyte._loadedScripts.push(script.src); }
    else { return; }
  });

  $.pyte.includedScripts = (typeof pyte_preloaded != 'undefined') ?
    pyte_preloaded :
    [];

  $($.pyte.includedScripts).each($.pyte._Namespace);

})(jQuery);



/**
 * @public
 * Shorthand way to call of $.pyte.Namespace.create(namespace); method
 */
$.pyte.namespace = function (namespace){
  $.pyte._Namespace.create(namespace);
};

/**
 * Page module constructed via it's class literal.
 * 
 * @private
 * @constructor
 * @example new $.pyte._Module("foo.bar.Map", {container: "map1"});
 * @param {String} klass Class literal.
 * @param {Object} [options]  Options to pass to constructor.
 * @param {Function} [callback]  Callback when module is initialized.
 */
$.pyte._Module = $.inherit({
  __constructor: function(klass, options, callback) {
    this.args = $(arguments).slice(1);
    this.klass = klass;
    this.options = this.args[0];
    this.callback = this.args[1];
    $.pyte.include(klass);
    $.pyte._Module._modules.push(this);
  }
});

$.pyte._Module._modules = [];

/**
 * @private
 * Initialize all modules on DOM load.
 */
$.pyte._Module._initialize = function() {
  $.each($.pyte._Module._modules, function(index, module) {
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
 * @public
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
    new $.pyte._Module(klass, options, function() {
      window.application = this;
      if (callback) {
        callback.apply(this);
      }
    });
  }
});

$(function() {
  $.pyte._Module._initialize();
});