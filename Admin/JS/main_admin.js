var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/Product", {
            templateUrl: "ProductManager.html",
            controller: "ProductController"
        })
        .when("/Category", {
            templateUrl: "CategoryManager.html",
        })
        .otherwise({
            redirectTo: "/Product"
        });
});

app.factory('ProductService', function ($http) {
    var products = [];

    return {
        getProducts: function () {
            return $http.get('http://localhost:3000/products').then(function (response) {
                products = response.data;
                products.forEach(function (product) {
                    var date = new Date(product.NgayThem);
                    product.NgayThem = date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
                });
                return products;
            });
        },
        addProduct: function (newProduct) {
            return $http.post('http://localhost:3000/products', newProduct).then(function (response) {
                products.push(newProduct);
                return products;
            });
        },
        updateProduct: function (updatedProduct) {
            return $http.put('http://localhost:3000/products/' + updatedProduct.MaSanPham, updatedProduct).then(function (response) {
                var index = products.findIndex(function (product) {
                    return product.MaSanPham === updatedProduct.MaSanPham;
                });
                if (index !== -1) {
                    products[index] = updatedProduct;
                }
                return products;
            });
        },

        deleteProduct: function (productId) {
            return $http.delete('http://localhost:3000/products/' + productId).then(function (response) {
                products = products.filter(function (product) {
                    return product.MaSanPham !== productId;
                });
                return products;
            });
        }

    };
});

app.controller('ProductController', function ($scope, ProductService) {
    ProductService.getProducts().then(function (products) {
        products.forEach(function (product) {
            var date = new Date(product.NgayThem);
            product.NgayThem = date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
        });
        $scope.products = products;
    });

    $scope.setXoaSanPham = function (productId) {
        $scope.selectedProductId = productId;
    };


    $scope.XoaSanPham = function () {
        if ($scope.selectedProductId) {
            ProductService.deleteProduct($scope.selectedProductId).then(function () {
                ProductService.getProducts().then(function (products) {
                    $scope.products = products;
                });
            });
        }
    };

    $scope.setSuaSanPham = function (product) {
        var ngayThemDate = new Date(product.NgayThem);
        $scope.MaSanPham = product.MaSanPham;
        $scope.TenSanPham = product.TenSanPham;
        $scope.SoLuong = product.SoLuong;
        $scope.NgayThem = ngayThemDate;
        $scope.LoaiSanPham = product.LoaiSanPham;
        $scope.HinhAnh = product.HinhAnh;
        $scope.Hang = product.Hang;
        $scope.MoTa = product.MoTa;
        $scope.GiamGia = product.GiamGia;

    };

    $scope.SuaSanPhamFunction = function () {
        var d = $scope.NgayThem.getFullYear() + '-' +
            ('0' + ($scope.NgayThem.getMonth() + 1)).slice(-2) + '-' +
            ('0' + $scope.NgayThem.getDate()).slice(-2) + ' ' +
            ('0' + $scope.NgayThem.getHours()).slice(-2) + ':' +
            ('0' + $scope.NgayThem.getMinutes()).slice(-2) + ':' +
            ('0' + $scope.NgayThem.getSeconds()).slice(-2); console.log(d);
        var updatedProduct = {
            MaSanPham: $scope.MaSanPham,
            TenSanPham: $scope.TenSanPham,
            SoLuong: $scope.SoLuong,
            NgayThem: d,
            LoaiSanPham: $scope.LoaiSanPham,
            HinhAnh: $scope.HinhAnh,
            Hang: $scope.Hang,
            MoTa: $scope.MoTa,
            GiamGia: $scope.GiamGia
        };
        ProductService.updateProduct(updatedProduct).then(function () {
            ProductService.getProducts().then(function (products) {
                $scope.products = products;
            });
        });
    };

});

app.controller('ThemSanPham', function ($scope, ProductService) {
    $scope.SoLuong = 1;
    $scope.errorState = 0;

    // Validation functions
    $scope.checkMaSanPham = function () {
        if (!$scope.MaSanPham) {
            return 1;
        } else if ($scope.MaSanPham.length !== 6) {
            return 2;
        } else if (!/^[a-zA-Z0-9]*$/.test($scope.MaSanPham)) {
            return 3;
        } else {
            return 0;
        }
    };

    $scope.checkTenSanPham = function () {
        if (!$scope.TenSanPham) {
            return 4;
        } else if ($scope.TenSanPham.length > 100) {
            return 5;
        } else if (/[^\p{L}\s\p{P}]/u.test($scope.TenSanPham)) {
            return 6;
        } else if ($scope.TenSanPham.length < 2) {
            return 7;
        } else {
            return 0;
        }
    };

    $scope.checkSoLuong = function () {
        return $scope.SoLuong < 1 ? 8 : 0;
    };

    $scope.checkLoaiSanPham = function () {
        if (!$scope.LoaiSanPham) {
            return 9;
        } else if ($scope.LoaiSanPham.length > 100) {
            return 10;
        } else if (/[^\p{L}\s\p{P}]/u.test($scope.LoaiSanPham)) {
            return 11;
        } else if ($scope.LoaiSanPham.length < 2) {
            return 12;
        } else {
            return 0;
        }
    };



    $scope.checkInput = function () {
        $scope.errorState = $scope.checkMaSanPham() || $scope.checkTenSanPham() || $scope.checkSoLuong() || $scope.checkLoaiSanPham();
    };

    $scope.ThemSanPhamFunction = function () {

        var d = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
        var newProduct = {
            MaSanPham: $scope.MaSanPham,
            TenSanPham: $scope.TenSanPham,
            SoLuong: $scope.SoLuong,
            NgayThem: d,
            LoaiSanPham: $scope.LoaiSanPham,
            HinhAnh: $scope.HinhAnh,
            Hang: $scope.Hang,
            MoTa: $scope.MoTa,
            GiamGia: $scope.GiamGia
        };
        ProductService.addProduct(newProduct).then(function (products) {
            $scope.products = products;
        });
    };
});
