angular.module('jrWeather.services', [])

.service('getMe', function($http) {
  return {
    weather : function() {
      return $http.get('data/weather.json').then(function(success) {

        return success.data.vals;

      }, function(err) {
        console.log(err);
      })
    },
    cities : function() {
      return $http.get('data/cities.json').then(function(success) {

        return success.data;

      }, function(err) {
        console.log(err);
      })
    },
    met : function(ID) {
      return $http({
        method: 'GET',
        url: 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/'+ID,
        params: {
          res: 'daily',
          key: '1557995e-17dd-41ff-9ed9-2803b0328aa0',
        }
      }).then(function(success) {

        return success.data;

      }, function(err) {
        console.log(err);
      })
    }
  };
})

.service('weatherInfo', function (getMe, $q) {

  var out = {
    tabs: [],
    period: {},
    //   view: {},
    //period: {},
    weather: [],

    start: function (id) {
      var report = getMe.met(id),
          weather = getMe.weather();

      return $q.all([report,weather]).then(function(results) {

        out.period = results[0].SiteRep.DV.Location.Period;

        j = out.period.length;
        for (i = 0; i < j; i++) {
          out.tabs[i] = {
            date: out.period[i].value,
            icon: out.period[i].Rep[0].W
          }
        }
        out.weather = results[1];
      })
    },

    view: function (index) {

      var viewInfo = out.period[index];
      //TEMP
      return {
        date: viewInfo.value,
        period: viewInfo.Rep,
        imgs: out.setImg(viewInfo.Rep)
      }

    },

    setImg: function (report) {
      var img = [];
      report.forEach(function (el, i) {
        //if (el.$ == 'Day') {
        var detail = out.weather[el.W],
          tempFeels = (el.$ == 'Day') ? el.FDm : el.FNm,
          char = detail.ch;
        if (detail.t) {
          switch (true) {
          case (tempFeels < 2):
            char = char + 1
            break;
          case (tempFeels < 12):
            char = char + 2;
            break;
          case (tempFeels < 20):
            char = char + 3;
            break;
          case (tempFeels < 30):
            char = char + 4;
            break;
          default:
            char = char + 5;
            break;
          }
        } else if (detail.t && el.S > 20) {
          char = char + 1;
        };

        img[i] = {
          bg: 'bg_' + el.$ + detail.bg,
          char: 'char_' + char,
          prop: detail.p,
          density: detail.pD,
          name : detail.n
        }

      })
      return img;


    }

  }
  return out;
})

/*
char = personBase + tempMod + windMod
bgLevel = cloudLevel
bgProp = report.$
foreGround = foreLvl
foreProp = foreProp
forePropAngle = report.wind
*/

/*.service('setWeather', function(between) {
  return function(viewData) {

      day : {

      }
    }
  }
})*/


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

.service('objInArray', function() {
  return function (needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i].id == needle.id) return true;
    }
    return false;
  }
})

/*.service('between', function() {
  return function(val,min,max) {
    return val >= min && val < max;
  }
})*/

//because metoffice timestamps are baddys
.filter('isoFix', function() {
  return function(input) {
    input = input || "";
    return input.replace("Z","");
  }
});
