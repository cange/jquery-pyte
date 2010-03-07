$.require('b.B');

b.A = $.inherit({
    
  __constructor: function(){
    this.name = 'A';
    this.path = 'b';
  },
  
  getName: function(){
    return this.name;
  },
  
  getPath: function(){
    return this.path + '.' + this.getName();
  }
  
});