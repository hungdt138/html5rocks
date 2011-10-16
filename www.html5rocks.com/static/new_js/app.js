// +1 buttons.

(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

// Show header box shadow on scroll.
var docTop = $('html, body').offset().top;
$(window).bind('scroll', function(event) {
  var y = $(this).scrollTop();
  if ((y - docTop) > 100) {
    $('header').addClass('scroll');
    $(this).unbind('scroll', event.handler); // Remove this listen for performance. 
  }
});

// Page header pulldowns.

$('#search_show').click(function() {
  $('#features_hide').click(); // Hide features panel if it's out.

  if ($(this).hasClass('current')) {
    $('.subheader.search').hide();
    $(this).removeClass('current');
  } else {
    $('nav.main .current').removeClass('current');
    $(this).addClass('current');
    $('.subheader.search').show();
    $('#q').focus();
  }
});

$('#search_hide').click(function() {
  $('#search_show').removeClass('current');
  $('.subheader.search').hide();
});

$('#features_show').click(function() {
  $('#search_hide').click(); // Hide search panel if it's out.

  if ($(this).hasClass('current')) {
    $('.subheader.features').hide();
    $(this).removeClass('current');
  } else {
    $('nav.main .current').removeClass('current');
    $(this).addClass('current');
    $('.subheader.features').show();
  }
});

$('#features_hide').click(function() {
  $('#features_show').removeClass('current');
  $('.subheader.features').hide();
});

$('.subheader.features ul li a').click(function() {
  $('nav.main .current').removeClass('current');
});

// Page grid navigation.

$('a').click(function() {
  // Don't intercept external links
  if ($(this).attr('target')) {
    return true;
  }

  page = $(this).attr('href').substr($(this).attr('href').indexOf('/')).replace(/\/\w{2,3}\//gi, '').replace(/\/([A-Za-z]+)/gi, '-$1').replace(/\/$/, '').replace(/^-/, '');

  $('body').removeClass().attr('data-href', page);
  $('.page').removeClass('current');

  var pagePanel = $('.page#' + page);
  if (pagePanel.hasClass('loaded')) {
    pagePanel.addClass('current');
  } else {
    //pagePanel.addClass('current loaded').load($(this).attr('href') + ' article');
    pagePanel.addClass('current loaded');
    $.ajax({
      url: $(this).attr('href'),
      success: function(data, textStatus, jqXHR) {
        var html = $(jqXHR.responseText);

        // Filter out and load content section of the featur page.
        pagePanel.html(html.find('[data-import-html]'));

        // Parse out the caniuse data scripts from the html and run them.
        var scripts = html.filter('script.import_script');
        $.each(scripts, function(i, script) {
          eval(script.text); // TODO(ericbidelman): Figure out something better.
        });

        $('.subheader.features').slideUp();
      }
    });
  }

  /*$('.page#' + page).addClass('current').load($(this).attr('href') + ' .page', function() {
    $.scrollTo($('page#' + page), 800, {queue:true});
  });*/

  // TODO(Google): record GA hit on new ajax page load.
  // TODO(paulirish): add window.history.pushState

  return false;
});

$(document).keydown(function(e) {
  currentId = $('.current').attr('id');
  if (e.keyCode == 39) {
    nextPage = $('.current').next();
    nextPage.html('<p style="border: 4px solid red">Loading content...</p>');
    nextPage.addClass('next');
    nextPage.addClass('loaded');
    setTimeout(function() {
      $('.current').attr('class', $('.current').attr('class').replace(/current/, 'previous'));
      $('.page.next').attr('class', $('.page.next').attr('class').replace(/next/, 'current'));
    }, 10);
    
    $('.page.current').one('webkitTransitionEnd', function(e) {
      e.target.classList.remove('previous');
      $('.next').removeClass('next');
    });
  } else if (e.keyCode == 27) { // ESC
    $('#search_hide').click();
    $('#features_hide').click();
  }
});

// Features navigation.

// Toggle the feature nav.
$('.features_outline_nav_toggle').click(function(){
  $(this).toggleClass('activated');
  $('nav.features_outline').fadeToggle('fast');
});

// A feature is clicked.
$('nav.features_outline a.section_title').click(function(){
  if ($(this).parent('li').hasClass('current'))
  {
    $(this).parent('li').removeClass('current');
    $(this).siblings('ul').slideUp('fast');
  }
  else
  {
    $('nav.features_outline li').removeClass('current');
    $('nav.features_outline a.section_title').siblings('ul').slideUp('fast');
    $(this).parent('li').addClass('current');
    $(this).siblings('ul').slideDown('fast');
  }
});