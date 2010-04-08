# Pyte - JavaScript#

##What is pyte##
JavaScript provide some OOP characteristics. <br />
Pyte brings several enhancements, such as namespace support and the loading of remote script files.

###Features###
* Tested against Firefox 2.x, Safari 3.x, IE 6-9 and Opera 9.5 
* Provide namespace support
* Synchronous remote JavaScript file loading
* including of style sheets (css) files
* On the fly dependencies
* Application pattern
* Light and easy class includes

##How to use pyte##

###Define the base path###
The base path is the directory which contains the JavaScript files.<br />
As the _default_ is defined the _"/javascrpts/"_ path.<br />
The path can be changed as follows.

    $.pyte.setBasePath('my/own/path/js/');

Define a base path to load stylesheet.
 
    $.pyte.setBasePath('my/path/to/css/', $.pyte.STYESHEET);

_Now you can also inlcude css files._
###Load JavaScript sources###

    // load a single script source
    $.require('single.js');

    // load multiple script source
    $.require('first.js', 'second.js');

###Load style sheets sources###
Method is similar to JavaScript.

    $.require('style.css');

You can also mix the media. The order of the file type is irrelevant.

    $.require('single.js', 'style.css');

###Include JavaScript Classes###
``$.require`` loads files and initialized the same path as the namespace. <br />
Thus, the content is immediately available as an object.

####Simple example####
Create a simple class in the Abstract.js file

    my.app.Abstract = $.inherit({
      __constructor: function() {
        alert('Abstract is now running');
      }
    });

Loading and call the class in another file

    $.require('my.app.Abstract');
    // execute the Abstract class
    new my.app.Abstract();
    
Loading of class files and other script files in one

    $.require('my.app.Abstract', 'my/other/scripts.js');
    
Pyte proceeds from the following directory structure
  
    /javascripts/
      my/
        app/
          Abstract.js

####Run the application in the HTML document####
To register an application class with your layout only include this single statement.

    <script type="text/javascript">
        new Application("my.app.Abstract");
    </script>

###Create JavaScript Namespace###

    $.namespace('foo.bar'); // foo.bar is now available
  
You can add many more of sub namespaces

    $.namespace('foo.baz'); 
    $.namespace('foo.thut');
_The Objects foo.baz and foo.thut are now available._


Or you can register multiple namspaces.

    $.namespace('my.first.space', 'my.second.space', 'and.many.more.spaces');
_All these objects and sub objects are now registered on the window object._

##Dependencies##
* [jQuery](http://jquery.com/) version 1.4.*
* Pyte using the [jquery-inheritance](http://code.google.com/p/jquery-inheritance/) plugin

##License##
Dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.