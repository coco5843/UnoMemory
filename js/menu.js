let selectedTexture = 0;
$(function() {
  $(".selectable").selectable({
    selected: function() {
      $(".selectable img").each(function(index) {
        if ($(this).hasClass("ui-selected")) {
          selectedTexture = index;
        }
      });
    }
  });

  $(".difficulty").click(function() {
    const value = $(this).val();
    localStorage.setItem("texture", selectedTexture);
    localStorage.setItem("difficulty", value);
    window.location = "game.html";

  });
});



