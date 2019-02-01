$(function() {


  /* Smooth Scroll
  ------------------------------------------------------------ */
  $('a[href^="#"]').not('.noscroll').on('click', (e) => {
    let href = $(e.currentTarget).attr('href');
    let target = $(href == '#' || href == '' ? 'html' : href);
    let headerH = (winW >= breakpoint) ? 0 : $('#header').height();
    let position = (href == '#top') ? 0 : target.offset().top - headerH;
    $('html, body').stop(false,false).animate({scrollTop: position}, 700, 'easeOutExpo');
    return false;
  });



  /* PC・SP 画像切り替え
  ------------------------------------------------------------ */
  $('img[data-sp-src]').each( (idx, elm) => {
    const pcSrc = $(elm).attr('src');
    const spSrc = $(elm).data('sp-src');
    enquire.register('screen and (max-width: 767px)', {
      match: () => {
        $(elm).attr('src', spSrc);
      },
      unmatch: () => {
        $(elm).attr('src', pcSrc).filter('.is-rollover').rollover()
      }
    })
  });

});
