angular.module('jrWeather.controllers', ['jrWeather.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SearchCtrl', [
  '$scope', 'getCities', 'favList', function($scope, getCities, favList) {

  favList.get()

  getCities.then(function(result) {
    $scope.cities = result.data;
  }, function(err) {
      console.log(err);
  })

  $scope.faveCities = favList.list;

  $scope.toggle = function(item) {
    favList.toggle(item);
  }

  $scope.isFave = function(item) {
    return favList.check(item);
  }

}])

.controller('WeatherCtrl', [
  '$scope', '$stateParams', 'getMet', 'weatherInfo',
  function ($scope, $stateParams, getMet, weatherInfo) {

    $scope.index = 0;

    getMet($stateParams.cityID).then(function (result) {

      $scope.get = result.data.SiteRep.DV.Location;
      weatherInfo.start($scope.get);
      $scope.tabs = weatherInfo.tabs;
      $scope.view = weatherInfo.view(0);

    }, function (err) {
      console.log(err);
    })


    $scope.makeActive = function (index) {
      $scope.index = index
      $scope.view = weatherInfo.view(index);
      //console.log($scope.view)
    }

    $scope.isActive = function (index) {
      return index == $scope.index;
    }
}]);
