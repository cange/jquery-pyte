'b.A'.include();

b.B = $.inherit(b.A,{
  __constructor: function(){
    this.__base();
  },
  
  getType: function(){
    var type = this.__self.TYPE;
    test(type+" class basic", function() { ok(type == 'b.B', "TYPE is b.B" ); });
    return type;
  }
  
},
{
  TYPE:'b.B'
});