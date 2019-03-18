angular.module('iteControllers', ['userServices'])

    .controller('regIteCtrl', function ($route, $routeParams, $http, $location, $timeout, Ite, Pacient, $scope) {
        var app = this;
        app.adauga = true;
        app.print = false;

        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.data_estimativa = new moment().add(6, 'days').format('DD/MM/YYYY');

        $scope.$watch('registerIte.regData.pret_final - registerIte.regData.avans', function (value) {
            $scope.registerIte.regData.rest_plata = value;
        });

        this.regIte = function (regData, valid) {
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
                        Ite.create(
                            app.regData,
                            app.regData.ite_inregistrat_pacient = pacient,
                            app.regData.ite_pacient_id = pacient_id,
                            app.regData.telefon = telefon_pacient)
                            .then(function (data) {

                                if (data.data.success) {
                                    $scope.comanda_ite = data.data.comanda_ite.nr_comanda_ite + 1;
                                    if (data.config.data.ureche_protezata == "Bilateral") {

                                        if (data.data.comanda_ite.serie_ite.includes("-")) {
                                            $scope.serie_ite = (parseInt(data.data.comanda_ite.serie_ite) + 2 + "-" + (parseInt(data.data.comanda_ite.serie_ite) + 3));
                                        } else {
                                            $scope.serie_ite = (parseInt(data.data.comanda_ite.serie_ite) + 1 + "-" + (parseInt(data.data.comanda_ite.serie_ite) + 2));
                                        }
                                    } else {
                                        if (data.data.comanda_ite.serie_ite.includes("-")) {
                                            $scope.serie_ite = parseInt(data.data.comanda_ite.serie_ite) + 2;
                                        } else {
                                            $scope.serie_ite = parseInt(data.data.comanda_ite.serie_ite) + 1;

                                        }
                                    }
                                    app.disabled = true;
                                    app.print = true;
                                    app.adauga = false;
                                    app.successMsg = data.data.message

                                    $timeout(function () {
                                        window.print();
                                    }, 300)

                                    $scope.print_ite = function () {
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

    .controller('registruIteCabinetCtrl', function (Pacient, $scope, User) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');

    })

    .controller('registruIteCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.finalizat_ite = new moment().format('DD/MM/YYYY');
    })



    .controller('editIteCtrl', function ($scope, $routeParams, Ite, $timeout, $location) {
        var app = this;
        var eroare = 'Campul trebuie sa contina cel putin 1 carcater.';

        $scope.Back = function () {
            window.history.back();
        };


        Ite.getIte($routeParams.id).then(function (data) {
            if (data.data.success) {


                //              1.Cabinet ----------------------------------------------
                $scope.Data_Inregistrare = data.data.ite.data_inregistrare;
                $scope.Data_Estimativa = data.data.ite.data_estimativa;
                $scope.Nume = data.data.ite.ite_inregistrat_pacient;
                $scope.Cabinet = data.data.ite.cabinet;
                $scope.Telefon = data.data.ite.telefon;
                $scope.Model_Aparat = data.data.ite.model_aparat;
                $scope.Ureche_Protezata = data.data.ite.ureche_protezata;
                $scope.Carcasa_ite = data.data.ite.carcasa_ite;
                $scope.Culoare_Carcasa = data.data.ite.culoare_carcasa;
                $scope.Buton_Programe = data.data.ite.buton_programe;
                $scope.Potentiometru_Volum = data.data.ite.potentiometru_volum;
                $scope.Vent_ite = data.data.ite.vent_ite;
                $scope.Material_ite = data.data.ite.material_ite;
                $scope.Serie_ite = data.data.ite.serie_ite;
                $scope.Tip_ite = data.data.ite.tip_ite;
                $scope.ite_Taxa_Urgenta = data.data.ite.ite_taxa_urgenta;
                $scope.newCompletare_Cabinet = data.data.ite.completare_cabinet;
                $scope.newIesit_Cabinet = data.data.ite.iesit_cabinet;
                $scope.newIntrat_Cabinet = data.data.ite.intrat_cabinet;
                $scope.newPredat_Pacient = data.data.ite.predat_pacient;
                $scope.Observatii_Ite = data.data.ite.observatii_ite;
                currentCabinet = data.data.ite.cabinet;
                app.currentIte = data.data.ite._id;
                $scope.nr_comanda_ite = data.data.ite.nr_comanda_ite;

                //              2.Logistic ----------------------------------------------
                $scope.newLog_Sosit = data.data.ite.log_sosit;
                $scope.newLog_Plecat = data.data.ite.log_plecat;
                $scope.newLog_Preluat = data.data.ite.log_preluat;
                $scope.newLog_Trimis = data.data.ite.log_trimis;



                //              3.Asamblare ----------------------------------------------
                $scope.newObservatii_Asamblare = data.data.ite.observatii_asamblare;
                $scope.newAsamblare_Sosit = data.data.ite.asamblare_sosit;
                $scope.newAsamblare_Plecat = data.data.ite.asamblare_plecat;
                $scope.newFinalizat_Ite = data.data.ite.finalizat_ite;
                $scope.newExecutant_Ite = data.data.ite.executant_ite;

                $scope.addExec = function () {
                    $scope.newExecutant_Ite = $scope.exec;

                    var iteObject = {};
                    iteObject._id = app.currentIte;
                    iteObject.executant_ite = $scope.exec;
                    Ite.editIte(iteObject).then(function (data) {
                        if (data.data.success) {
                            app.successMsgExecutant_Ite = data.data.message;
                            $timeout(function () {
                                app.successMsgExecutant_Ite = false;
                            }, 1500);

                        } else {
                            app.errorMsgExecutant_Ite = data.data.message;
                            $timeout(function () {
                                app.errorMsgExecutant_Ite = false;
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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.iesit_cabinet = $scope.newIesit_Cabinet;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.intrat_cabinet = $scope.newIntrat_Cabinet;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.predat_pacient = $scope.newPredat_Pacient;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.completare_cabinet = $scope.newCompletare_Cabinet;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.log_sosit = $scope.newLog_Sosit;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.log_plecat = $scope.newLog_Plecat;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.log_preluat = $scope.newLog_Preluat;

                Ite.editIte(iteObject).then(function (data) {

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
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.log_trimis = $scope.newLog_Trimis;

                Ite.editIte(iteObject).then(function (data) {

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



        // Asamblare 
        //----------------------------------------------------------------------------------------------

        app.updateAsamblare_Sosit = function (newAsamblare_Sosit, valid) {
            app.errorMsgAsamblare_Sosit = false;
            app.disabled = false;

            if (valid) {
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.asamblare_sosit = $scope.newAsamblare_Sosit;

                Ite.editIte(iteObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgAsamblare_Sosit = data.data.message;
                        $timeout(function () {
                            app.asamblare_sositForm.asamblare_sosit.$setPristine();
                            app.asamblare_sositForm.asamblare_sosit.$setUntouched();
                            app.successMsgAsamblare_Sosit = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgAsamblare_Sosit = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgAsamblare_Sosit = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgAsamblare_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateAsamblare_Plecat = function (newAsamblare_Plecat, valid) {
            app.errorMsgAsamblare_Plecat = false;
            app.disabled = false;

            if (valid) {
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.asamblare_plecat = $scope.newAsamblare_Plecat;

                Ite.editIte(iteObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgAsamblare_Plecat = data.data.message;
                        $timeout(function () {
                            app.asamblare_plecatForm.asamblare_plecat.$setPristine();
                            app.asamblare_plecatForm.asamblare_plecat.$setUntouched();
                            app.successMsgAsamblare_Plecat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgAsamblare_Plecat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgAsamblare_Plecat = false;
                            app.disabled = false;
                        }, 3000);
                    }
                });
            } else {
                app.errorMsgAsamblare_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateFinalizat_Ite = function (newFinalizat_Ite, valid) {
            app.errorMsgFinalizat_Ite = false;
            app.disabled = false;

            if (valid) {
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.finalizat_ite = $scope.newFinalizat_Ite;

                Ite.editIte(iteObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgFinalizat_Ite = data.data.message;
                        $timeout(function () {
                            app.finalizat_iteForm.finalizat_ite.$setPristine();
                            app.finalizat_iteForm.finalizat_ite.$setUntouched();
                            app.successMsgFinalizat_Ite = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgFinalizat_Ite = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgFinalizat_Ite = false;
                            app.disabled = false;
                        }, 3000);
                    }
                });
            } else {
                app.errorMsgFinalizat_Ite = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateObservatii_Asamblare = function (newObservatii_Asamblare, valid) {
            app.errorMsgObservatii_Asamblare = false;
            app.disabled = false;

            if (valid) {
                var iteObject = {};
                iteObject._id = app.currentIte;
                iteObject.observatii_asamblare = $scope.newObservatii_Asamblare;

                Ite.editIte(iteObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgObservatii_Asamblare = data.data.message;

                        $timeout(function () {
                            app.observatii_asamblareForm.observatii_asamblare.$setPristine();
                            app.observatii_asamblareForm.observatii_asamblare.$setUntouched();
                            app.successMsgObservatii_Asamblare = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_Asamblare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_Asamblare = eroare;
                app.disabled = true;
            }

        };

        app.deleteIte = function () {
            app.errorMsgDeleteIte = false;
            var deletedIte = app.currentIte;

            Ite.deleteIte(deletedIte).then(function (data) {
                if (data.data.success) {
                    app.successDeleteIte = data.data.message;
                    app.disabled = true;
                    $timeout(function () {
                        $location.path('/registruIte/');
                        app.successDeleteIte = false;

                    }, 2000);

                } else {
                    app.errorMsgDeleteIte = data.data.message;
                    $timeout(function () {
                        $location.path('/');
                        app.successDeleteIte = false;

                    }, 2000);

                }
            });
        };


    });




