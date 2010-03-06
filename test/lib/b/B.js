b.B = $.inherit({
  
  __constructor: function(){
    this.name = 'B';
    this.path = 'b';
  },
  
  getName: function(){
    return this.name;
  },
  
  getPath: function(){
    return this.path + '.' + this.getName();
  }
  
});