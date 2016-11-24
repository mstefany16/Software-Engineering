( function () {
    'use strict';

    angular.module('confusionApp')

        .controller('MenuController', ['$scope', '$state', 'menuFactory', 'AuthFactory', 'ngDialog',
            function ($scope, $state, menuFactory,  AuthFactory, ngDialog) {

                $scope.tab = 1;
                $scope.filtText = '';
                $scope.showDelete = false;
                $scope.showMenu = false;
                $scope.showAdd = false;
                $scope.message = "Loading ...";
                $scope.admin = AuthFactory.getAdmin();
                $scope.user = AuthFactory.isAuthenticated();

                menuFactory.query(
                    function (response) {
                        $scope.dishes = response;
                        $scope.showMenu = true;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    });

                $scope.select = function (setTab) {
                    $scope.tab = setTab;

                    if (setTab === 2) {
                        $scope.filtText = "appetizer";
                    } else if (setTab === 3) {
                        $scope.filtText = "mains";
                    } else if (setTab === 4) {
                        $scope.filtText = "dessert";
                    } else {
                        $scope.filtText = "";
                    }
                };

                $scope.isSelected = function (checkTab) {
                    return ($scope.tab === checkTab);
                };

                $scope.toggleFavorites = function () {
                    $scope.showFavorites = !$scope.showFavorites;
                };
                $scope.toggleDelete = function () {
                    $scope.showDelete = !$scope.showDelete;
                };

                $scope.openAdd = function () {
                    ngDialog.open({
                        template: 'views/adddish.html',
                        scope: $scope, className: 'ngdialog-theme-default',
                        controller: "AddController"
                    });
                };
                $scope.removeDish = function (dishid) {
                    console.log('Remove dish', dishid);
                    menuFactory.delete({ id: dishid });
                    //$scope.showDelete = !$scope.showDelete;
                    $state.go('app.menu', {}, { reload: true });

                };

            }])


    .controller('PromoController', ['$scope', '$state', 'promotionFactory', 'AuthFactory', 'ngDialog',
            function ($scope, $state, promotionFactory, AuthFactory, ngDialog) {

                $scope.tab = 1;
                $scope.filtText = '';
                $scope.showDelete = false;
                $scope.showAdd = false;
                $scope.message = "Loading ...";
                $scope.admin = AuthFactory.getAdmin();
                $scope.user = AuthFactory.isAuthenticated();

                promotionFactory.query(
                    function (response) {
                        $scope.promotions = response;
                        $scope.showMenu = true;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    });

                $scope.toggleDelete = function () {
                    $scope.showDelete = !$scope.showDelete;
                };

                $scope.openAddPromo = function () {
                    ngDialog.open({
                        template: 'views/addpromo.html',
                        scope: $scope, className: 'ngdialog-theme-default',
                        controller: "AddPromoController"
                    });
                };
                $scope.removePromo = function (dishid) {
                    console.log('Remove promotion', dishid);
                    promotionFactory.delete({ id: dishid });
                    $scope.showDelete = !$scope.showDelete;
                    $state.go('app.promotions', {}, { reload: true });

                };

            }])
    .controller('AddController', ['$scope', '$state', 'menuFactory', 'AuthFactory', 'ngDialog',
            function ($scope, $state, menuFactory, AuthFactory, ngDialog) {



                $scope.admin = AuthFactory.getAdmin();
                $scope.message = "Loading ...";

                $scope.myDish = {
                    name: "",
                    image: "",
                    category: "",
                    label: "",
                    price: "",
                    description: "",
                    featured: false

                };

                $scope.addDish = function () {
                    console.log('Add dish');
                    menuFactory.save($scope.myDish);

                    ngDialog.close();
                    $state.go('app.menu', {}, { reload: true });

                    $scope.addForm.$setPristine();

                    $scope.myDish = {
                        name: "",
                        image: "",
                        category: "",
                        label: "",
                        price: "",
                        description: "",
                        featured: false

                    };
                };
            }])

    .controller('AddPromoController', ['$scope', '$state', 'promotionFactory', 'AuthFactory', 'ngDialog',
            function ($scope, $state, promotionFactory, AuthFactory, ngDialog) {


                $scope.admin = AuthFactory.getAdmin();
                $scope.message = "Loading ...";

                $scope.myPromo = {
                    name: "",
                    image: "",
                    label: "",
                    price: "",
                    description: "",
                    featured: false

                };

                $scope.addPromo = function () {
                    console.log('Add promotion');
                    promotionFactory.save($scope.myPromo);

                    ngDialog.close();
                    $state.go('app.promotions', {}, { reload: true });

                    $scope.addPromoForm.$setPristine();

                    $scope.myPromo = {
                        name: "",
                        image: "",
                        label: "",
                        price: "",
                        description: "",
                        featured: false

                    };
                };


            }])


        .controller('ContactController', ['$scope', '$state', 'feedbackFactory', 'AuthFactory',
            function ($scope, $state, feedbackFactory, AuthFactory) {

                $scope.feedback = {};
                $scope.user = AuthFactory.isAuthenticated();
                $scope.message = "Loading ...";

                feedbackFactory.query(
                    function (response) {
                        $scope.feedback = response;

                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    });

                $scope.myfeedback = {
                    firstName: "",
                    lastName: "",
                    tel: "",
                    email: "",
                    rating: 5,
                    comments: ""

                };


                $scope.sendFeedback = function () {


                    feedbackFactory.save($scope.myfeedback);

                    $state.go($state.current, {}, { reload: true });

                    $scope.feedbackForm.$setPristine();
                    $scope.myfeedback = {
                        firstName: "",
                        lastName: "",
                        tel: "",
                        email: "",
                        rating: 5,
                        comments: ""
                    };

                };

            }])

        

        .controller('HomeController', ['$scope', 'promotionFactory', function ($scope,promotionFactory) {

            $scope.showPromotion = false;
            $scope.message = "Loading ...";
            
            var promotions = promotionFactory.query({
                featured: "true"
            })
                .$promise.then(
                    function (response) {
                        var promotions = response;
                        $scope.promotion = promotions[0];
                        $scope.showPromotion = true;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
        }])

        
        // handles logging in and logging out and registration
        .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

            //used to flip log in and log out on navbar
            $scope.loggedIn = false;
            $scope.username = '';

            if (AuthFactory.isAuthenticated()) {
                $scope.loggedIn = true;
                $scope.username = AuthFactory.getUsername();
            }

            //open the login view
            $scope.openLogin = function () {
                ngDialog.open({
                    template: 'views/login.html',
                    scope: $scope, className: 'ngdialog-theme-default',
                    controller: "LoginController"
                });
            };

            //open reservation view
            $scope.openReservation = function () {
                ngDialog.open({
                    template: 'views/reserve.html',
                    scope: $scope, className: 'ngdialog-theme-default',
                    controller: "ReservationController"
                });
            };

            $scope.logOut = function () {
                AuthFactory.logout();
                $scope.loggedIn = false;
                $scope.username = '';
                $state.go('app', {}, { reload: true });
            };


            $scope.openAccount = function () {
                ngDialog.open({
                    template: 'views/account.html',
                    scope: $scope, className: 'ngdialog-theme-default',
                    controller: "AccountController"
                });
            };

            $rootScope.$on('login:Successful', function () {
                $scope.loggedIn = AuthFactory.isAuthenticated();
                $scope.username = AuthFactory.getUsername();
            });

            $rootScope.$on('registration:Successful', function () {
                $scope.loggedIn = AuthFactory.isAuthenticated();
                $scope.username = AuthFactory.getUsername();
            });

            //active class
            $scope.stateis = function (curstate) {
                return $state.is(curstate);
            };

        }])


     .controller('AccountController', ['$scope', 'ngDialog', 'AuthFactory', function ($scope, ngDialog, AuthFactory) {


         $scope.deleteAccount = function () {
             if ($scope.yes) {
                 AuthFactory.delete();

                 AuthFactory.logout();

                 ngDialog.close();
             }
             else {
                 ngDialog.close();
             }
         };

     }])


        .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

            //retrieves login data in local storage
            $scope.loginData = $localStorage.getObject('userinfo', '{}');

            // if in login and is remembered me get the info from local storage
            $scope.doLogin = function () {
                if ($scope.rememberMe)
                    $localStorage.storeObject('userinfo', $scope.loginData);


                AuthFactory.login($scope.loginData);

                ngDialog.close();

            };

            $scope.openRegister = function () {
                ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
            };

        }])

        .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

            $scope.register = {};
            $scope.loginData = {};

            $scope.doRegister = function () {
                console.log('Doing registration', $scope.registration);

                AuthFactory.register($scope.registration);

                ngDialog.close();

            };
        }])

    .controller('ReservationController', ['$scope', '$state', 'reservationFactory', 'AuthFactory',
            function ($scope, $state, reservationFactory, AuthFactory) {

                $scope.reservation = {};
                $scope.user = AuthFactory.isAuthenticated();
                $scope.message = "Loading...";


                $scope.myreservation = {
                    guests: "1",
                    date: "",
                    time: 5,
                    section: "inside"
                };

                $scope.sendReservation = function () {
                   
                    reservationFactory.reserve($scope.myreservation);

                    $state.go($state.current, {}, { reload: true });

                    $scope.sendForm.$setPristine();
                    $scope.myreservation = {
                        guests: "1",
                        date: "",
                        time: 5,
                        section: "inside"
                    };
                };

            }])

       .controller('MyReservationController', ['$scope', '$state', 'myReservationFactory', 'AuthFactory',
            function ($scope, $state, myReservationFactory, AuthFactory) {
                
                $scope.showDelete = true;

                $scope.myreservations = myReservationFactory.query();

                $scope.cancelReservation = function (reserveid) {
                    console.log('Remove dish', reserveid);
                    myReservationFactory.delete({ id: reserveid });
                    $state.go('app.reservations', {}, { reload: true });

                };
            }])

    ;
} )();