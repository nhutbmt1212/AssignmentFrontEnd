var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/Product", {
            templateUrl: "ProductManager.html"
        })
        .when("/Category", {
            templateUrl: "CategoryManager.html"
        })
        .otherwise({
            redirectTo: "/Product"
        });

});
