window.addEventListener('resize', function () {
    var cartTitle = document.getElementById('cartTitle');
    if (window.innerWidth <= 767) {
        cartTitle.classList.remove('truncate-text');

    } else {
        cartTitle.classList.add('truncate-text');

    }
});