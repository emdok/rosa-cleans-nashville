(function () {
  // Assemble the address at runtime so scrapers don't lift it from the source.
  var u = "rosa.cleaning.nashville", d = "gmail.com";
  var addr = u + String.fromCharCode(64) + d;
  document.querySelectorAll("a.js-email").forEach(function (a) {
    a.href = "mailto:" + addr;
    a.textContent = addr;
  });

  var form = document.getElementById("contact-form");
  var msg = document.getElementById("form-msg");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector("button[type=submit]");
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending…";
    msg.className = "form-msg";

    var data = Object.fromEntries(new FormData(form));

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          form.reset();
          msg.className = "form-msg ok";
          msg.textContent = "Thanks — your message is on its way. I'll get back to you within a couple days.";
        } else {
          throw new Error(res.message || "Submission failed");
        }
      })
      .catch(function () {
        msg.className = "form-msg err";
        msg.textContent = "Something went wrong sending that. Please email " + addr + " directly.";
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = original;
      });
  });
})();
