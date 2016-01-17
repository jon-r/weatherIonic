angular.module('jrWeather.animations', ['ngAnimate'])

.animation('.weather-bg', [function() {


  return {

    setClass: function(element, classesToAdd, classesToRemove, onDone) {
      // do some cool animation and call the doneFn
      var effect = 'saturate(1) brightness(1)';

      switch (classesToAdd) {
      case ('bg-0'):
          effect = {'-webkit-filter': 'saturate(1.5) brightness(1)'};
        break;
      case ('bg-2'):
          effect = {'-webkit-filter': 'saturate(.8) brightness(1.3)'};
        break;
      case ('bg-3'):
          effect = {'-webkit-filter': 'saturate(.4) brightness(1.6)'};
      }


      console.log(classesToAdd);
      TweenMax.to(element, 1, effect);
    }

  };
}])

/*
hsl(237, 66%, 14%)

212, 80%, 23%
204, 85%, 33%


219, 66%, 44%
212, 61%, 64%
202, 88%, 83%


*/
