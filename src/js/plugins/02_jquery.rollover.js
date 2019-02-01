/**
 * jQuery.rollover
 *
 * @version    1.0.4
 * @author     Hiroshi Hoaki <rewish.org@gmail.com>
 * @copyright  2010-2011 Hiroshi Hoaki
 * @license    http://rewish.org/license/mit The MIT License
 * @link       http://rewish.org/javascript/jquery_rollover_plugin
 *
 */
jQuery.fn.rollover = function(suffix) {
  suffix = suffix || '_on';
  var check = new RegExp(suffix + '\\.\\w+$');
  return this.each(function() {
    var img = jQuery(this);
    var src = img.attr('src');
    if (check.test(src)) return;
    var _on = src.replace(/\.\w+$/, suffix + '$&');
    jQuery('<img>').attr('src', _on);
    img.on({
      'mouseenter':function() { img.attr('src', _on); },
      'mouseleave':function() { img.attr('src', src); }
    });
  });
};
