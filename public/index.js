$(document).ready(function () {
    let loadding = false;

    const $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    });

    function getGirlList(params, done) {
        $.getJSON({
            url: "/girls",
            data: params
        }).done(function (items) {
            console.log(items);
            let $items = $(items.map(function (item) {
                return createGridItem(item);
            }))
            $items.imagesLoaded(function () {
                $grid.append($items).masonry('appended', $items);
                if (done){
                    done();
                }
            });
        });
    }

    window.onscroll = function () {
        const bodyHeight = $('body').height();
        const scrollHeight = window.scrollY || window.pageYOffset;
        const screenHeight = window.screen.height;
        if (bodyHeight - screenHeight - scrollHeight < screenHeight / 3) {
            if (loadding === false) {
                loadding = true;
                let params = {
                    page: (parseInt(sessionStorage.getItem("page")) || 1) + 1
                }
                getGirlList(params, function () {
                    sessionStorage.setItem("page", params.page);
                    loadding = false;
                });
            }
        }
    }

    getGirlList({
        page: 1
    }, function(){
        sessionStorage.setItem("page", 1);
    });

    $("body").on("click", ".grid-item", function () {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        const _id = $(this).data("_id");
        $.getJSON({
            url: `/girl?_id=${_id}`,
        }).done(function (items) {
            console.log(items);
            items = items[0].imgs.map(function (item) {
                return {
                    src: item,
                    w: 0,
                    h: 0
                }
            })

            var options = {
                index: 0
            };

            // Initializes and opens PhotoSwipe
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

            items.map(function (item) {
                var img = new Image();
                img.onload = function () { // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                }
                img.src = item.src; // let's download image
            })

            gallery.listen('gettingData', function (index, item) {
                if (item.w < 1 || item.h < 1) { // unknown size
                    var img = new Image();
                    img.onload = function () { // will get size after load
                        item.w = this.width; // set image width
                        item.h = this.height; // set image height
                        gallery.invalidateCurrItems(); // reinit Items
                        gallery.updateSize(true); // reinit Items
                    }
                    img.src = item.src; // let's download image
                }
            });

            gallery.init();

        });
    })
})

function createGridItem(item) {
    let img = document.createElement("img");
    img.src = item.poster;

    let div = document.createElement("div");
    div.className = "grid-item";
    div.setAttribute("data-_id", item._id);
    div.appendChild(img);

    return div;
}