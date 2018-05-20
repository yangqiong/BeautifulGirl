$(document).ready(function () {
    const $grid = $('.grid');
    $grid.masonry({
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    });

    $.getJSON({
        url: "http://192.168.0.111:1337/model?bPoster=true",
    }).done(function (items) {
        console.log(items);
        let $items = $(items.map(function (item) {
            return createGridItem(item);
        }).join(""))

        $items.hide();
        $grid.append($items);

        $grid.imagesLoaded().progress(function (imgLoad, image) {
            var $item = $(image.img).parents('.grid-item');
            $item.show();
            $grid.masonry('appended', $item);
        });
    });

    $("body").on("click", ".grid-item", function () {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        const sModelName = $(this).data("model-name");
        $.getJSON({
            url: `http://192.168.0.111:1337/model?sName=${sModelName}`,
        }).done(function (items) {
            console.log(items);
            items = items.map(function (item) {
                return {
                    src: item.sImgUrl,
                    w: 0,
                    h: 0
                }
            })

            // define options (if needed)
            var options = {
                // optionName: 'option value'
                // for example:
                index: 0 // start at first slide
            };

            // Initializes and opens PhotoSwipe
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

            items.map(function(item){
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
    return `
    <div class="grid-item" data-model-name="${item.sName}">
        <img src="${item.sImgUrl}" />
    </div>
    `
}