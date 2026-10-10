document.addEventListener("DOMContentLoaded", function () {
  var home = new URL("../", document.baseURI).href;
  var quarto = document.querySelector("#quarto-sidebar .sidebar-menu-container > ul");
  var gitbook = document.querySelector("ul.summary");
  var li = document.createElement("li");
  if (quarto) {
    li.className = "sidebar-item";
    li.innerHTML = '<div class="sidebar-item-container"><a class="sidebar-item-text sidebar-link"><span class="menu-text"><i class="bi bi-arrow-left-circle"></i> Back</span></a></div>';
    quarto.appendChild(li);
  } else if (gitbook) {
    li.className = "chapter";
    li.innerHTML = '<a><i class="fa fa-arrow-circle-o-left"></i> Back</a>';
    gitbook.appendChild(li);
  } else {
    return;
  }
  li.querySelector("a").href = home;
});
