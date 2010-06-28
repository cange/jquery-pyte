$.pyte.ignore = true;
var compressedAlpha = compressedBeta = compressedGamma = false;
$.require('compress.Beta');
compress.Alpha = $.inherit({
  __constructor: function () {
    compressedAlpha = true;
    new compress.Beta;
  }
});$.require('compress.Gamma');
compress.Beta = $.inherit({
  __constructor: function () {
    compressedBeta = true;
    new compress.Gamma;
  }
});compress.Gamma = $.inherit({
  __constructor: function () {
    compressedGamma = true;
  }
});
$.pyte.ignore = false;