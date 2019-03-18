var app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })

            .when('/registerUtilizator', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                permission: ['admin']

            })

            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })

            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })

            .when('/profil/:username', {
                templateUrl: 'app/views/pages/management/profil.html',
                controller: 'profilCabinetCtrl',
                controllerAs: 'profilCab',
                authenticated: true,
            })

            .when('/registruServiceCabinet/:username', {
                templateUrl: 'app/views/pages/management/registru_service_cabinet.html',
                controller: 'registruServiceCabinetCtrl',
                controllerAs: 'registruServCab',
                authenticated: true,
                permission: ['admin', 'user']
            })

            .when('/registruRecarcasariCabinet/:username', {
                templateUrl: 'app/views/pages/management/registru_recarcasari_cabinet.html',
                controller: 'registruRecarcasariCabinetCtrl',
                controllerAs: 'registruRecarcsariCab',
                authenticated: true,
                permission: ['admin', 'user']
            })

            .when('/registruOliveCabinet/:username', {
                templateUrl: 'app/views/pages/management/registru_olive_cabinet.html',
                controller: 'registruOliveCabinetCtrl',
                controllerAs: 'registruOliveCab',
                authenticated: true,
                permission: ['admin', 'user']
            })

            .when('/registruIteCabinet/:username', {
                templateUrl: 'app/views/pages/management/registru_ite_cabinet.html',
                controller: 'registruIteCabinetCtrl',
                controllerAs: 'registruIteCab',
                authenticated: true,
                permission: ['admin', 'user']
            })

            .when('/management', {
                templateUrl: 'app/views/pages/management/management.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
                authenticated: true,
                permission: ['admin']
            })

            .when('/edit/:id', {
                templateUrl: 'app/views/pages/management/edit.html',
                controller: 'editCtrl',
                controllerAs: 'edit',
                authenticated: true,
                permission: ['admin', 'service']
            })

            .when('/registru', {
                templateUrl: 'app/views/pages/management/registru.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'service']
            })
            .when('/raportareCabinete', {
                templateUrl: 'app/views/pages/management/raportareCabinete.html',
                authenticated: true,
                permission: ['admin']
            })
            .when('/raportareTehnic', {
                templateUrl: 'app/views/pages/management/raportareTehnic.html',
                authenticated: true,
                permission: ['admin']
            })
            .when('/registruService', {
                templateUrl: 'app/views/pages/management/registruService.html',
                controller: 'registruServiceCtrl',
                controllerAs: 'registruServ',
                authenticated: true,
                permission: ['admin', 'service']
            })
            .when('/registruRecarcasari', {
                templateUrl: 'app/views/pages/management/registruRecarcasari.html',
                controller: 'registruRecarcasariCtrl',
                controllerAs: 'registruServ',
                authenticated: true,
                permission: ['admin', 'asamblare']
            })

            .when('/registruOlive', {
                templateUrl: 'app/views/pages/management/registruOlive.html',
                controller: 'registruOliveCtrl',
                controllerAs: 'registruOlive',
                authenticated: true,
                permission: ['admin', 'plastie']
            })

            .when('/registruIte', {
                templateUrl: 'app/views/pages/management/registruIte.html',
                controller: 'registruIteCtrl',
                controllerAs: 'registruIte',
                authenticated: true,
                permission: ['admin', 'asamblare']
            })

            .when('/registruLogistic_service', {
                templateUrl: 'app/views/pages/management/registruLogistic_service.html',
                controller: 'registruLogisticServiceCtrl',
                controllerAs: 'registruLogServ',
                authenticated: true,
                permission: ['admin', 'colete']
            })
            .when('/registruLogistic_recarcasari', {
                templateUrl: 'app/views/pages/management/registruLogistic_recarcasari.html',
                controller: 'registruLogisticRecarcasariCtrl',
                controllerAs: 'registruLogRecarcasari',
                authenticated: true,
                permission: ['admin', 'colete']
            })

            .when('/registruLogistic_olive', {
                templateUrl: 'app/views/pages/management/registruLogistic_olive.html',
                controller: 'registruLogisticOliveCtrl',
                controllerAs: 'registruLogOlive',
                authenticated: true,
                permission: ['admin', 'colete']
            })

            .when('/registruLogistic_ite', {
                templateUrl: 'app/views/pages/management/registruLogistic_ite.html',
                controller: 'registruLogisticIteCtrl',
                controllerAs: 'registruLogIte',
                authenticated: true,
                permission: ['admin', 'colete']
            })

            .when('/piese', {
                templateUrl: 'app/views/pages/management/piese.html',
                controller: 'registruCtrl',
                controllerAs: 'registru',
                authenticated: true,
                permission: ['admin', 'service']
            })

            .when('/service/:id', {
                templateUrl: 'app/views/pages/management/service.html',
                controller: 'editServiceCtrl',
                controllerAs: 'editService',
                authenticated: true,
            })

            .when('/recarcasare/:id', {
                templateUrl: 'app/views/pages/management/recarcasare.html',
                controller: 'editRecarcasareCtrl',
                controllerAs: 'editRecarcasare',
                authenticated: true,
            })

            .when('/oliva/:id', {
                templateUrl: 'app/views/pages/management/oliva.html',
                controller: 'editOlivaCtrl',
                controllerAs: 'editOliva',
                authenticated: true,
            })

            .when('/ite/:id', {
                templateUrl: 'app/views/pages/management/ite.html',
                controller: 'editIteCtrl',
                controllerAs: 'editIte',
                authenticated: true,
            })

            .when('/profilPacient/:id', {
                templateUrl: 'app/views/pages/management/profilPacient.html',
                authenticated: true,
            })

            .when('/registerPac', {
                templateUrl: 'app/views/pages/users/registerPacient.html',
                controller: 'regPacientCtrl',
                controllerAs: 'registerPac',
                authenticated: true,
                permission: ['user']
            })

            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });



app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {

    $rootScope.$on('$routeChangeStart', function (event, next) {

        if (next.$$route !== undefined) {
            if (next.$$route.authenticated === true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                } else if (next.$$route.permission) {

                    User.getPermission().then(function (data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                event.preventDefault();
                                $location.path('/');
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                if (Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/home');
                }
            }
        }
    });
}]);


