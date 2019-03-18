angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User, $window) {

        var app = this;

        this.regUser = function (regData, valid) {
            app.loading = true;
            app.errorMsg = false;

            if (valid) {
                User.create(app.regData).then(function (data) {
                    if (data.data.success) {
                        app.loading = false;
                        app.successMsg = data.data.message + '...Se redirectioneaza';
                        $timeout(function () {
                            $location.path('/management');
                        }, 2000);
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }

                });
            } else {
                app.loading = false;
                app.errorMsg = 'Verifica daca toate campurile sunt completate corect';

            }

        };
    });


