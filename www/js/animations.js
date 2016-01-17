angular.module('jrWeather.animations', ['ngAnimate'])

.animation('.lol', [function() {

  return {

    setClass: function(element, classesToAdd, classesToRemove, onDone) {
      // do some cool animation and call the doneFn
      console.log(classesToAdd);
    }

  };
}])
