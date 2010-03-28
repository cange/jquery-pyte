/*!
 * Pyte is a JavaScript dependency management and deployment library. v1.1.4-dev
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
(function ($, window) {
  
  $.pyte = {
    /**
     * @private
     * @type String
     */
    _basePath: "/javascripts/",
    
    /**
     * @public 
     * Define the root directory to load the JavaScripts.
     * @param {String} path New path of directory.
     */
    setBasePath: function (path) {
      this._basePath = typeof path == 'string' ? path : this._basePath;
    },
    
    /**
     * @public
     * Converts a nested array into a one-dimensional array.
     * @param {Array} Array
     * @return Returns a one-dimensional version of the array.
     * @type Array     
     */
    flatten: function (args) {
      var flatArgs = [];
      $.each(args, function (index, arg) {
        if ($.isArray(arg)) {
          if (index > 0) {
            flatArgs = $(args).slice(0, index);
          }
          args = $.merge(
            $.merge(flatArgs, arg), 
            $(args).slice(index + 1, args.length)
          );
        }
      });
      return args;
    },
    
    /**
     * Contains all loaded script urls and prevents double ajax requests
     * @type Array
     */
    _loadedUrls: [],
    
    includedUrls: (typeof pyte_preloaded != 'undefined') ? pyte_preloaded : []
  };
  
  $.grep($("script"), function (script) {
    if(!!script.src.length && script.src.match(document.location.host)) {
      $.pyte._loadedUrls.push(script.src);
    } else { return; }
  });
  
  $.extend({
    /**
     * @public
     * Append one or more classes to the document.
     * @example $.require("foo.bar.Map", "foo.bar.Settings", "path/to/script.js");
     * @param {String} classPaths Path to classes e.g. "foo.bar.GeoCoder" or a 
     *  path to a script file.
     */
    require: function (classPaths) {
      $.each($.pyte.flatten(arguments), function (i, uri) {
        if (!$.grep($.pyte.includedUrls, function (url) { 
          return url.match(uri); 
        }).length
        ) {
          // construct prevents misinterpretations
          var isUri = new RegExp('\/*.js$', 'gi'), 
          script;
          
          if (!isUri.test(uri)) {
            $.namespace(uri);
            $.pyte.includedUrls.push(uri);
            // transform a class path e.g. "foo.bar.MyClass" to "foo/bar/MyClass.js"
            uri = uri.replace(/\./g, "/") + '.js';
          }
          uri = $.pyte._basePath + uri;
          
          // find uri in _loadedUrls and stopt load request
          if (!!$.grep($.pyte._loadedUrls, function (loadedUrl) {
            return loadedUrl.match(uri); }).length
          ) { 
            return false;
          }
          
          script = $.ajax({url: uri, async: false}).responseText;
            
          // feature support is available on jquery version 1.4.*
          // dojo: investigate Joseph Smarr's technique for IE:
          // http://josephsmarr.com/2007/01/31/fixing-eval-to-use-global-scope-in-ie/
          // @see http://trac.dojotoolkit.org/ticket/744
          if ($.support.scriptEval) {
            window.eval(script + '\r\n//@ sourceURL=' + uri); // debugging assist for Firebug
          } else { // msie
            $.globalEval(script);
          }
          
          $.pyte._loadedUrls.push(uri);
        }
      });
    },
        
    /**
     * Provides a package namespace. 
     * 
     * @param {String/Array} namespaces  Namespace e.g. "for.bar.events".
     * @return Returns the base package of namespace.
     * @type Object
     */
    namespace: function (namespaces) {
     // Enumerable inject helper method
      $.each($.pyte.flatten(arguments), function (i, namespace) {
        var _window = window;
        $.each(namespace.split("."), function (i, part) {
          _window = !!_window[part] ? _window[part] : _window[part] = {};
        });
      });
    }
  });

  /**
   * Register all initial include urls.
   */
  $.each($.pyte.includedUrls, $.namespace);
    
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
    __constructor: function (klass, options, callback) {
      this.klass = klass;
      this.options = options;
      this.callback = callback;
      $.require(klass);
      $.pyte._Module._modules.push(this);
    }
  });
  
  $.pyte._Module._modules = [];
  
  /**
   * @private
   * Initialize all modules on DOM load.
   */
  $.pyte._Module._initialize = function () {
    $.each($.pyte._Module._modules, function (index, module) {
      window.eval("var Klass = " + module.klass);
      var instance = new Klass(module.options);
      if (module.callback) {
        module.callback.apply(instance);
      }
    });
  };
  
})(jQuery, window);

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
  __constructor: function (klass, options, callback) {
    if($.isFunction(options)) {
      callback = options;      
      options = {};
    }
    new $.pyte._Module(klass, options, function () {
      window.application = this;
      if (callback) {
        callback.apply(this);
      }
    });
  }
});

/** shorthanded way for ready() to initialize */
$(function () {
  $.pyte._Module._initialize();
});