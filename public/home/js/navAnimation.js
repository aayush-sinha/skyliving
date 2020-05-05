function myFunction(divName) {
  var x = document.getElementById(divName);
  var y = document.getElementById(divName+'A');
  var z = y.children;
  x.classList.remove('animated', 'slideOutLeft')
  x.classList.remove('animated', 'slideInLeft')
  if (x.style.display === "none") {
    x.style.display = "block";
    x.classList.add('animated', 'slideInLeft')
    x.addEventListener('animationend', function() { x.style.display = "block";
    z[0].style.transform = 'rotate(180deg)';
  });
    
  } else {
   
    x.classList.add('animated', 'slideOutLeft')
    x.addEventListener('animationend', function() { x.style.display = "none";
    z[0].style.transform = 'rotate(0deg)'; 
  });
    
    
  }
}
