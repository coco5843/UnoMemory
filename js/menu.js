
$(function() {
  $(".selectable").selectable({
    selected: function() {
      var selectedItemList = $("#selected-item-list").empty();
      $(".selectable img").each(function(index) {
        if ($(this).hasClass("ui-selected")) {

          selectedItemList.append((index + 1) + ", ");
        }
      });
    }
  });
});
