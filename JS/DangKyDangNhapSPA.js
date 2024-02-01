
var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            title: "Đăng nhập",
            templateUrl: "DangNhap.html"
        })
        .when("/DangKy", {
            title: "Đăng ký",
            templateUrl: "DangKy.html"
        })
        .otherwise({
            title: "Đăng nhập",
            redirectTo: "/"
        });


});
app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
app.controller('ChuyenSangDangKy', function ($scope, $location, $anchorScroll) {
    $scope.ChuyenDangKy = function () {
        $location.path('/DangKy');
        $anchorScroll();
    }; $scope.ChuyenDangNhap = function () {
        $location.path('/');
        $anchorScroll();
    };
});