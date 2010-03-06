b.A = $.inherit({
    
  __constructor: function(property){
    this.property = property || 'b.A';
    this.getProperty();
  },
  
  getProperty: function() {
    test(this.getType()+ " class basic", function() { ok( true, "class loaded" ); });
    return this.property + ' of b.A';
  },
  
  getType: function(){
    var type = this.__self.TYPE;
    test(type+" class basic", function() { ok(type == 'b.A', "NAME is b.A" ); });
    return type;
  }
},
{
  TYPE: 'b.A'
}
);