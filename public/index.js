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
                    ga('send', 'event', 'page_next', '', '');
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
        ga('send', 'event', 'img_click', '', '');
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
                index: 0,
                // shareButtons: [
                //     {id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
                // ]
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

            gallery.listen('afterChange', function() {
                ga('send', 'event', 'img_view', '', '');
            });

            $("button[title=share]").on("click", function(){
                ga('send', 'event', 'img_action', '', '');
            })
            $(".pswp__share-tooltip").on("click", function(){
                ga('send', 'event', 'img_download', '', '');
            })
        });
    })
})

function createGridItem(item) {
    let img = document.createElement("img");
    img.src = item.poster;

    let imgCount = document.createElement("div");
    imgCount.className="grid-item-count";
    imgCount.innerHTML = item.imgs.length + " pictures";

    let elem = document.createElement("div");
    elem.className = "grid-item";
    elem.setAttribute("data-_id", item._id);


    elem.appendChild(img);
    elem.appendChild(imgCount);

    return elem;
}