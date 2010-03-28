(function($, undefined){

  module("$.require()", {
    setup: function () {
      $.pyte.setBasePath('src/');
    },
    teardown: function () {
      delete source_a;
      delete source_b;
      delete source_c;
      delete source_d;
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

  module("$.namespace(string)", {
    teardown: function () {
      try {  // IE (sucks) doesn't support delete
        delete foo;
      } catch(e){
        foo = undefined;
      };
    }
  });
  test('Isn\'t "foo.bar.myNamespace" defined', function() {
    ok(typeof foo != 'object', 'Object "foo" isn\'t defined');    
    ok(typeof bar != 'object', 'Object "bar" isn\'t defined');    
    ok(typeof myNamespace != 'object', 'myNamespace "that" isn\'t defined');    
  });

  test('Define "foo.bar.myNamespace" namespace', function() {
    $.namespace('foo.bar.myNamespace');

    ok(typeof foo == 'object', 'Object "foo" exists');
    ok(typeof foo.bar == 'object', 'Object "foo.bar" exists');
    ok(typeof foo.bar.myNamespace == 'object', 'Object "foo.bar.myNamespace" exists');
    
    ok(typeof window.foo == 'object', 'Object "foo" is added on window');
    ok(window.bar == undefined, 'Object "bar" isn\'t added on window');
    ok(window.myNamespace == undefined, 'Object "myNamespace" isn\'t added on window');
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

})(jQuery);