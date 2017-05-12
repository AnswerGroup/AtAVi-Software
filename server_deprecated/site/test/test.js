describe('AdminController', function() {
  beforeEach(module('AtAViApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  beforeEach(function() {
      $scope = {};
      controller = $controller('AdminController', { $scope: $scope });
     
    });

  it('console log', function() {
    expect($scope.eugen).toEqual("saraci");
  });


});