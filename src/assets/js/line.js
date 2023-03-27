$(document).ready(function() {
  $("button").click(function() {
    $("button").removeClass("active");
    $(this).addClass("active");
    $(".line").removeClass("active");
    $(this).next(".line").addClass("active");
  });
});