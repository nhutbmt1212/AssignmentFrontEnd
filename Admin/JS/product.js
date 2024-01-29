$(document).ready(function () {
    $.get("http://localhost:3000/products", function (data, status) {
        data.forEach((item, index) => {

            //     var row = `<tr>
            //     <th scope="row">${index + 1}</th>
            //     <td>${item.MaSanPham}</td>
            //     <td>${item.TenSanPham}</td>
            //     <td>${item.SoLuong}</td>
            //     <td>${item.NgayThem}</td>
            //     <td>${item.LoaiSanPham}</td>
            //     <td><img src="${item.HinhAnh}" alt="Hình ảnh sản phẩm ${index + 1}" width="50" height="50"></td>
            //     <td>${item.Hang}</td>
            //     <td>${item.MoTa}</td>
            //     <td>${item.GiamGia}%</td>
            //     <td class="text-center">
            //         <div class="dropdown">
            //             <button type="button" class="border-0" data-bs-toggle="dropdown" style="background-color: rgba(0, 0, 0, 0);"
            //             >
            //                 <i class="bi bi-three-dots-vertical"></i>
            //             </button>
            //             <ul class="dropdown-menu">
            //                 <li><a class="dropdown-item" href="#">Sửa</a></li>
            //                 <li><a class="dropdown-item" href="#">Xóa</a></li>
            //             </ul>
            //         </div>
            //     </td>
            // </tr>`;
            //     $('tbody').append(row);

        });
    });
});