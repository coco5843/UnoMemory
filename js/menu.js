let selectedTexture = 0;
let hardMode = false;


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
    localStorage.setItem("hardmode", hardMode.toString());
    localStorage.setItem("texture", selectedTexture);
    localStorage.setItem("difficulty", value);
    window.location = "game.html";

  });

  $("#toggle").click(function() {
    hardMode = !hardMode;
    if(hardMode)
      this.classList.add("toggled");
    else
      this.classList.remove("toggled");
  });
});



