var svapp = angular.module("svapp", ['ui.bootstrap'], function($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

//svapp.controller('AlertCtrl', function ($scope) {
//    $scope.closeAlert = function(index) {
//        $scope.alerts.splice(index, 1);
//    };
//});

//svap.controller("LocationController", function($scope, $location) {
//    $scope.$location = {};
//    angular.forEach("protocol host port path search hash".split(" "), function(method){
//        $scope.$location[method] = function(){
//            var result = $location[method].call($location);
//            return angular.isObject(result) ? angular.toJson(result) : result;
//        };
//    });
//})
//
//
//
//$scope.currentPath = $location.path();