$.pyte.setBasePath('lib/');
new Application('c.A');


(function($, undefined){

  module("$.pyte.flatten()");
  test("neste array flatten", function() {
//    same($.pyte.flatten([1, [2]]), [1,2], 'Flat a nested (2x) array');
//    same($.pyte.flatten([1, [2, [3], 4], 5]), [1, 2, 3, 4, 5], 'Flat a nested (3x) array');
  });
  
  module("$.require()", {
    setup: function () {
      $.pyte.ignore = false;
      $.pyte.setBasePath('src/');
    },
    teardown: function () {
      delete source_a;
      delete source_b;
      delete source_c;
      delete source_d;
//      delete compress;
    }
  });
  
  test("a single source", function() {
    var state = 'loaded';
    
    ok(typeof a_a == 'undefined', '"a/a.js" not exists');
    
    $.require('a/a.js');
    ok(source_a == state, '"a/a.js" exists');
  });
  
  test("multiple sources", function() {
    var state = 'undefined';
    
    ok(typeof b_a == state && typeof b_b == state && typeof b_c == state, '"b_*" objects not exists per initial');
    
    state = 'loaded'
    $.require('b/a.js', 'b/b.js', 'b/c.js');
    ok(b_a == state, '"b/a.js" is exists');
    ok(b_b == state, '"b/b.js" is exists');
    ok(b_c == state, '"b/c.js" is exists');
  });

  test("nested sources", function() {
    var state = 'undefined';
    
    ok(typeof c_a == state && typeof c_b == state && typeof c_c == state && typeof c_d == state, '"c_*" object not exists');
    
    state = 'loaded'
    $.require('c/a.js', ['c/b.js', 'c/c.js'], 'c/d.js');
    ok(c_a == state, '"c/c_a.js" is exists');
    ok(c_b == state, '"c/c_b.js" is exists');
    ok(c_c == state, '"c/c_a.js" is exists');
    ok(c_d == state, '"c/c_d.js" is exists');
  });
  

  test('Set "ignore" for compressed sources', function () {
    // start production ignore mode 
    $.pyte.ignore = true;
    $.require('compress.Alpha');
    new compress.Alpha;

    ok('Alpha' in compress, 'Is "Alpha" in "compress"');
    ok('Beta' in compress, 'Is "Beta" in "compress"');
    ok('Gamma' in compress, 'Is "Gamma" in "compress"');
    equals(compressedAlpha, true, 'Boolean "compressedAlpha"');
    equals(compressedBeta, true, 'Boolean "compressedBeta"');
    equals(compressedGamma, true, 'Boolean "compressedGamma"');
    // switch back to development mode 
    $.pyte.ignore = false;
  });

  test("StyleSheets load (foo.css)", function() {
    $.pyte.setBasePath('css/', $.pyte.STYLESHEET);
    var selector = 'head link[href*=foo]';
    
    ok($(selector).length == 0, 'CSS file "foo.css" is not exist in the head of document.');
    equals($('body').css("position"), 'static', 'Body position is "static" per default');
    
    $.require('foo.css');
    stop();
    setTimeout(function () {
      start();
      equals($(selector).length, 1, 'CSS file "foo.css" is one time exist in the head of document.');
      equals($('body').css("position"), 'relative', 'Body position is changed after css load');
    }, 500);
    
    
    $.require('foo.css', 'foo.css');
    stop();
    setTimeout(function () {
      start();
      equals($(selector).length, 1, 'After try file to load twice time, the file may be available only once in head.');
    }, 500);
  });


  module("$.namespace()");

  test('single params', function() {
    ok(typeof foo != 'object', 'Object "foo" isn\'t defined');    
    ok(typeof bar != 'object', 'Object "bar" isn\'t defined');    
    ok(typeof myNamespace != 'object', 'myNamespace "that" isn\'t defined');    
  });
  
  test('multiple params ("aa.b.c", "bb.c.a", "cc.a.b")', function() {
    ok(typeof aa != 'object', 'Object "aa" isn\'t defined');
    ok(typeof bb != 'object', 'Object "bb" isn\'t defined');
    ok(typeof cc != 'object', 'Object "cc" isn\'t defined');
    
    $.namespace('aa.b.c', 'bb.c.a', 'cc.a.b');

    ok(typeof aa == 'object', 'Object "aa" is now defined');
    ok(typeof aa.b == 'object', 'Object "aa.b" is now defined');
    ok(typeof aa.b.c == 'object', 'Object "aa.b.c" is now defined');
    ok(typeof bb == 'object', 'Object "bb" is now defined');
    ok(typeof bb.c == 'object', 'Object "bb.c" is now defined');
    ok(typeof bb.c.a == 'object', 'Object "bb.c.a" is now defined');
    ok(typeof cc == 'object', 'Object "cc" is now defined');
    ok(typeof cc.a == 'object', 'Object "cc.a" is now defined');
    ok(typeof cc.a.b == 'object', 'Object "cc.a.b" is now defined');
  });

  test('Define "foo.bar.myNamespace" namespace', function() {
    $.namespace('foo.bar.myNamespace');

    ok(typeof foo == 'object', 'Object "foo" exists');
    ok(typeof foo.bar == 'object', 'Object "foo.bar" exists');
    ok(typeof foo.bar.myNamespace == 'object', 'Object "foo.bar.myNamespace" exists');
    
    ok(typeof window.bar == 'undefined', 'Object "bar" isn\'t on window root exists');
    ok(typeof window.myNamespace == 'undefined', 'Object "myNamespace" isn\'t on window root exists');
  }); 


  module("Include JavaScript sources with namespace", {
    setup: function (){
      $.pyte.setBasePath('lib/');
    },
    teardown: function () {
      delete this.classA;
      delete this.classB;
      try {  // IE (sucks) doesn't support delete
        delete a;
        delete b;
        delete otherScripts;
      } catch(e){
        a = undefined;
        b = undefined;
        otherScripts = undefined;
      };
    }
  });
  
  test('simple class a.A', function (){
    ok(typeof a != 'object', 'Namespace A isn\'t exists');
  
    $.require('a.A');
    $.require('a.A'); // double call, but it should be loaded only one time
    this.classA = new a.A();
    equals(typeof this.classA ,'object', 'Class a.A is type of');
    equals(this.classA.getName(),'A', 'Class a.A.getName() is')
  });
  
  test('multiple class b.A', function (){
    ok(typeof b != 'object', 'Namespace "b" isn\'t exists');
    
    $.require('b.A', 'scripts.js');
    this.classA = new b.A();
    equals(typeof this.classA ,'object', 'Class b.A is type of');
    equals(this.classA.getName(), 'A', 'Class b.A.getName() is');
    equals(this.classA.getPath(), 'b.A', 'Class b.A.getPath() is');
        
    this.classB = new b.B();
    equals(typeof this.classB ,'object', 'Class b.B is type of');
    equals(this.classB.getName(), 'B', 'Class b.B.getName() is');
    equals(this.classB.getPath(), 'b.B', 'Class b.B.getPath() is');
    
    equals(otherScripts, 'loaded', '"scripts.js" is');
  });

  test('Application', function() {
    equals(typeof c, 'object', '"c" is exists');
    equals(typeof c.A, 'function', '"c.A" is exists');
    equals(typeof application, 'object', 'Application class c.A is type of');
    equals(application.getName(), 'A', 'Application class c.AA.getName() is');      
    equals(application.getPath(), 'c.A', 'Application class c.AA.getPath() is');
  });

})(jQuery);


