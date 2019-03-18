angular.module('userServices', [])

    .factory('User', function ($http) {
        userFactory = {};

        //User.create(regData)
        userFactory.create = function (regData) {
            return $http.post('/api/users/', regData);
        };
        userFactory.renewSession = function (username) {
            return $http.get('/api/renewToken/' + username);
        };

        userFactory.getPermission = function () {
            return $http.get('/api/permission/');
        };

        userFactory.getUsers = function () {
            return $http.get('/api/management/');
        };

        userFactory.getUser = function (id) {
            return $http.get('/api/edit/' + id);
        };

        userFactory.deleteUser = function (username) {
            return $http.delete('/api/management/' + username);
        };

        userFactory.editUser = function (id) {
            return $http.put('/api/edit', id);
        };
        return userFactory;
    })

    // Pacient Factory
    .factory('Pacient', function ($http) {
        pacientFactory = {};


        pacientFactory.create = function (regData) {
            return $http.post('/api/pacienti/', regData);
        };

        pacientFactory.getPacienti = function () {
            return $http.get('/api/registru/');
        };

        pacientFactory.getPacientiService = function (username) {
            return $http.get('/api/profilService/' + username);
        };

        pacientFactory.getPacientiCabinet = function (username) {
            return $http.get('/api/profilCabinet/' + username);
        };

        pacientFactory.getPacient = function (id) {
            return $http.get('/api/editPacient/' + id);
        };

        pacientFactory.getServPacient = function (id) {
            return $http.get('/api/profilPacient/' + id);
        };

        pacientFactory.editPacient = function (id) {
            return $http.put('/api/editPacient', id);

        };


        return pacientFactory;
    })

    // Service Factory

    .factory('Service', function ($http) {
        serviceFactory = {};

        serviceFactory.create = function (regData) {
            return $http.post('/api/service/', regData);

        };

        serviceFactory.getService = function (id) {
            return $http.get('/api/service/' + id);

        };

        serviceFactory.editService = function (id) {
            return $http.put('/api/editService', id);
        };

        serviceFactory.deleteService = function (id) {
            return $http.delete('/api/service/' + id);
        };

        return serviceFactory;
    })

    // Recarcasare Factory

    .factory('Recarcasare', function ($http) {
        recarcasareFactory = {};

        recarcasareFactory.create = function (regData) {
            return $http.post('/api/recarcasare/', regData);

        };

        recarcasareFactory.getRecarcasare = function (id) {
            return $http.get('/api/recarcasare/' + id);

        };

        recarcasareFactory.editRecarcasare = function (id) {
            return $http.put('/api/editRecarcasare', id);
        };

        recarcasareFactory.deleteRecarcasare = function (id) {
            return $http.delete('/api/recarcasare/' + id);
        };


        return recarcasareFactory;
    })

    // Oliva Factory

    .factory('Oliva', function ($http) {
        olivaFactory = {};

        olivaFactory.create = function (regData) {
            return $http.post('/api/oliva/', regData);
        };

        olivaFactory.getOliva = function (id) {
            return $http.get('/api/oliva/' + id);

        };

        olivaFactory.editOliva = function (id) {
            return $http.put('/api/editOliva', id);
        };

        olivaFactory.deleteOliva = function (id) {
            return $http.delete('/api/oliva/' + id);
        };

        return olivaFactory;
    })

    // ITE Factory


    .factory('Ite', function ($http) {
        iteFactory = {};

        iteFactory.create = function (regData) {
            return $http.post('/api/ite/', regData);

        };

        iteFactory.getIte = function (id) {
            return $http.get('/api/ite/' + id);

        };

        iteFactory.editIte = function (id) {
            return $http.put('/api/editIte', id);
        };

        iteFactory.deleteIte = function (id) {
            return $http.delete('/api/ite/' + id);
        };


        return iteFactory;
    });
