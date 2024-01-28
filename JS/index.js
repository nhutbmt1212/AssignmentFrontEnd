
var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "SpaIndex/productSpaIndex.html"
        })
        .when("/Detail", {
            templateUrl: "SpaIndex/productSpaDetail.html"
        });

});

app.controller('CtrlProduct', function ($scope, $location, $anchorScroll) {
    $scope.OpenDetailProduct = function () {
        $location.path('/Detail');
        $anchorScroll();
    };
});