(function ($) {

var update_page = function  () {

  var
  $win                  = $(window),
  $header               = $("header.o_main_header"),
  $main_navbar          = $("#main_navbar"),
  $navbar_aside         = $(".navbar-aside"),
  $navClone             = null,
  $floating_action      = $("#floating_action"),
  $floating_action_menu = $("#floating_action_menu"),
  $body                 = $("body"),
  $main                 = $("main"), // remove
  $aside                = $("aside"),
  $mask                 = $("#mask"),
  $title                = $("#main_title"),
  $cardTop              = $(".card.top")
  $cover_img            = $(".card.top .card-img"),
  ripples               = $(".ripple"),
  $main_back            = $("#main-back");

  var titleZoom = 1.5,
  wW          = $win.width();

  $navbar_aside.find("li").has("ul").addClass("parent");

  if ($main.hasClass("index")){
    $main.find("#index .index-tree > .row").each(function(){
      var childs = $(this).find(".col-md-3");
      if(childs.length == 2){
        childs.removeClass("col-md-3").addClass("col-md-6");
      }
      if(childs.length == 3){
        childs.removeClass("col-md-3").addClass("col-md-4");
      }
    })
    $(".floating_action_container").remove();
  }

  var resize_aside = function(){
    var navbar_aside_data = $navbar_aside[0].getBoundingClientRect();
    var $navClone_ul = $navClone.find("> ul");
    var $navbar_aside_ul = $navbar_aside.find("> ul");
    var maxH = $(window).height() - 45;
    maxH_ul = maxH - ($navClone_ul.position().top + 45);
    $navClone.css({
      "width": navbar_aside_data.width,
      "left": navbar_aside_data .left,
      "height": maxH
    })
    $navClone_ul.add($navbar_aside_ul).css("max-height",maxH_ul)
  }

  var resize = function() {
    wW          = $(window).width();

    if($navClone != null){
      resize_aside();
    }
  }


  var header_layout = function  () {

    var $header_sub  = $header.find(".o_sub_nav");
    var headerHeight = $header.outerHeight();

    var isDesktop = undefined;
    checkMindowMedia();
    $win.on('resize', checkMindowMedia);

    function checkMindowMedia() {
      var old = isDesktop;
      isDesktop = ($win.outerWidth(true) >= 992);
      if (old !== isDesktop) {
        onScrollWindow();
      }
    }

    $win.on('scroll', onScrollWindow);

    function onScrollWindow(e) {
      $header.toggleClass('o_scrolled', $win.scrollTop() > headerHeight);
    }

    // Menu opening & closing
    var timer;
    $header.on('click', '.o_primary_nav .dropdown-toggle', function(e) {
      e.preventDefault();

      var $a = $(this);
      clearTimeout(timer);

      $a.parent().toggleClass('open');
      $a.closest('ul').toggleClass('o_sub_opened', $a.parent().hasClass('open'));
      if ($a.closest('.o_primary_nav').children('.open').length > 0) {
        $header.addClass("o_sub_opened");
      } else {
        timer = setTimeout(function() {
          $header.removeClass("o_sub_opened");
        }, 200);
      }
    });
    $header.on('click', '.o_primary_nav .o_secondary_nav', function(e) {
      if (e.target === e.currentTarget) {
        $header.find('.open').removeClass('open');
        $header.find('.o_sub_opened').andSelf().removeClass('o_sub_opened');
      }
    });

    // Mobile menu opening
    $header.on('click', '.o_mobile_menu_toggle', function(e) {
      e.preventDefault();
      $(this).find('i').toggleClass('fa-bars fa-times');
      $header.toggleClass('o_mobile_menu_opened');
    });
  };
  header_layout();

  var floating_menu_layout = function () {
    var lis = $navbar_aside.find("> ul > li").clone(true)
      .addClass("ripple")
      .css({
        position: 'relative',
        overflow: 'hidden'
      });
    lis.find("ul").remove().end()
      .find("a").removeClass("ripple").on("click", function  () {
        floating_menu_toggle();
      });
    $floating_action_menu.find(".content").empty().append(lis);
  }
  floating_menu_layout();

  var floating_menu_toggle = function  () {
    $floating_action.toggleClass("active");
    setTimeout(function  () {
      $floating_action_menu.toggleClass("active");
      $mask.toggleClass("active");
    }, 300);
  };

  var scroll_to = function(el_list) {
    var offset = 80;
    el_list.each(function () {
      var $link = $(this),
          href = $link.attr("href");

      $link.on("click", function () {
        var val = $(href).offset().top - 60;
        $('html, body').animate({
          scrollTop: val
        }, 600);
        $navClone.find("li").removeClass("active");
        $link.parents("li").addClass("active");
        window.location.hash = $(this).prop('hash');
        return false;
      })
    })
  }


  var ripple_animation = function(el_list) {
    el_list.each(function () {
      var btn = $(this);
      btn
        .css({
          position: 'relative',
          overflow: 'hidden'
        })
        .bind('mousedown', function (e) {
          var ripple;
          if (btn.find('.inner-ripple').length === 0) {
            ripple = $('<span class="inner-ripple"/>');
            btn.prepend(ripple);
          } else {
            ripple = btn.find('.inner-ripple');
          }
          ripple.removeClass('inner-ripple-animated');

          if (!ripple.height() && !ripple.width()) {
            var diameter = Math.max(btn.outerWidth(), btn.outerHeight());
            ripple.css({
              height: diameter,
              width: diameter
            });
          }
          var x = e.pageX - btn.offset().left - ripple.width() / 2;
          var y = e.pageY - btn.offset().top - ripple.height() / 2;
          ripple .css({top: y + 'px', left: x + 'px'}) .addClass('inner-ripple-animated');
          setTimeout(function () {
            ripple.removeClass('inner-ripple-animated');
          }, 351);
        });
    });
  }
  var aside_layout = function  () {

    if ($navbar_aside.length > 0) {

      var navbar_aside_data = $navbar_aside[0].getBoundingClientRect();

      if ($navClone == null) { // build affix menu

        $navClone = $navbar_aside.clone().attr("id","navClone").appendTo($body);

        //force repainting
        $navClone[0].style.display='none';
        setTimeout(function () {
          $navClone[0].offsetHeight;
          $navClone[0].style.display='';
        }, 10);
        $navClone.addClass("affix hidden");

        ripple_animation($navClone.find("li > a"));
        scroll_to($navClone.find("li > a"));

        $navClone.css({
          "width": navbar_aside_data.width,
          "left": navbar_aside_data .left
        })
        $(window).trigger("resize");
        //$body.scrollspy('refresh');
      } // End - build affix menu

    }
  };
  aside_layout();

  var cards_animate = function  (type, speed) {
    type = type || 'in';
    speed = speed || 2000;
    var $container = $("main.index"),
      $cards = $container.find(".card"),
      $titles = $container.find("h2");

    $cards.each(function  () {
      var $card = $(this),
        cardOffset = this.getBoundingClientRect(),
        offset = cardOffset.left * 0.8 + cardOffset.top,
        delay = parseFloat(offset / speed).toFixed(2);
      $card.css("transition-delay", delay + "s");
    });

    if (type === "in") {
      $titles.fadeTo(0, 0);
      $titles.fadeTo(1000, 1);
      $container.addClass("animating");
    } else {
      $titles.fadeTo(300, 0);
      $container.removeClass("animating");
    }
  };
  cards_animate();


  // BIND EVENTS

  $floating_action.on("click", function  () {
    floating_menu_toggle();
    return false;
  });

  $mask.on("click", function  () {
    floating_menu_toggle();
    return false;
  });

  $(".content-switcher").each(function  (index, switcher) {
    var $switcher = $(switcher),
        $links = $switcher.find('> ul > li'),
        $tabs = $switcher.find('> .tabs > *'),
        $all = $links.add($tabs);

    function select(index) {
      $all.removeClass('active');
      $links.eq(index).add($tabs.eq(index)).addClass('active');
    }
    select(0);
    $switcher.on('click', '> ul > li', function () {
      select($(this).index());
      return false;
    });
  });


  $(window)
    .on("scroll", function () {
      //aside_layout();
    })
    .on("resize", function () {
      resize();
    })
    .trigger("scroll");

  //Ripples

  ripple_animation(ripples);

};

$(document).ready(function () {
  update_page();
});

})(jQuery);
