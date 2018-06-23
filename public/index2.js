$(document).ready(function () {
    const $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    });
    
    function getGirlList(done){
        let page = sessionStorage.getItem("page") || 1;
        $.getJSON({
            url: "/girls",
            data: {
                page: page
            }
        }).done(function (items) {
            console.log(items);
            let $items = $(items.map(function (item) {
                return createGridItem(item);
            }))
            $items.imagesLoaded(function(){
                $grid.append($items).masonry( 'appended', $items );
                page++;
                sessionStorage.setItem("page", page);
                if (done){
                    done();
                }
            });
        });
    }

    window.onscroll = function(){
        let loadding = false;
        const bodyHeight = $('body').height();
        const scrollHeight = window.scrollY || window.pageYOffset;
        const screenHeight = window.screen.height;
        if (bodyHeight - screenHeight - scrollHeight < screenHeight / 3) {
            if (loadding === false){
                loadding = true;
                getGirlList(function(){
                    loadding = false;
                });
            }
        }
    }

    getGirlList();
})

function createGridItem(item) {
    let img = document.createElement("img");
    img.src = item.poster;

    let div = document.createElement("div");
    div.appendChild(img);
    div.className = "grid-item";

    return div;
}