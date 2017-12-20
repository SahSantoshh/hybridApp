angular.module('starter')
.controller('MenuCtrl', function($http,$scope, $sce){

  $scope.categories = [];

  $http.get("https://www.scubadivingtheory.com/api/get_category_index/").then(
    function(returnedData){
      $scope.categories =returnedData.data.categories;
      $scope.categories.forEach(function(element, index, array){
        element.title = $sce.trustAsHtml(element.title);
      })
      console.log(returnedData);
    }, function(err){
       console.log(err);
    })

})

angular.module('starter')
.controller('PostCtrl', function(){

})
