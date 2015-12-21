angular.module('jrWeather.services', [])

.service('getCities', ['$http', function($http) {
  return $http.get('data/cities.json')
    .success(function(data) {
      return data;
    })
    .error(function(err) {
      return err;
    })
}])

.service('favList', ['$window', 'objInArray', function($window, objInArray) {
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
}])

.service('objInArray', [function() {
  return function (needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i].id == needle.id) return true;
    }
    return false;
  }
}])
