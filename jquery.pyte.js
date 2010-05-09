/*!
 * @fileOverview
 * Pyte brings several enhancements, such as namespace support, the loading of
 * remote script files and embedding of style sheets files.
 * @link Copyright (c) 2010 <a href="http://github.com/psyk/jquery-pyte">jquery-pyte</a>.
 */

(function ($, window) {
  /**
   * The <code>pyte</code> object contains several service methods that are the 
   * public methods <code>$.require</code> and <code>$.namespace</code> required.
   * JavaScript provide some OOP characteristics. 
   * Pyte brings several enhancements, such as namespace support, the loading of
   * remote script files and embedding of style sheets files.
   * 
   * @author <a href="dev@psykmedia.de">Christian Angermann</a>
   * @link Copyright (c) 2010 <a href="http://github.com/psyk/jquery-pyte">jquery-pyte</a>.
   * 
   * @link This script was inspired by the extension of 
   * <a href="http://github.com/aemkei/pyte">pyte prototypejs</a> Martin Kleppe.
   * 
   * @link Dual licensed under the MIT and GPL licenses 
   * <a href="http://www.opensource.org/licenses/mit-license.php">MIT license</a> 
   * and <a href="http://www.gnu.org/licenses/gpl.html">GPL</a>.
   * 
   * @version 2010 1.1.8-stable
   * @requires <a href="http.jquery.com">jQuery</a> v1.4.*
   * @requires <a href="http://code.google.com/p/jquery-inheritance/">
   * jquery.inherit</a> - Inheritance plugin by Filatov Dmitry
   * @class 
   */
  $.pyte = {
    /**
     * @public
     * @constant
     * @type String
     * @see #.setBasePath()
     */
    STYLESHEET: 'css',
    
    /**
     * @public
     * @constant
     * @type String
     * @see #.setBasePath()
     */
    JAVASCRIPT: 'js',
    
    /**
     * @default root directory to the JavaScript sources.
     * private
     * @type String
     */
    _basePath: "/javascripts/",
    
    /**
     * @default root directory to the Cascading Style Sheets sources.
     * private
     * @type String
     */
    _styleBasePath: "/stylesheets/",
      
    /**
     * Defines the path to the JavaScripts or Cascading Style Sheets root directory.<br />
     * The base path is the directory which contains the JavaScript files.
     * The path can be changed as follows.
     * @example 
     * // Define a base path to include JavaScript.
     * // As the <em>default</em> is defined the <em>"/javascripts/"</em> path.
     * $.pyte.setBasePath('my/own/path/js/');
     *
     * // Define a base path to embed style sheets.
     * // As the <em>default</em> is defined the <em>"/stylesheets/"</em> path.
     * $.pyte.setBasePath('my/path/to/css/', $.pyte.STYLESHEET);
     * @public
     * @param {String} path New path of directory.
     * @param {String} [type] Type of media $.pyte.JAVASCRIPT or $.pyte.STYLESHEET.
     */
    setBasePath: function (path, type) {
      type = type || $.pyte.JAVASCRIPT;
      if (type == $.pyte.JAVASCRIPT) {
        this._basePath = typeof path == 'string' ? path : this._basePath;
      } else {
        this._styleBasePath = typeof path == 'string' ? path : this._styleBasePath;
      }
    },
      
    /**
     * Converts a nested array into a one-dimensional array.
     * @public
     * @example $.pyte.flatten([1, [2, 3], 4]); // returns [1, 2, 3, 4]
     * @param {Array} args Nested array to be normalized
     * @return {Array} Returns a one-dimensional version of the array.
     */
    flatten: function (args) {
      var flatArgs = [];
      $.each(args, function (index, arg) {
        if ($.isArray(arg)) {
          args = $.merge(
            $.merge(index > 0 ? $(args).slice(0, index) : flatArgs, arg), 
            $(args).slice(index + 1, args.length)
          );
        }
      });
      return args;
    },
    
    /**
     * Contains all loaded script urls and prevents double load of this urls.
     * @private
     * @type Array
     */
    _loadedUrls: [],

    /**
     * Contains all included script urls and prevents double ajax requests.
     * @public
     * @ignore
     * @type Array
     */    
    includedUrls: (typeof pyte_preloaded != 'undefined') ? pyte_preloaded : []
  };
  
  /** 
   * @ignore
   * Find all initial loaded JavaScript and StyleSheet files and 
   * stores them in $.pyte._loadedUrls.
   */
  $.grep($('head script, head link[type="text/css"]'), function (elem) {
    var uriAttr = !!elem.src ? 'src' : 'href';
    if(!!elem[uriAttr].length && !!elem[uriAttr].match(document.location.host)) {
      $.pyte._loadedUrls.push(elem[uriAttr]);
    } else { return; }
  });

  /** @lends $ */
  $.extend({

    /**
     * Append one or more classes to the document.
     * @class
     * @public
     * @example // ###Load JavaScript sources###
     * // load a single script source
     * $.require('single.js');<br />
     * // load multiple script source
     * $.require('first.js', 'second.js');
     * 
     * @example // ###Embed style sheets sources###
     * // Method is similar to JavaScript.
     * $.require('style.css');<br />
     * // You can also mix the media. The order of the file type is irrelevant.
     * $.require("foo.bar.Map", "style.css", "path/to/script.js");
     *
     * @param {String} sourcePath Path to classes e.g. "foo.bar.GeoCoder" or a
     *  path to a script file.
     */
    require: function (sourcePath) {
      $.each($.pyte.flatten(arguments), function (i, uri) {
        if (!$.grep($.pyte.includedUrls, function (url) { 
          return url.match(uri); 
        }).length
        ) {
          // construct prevents misinterpretations
          var isUri = new RegExp('\/*.js$', 'gi').test(uri), 
          isStyleSheet = new RegExp('\/*.css$', 'gi').test(uri), 
          script;
          
          if (!isUri && !isStyleSheet) {
            $.namespace(uri);
            $.pyte.includedUrls.push(uri);
            // transform a class path e.g. "foo.bar.MyClass" to "foo/bar/MyClass.js"
            uri = uri.replace(/\./g, "/") + '.js';
          }
          
          uri = (isStyleSheet ? $.pyte._styleBasePath : $.pyte._basePath) + uri;
          
          // find uri in _loadedUrls and stopt load request
          if (!!$.grep($.pyte._loadedUrls, function (loadedUrl) {
            return loadedUrl.match(uri); }).length
          ) { 
            return false;
          }
          
          if (isStyleSheet) {
            // Adds a CSS link tag with the style url.
            $('head').first()
              .append('<link rel="stylesheet" type="text/css" href="' + uri + '" />');
          } else {
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
          }
          
          $.pyte._loadedUrls.push(uri);
        }
      });
    },
    
    /**
     * Provides a package namespace.
     * @class 
     * @param {String/Array} namespaces  Namespace e.g. "for.bar.events".
     * @return {Object} Returns the base package of namespace.
     * @example $.namespace('for.bar.events'); // added the object path on the window object
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
  
  /**
   * @private
   * Contains all registered modules.
   * @type Array 
   */
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
 * Enables load and initialize the same class. The class-instance object is 
 * registered at the window.
 * @public
 * @constructor
 * @example 
 * &lt;script type="text/javascript"&gt
 *   new Application("foo.bar.app.MyApp");
 * &lt;/script&gt
 * @param {String} klass Class reference as string pattern.
 * @param {Object|Function} [options|callback] Some parameter for initial class.
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

/** @private */
$(function () {
  $.pyte._Module._initialize();
});