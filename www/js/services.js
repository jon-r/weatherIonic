angular.module('jrWeather.services', [])

.service('getCities', function($http) {
  return $http.get('data/cities.json')
})

.service('getWeather', function($q, $http) {
  return $http.get('data/weather.json')
})

.service('getMet', function ($http) {
  return function (ID) {
    return $http({
      method: 'GET',
      url: 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/'+ID,
      params: {
        res: 'daily',
        key: '1557995e-17dd-41ff-9ed9-2803b0328aa0',
      }
    })
  }
 })

.service('weatherInfo', function(getWeather) {

  var today = [],
      weather = {},
      weatherSpec = [];

  var out = {
    data : {},
    tabs : [],


    start: function(data) {

      out.get();

      j=data.Period.length;
      for (i=0;i<j;i++) {
        out.tabs[i] = {
          date: data.Period[i].value,
          icon: data.Period[i].Rep[0].W
        }
      }
      reports = data.Period;
     // http://stackoverflow.com/questions/18752222/waiting-for-a-promise
    },

    get : function() {

      getWeather.then(function(result) {
        weatherSpec = result.data;
      }, function(err) {
        console.log(err);
      })
    },

    view : function(index) {

      weather = {
        date : reports[index].value,
        imgs : weatherSpec[reports[index].Rep[0].W]
      }

      //temp
      console.log(weather.imgs)
      return weather;
    }
/*    set : function(data) {
      out.split(data.Period);
      //return out.days;
    }*/


  }

  return out;
})

.service('favList', function($window, objInArray) {
  var out = {
    list : [],

    toggle : function(item) {
      if (out.check(item)) {
        var i = out.list.indexOf(item)
        out.list.splice(i,1);
        out.save();
      } else {
        out.list.push({id : item.id, name: item.name, name2: item.name2});
        out.save();
      }
    },

    save : function() {
      $window.localStorage['faves'] = JSON.stringify(out.list);
    },

    get : function(data) {
      out.list = JSON.parse($window.localStorage['faves'] || '[]');
    },

    check : function(item) {
      return objInArray(item, out.list);
    }
  };
  return out;
})

.service('objInArray', [function() {
  return function (needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i].id == needle.id) return true;
    }
    return false;
  }
}])

//because metoffice timestamps are baddys
.filter('isoFix', function() {
  return function(input) {
    input = input || "";
    return input.replace("Z","");
  }
});
