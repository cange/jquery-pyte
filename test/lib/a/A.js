a.A = $.inherit({
  
  __constructor: function(){
    this.name = 'A';
    this.path = 'a';
  },
  
  getName: function(){
    return this.name;
  },
  
  getPath: function(){
    return this.path + '.' + this.getName();
  }
  
});