angular.module('olivaControllers', ['userServices'])

    .controller('regOlivaCtrl', function ($route, $routeParams, $http, $location, $timeout, Oliva, Pacient, $scope) {
        var app = this;
        app.adauga = true;
        app.print = false;

        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.data_estimativa = new moment().add(6, 'days').format('DD/MM/YYYY');

        $scope.$watch('registerOliva.regData.pret_final - registerOliva.regData.avans', function (value) {
            $scope.registerOliva.regData.rest_plata = value;
        });

        this.regOliva = function (regData, valid) {
            app.loading = true;
            app.errorMsg = false;
            app.disabled = false;

            if (valid) {
                Pacient.getPacient($routeParams.id)
                    .then(function (data) {
                        $scope.Pacient_Adresa = data.data.pacient.adresa;
                        $scope.Pacient_Telefon = data.data.pacient.telefon;
                        $scope.Pacient_Varsta = data.data.pacient.varsta;
                        var pacient = data.data.pacient.nume;
                        var pacient_id = data.data.pacient._id;
                        var telefon_pacient = data.data.pacient.telefon;

                        Oliva.create(
                            app.regData,
                            app.regData.oliva_inregistrat_pacient = pacient,
                            app.regData.oliva_pacient_id = pacient_id,
                            app.regData.telefon = telefon_pacient)
                            .then(function (data) {

                                if (data.data.success) {
                                    $scope.comanda_oliva = data.data.comanda_oliva.nr_comanda_oliva + 1;
                                    if (data.config.data.ureche_protezata == "Bilateral") {

                                        if (data.data.comanda_oliva.serie_oliva.includes("-")) {
                                            $scope.serie_oliva = (parseInt(data.data.comanda_oliva.serie_oliva) + 2 + "-" + (parseInt(data.data.comanda_oliva.serie_oliva) + 3));
                                        } else {
                                            $scope.serie_oliva = (parseInt(data.data.comanda_oliva.serie_oliva) + 1 + "-" + (parseInt(data.data.comanda_oliva.serie_oliva) + 2));
                                        }
                                    } else {
                                        if (data.data.comanda_oliva.serie_oliva.includes("-")) {
                                            $scope.serie_oliva = parseInt(data.data.comanda_oliva.serie_oliva) + 2;
                                        } else {
                                            $scope.serie_oliva = parseInt(data.data.comanda_oliva.serie_oliva) + 1;

                                        }
                                    }

                                    app.disabled = true;
                                    app.successMsg = data.data.message
                                    app.adauga = false;
                                    app.print = true;

                                    $timeout(function () {
                                        window.print();
                                    }, 300)

                                    $scope.print_oliva = function () {
                                        window.print();
                                    }


                                } else {
                                    app.loading = false;
                                    app.errorMsg = data.data.message;
                                    $timeout(function () {
                                        app.errorMsg = false;
                                    }, 3000)
                                }
                            });

                    })
            } else {
                app.loading = false;
                app.errorMsg = 'Completeaza corect Formularul';

            }

        };

    })

    .controller('registruOliveCabinetCtrl', function (Pacient, $scope, User) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');

    })

    .controller('registruOliveCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
    })



    .controller('editOlivaCtrl', function ($scope, $routeParams, Oliva, $timeout, $location) {
        var app = this;
        var eroare = 'Campul trebuie sa contina cel putin 1 carcater.';

        $scope.Back = function () {
            window.history.back();
        };


        Oliva.getOliva($routeParams.id).then(function (data) {
            if (data.data.success) {


                //              1.Cabinet ----------------------------------------------
                $scope.Data_Inregistrare = data.data.oliva.data_inregistrare;
                $scope.Data_Estimativa = data.data.oliva.data_estimativa;
                $scope.Nume = data.data.oliva.oliva_inregistrat_pacient;
                $scope.Cabinet = data.data.oliva.cabinet;
                $scope.Telefon = data.data.oliva.telefon;
                $scope.Model_Aparat = data.data.oliva.model_aparat;
                $scope.Ureche_Protezata = data.data.oliva.ureche_protezata;
                $scope.Vent_Oliva = data.data.oliva.vent_oliva;
                $scope.Material_Oliva = data.data.oliva.material_oliva;
                $scope.Tip_Oliva = data.data.oliva.tip_oliva;
                $scope.Serie_Oliva = data.data.oliva.serie_oliva;
                $scope.newCompletare_Cabinet = data.data.oliva.completare_cabinet;
                $scope.nr_comanda_oliva = data.data.oliva.nr_comanda_oliva;


                $scope.newIesit_Cabinet = data.data.oliva.iesit_cabinet;
                $scope.newIntrat_Cabinet = data.data.oliva.intrat_cabinet;
                $scope.newPredat_Pacient = data.data.oliva.predat_pacient;

                $scope.Observatii_Oliva = data.data.oliva.observatii_oliva;
                $scope.Oliva_Taxa_Urgenta = data.data.oliva.oliva_taxa_urgenta;

                currentCabinet = data.data.oliva.cabinet;
                app.currentOliva = data.data.oliva._id;

                //              2.Logistic ----------------------------------------------
                $scope.newLog_Sosit = data.data.oliva.log_sosit;
                $scope.newLog_Plecat = data.data.oliva.log_plecat;
                $scope.newLog_Preluat = data.data.oliva.log_preluat;
                $scope.newLog_Trimis = data.data.oliva.log_trimis;



                //              3.Plastie ----------------------------------------------
                $scope.newObservatii_Plastie = data.data.oliva.observatii_plastie;
                $scope.newPlastie_Sosit = data.data.oliva.plastie_sosit;
                $scope.newPlastie_Plecat = data.data.oliva.plastie_plecat;
                $scope.newFinalizat_Oliva = data.data.oliva.finalizat_oliva;
                $scope.newExecutant_Oliva = data.data.oliva.executant_oliva;

                $scope.addExec = function () {
                    $scope.newExecutant_Oliva = $scope.exec;

                    var olivaObject = {};
                    olivaObject._id = app.currentOliva;
                    olivaObject.executant_oliva = $scope.exec;
                    Oliva.editOliva(olivaObject).then(function (data) {
                        if (data.data.success) {
                            app.successMsgExecutant_Oliva = data.data.message;
                            $timeout(function () {
                                app.successMsgExecutant_Oliva = false;
                            }, 1500);

                        } else {
                            app.errorMsgExecutant_Oliva = data.data.message;
                            $timeout(function () {
                                app.errorMsgExecutant_Oliva = false;
                            }, 2000);

                        }
                    });

                };



            } else {
                app.errorMsg = data.data.message;
            }
        });


        //              1.Cabinet ----------------------------------------------


        app.updateIesit_Cabinet = function (newIesit_Cabinet, valid) {
            app.errorMsgIesit_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.iesit_cabinet = $scope.newIesit_Cabinet;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgIesit_Cabinet = data.data.message;
                        $timeout(function () {
                            app.iesit_cabinetForm.iesit_cabinet.$setPristine();
                            app.iesit_cabinetForm.iesit_cabinet.$setUntouched();
                            app.successMsgIesit_Cabinet = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgIesit_Cabinet = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgIesit_Cabinet = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateIntrat_Cabinet = function (newIntrat_Cabinet, valid) {
            app.errorMsgIntrat_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.intrat_cabinet = $scope.newIntrat_Cabinet;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgIntrat_Cabinet = data.data.message;
                        $timeout(function () {
                            app.intrat_cabinetForm.intrat_cabinet.$setPristine();
                            app.intrat_cabinetForm.intrat_cabinet.$setUntouched();
                            app.successMsgIntrat_Cabinet = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgIntrat_Cabinet = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgIntrat_Cabinet = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updatePredat_Pacient = function (newPredat_Pacient, valid) {
            app.errorMsgPredat_Pacient = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.predat_pacient = $scope.newPredat_Pacient;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgPredat_Pacient = data.data.message;
                        $timeout(function () {
                            app.predat_pacientForm.predat_pacient.$setPristine();
                            app.predat_pacientForm.predat_pacient.$setUntouched();
                            app.successMsgPredat_Pacient = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgPredat_Pacient = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgPredat_Pacient = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateCompletare_Cabinet = function (newCompletare_Cabinet, valid) {
            app.errorMsgCompletare_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.completare_cabinet = $scope.newCompletare_Cabinet;

                Oliva.editOliva(olivaObject).then(function (data) {

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

        };


        // Logistic 
        //----------------------------------------------------------------------------------------------

        app.updateLog_Sosit = function (newLog_Sosit, valid) {
            app.errorMsgLog_Sosit = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.log_sosit = $scope.newLog_Sosit;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Sosit = data.data.message;
                        $timeout(function () {
                            app.log_sositForm.log_sosit.$setPristine();
                            app.log_sositForm.log_sosit.$setUntouched();
                            app.successMsgLog_Sosit = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Sosit = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Sosit = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateLog_Plecat = function (newLog_Plecat, valid) {
            app.errorMsgLog_Plecat = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.log_plecat = $scope.newLog_Plecat;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Plecat = data.data.message;
                        $timeout(function () {
                            app.log_plecatForm.log_plecat.$setPristine();
                            app.log_plecatForm.log_plecat.$setUntouched();
                            app.successMsgLog_Plecat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Plecat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Plecat = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };


        app.updateLog_Preluat = function (newLog_Preluat, valid) {
            app.errorMsgLog_Preluat = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.log_preluat = $scope.newLog_Preluat;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Preluat = data.data.message;
                        $timeout(function () {
                            app.log_preluatForm.log_preluat.$setPristine();
                            app.log_preluatForm.log_preluat.$setUntouched();
                            app.successMsgLog_Preluat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Preluat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Preluat = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Preluat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateLog_Trimis = function (newLog_Trimis, valid) {
            app.errorMsgLog_Trimis = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.log_trimis = $scope.newLog_Trimis;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Trimis = data.data.message;
                        $timeout(function () {
                            app.log_trimisForm.log_trimis.$setPristine();
                            app.log_trimisForm.log_trimis.$setUntouched();
                            app.successMsgLog_Trimis = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Trimis = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Trimis = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Trimis = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        // Plastie 
        //----------------------------------------------------------------------------------------------

        app.updatePlastie_Sosit = function (newPlastie_Sosit, valid) {
            app.errorMsgPlastie_Sosit = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.plastie_sosit = $scope.newPlastie_Sosit;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgPlastie_Sosit = data.data.message;
                        $timeout(function () {
                            app.plastie_sositForm.plastie_sosit.$setPristine();
                            app.plastie_sositForm.plastie_sosit.$setUntouched();
                            app.successMsgPlastie_Sosit = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgPlastie_Sosit = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgPlastie_Sosit = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgPlastie_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updatePlastie_Plecat = function (newPlastie_Plecat, valid) {
            app.errorMsgPlastie_Plecat = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.plastie_plecat = $scope.newPlastie_Plecat;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgPlastie_Plecat = data.data.message;
                        $timeout(function () {
                            app.plastie_plecatForm.plastie_plecat.$setPristine();
                            app.plastie_plecatForm.plastie_plecat.$setUntouched();
                            app.successMsgPlastie_Plecat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgPlastie_Plecat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgPlastie_Plecat = false;
                            app.disabled = false;
                        }, 3000);
                    }
                });
            } else {
                app.errorMsgPlastie_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateFinalizat_Oliva = function (newFinalizat_Oliva, valid) {
            app.errorMsgFinalizat_Oliva = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.finalizat_oliva = $scope.newFinalizat_Oliva;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgFinalizat_Oliva = data.data.message;
                        $timeout(function () {
                            app.finalizat_olivaForm.finalizat_oliva.$setPristine();
                            app.finalizat_olivaForm.finalizat_oliva.$setUntouched();
                            app.successMsgFinalizat_Oliva = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgFinalizat_Oliva = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgFinalizat_Oliva = false;
                            app.disabled = false;
                        }, 3000);
                    }
                });
            } else {
                app.errorMsgFinalizat_Oliva = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateObservatii_Plastie = function (newObservatii_Plastie, valid) {
            app.errorMsgObservatii_Plastie = false;
            app.disabled = false;

            if (valid) {
                var olivaObject = {};
                olivaObject._id = app.currentOliva;
                olivaObject.observatii_plastie = $scope.newObservatii_Plastie;

                Oliva.editOliva(olivaObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgObservatii_Plastie = data.data.message;

                        $timeout(function () {
                            app.observatii_plastieForm.observatii_plastie.$setPristine();
                            app.observatii_plastieForm.observatii_plastie.$setUntouched();
                            app.successMsgObservatii_Plastie = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_Plastie = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_Plastie = eroare;
                app.disabled = true;
            }

        };

        app.deleteOliva = function () {
            app.errorMsgDeleteOliva = false;
            var deletedOliva = app.currentOliva;

            Oliva.deleteOliva(deletedOliva).then(function (data) {
                if (data.data.success) {
                    app.successDeleteOliva = data.data.message;
                    app.disabled = true;
                    $timeout(function () {
                        $location.path('/registruOlive/');
                        app.successDeleteOliva = false;

                    }, 2000);

                } else {
                    app.errorMsgDeleteOliva = data.data.message;
                    $timeout(function () {
                        $location.path('/');
                        app.successDeleteOliva = false;

                    }, 2000);

                }
            });
        };

    });




