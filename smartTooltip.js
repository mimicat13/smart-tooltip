/**
 * @author Pavel Chigarin <chigarin@gmail.com>
 * @version 1.0
 *
 * @example
 * $(document).ready(function() {
 *      $('.smart-a').smartTooltip();
 *
 *      $('.smart-b').smartTooltip({static: true});
 *
 *      $('.smart-c').smartTooltip();
 *      $('.smart-c').smartTooltip('params', {static: true});
 *
 *      $('.smart-d').smartTooltip();
 *      $('.smart-d').smartTooltip('params', {
 *          content: 'loading',
 *          open: function(dom) {
 *              //new content (external ajax data for e.g)
 *              setTimeout(function() {
 *                 dom.smartTooltip('content', 'external content');
 *             }, 500);
 *          },
 *      });
 *   });
 *
 * @todo:
 *      toooltip data - build at init not at first hover
 */

(function($) {
  var options = new Array();
  var defaultOptions = {
    static: false,
    content: null,
    open: null,
  };
  var popups = new Array();

  var private = {
    options: new Array(),

    randomString: function(length_) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
      if (typeof length_ !== 'number') {
        length_ = Math.floor(Math.random() * chars.length_);
      }
      var str = '';
      for (var i = 0; i < length_; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }

      return str;
    },

    getUid: function(self) {
      return self.data('uid');
    },

    getOptions: function(dom) {
      var currOptions = {};
      var uid = private.getUid(dom);
      for (var o in options[uid]) {
        currOptions[o] = options[uid][o];
      }

      return currOptions;
    },

    build: function(param) {
      return this.each(function() {
        methods.params(param);

        var uid = private.getUid($(this));
        if (!options[uid]._hoverIsInited) {
          options[uid]._hoverIsInited = true;
          var $eventOwner = $(this);
          $eventOwner.hover(
              function() {
                $(this).smartTooltip('show');
              },
              function() {
                $(this).smartTooltip('hide');
              }
          );
        }
      });
    },

    calcPosition: function(dom) {
      var uid = private.getUid(dom);
      if (!popups[uid].popupInstance) {
        return;
      }

      var containerWidth = popups[uid].popupContainer.innerWidth();
      var containerHeight = popups[uid].popupContainer.innerHeight();
      var tooltipWidth = popups[uid].popupInstance.outerWidth();
      var tooltipHeight = popups[uid].popupInstance.outerHeight();
      var containerHalfWidth = Math.round(containerWidth * 0.5);
      var tooltipHalfWidth = Math.round(tooltipWidth * 0.5);

      var scrollTop = 0;
      if (typeof(window.pageYOffset) === 'number') {
        scrollTop = window.pageYOffset;
      } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        scrollTop = document.body.scrollTop;
      }
      var clientWidth = window.innerWidth || document.documentElement.clientWidth;

      var currentOptions = private.getOptions(dom);

      var bottomPos = containerHeight + 15;
      if (popups[uid].popupContainer.offset().top - scrollTop < tooltipHeight + 15 && !currentOptions.static) {
        popups[uid].popupInstance.removeClass('arrow-down').addClass('arrow-up');
        bottomPos = -tooltipHeight - containerHeight;
        popups[uid].popupInstance.addClass('arrow-up');
      } else {
        popups[uid].popupInstance.addClass('arrow-down');
      }

      var leftPos = (-tooltipHalfWidth + containerHalfWidth) + 'px';
      var rightPos = 'auto';

      var outOfBoundsLeft = popups[uid].popupContainer.offset().left + containerHalfWidth - tooltipHalfWidth;
      if (outOfBoundsLeft < 15 && !currentOptions.static) {
        leftPos = (containerHalfWidth - 40) + 'px';
        popups[uid].popupInstance.addClass('arrow-shift-right');
      }

      var outOfBoundsRight = popups[uid].popupContainer.offset().left + containerHalfWidth + tooltipHalfWidth;
      if (outOfBoundsRight > clientWidth - 45 && !currentOptions.static) {
        leftPos = 'auto';
        rightPos = (containerHalfWidth - 40) + 'px';
        popups[uid].popupInstance.addClass('arrow-shift-left');
      }

      popups[uid].popupInstance.css('bottom', bottomPos + 'px');
      popups[uid].popupInstance.css('left', leftPos);
      popups[uid].popupInstance.css('right', rightPos);
    },
  };

  var methods = {
    params: function(param) {
      $(this).each(function(i, dom) {
        if (param) {
          var uid = private.getUid($(dom));
          options[uid] = $.extend({}, defaultOptions, param);
        }
      });
    },

    show: function(param) {
      return this.each(function() {
        var uid = private.getUid($(this));
        popups[uid].popupContainer = $(this);

        var htmlData = null;

        if (options[uid]['content']) {
          htmlData = options[uid]['content'];
        } else {
          var contentId = popups[uid].popupContainer.data('tooltip-content');
          if (!contentId) {
            if (popups[uid].popupContainer.attr('title')) {
              htmlData = popups[uid].popupContainer.attr('title');
              popups[uid].popupContainer.data('title', htmlData);
              popups[uid].popupContainer.removeAttr('title');
            } else {
              htmlData = popups[uid].popupContainer.data('title');
            }
          } else {
            htmlData = $(contentId).html();
          }
          options[uid]['content'] = htmlData;
        }

        if (popups[uid].popupInstance) {
          popups[uid].popupInstance.stop(true, false).remove();
          popups[uid].popupInstance = null;
        }

        popups[uid].popupContainer.css('position', 'relative');
        popups[uid].popupContainer.append('<div class="smart-tooltip" data-uid="' + uid + '">' + htmlData +
            '</div>');
        popups[uid].popupInstance = $('.smart-tooltip[data-uid="' + uid + '"]');

        if (options[uid]['open']) {
          options[uid]['open'](popups[uid].popupContainer);
        }

        private.calcPosition(popups[uid].popupContainer);
        popups[uid].popupInstance.addClass('animate');
      });
    },

    hide: function(param) { //return;
      return this.each(function() {
        var uid = private.getUid($(this));
        if (popups[uid].popupInstance) {
          popups[uid].popupInstance.removeClass('animate').delay(400).queue(function() {
            $(this).dequeue();
            popups[uid].popupInstance.remove();
            popups[uid].popupInstance = null;
          });
        }
      });
    },

    content: function(param) {
      return this.each(function() {
        var uid = private.getUid($(this));
        if (!popups[uid].popupInstance) {
          return;
        }
        popups[uid].popupInstance.html(param);
        private.calcPosition(popups[uid].popupInstance);
      });
    },
  };

  $.fn.smartTooltip = function(param) {
    this.each(function(i, dom) {
      if (!$(dom).data('uid')) {
        var uid = private.randomString(10);
        $(dom).data('uid', uid);

        options[uid] = new Array();
        options[uid] = $.extend({}, defaultOptions, param);

        popups[uid] = new Object();
        popups[uid].popupContainer = null;
        popups[uid].popupInstance = null;
      }
    });

    if (methods[param]) {
      return methods[param].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof param === 'object' || !param) {
      return private.build.apply(this, arguments);
    } else {
      console.log('smartTooltip: method: "' + param + '" not found!');
    }
  };
})(jQuery);
