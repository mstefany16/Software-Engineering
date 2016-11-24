( function () {
  'use strict';

  angular.module('confusionApp', ['ui.router', 'ngResource', 'ngDialog'])
  .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider

          // route for the home page
          .state('app', {
              url: '/',
              views: {
                  'header': {
                      templateUrl: 'views/header.html',
                      controller: 'HeaderController'
                  },
                  'content': {
                      templateUrl: 'views/home.html',
                      controller: 'HomeController'
                  },
                  'footer': {
                      templateUrl: 'views/footer.html',
                  }
              }

          })


          // route for the contactus page
          .state('app.contactus', {
              url: 'contactus',
              views: {
                  'content@': {
                      templateUrl: 'views/contactus.html',
                      controller: 'ContactController'
                  }
              }
          })

          // route for the menu page
          .state('app.menu', {
              url: 'menu',
              views: {
                  'content@': {
                      templateUrl: 'views/menu.html',
                      controller: 'MenuController'
                  }
              }
          })

          .state('app.promotions', {
              url: 'promotions/:id',
              views: {
                  'content@': {
                      templateUrl: 'views/promotions.html',
                      controller: 'PromoController'
                  }
              }
          })


                // route for the reservations page
          .state('app.reservations', {
              url: 'reservations',
              views: {
                  'content@': {
                      templateUrl: 'views/reservations.html',
                      controller: 'MyReservationController'
                  }
              }
          })
      ;

      $urlRouterProvider.otherwise('/');
  })
    ;
} )();
