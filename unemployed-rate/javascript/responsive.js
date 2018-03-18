var textItems = document.getElementsByClassName("centered");
var flexItems = document.getElementsByClassName("flexbox-item");
var prejobText = document.getElementsByClassName("prejobText")[0];
var allP = document.getElementsByTagName("p");

function setWidth() {
    var flexboxContainerWidth = document.getElementsByClassName("flexbox-container")[1].clientWidth;
    if (flexboxContainerWidth <= 550) {
        for (var i = 0; i < allP.length; i++)
            allP[i].style.fontSize = 16;

        for (var i = 0; i < flexItems.length; i++) {
            flexItems[i].style.flexBasis = "99%";
            flexItems[i].style.width = flexboxContainerWidth * 0.9;
        }

        for (var i = 0; i < textItems.length; i++) {
            textItems[i].style.paddingLeft = flexboxContainerWidth * 0.05;
            textItems[i].style.paddingRight = flexboxContainerWidth * 0.05;
        }
    } else {
        for (var i = 0; i < allP.length; i++)
            allP[i].style.fontSize = 20;

        for (var i = 0; i < flexItems.length; i++) {
            if (i != 6 && i != 7) {
                flexItems[i].style.width = flexboxContainerWidth * 0.49;
                flexItems[i].style.flexBasis = "49%";
            } else {
                flexItems[i].style.flexBasis = "99%";
                flexItems[i].style.width = flexboxContainerWidth * 0.9;
                textItems[i].style.paddingLeft = flexboxContainerWidth * 0.05;
                textItems[i].style.paddingRight = flexboxContainerWidth * 0.05;
            }
        }
        prejobText.style.paddingLeft = "30%";
        prejobText.style.paddingRight = "30%";
    }
}

setWidth();

window.addEventListener("resize", setWidth);