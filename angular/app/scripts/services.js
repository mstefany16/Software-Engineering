( function () {
  'use strict';

  angular.module('confusionApp')
  .constant("baseURL", "https://localhost:3443/")
  .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

      return $resource(baseURL + "dishes/:id", null, {
          'update': {
              method: 'PUT'
          }
      });

  }])


  .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

      return $resource(baseURL + "promotions/:id", null, {
          'update': {
              method: 'PUT'
          }
      });

  }])


  .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {


      return $resource(baseURL + "feedback/:id", null, {
          'update': {
              method: 'PUT'
          }
      });

  }])

.factory('myReservationFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "reservations/myreservations/:id", null, {
        'update': {
            method: 'PUT'
        }
    });
}])


.factory('reservationFactory', ['$resource', 'baseURL','ngDialog','$state', function ($resource, baseURL, ngDialog, $state) {

    var reservationFac = {};


    reservationFac.reserve = function (reserveData) {
        $resource(baseURL + "reservations/").save(reserveData, function (response) {

            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Reservation Status:</h3></div>' +
                '<div><p>' + response.status + '</p><p>' +
               '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';

            ngDialog.openConfirm({ template: message, plain: 'true' });
           
        }
        );

        $state.go('views/reserve.html', {}, { reload: true });
    };

    return reservationFac;

}])

  //    local storage to store user name and password and auth uses it to store the
  //    token sent back from the server side
  .factory('$localStorage', ['$window', function ($window) {
      return {
          store: function (key, value) {

              $window.localStorage[key] = value;
          },
          get: function (key, defaultValue) {
              return $window.localStorage[key] || defaultValue;
          },
          remove: function (key) {
              $window.localStorage.removeItem(key);
          },
          storeObject: function (key, value) {
              $window.localStorage[key] = JSON.stringify(value);
          },
          getObject: function (key, defaultValue) {
              return JSON.parse($window.localStorage[key] || defaultValue);
          }
      };
  }])

  //    login, logout, registration
  .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', '$state',
      function ($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog, $state) {


          var authFac = {};

          //when logged in, server the send with back an object which has a token
          //the save it use it localstorage and for subsequent requests put the token in
          //the header of the http request going client -> server
          //when token is deleted, logged out
          var TOKEN_KEY = 'Token';
          var isAuthenticated = false;
          var username = '';
          var admin = false;
          var authToken = undefined;

          //retrieves credentials from the local storage and restores those value
          //  doesnt handle expired tokens future TODO
          function loadUserCredentials() {
              var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
              if (credentials.username !== undefined) {
                  useCredentials(credentials);
              }
          }

          //using local storage and stores credentials username + token
          function storeUserCredentials(credentials) {
              $localStorage.storeObject(TOKEN_KEY, credentials);
              useCredentials(credentials);
          }

          //use the tokens once logged in
          function useCredentials(credentials) {
              isAuthenticated = true;
              username = credentials.username;
              admin = credentials.admin;
              authToken = credentials.token;

              // Set the token as header for your requests!
              //  x-access-token - name of header
              //  by calling this , for all outgoing message, insert header x-access-token
              //  and put authToken
              $http.defaults.headers.common['x-access-token'] = authToken;
          }

          // authtoken is undefined, user is empty, auth is false, header value is removed
          function destroyUserCredentials() {
              authToken = undefined;
              username = '';
              admin = false;
              isAuthenticated = false;
              $http.defaults.headers.common['x-access-token'] = authToken;
              //  remove stored credentials in local storage
              $localStorage.remove(TOKEN_KEY);
          }

          //logindata passed
          authFac.login = function (loginData) {
              //rest api endpoint
              $resource(baseURL + "users/login")
              .save(loginData,
                 // success function
                 function (response) {
                     // takes in the username and token and puts it in local storage
                     storeUserCredentials({ username: loginData.username, admin: response.admin, token: response.token });
                     //remind the controller that the login is successful
                     // display user name on navbar
                     $state.go($state.current, {}, { reload: true });
                     $rootScope.$broadcast('login:Successful');
                 },
                 // failure function
                 function (response) {
                     isAuthenticated = false;

                     // error message
                     var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                         '<div><p>' + response.data.err.message + '</p><p>' +
                           response.data.err.name + '</p></div>' +
                       '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';

                     ngDialog.openConfirm({ template: message, plain: 'true' });
                 }

              );

          };

          //user logout
          authFac.logout = function () {
              //get sends a get request to the users logout on server side  and destroy the credentials
              $resource(baseURL + "users/logout").get(function (response) {
              });
              destroyUserCredentials();
          };

          //passes register data from controller
          authFac.register = function (registerData) {

              $resource(baseURL + "users/register")
              .save(registerData,
                 // success function
                 function (response) {
                     // login the user with the function
                     authFac.login({ username: registerData.username, password: registerData.password });
                     //remember the users credentials id registration successful
                     if (registerData.rememberMe) {
                         $localStorage.storeObject('userinfo',
                             { username: registerData.username, password: registerData.password });
                     }
                     //broadcast
                     $rootScope.$broadcast('registration:Successful');
                     $state.go('app', {}, { reload: true });
                 },

                 // error function
                 function (response) {

                     var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                         '<div><p>' + response.data.err.message +
                         '</p><p>' + response.data.err.name + '</p></div>';

                     ngDialog.openConfirm({ template: message, plain: 'true' });

                 }

              );
          };

          //deletes user account 
          authFac.delete = function () {
              $resource(baseURL + "users/account").delete(function (response) {
              });
              $state.go('app', {}, { reload: true });
          };

          authFac.isAuthenticated = function () {
              return isAuthenticated;
          };

          authFac.getUsername = function () {
              return username;
          };

          authFac.getAdmin = function () {
              return admin;
          };

          loadUserCredentials();

          return authFac;

      }])
    ;


})();