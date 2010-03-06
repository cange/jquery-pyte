# Pyte - JavaScript#

##What is pyte##
JavaScript provide some OOP characteristics. <br />
Pyte brings several enhancements, such as namespace support and the loading of remote script files.

###Features###
* Tested against Firefox 3.x, Safari 3.x, IE 6-8 and Opera 9.5 
* Provide namespace support
* Synchronous remote file loading
* On the fly dependencies
* Application pattern
* Light and easy class includes

##How to use pyte##

###Define the base path###
The \_basePath is the directory which contains the JavaScript files.<br />
As the _default_ is defined the _"/javascrpts/"_ path.<br />
The path can be changed as follows.

    $.pyte._basePath = 'my/own/path/js/';

###Load JavaScript sources###

    // load a single script source
    $.pyte.load('single.js');

    // load multiple script source
    $.pyte.load('first.js', 'second.js');

###Include JavaScript Classes###
``$.pyte.include`` loads files and initialized the same path as the namespace. <br />
Thus, the content is immediately available as an object.

####Simple example####
#####Create a simple class in the Abstract.js file#####

    my.app.Abtract = $.inherit({
      __contructor: function() {
        alert('Abstract is now running');
      }
    });

#####Load and call the class in another file#####

    $.pyte.include('my.app.Abstract');
    // execude the Abstract class
    new my.app.Abstract(); // Abstract is now running
    
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

    $.pyte.namespace('foo.bar'); // foo.bar is now available
  
    // you can add many more of sub namespaces
    $.pyte.namespace('foo.baz');
    $.pyte.namespace('foo.thut');


##Requirements##

[jQuery](http://jquery.com/) version 1.4.*

Pyte using the jQuery [jquery-inheritance](http://code.google.com/p/jquery-inheritance/)


##Licence##

[MIT](http://www.opensource.org/licenses/mit-license.php)


##To do##
Resolve dependence to jquery-inheritance