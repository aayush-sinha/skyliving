// basic paging logic to demo the buttons
var bl = document.querySelector('.paginate.left');
var br = document.querySelector('.paginate.right');




bl.onclick = previousHandler;
br.onclick = nextHandler;


const urlParams = new URLSearchParams(window.location.search);
const currentPage = parseInt(urlParams.get('page'));




var index = 0, total = 1;

function slide(offset) {
  index = Math.min(Math.max(index + offset, 0), total);

  document.querySelector('.counter').innerHTML = 'Page ' + (index) + ' of ' + total;

  bl.setAttribute('data-state', index - 1 === 0 ? 'disabled' : '');
  br.setAttribute('data-state', index - 1 === total - 1 ? 'disabled' : '');

}
function nextHandler() {
  if (currentPage < total)
    window.location.href = '/rooms?page=' + (currentPage + 1) + '&limit=12';
}
function previousHandler() {
  if (currentPage > 1)
    window.location.href = '/rooms?page=' + ((currentPage) - 1) + '&limit=12';
}
slide(currentPage);

