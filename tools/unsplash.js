var sName = $("title").text.split("(")[0].trim();
var imgs = Array.from(document.querySelectorAll("._1pn7R img[itemprop=thumbnailUrl]")).slice(0, getRandomSize());
var items = imgs.map(function(img, index){
    var item = {
        sName: sName,
        sImgUrl: img.currentSrc
    }
    if (index === 0){
        item.bPoster = true;
    }
    return item;
});

function getRandomSize(){
    return parseInt(Math.random() * 5 + 5)
}

console.log(JSON.stringify(items));