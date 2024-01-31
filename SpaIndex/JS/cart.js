window.addEventListener('resize', function () {
    var cartTitles = document.querySelectorAll('.cartTitle');
    cartTitles.forEach(function (cartTitle) {
        if (window.innerWidth <= 767) {
            cartTitle.classList.remove('truncate-text');
        } else {
            cartTitle.classList.add('truncate-text');
        }
    });
});
