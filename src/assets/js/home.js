// $(document).ready(function() {
//   $('#menu-icon').click(function() {
//     $('.menu').slideToggle();
//   });
  
//   $(window).resize(function() {
//     var screenWidth = $(window).width();
//     if (screenWidth > 768) {
//       $('.menu').removeAttr('style');
//     }
//   });
// });

var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000); // 5 saniye
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}