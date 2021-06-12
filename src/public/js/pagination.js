var current_page = parseInt(document.getElementById('currentPage').textContent);
var current_stage = parseInt((current_page - 1) / 3) + 1;
var baseHref = window.location.href.split('?')[0] + '?page=';
var totalPage = parseInt(document.getElementById('totalPage').textContent);
var pageLinkInner = document.getElementsByClassName('page-link-inner');
var maxStage = Math.ceil(totalPage / 3);
var btn_next = document.getElementById('btn_next');
var btn_prev = document.getElementById('btn_prev');

function ShowHidePreNextBtn() {
    if (current_stage == 1) {
        btn_prev.style.visibility = 'hidden';
    } else {
        btn_prev.style.visibility = 'visible';
    }
    console.log(maxStage)
    if (current_stage == maxStage) {
        btn_next.style.visibility = 'hidden';
    } else {
        btn_next.style.visibility = 'visible';
    }
}

function loadLink() {
    for (let i = 0; i < pageLinkInner.length; i++) {
        btn_prev.href = baseHref + (current_page - 1).toString();
        btn_next.href = baseHref + (current_page + 1).toString();
        var numberStart = current_stage * 3 - 2;
        pageLinkInner[i].href = baseHref + (i + numberStart).toString();
        pageLinkInner[i].innerHTML = i + numberStart;
    }
}

function loadActivePageLinkInner() {
    for (let i = 0; i < pageLinkInner.length; i++) {
        let href = pageLinkInner[i].href;
        let index = href.charAt(href.length - 1);
        if (index == current_page)
            pageLinkInner[i].parentElement.classList.add('active');
    }
}

window.onload = function () {
    ShowHidePreNextBtn();
    loadLink();
    loadActivePageLinkInner();
};