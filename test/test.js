(function($, undefined){

  test("Check for loading source whit $.pyte.load method.", function() {
    $.pyte.load('src/a.js');
    ok(, "Include a.A class wi accessible via .customdata.");
    ok($.customdata($("#multiple_data")), "Custom data accessible via $.customdata.");
    ok($.customdata($("#no_data")), "Custom data accessibleeven if empty.");
  });
  
});