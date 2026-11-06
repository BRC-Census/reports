/* The one script added to the prebuilt reports (2018, 2019 and the
   bookdown/Quarto builds) by bin/add-year. It links pinkbar.css, tags <html>
   with the report family so pinkbar.css can offset that family's layout, and
   puts the Census pink bar, with its "Back" link, at the top of the page.
   The reports built in this repo carry the bar in their own HTML instead. */
(function () {
  var home = new URL("../", document.baseURI).href;

  /* Linked from <head> while it is still parsing, so the bar is styled before
     the page paints. */
  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = home + "pinkbar.css";
  (document.head || document.getElementsByTagName("head")[0]).appendChild(css);

  document.addEventListener("DOMContentLoaded", function () {
    var html = document.documentElement;
    var quartoHeader = document.getElementById("quarto-header");

    if (document.getElementById("quarto-sidebar") || quartoHeader) {
      html.classList.add("pinkbar-quarto");
    } else if (document.querySelector(".book > .book-summary")) {
      html.classList.add("pinkbar-gitbook");       // bookdown's GitBook build
    } else if (document.getElementById("ml-menu")) {
      html.classList.add("pinkbar-mlmenu");        // 2018 and 2019
    }

    /* Quarto offsets the page by the height of its own fixed header, which
       changes with the window; pinkbar.css adds the bar's height to whatever
       that is. */
    if (quartoHeader && window.ResizeObserver) {
      new ResizeObserver(function () {
        html.style.setProperty("--quarto-header-h", quartoHeader.clientHeight + "px");
      }).observe(quartoHeader);
    }

    var back = document.createElement("a");
    back.className = "pinkbar-back";
    back.href = home;
    back.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/></svg><span>Back</span>';

    var bar = document.createElement("div");
    bar.className = "pinkbar";
    bar.appendChild(back);
    document.body.insertBefore(bar, document.body.firstChild);
  });
})();
