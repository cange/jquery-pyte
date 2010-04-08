c.A = $.inherit({

  __constructor: function(){
    this.name = 'A';
    this.path = 'c';
  },
  
  getName: function(){
    return this.name;
  },
  
  getPath: function(){
    return this.path + '.' + this.getName();
  }
  
});