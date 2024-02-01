var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/Product", {
            title: "Quản lý sản phẩm",
            templateUrl: "ProductManager.html",
            controller: "ProductController",


        })
        .when("/Category", {
            title: "Quản lý danh mục",
            templateUrl: "CategoryManager.html",
        })
        .otherwise({
            title: "Quản lý sản phẩm",
            redirectTo: "/Product"
        });
});
app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
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

app.controller('ProductController', ['$scope', 'ProductService', 'UploadService', function ($scope, ProductService, UploadService) {
    ProductService.getProducts().then(function (products) {

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
    $scope.errorState = 0;
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
    $scope.checkHang = function () {
        if (!$scope.Hang) {
            return 13;
        } else if ($scope.Hang.length > 100) {
            return 14;
        } else if (/[^\p{L}\s\p{P}]/u.test($scope.Hang)) {
            return 15;
        } else if ($scope.Hang.length < 2) {
            return 16;
        } else {
            return 0;
        }
    };
    $scope.CheckMoTa = function () {
        if (!$scope.MoTa) {
            return 17;
        }
        else {
            return 0;
        }
    }
    $scope.CheckGiamGia = function () {
        if ($scope.GiamGia < 0 || $scope.GiamGia > 100) {
            return 18;
        }
        else {
            return 0;
        }
    }
    $scope.checkInput = function () {
        $scope.errorState = $scope.checkTenSanPham() || $scope.checkSoLuong() || $scope.checkLoaiSanPham() || $scope.checkHang() || $scope.CheckMoTa() || $scope.CheckGiamGia();
    };


    $scope.SuaSanPhamFunction = function () {
        var now = $scope.NgayThem;
        var NgayGioConvert = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        var updatedProduct = {
            MaSanPham: $scope.MaSanPham,
            TenSanPham: $scope.TenSanPham,
            SoLuong: $scope.SoLuong,
            NgayThem: NgayGioConvert,
            LoaiSanPham: $scope.LoaiSanPham,
            HinhAnh: $scope.SuaHinhAnh ? $scope.SuaHinhAnh.name : $scope.HinhAnh,
            Hang: $scope.Hang,
            MoTa: $scope.MoTa,
            GiamGia: $scope.GiamGia
        };
        ProductService.updateProduct(updatedProduct).then(function (products) {
            $scope.products = products;
        });

        if ($scope.SuaHinhAnh) {
            UploadService.uploadImage($scope.SuaHinhAnh).then(function (response) {
                console.log('Hình ảnh đã được tải lên thành công!');
            }, function (error) {
                console.log('Lỗi khi tải lên hình ảnh: ', error);
            });
        }
    };


}]);
app.service('UploadService', ['$http', function ($http) {
    this.uploadImage = function (image) {
        var data = new FormData();
        data.append('HinhAnh', image);

        $http.post('http://localhost:3000/upload', data, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });

    };

}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.on('change', function (event) {
                var files = event.target.files;
                if (files.length > 0) {
                    var fileName = files[0].name;

                    onChangeHandler(fileName);
                }
            });
            element.on('$destroy', function () {
                element.off();
            });
        }
    };
});
function generateRandomString() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


app.controller('ThemSanPham', ['$scope', 'ProductService', 'UploadService', function ($scope, ProductService, UploadService) {
    $scope.SoLuong = 1;
    $scope.errorState = 0;
    $scope.GiamGia = 0;
    $scope.MaSanPham = generateRandomString();


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

    $scope.checkHang = function () {
        if (!$scope.Hang) {
            return 13;
        } else if ($scope.Hang.length > 100) {
            return 14;
        } else if (/[^\p{L}\s\p{P}]/u.test($scope.Hang)) {
            return 15;
        } else if ($scope.Hang.length < 2) {
            return 16;
        } else {
            return 0;
        }
    };

    $scope.CheckMoTa = function () {
        if (!$scope.MoTa) {
            return 17;
        }
        else {
            return 0;
        }
    }
    $scope.CheckGiamGia = function () {
        if ($scope.GiamGia < 0 || $scope.GiamGia > 100) {
            return 18;
        }
        else {
            return 0;
        }
    }

    $scope.checkInput = function () {
        $scope.errorState = $scope.checkTenSanPham() || $scope.checkSoLuong() || $scope.checkLoaiSanPham() || $scope.checkHang() || $scope.CheckMoTa() || $scope.CheckGiamGia();
    };

    $scope.ThemSanPhamFunction = function () {

        if ($scope.HinhAnh) {
            var now = new Date();
            var NgayGioHienTai = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

            var newProduct = {
                MaSanPham: $scope.MaSanPham,
                TenSanPham: $scope.TenSanPham,
                SoLuong: $scope.SoLuong,
                NgayThem: NgayGioHienTai,
                LoaiSanPham: $scope.LoaiSanPham,
                HinhAnh: $scope.HinhAnh.name,
                Hang: $scope.Hang,
                MoTa: $scope.MoTa,
                GiamGia: $scope.GiamGia
            };

            ProductService.addProduct(newProduct).then(function (products) {
                $scope.products = products;
            });
            UploadService.uploadImage($scope.HinhAnh).then(function (response) {
                console.log('Hình ảnh đã được tải lên thành công!');
            }, function (error) {
                console.log('Lỗi khi tải lên hình ảnh: ', error);
            });
        }
        else {
            alert('Bạn chưa chọn ảnh. Vui lòng thử lại');
        }




    };
}]);

