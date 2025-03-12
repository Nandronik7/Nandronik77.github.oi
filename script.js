// Встановлення дати, до якої рахуємо (заміни на потрібну)
var target_date = new Date("December 31, 2025 23:59:59").getTime();

var Clock = (function(){  
  var exports = function(element) {
    this._element = element;
    var html = '';
    for (var i=0;i<8;i++) {
      html += '<span data-now="0" data-old="0">&nbsp;</span>';
    }
    this._element.innerHTML = html;
    this._slots = this._element.getElementsByTagName('span');
    this._tick();
  };

  exports.prototype = {
    _tick:function() {
      var time = new Date().getTime();
      var seconds_left = Math.max((target_date - time) / 1000, 0); // Виключаємо негативне значення
      var days = Math.floor(seconds_left / 86400);
      seconds_left %= 86400;
      var hours = Math.floor(seconds_left / 3600);
      seconds_left %= 3600;
      var minutes = Math.floor(seconds_left / 60);
      var seconds = Math.floor(seconds_left % 60);
      
      this._update(
        this._pad(days) + 
        this._pad(hours) + 
        this._pad(minutes) + 
        this._pad(seconds)
      );

      var self = this;
      setTimeout(function(){
        self._tick();
      }, 1000);
    },

    _pad:function(value) {
      return ('0' + value).slice(-2);
    },

    _update:function(timeString) {
      var i = 0, l = this._slots.length, value, slot, now;
      for (; i < l; i++) {
        value = timeString.charAt(i);
        slot = this._slots[i];
        now = slot.getAttribute("data-now");
        if (!now) {
          slot.setAttribute("data-now", value);
          slot.setAttribute("data-old", value);
          continue;
        }
        if (now !== value) {
          this._flip(slot, value);
        }
      }
    },

    _flip:function(slot, value) {
      slot.classList.remove('flip');
      slot.setAttribute("data-old", slot.getAttribute("data-now"));
      slot.setAttribute("data-now", value);
      slot.offsetWidth; // Trigger reflow
      slot.classList.add('flip');
    }
  };
  return exports;
}());

document.addEventListener("DOMContentLoaded", function() {
  var clocks = document.querySelectorAll('.clock');
  for (var i = 0; i < clocks.length; i++) {
    new Clock(clocks[i]);
  }
});