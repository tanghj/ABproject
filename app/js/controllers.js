'use strict';

angular.module("myApp")
.controller("MyCtrl1",function($scope){
    $scope.hello = "hello,a!";
})
.controller("MyCtrl2",function($scope){
    $scope.testItem = [1,2,3,4,5,6,7,8,9];
})
.controller("MyCtrl3",function($scope){
	$scope.testItem = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9];
})
