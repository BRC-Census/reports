/* Puts the name of the report being viewed on the right side of the pink bar,
   so a reader on a phone, where the report's own menu is hidden, can still
   tell which report this is.

   The name is not written into the pages. It is the link text of this
   report's entry in the landing page's list, read from index.html each time,
   so renaming a report there renames it here too. If the landing page can't
   be fetched (opened from a local file, offline) the bar keeps just "Back".

   Loaded by patch.js on the prebuilt reports, and by a deferred <script> on
   the pages built in this repo; either way the bar is already in the page. */
(function () {
  var script = document.currentScript;
  if (!script || !window.fetch || !window.DOMParser) return;

  // This file sits at the site root, so its own URL says where the root is.
  var home = new URL("./", script.src);

  // The first path segment below the root names the report: "2017-summary-report".
  function reportDir(url) {
    var u = new URL(url, home);
    if (u.origin !== home.origin || u.pathname.indexOf(home.pathname) !== 0) return "";
    return decodeURIComponent(u.pathname.slice(home.pathname.length).split("/")[0]);
  }

  var dir = reportDir(location.href);
  if (!dir) return;
  var key = "pinkbar-title:" + dir;

  function show(name) {
    var bar = document.querySelector(".pinkbar");
    if (!bar || !name) return;
    var span = bar.querySelector(".pinkbar-title");
    if (!span) {
      span = document.createElement("span");
      span.className = "pinkbar-title";
      bar.appendChild(span);
    }
    span.textContent = name;
  }

  // Show the name remembered from an earlier page of this visit at once, so it
  // doesn't flicker in on every page of a multi-page report...
  try { show(sessionStorage.getItem(key)); } catch (e) {}

  // ...then check it against the landing page as it is now.
  fetch(home.href)
    .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      // The report list first, then any other link to this report, in case
      // the list is reorganized.
      var links = Array.prototype.slice.call(doc.querySelectorAll(".reports a"))
        .concat(Array.prototype.slice.call(doc.querySelectorAll("a")));
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");
        if (href && reportDir(href) === dir) {
          var name = links[i].textContent.replace(/\s+/g, " ").trim();
          show(name);
          try { sessionStorage.setItem(key, name); } catch (e) {}
          return;
        }
      }
      // No longer listed: drop any name remembered from before.
      var old = document.querySelector(".pinkbar .pinkbar-title");
      if (old) old.parentNode.removeChild(old);
      try { sessionStorage.removeItem(key); } catch (e) {}
    })
    .catch(function () {});
})();
