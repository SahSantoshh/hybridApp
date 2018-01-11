// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngStorage', 'ngCordova'])

  .run(function ($ionicPlatform, $rootScope, FileSys, $q, $filter) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

    });


    $rootScope.catFile = "cats.json";
    $rootScope.postFile = "_post.json";
    $rootScope.mainPosts = [];
    $rootScope.sIds = [];
    $rootScope.id = {
      "id": "",
    };
    $rootScope.gotId = false;

    $rootScope.insertData = function (fileName, data) {
      FileSys.insertData(fileName, data);
    }

    $rootScope.insertPostId = function (oneId) {
      FileSys.checkFile("posts.json").then(function (success) {
        $rootScope.fetchData("posts.json").then(function (data) {
          $rootScope.sIds = JSON.parse(data);
        
          $rootScope.sIds.forEach(element =>{
            if(element.id == oneId){
              $rootScope.gotId = true;
              // break;
            }
          })

          if(!$rootScope.gotId){
            $rootScope.id.id = oneId;
            $rootScope.sIds.push($rootScope.id);
            $rootScope.insertData("posts.json", $rootScope.sIds);
          }
        });
      }, function (error) {
        $rootScope.id.id = oneId;
        $rootScope.sIds.push($rootScope.id);
        $rootScope.insertData("posts.json", $rootScope.sIds);
      });
    }

    $rootScope.fetchData = function (fileName) {
      return $q(function (resolve, reject) {
        FileSys.getData(fileName).then(function (success) {
          // $rootScope.cats = JSON.parse(success);
          resolve(success);
        });
      });
    }

    $rootScope.mainPosts1 = [];
    $rootScope.sIds1 = [];

    $rootScope.getPostIds = function () {
      return $q(function (resolve, reject) {
        $rootScope.fetchData("posts.json").then(function (success) { //fetches all posts id in posts.json file
          $rootScope.sIds1 = JSON.parse(success); //split them in array

          $rootScope.sIds1.forEach(element => {
            FileSys.checkFile(element.id + $rootScope.postFile).then(function (checked) { //check every file with the id
                $rootScope.fetchData(element.id + $rootScope.postFile).then(function (data) { //fetched data of checked file
                  $rootScope.mainPosts1.push(JSON.parse(data));// if file found then added them in array
                });
            });
          });
          resolve($rootScope.mainPosts1); //returened all posts id
        });
      });
    }

    $rootScope.delay = (function () {
      var timer = 0;
      return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();
  })


  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
      })
      .state('main.contentByCategory', {
        url: '/contentByCategory/:catId',
        templateUrl: 'templates/contentByCategory.html',
        controller: 'CatCtrl'
      })
      .state('main.contentRecent', {
        url: '/contentRecent',
        templateUrl: 'templates/menuContent.html',
        controller: 'MainCtrl'
      })
      .state('main.postDetail', {
        url: '/postDetail/:postId',
        templateUrl: 'templates/postDetail.html',
        controller: 'PostCtrl'
      })
      .state('main.favorites', {
        url: '/favorites',
        templateUrl: 'templates/favorites.html',
        controller: 'FavCtrl'
      })

    $urlRouterProvider.otherwise('/main/contentRecent');

  })
