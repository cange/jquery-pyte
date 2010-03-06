(function($, undefined){

  module("Load JavaScript", {
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
    
    ok(typeof source_a == 'undefined', '"source_a.js" not exists');
    
    $.pyte.load('source_a.js');
    ok(source_a == state, '"source_a.js" exists');
  });
  
  test("multiple sources", function() {
    var state = 'undefined';
    
    ok(typeof source_b == state, '"b/source_b.js" not exists');
    ok(typeof source_c == state, '"b/source_c.js" not exists');
    ok(typeof source_d == state, '"b/source_d.js" not exists');
    
    state = 'loaded'
    $.pyte.load('b/source_b.js', 'b/source_c.js', 'b/source_d.js');
    ok(source_b == state, '"b/source_b.js" is exists');
    ok(source_c == state, '"b/source_c.js" is exists');
    ok(source_d == state, '"b/source_d.js" is exists');
  });




  module("Namespace", {
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
    $.pyte.namespace('foo.bar.myNamespace');

    ok(typeof foo == 'object', 'Object "foo" exists');
    ok(typeof foo.bar == 'object', 'Object "foo.bar" exists');
    ok(typeof foo.bar.myNamespace == 'object', 'Object "foo.bar.myNamespace" exists');
    
    ok(typeof window.foo == 'object', 'Object "foo" is added on window');
    ok(window.bar == undefined, 'Object "bar" isn\'t added on window');
    ok(window.myNamespace == undefined, 'Object "myNamespace" isn\'t added on window');
  }); 
  
  test('Namespace inject', function(){
    equals($.pyte._Namespace.inject([1,2,3], 0, function(a) { return a + this; }), 
      6, 'Takes a callback with an accumulator and the current index.');
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
      } catch(e){
        a = undefined;
        b = undefined;
      };
    }
  });
  
  test('simple class a.A', function (){
    ok(typeof a != 'object', 'Namespace A isn\'t exists');
  
    $.pyte.include('a.A');
    this.classA = new a.A();
    equals(typeof this.classA ,'object', 'Class a.A is type of');
    equals(this.classA.getName(),'A', 'Class a.A.getName() is')
  });
  
  test('multiple class b.A', function (){
    ok(typeof b != 'object', 'Namespace "b" isn\'t exists');
    
    $.pyte.include('b.A');
    this.classA = new b.A();
    equals(typeof this.classA ,'object', 'Class b.A is type of');
    equals(this.classA.getName(), 'A', 'Class b.A.getName() is');
    equals(this.classA.getPath(), 'b.A', 'Class b.A.getPath() is');
        
    this.classB = new b.B();
    equals(typeof this.classB ,'object', 'Class b.B is type of');
    equals(this.classB.getName(), 'B', 'Class b.B.getName() is');
    equals(this.classB.getPath(), 'b.B', 'Class b.B.getPath() is');
  });

})(jQuery);