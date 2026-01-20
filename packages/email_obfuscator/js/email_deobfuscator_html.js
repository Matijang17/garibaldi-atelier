(function ($) {
  $.fn.deobfuscateEmailLink = function () {
    $(this).each(function () {
      if ($(this).hasClass("obfuscated-link")) {
        var href = $(this).attr("href");
        var raw = $("<div/>").html(href).text();
        $(this).attr(
          "href",
          raw.replace("#MAIL:", "mailto:").replace(/\(at\)/g, "@")
        );
      } else {
        $(this).html($(this).html().replace("(at)", "@"));
      }
    });
  };

  $(document).ready(function () {
    $("a.obfuscated-link").deobfuscateEmailLink();
    $("span.obfuscated-link-text").deobfuscateEmailLink();
  });
})(jQuery);
