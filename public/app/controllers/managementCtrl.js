angular.module('managementController', [])

    .controller('managementCtrl', function (User, $scope) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;
        app.limit = 100;
        app.searchLimit = 0;

        //              User Controller ----------------------------------------------
        User.getUsers().then(function (data) {
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                    app.users = data.data.users;
                    app.loading = false,
                        app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.editAccess = true;
                    } else if (data.data.permission === 'moderator') {
                        app.editAccess = true;
                    }

                } else {
                    app.errorMsg = 'Insufficient Permissions';
                    app.loading = false;

                }
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });

        app.showMore = function (number) {
            app.showMoreError = false;

            if (number > 0) {
                app.limit = number;
            } else {
                app.showMoreError = 'Please enter a valid number';
            }

        };

        app.showAll = function () {
            app.limit = undefined;
            app.showMoreError = false;
        };

        app.deleteUser = function (username) {
            User.deleteUser(username).then(function (data) {
                if (data.data.success) {
                    getUsers();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        };

    })


    //              User Edit Controller ----------------------------------------------
    .controller('editCtrl', function ($scope, $routeParams, User, $timeout) {
        var app = this;
        $scope.nameTab = 'active';
        app.phase1 = true;

        User.getUser($routeParams.id).then(function (data) {
            if (data.data.success) {

                $scope.newName = data.data.user.name;
                $scope.newUsername = data.data.user.username;
                $scope.newPermission = data.data.user.permission;
                app.currentUser = data.data.user._id;
            } else {
                app.errorMsg = data.data.message;
            }
        });

        app.namePhase = function () {
            $scope.nameTab = 'active';
            $scope.usernameTab = 'default';
            $scope.permissionsTab = 'default';
            app.phase1 = true;
            app.phase2 = false;
            app.phase4 = false;
            app.errorMsg = false;


        };


        app.usernamePhase = function () {

            $scope.nameTab = 'default';
            $scope.usernameTab = 'active';
            $scope.permissionsTab = 'default';
            app.phase1 = false;
            app.phase2 = true;
            app.phase4 = false;
            app.errorMsg = false;
        };


        app.permissionsPhase = function () {

            $scope.nameTab = 'default';
            $scope.usernameTab = 'default';
            $scope.permissionsTab = 'active';
            app.phase1 = false;
            app.phase2 = false;
            app.phase4 = true;
            app.disableUser = false;
            app.disableModerator = false;
            app.disableAdmin = false;
            app.errorMsg = false;

            if ($scope.newPermission === 'user') {
                app.disableUser = true;
            } else if ($scope.newPermission === 'moderator') {
                app.disableModerator = true;
            } else if ($scope.newPermission === 'admin') {
                app.disableAdmin = true;
            }

        };

        app.updateName = function (newName, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var userObject = {};
                userObject._id = app.currentUser;
                userObject.name = $scope.newName;
                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.nameForm.name.$setPristine();
                            app.nameForm.name.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Formularul nu a fost completat corect';
                app.disabled = false;
            }
        };


        app.updateUsername = function (newUsername, valid) {
            app.errorMsg = false;
            app.disabled = true;

            if (valid) {
                var userObject = {};
                userObject._id = app.currentUser;
                userObject.username = $scope.newUsername;
                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.usernameForm.username.$setPristine();
                            app.usernameForm.username.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = 'Formularul nu a fost completat corect';
                app.disabled = false;
            }
        };

        app.updatePermissions = function (newPermission) {
            app.errorMsg = false;
            app.disableUser = true;
            app.disableService = true;
            app.disableAsamblare = true;
            app.disablePlastie = true;
            app.disableColete = true;
            app.disableAdmin = true;
            var userObject = {};
            userObject._id = app.currentUser;
            userObject.permission = newPermission;

            User.editUser(userObject).then(function (data) {

                if (data.data.success) {
                    app.successMsg = data.data.message;

                    $timeout(function () {
                        app.successMsg = false;
                        $scope.newPermission = newPermission;

                        if (newPermission === 'user') {
                            app.disableUser = true;
                            app.disableService = false;
                            app.disableAsamblare = false;
                            app.disablePlastie = false;
                            app.disableColete = false;
                            app.disableAdmin = false;
                        } else if (newPermission === 'service') {
                            app.disableUser = false;
                            app.disableService = true;
                            app.disableAsamblare = false;
                            app.disablePlastie = false;
                            app.disableColete = false;
                            app.disableAdmin = false;
                        } else if (newPermission === 'asamblare') {
                            app.disableUser = false;
                            app.disableService = false;
                            app.disableAsamblare = true;
                            app.disablePlastie = false;
                            app.disableColete = false;
                            app.disableAdmin = false;
                        } else if (newPermission === 'plastie') {
                            app.disableUser = false;
                            app.disableService = false;
                            app.disableAsamblare = false;
                            app.disablePlastie = true;
                            app.disableColete = false;
                            app.disableAdmin = false;
                        } else if (newPermission === 'colete') {
                            app.disableUser = false;
                            app.disableService = false;
                            app.disableAsamblare = false;
                            app.disablePlastie = false;
                            app.disableColete = true;
                            app.disableAdmin = false;

                        } else if (newPermission === 'admin') {
                            app.disableUser = false;
                            app.disableService = false;
                            app.disableAsamblare = false;
                            app.disablePlastie = false;
                            app.disableColete = false;
                            app.disableAdmin = true;
                        }
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        };
    })

    .controller('profilServiceCtrl', function (Pacient, $scope, User) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;


    })


    .controller('profilCabinetCtrl', function (Pacient, $scope, User) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');

    })


    .controller('registruCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.finalizat_service = new moment().format('DD/MM/YYYY');

    })



    .controller('registruLogisticServiceCtrl', function () {
        var app = this;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
    })

    .controller('registruLogisticRecarcasariCtrl', function () {
        var app = this;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
    })

    .controller('registruLogisticOliveCtrl', function () {
        var app = this;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
    })

    .controller('registruLogisticIteCtrl', function () {
        var app = this;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
    })

    .controller('editProfilPacientCtrl', function ($route, $scope, $routeParams, Pacient, $timeout) {
        var app = this;

        app.servicePhase = function () {
            service_loader();
            $scope.serviceTab = 'active';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = true;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;

        };

        app.recarcasariPhase = function () {
            recarcasari_loader();
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'active';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = true;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;
        };

        app.olivePhase = function () {
            olive_loader();
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'active';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = true;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;
        };

        app.itePhase = function () {
            ite_loader();
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'active';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = true;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;
        };

        app.detaliiPhase = function () {
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'active';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = true;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;
        };

        app.add_servicePhase = function () {
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'active';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = true;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;
        };
        app.add_recarcasarePhase = function () {
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'active';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = true;
            app.phase8 = false;
            app.phase9 = false;
            app.errorMsg = false;
        };
        app.add_olivaPhase = function () {
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'active';
            $scope.add_iteTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = true;
            app.phase9 = false;
            app.errorMsg = false;
        };
        app.add_itePhase = function () {
            $scope.serviceTab = 'default';
            $scope.recarcasariTab = 'default';
            $scope.oliveTab = 'default';
            $scope.iteTab = 'default';
            $scope.detaliiTab = 'default';
            $scope.add_serviceTab = 'default';
            $scope.add_recarcasareTab = 'default';
            $scope.add_olivaTab = 'default';
            $scope.add_iteTab = 'active';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.phase9 = true;
            app.errorMsg = false;
        };

        Pacient.getPacient($routeParams.id).then(function (data) {
            if (data.data.success) {
                $scope.Pacient_Cabinet = data.data.pacient.cabinet;
                $scope.Pacient_Nume = data.data.pacient.nume;
                $scope.Pacient_Data_Inregistrare = data.data.pacient.data_inregistrare;
                $scope.Pacient_Telefon = data.data.pacient.telefon;
                $scope.Pacient_Adresa = data.data.pacient.adresa;
                $scope.Pacient_Varsta = data.data.pacient.varsta;
                $scope.Pacient_Sex = data.data.pacient.sex;
                $scope.Pacient_Cnp = data.data.pacient.cnp;
                app.currentPacient = data.data.pacient._id;


            } else {
                app.errorMsg = data.data.message;
            }

        });

        app.updatePacient_Telefon = function (Pacient_Telefon, valid) {
            app.errorMsgTelefon = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.telefon = $scope.Pacient_Telefon;

                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsgTelefon = data.data.message;
                        $timeout(function () {
                            app.telefonForm.telefon.$setPristine();
                            app.telefonForm.telefon.$setUntouched();
                            app.successMsgTelefon = false;
                            app.disabled = false;
                        }, 2000);

                    } else {
                        app.errorMsgTelefon = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgTelefon = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updatePacient_Varsta = function (Pacient_Varsta, valid) {
            app.errorMsgVarsta = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.varsta = $scope.Pacient_Varsta;

                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsgVarsta = data.data.message;
                        $timeout(function () {

                            app.varstaForm.varsta.$setPristine();
                            app.varstaForm.varsta.$setUntouched();
                            app.successMsgVarsta = false;
                            app.disabled = false;
                        }, 2000);


                    } else {
                        app.errorMsgVarsta = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgVarsta = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updatePacient_Adresa = function (Pacient_Adresa, valid) {
            app.errorMsgAdresa = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.adresa = $scope.Pacient_Adresa;

                Pacient.editPacient(pacientObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsgAdresa = data.data.message;
                        $timeout(function () {

                            app.adresaForm.adresa.$setPristine();
                            app.adresaForm.adresa.$setUntouched();
                            app.successMsgAdresa = false;
                            app.disabled = false;
                        }, 2000);


                    } else {
                        app.errorMsgAdresa = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgAdresa = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateCompletare_Cabinet = function (newCompletare_Cabinet, valid) {
            app.errorMsgCompletare_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.completare_cabinet = $scope.newCompletare_Cabinet;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgCompletare_Cabinet = data.data.message;

                            $timeout(function () {
                                app.completare_cabinetForm.completare_cabinet.$setPristine();
                                app.completare_cabinetForm.completare_cabinet.$setUntouched();
                                app.successMsgCompletare_Cabinet = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgCompletare_Cabinet = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgCompletare_Cabinet = eroare;
                    app.disabled = true;
                }
            } else {
                app.errorMsgCompletare_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };

        app.updateTaxa_Urgenta_Cabinet = function (newTaxa_Urgenta_Cabinet, valid) {
            app.errorMsgTaxa_Urgenta_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var pacientObject = {};
                pacientObject._id = app.currentPacient;
                pacientObject.taxa_urgenta_cabinet = $scope.newTaxa_Urgenta_Cabinet;

                if (currentCabinet === currentUser) {
                    Pacient.editPacient(pacientObject).then(function (data) {

                        if (data.data.success) {
                            app.successMsgTaxa_Urgenta_Cabinet = data.data.message;
                            $timeout(function () {
                                app.taxa_urgenta_cabinetForm.taxa_urgenta_cabinet.$setPristine();
                                app.taxa_urgenta_cabinetForm.taxa_urgenta_cabinet.$setUntouched();
                                app.successMsgTaxa_Urgenta_Cabinet = false;
                                app.disabled = false;
                            }, 700);

                        } else {
                            app.errorMsgTaxa_Urgenta_Cabinet = data.data.message;
                            app.disabled = false;
                        }
                    });
                } else {
                    app.errorMsgTaxa_Urgenta_Cabinet = eroare;
                    app.disabled = true;
                }
            } else {
                app.errorMsgTaxa_Urgenta_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;
            }
        };


    })
