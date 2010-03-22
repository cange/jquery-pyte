# Pyte - JavaScript#

##What is pyte##
JavaScript provide some OOP characteristics. <br />
Pyte brings several enhancements, such as namespace support and the loading of remote script files.

###Features###
* Tested against Firefox 2.x, Safari 3.x, IE 6-9 and Opera 9.5 
* Provide namespace support
* Synchronous remote file loading
* On the fly dependencies
* Application pattern
* Light and easy class includes

##How to use pyte##

###Define the base path###
The base path is the directory which contains the JavaScript files.<br />
As the _default_ is defined the _"/javascrpts/"_ path.<br />
The path can be changed as follows.

    $.pyte.setBasePath('my/own/path/js/');

###Load JavaScript sources###

    // load a single script source
    $.require('single.js');

    // load multiple script source
    $.require('first.js', 'second.js');

###Include JavaScript Classes###
``$.require`` loads files and initialized the same path as the namespace. <br />
Thus, the content is immediately available as an object.

####Simple example####
#####Create a simple class in the Abstract.js file#####

    my.app.Abstract = $.inherit({
      __contructor: function() {
        alert('Abstract is now running');
      }
    });

#####Loading and call the class in another file#####

    $.require('my.app.Abstract');
    // execute the Abstract class
    new my.app.Abstract();
    
#####Loading of class files and other script files in one#####

    $.require('my.app.Abstract', 'my/other/scripts.js');
    
#####Pyte proceeds from the following directory structure#####
  
    /javascripts/
      my/
        app/
          Abstract.js

####Run the application in the HTML document####
To register an application class with your layout only include this single statement:

    <script type="text/javascript">
        new Application("my.app.Abstract");
    </script>

###Create JavaScript Namespace###

    $.namespace('foo.bar'); // foo.bar is now available
  
    // you can add many more of sub namespaces
    $.namespace('foo.baz');
    $.namespace('foo.thut');

##Dependencies##
[jQuery](http://jquery.com/) version 1.4.*<br />
Pyte using the [jquery-inheritance](http://code.google.com/p/jquery-inheritance/) plugin

##Licence##
Dual licensed under the 
[MIT](http://www.opensource.org/licenses/mit-license.php) and 
[GPL](http://www.gnu.org/licenses/gpl.html) licenses.