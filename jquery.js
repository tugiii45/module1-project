$(document).ready(function () {
  $("#button").click(function () {
    alert("Button clicked!");
  });
  $("button").css("background-color", "blue");
});
function caloriecounter(query) {
  $.ajax({
    url: ` https://api.api-ninjas.com/v1/nutrition?query=${query}`,
    method: "GET",
    headers : { 
        "X-Api-Key" : "uqEGPQJbibIECw3ymvifeeGnwfLf19vq8wID0WnL"
    },
    success: function (data) {
      console.log("AJAX success:", data);
    //   $("#result").html("<h2>" + data.title + "</h2><p>" + data.body + "</p>");
    },
    error: function (error) {
      console.log("AJAX error:", error);
    //   $("#result").html("<h2>Error</h2><p>Error loading data.</p>");
    },
  });
}
caloriecounter("1 apple");
