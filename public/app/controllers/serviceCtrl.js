angular.module('serviceControllers', ['userServices'])

    .controller('regServiceCtrl', function ($route, $routeParams, $http, $location, $timeout, Service, Pacient, User, $scope) {
        var app = this;
        app.adauga = true;
        app.print = false;

        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');

        this.regService = function (regData, valid) {
            app.loading = true;
            app.errorMsg = false;
            app.disabled = false;


            if (valid) {
                Pacient.getPacient($routeParams.id).then(function (data) {
                    var pacient = data.data.pacient.nume;
                    var pacient_id = data.data.pacient._id;
                    var telefon_pacient = data.data.pacient.telefon;

                    Service.create(app.regData, app.regData.service_inregistrat_pacient = pacient, app.regData.service_pacient_id = pacient_id, app.regData.telefon = telefon_pacient).then(function (data) {

                        if (data.data.success) {
                            $scope.comanda_service = data.data.comanda_service + 1;
                            app.disabled = true;
                            app.print = true;
                            app.adauga = false;
                            app.successMsg = data.data.message;

                            $timeout(function () {
                                window.print();
                            }, 300)

                            $scope.print_service = function () {
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

    .controller('registruServiceCabinetCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');

    })

    .controller('registruServiceCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.finalizat_service = new moment().format('DD/MM/YYYY');
    })

    .controller('editServiceCtrl', function ($scope, $routeParams, Service, $timeout, $location) {
        var app = this;
        var eroare = 'Campul trebuie sa contina cel putin 1 carcater.';

        $scope.Back = function () {
            window.history.back();
        };

        Service.getService($routeParams.id).then(function (data) {
            if (data.data.success) {

                //              1.Cabinet ----------------------------------------------
                $scope.newData_Inregistrare = data.data.service.data_inregistrare;
                $scope.newData_Estimativa = data.data.service.data_estimativa;
                $scope.newNume = data.data.service.service_inregistrat_pacient;
                $scope.newTelefon = data.data.service.telefon;
                $scope.newDenumire_Aparat = data.data.service.denumire_aparat;
                $scope.newSerie_Aparat = data.data.service.serie_aparat;
                $scope.newNr_Comanda_Service = data.data.service.nr_comanda_service;
                $scope.newDefectiune_Reclamata = data.data.service.defectiune_reclamata;
                $scope.newConstatare_Cabinet = data.data.service.constatare_cabinet;
                $scope.newCompletare_Cabinet = data.data.service.completare_cabinet;
                $scope.newU_Stanga = data.data.service.u_stanga;
                $scope.newU_Dreapta = data.data.service.u_dreapta;
                $scope.newGarantie = data.data.service.garantie;
                $scope.newCutie = data.data.service.cutie;
                $scope.newBaterie = data.data.service.baterie;
                $scope.newMulaj = data.data.service.mulaj;
                $scope.newOliva = data.data.service.oliva;
                $scope.newObservatii_Cabinet = data.data.service.observatii_cabinet;
                $scope.newObservatii_Pacient = data.data.service.observatii_pacient;
                $scope.Nr_Comanda_Service = data.data.service.nr_comanda_service;
                $scope.newIesit_Cabinet = data.data.service.iesit_cabinet;
                $scope.newIntrat_Cabinet = data.data.service.intrat_cabinet;
                $scope.newPredat_Pacient = data.data.service.predat_pacient;
                $scope.newCabinet = data.data.service.cabinet;
                $scope.newTaxa_Urgenta_Cabinet = data.data.service.taxa_urgenta_cabinet;
                currentCabinet = data.data.service.cabinet;
                app.currentService = data.data.service._id;

                //              2.Logistic ----------------------------------------------
                $scope.newLog_Sosit = data.data.service.log_sosit;
                $scope.newLog_Plecat = data.data.service.log_plecat;
                $scope.newLog_Preluat = data.data.service.log_preluat;
                $scope.newLog_Trimis = data.data.service.log_trimis;

                //              3.Service ----------------------------------------------
                $scope.newObservatii_Service = data.data.service.observatii_service;
                $scope.Observatii_service_Intern = data.data.service.observatii_service_intern;
                $scope.newServ_Sosit = data.data.service.serv_sosit;
                $scope.newServ_Plecat = data.data.service.serv_plecat;
                $scope.newFinalizat_Reparatie = data.data.service.finalizat_reparatie;
                $scope.newConstatare_Service = data.data.service.constatare_service;
                $scope.newOperatiuni_Efectuate = data.data.service.operatiuni_efectuate;
                $scope.newPiese_Inlocuite = data.data.service.piese_inlocuite;
                $scope.newCod_Componente = data.data.service.cod_componente;
                $scope.newCost_Reparatie = data.data.service.cost_reparatie;
                $scope.newExecutant_Reparatie = data.data.service.executant_reparatie;

                $scope.newTaxa_Constatare = data.data.service.taxa_constatare;
                $scope.newTaxa_Urgenta = data.data.service.taxa_urgenta;
                $scope.newGarantie_Serv = data.data.service.garantie_serv;

                $scope.addExec = function () {
                    $scope.newExecutant_Reparatie = $scope.exec;

                    var serviceObject = {};
                    serviceObject._id = app.currentService;
                    serviceObject.executant_reparatie = $scope.exec;
                    Service.editService(serviceObject).then(function (data) {
                        if (data.data.success) {

                        } else {
                            app.errorMsgExecutant_Reparatie = data.data.message;
                        }
                        if (serviceObject.executant_reparatie !== "-") {
                            app.errorMsgExecutant_Reparatie = data.data.message;
                        }


                    });

                };


            } else {
                app.errorMsg = data.data.message;
            }
        });


        // Cabinet 
        //----------------------------------------------------------------------------------------------

        app.updateIesit_Cabinet = function (newIesit_Cabinet, valid) {
            app.errorMsgIesit_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.iesit_cabinet = $scope.newIesit_Cabinet;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.intrat_cabinet = $scope.newIntrat_Cabinet;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.predat_pacient = $scope.newPredat_Pacient;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.completare_cabinet = $scope.newCompletare_Cabinet;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.log_sosit = $scope.newLog_Sosit;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.log_plecat = $scope.newLog_Plecat;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.log_preluat = $scope.newLog_Preluat;

                Service.editService(serviceObject).then(function (data) {

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
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.log_trimis = $scope.newLog_Trimis;

                Service.editService(serviceObject).then(function (data) {

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

        // Service 
        //----------------------------------------------------------------------------------------------

        app.updateServ_Sosit = function (newServ_Sosit, valid) {
            app.errorMsgServ_Sosit = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.serv_sosit = $scope.newServ_Sosit;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgServ_Sosit = data.data.message;
                        $timeout(function () {
                            app.serv_sositForm.serv_sosit.$setPristine();
                            app.serv_sositForm.serv_sosit.$setUntouched();
                            app.successMsgServ_Sosit = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgServ_Sosit = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgServ_Sosit = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgServ_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateFinalizat_Reparatie = function (newFinalizat_Reparatie, valid) {
            app.errorMsgFinalizat_Reparatie = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.finalizat_reparatie = $scope.newFinalizat_Reparatie;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgFinalizat_Reparatie = data.data.message;
                        $timeout(function () {
                            app.finalizat_reparatieForm.finalizat_reparatie.$setPristine();
                            app.finalizat_reparatieForm.finalizat_reparatie.$setUntouched();
                            app.successMsgFinalizat_Reparatie = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgFinalizat_Reparatie = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgFinalizat_Reparatie = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgFinalizat_Reparatie = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateServ_Plecat = function (newServ_Plecat, valid) {
            app.errorMsgServ_Plecat = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.serv_plecat = $scope.newServ_Plecat;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgServ_Plecat = data.data.message;
                        $timeout(function () {
                            app.serv_plecatForm.serv_plecat.$setPristine();
                            app.serv_plecatForm.serv_plecat.$setUntouched();
                            app.successMsgServ_Plecat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgServ_Plecat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgServ_Plecat = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgServ_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateConstatare_Service = function (newConstatare_Service, valid) {
            app.errorMsgConstatare_Service = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.constatare_service = $scope.newConstatare_Service;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgConstatare_Service = data.data.message;

                        $timeout(function () {
                            app.constatare_serviceForm.constatare_service.$setPristine();
                            app.constatare_serviceForm.constatare_service.$setUntouched();
                            app.successMsgConstatare_Service = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgConstatare_Service = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgConstatare_Service = eroare;
                app.disabled = true;
            }

        };

        app.updateOperatiuni_Efectuate = function (newOperatiuni_Efectuate, valid) {
            app.errorMsgOperatiuni_Efectuate = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.operatiuni_efectuate = $scope.newOperatiuni_Efectuate;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgOperatiuni_Efectuate = data.data.message;

                        $timeout(function () {
                            app.operatiuni_efectuateForm.operatiuni_efectuate.$setPristine();
                            app.operatiuni_efectuateForm.operatiuni_efectuate.$setUntouched();
                            app.successMsgOperatiuni_Efectuate = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgOperatiuni_Efectuate = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgOperatiuni_Efectuate = eroare;
                app.disabled = true;
            }

        };


        app.updatePiese_Inlocuite = function (newPiese_Inlocuite, valid) {
            app.errorMsgPiese_Inlocuite = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.piese_inlocuite = $scope.newPiese_Inlocuite;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgPiese_Inlocuite = data.data.message;

                        $timeout(function () {
                            app.piese_inlocuiteForm.piese_inlocuite.$setPristine();
                            app.piese_inlocuiteForm.piese_inlocuite.$setUntouched();
                            app.successMsgPiese_Inlocuite = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgPiese_Inlocuite = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgPiese_Inlocuite = eroare;
                app.disabled = true;
            }

        };

        app.updateCod_Componente = function (newCod_Componente, valid) {
            app.errorMsgCod_Componente = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.cod_componente = $scope.newCod_Componente;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgCod_Componente = data.data.message;

                        $timeout(function () {
                            app.cod_componenteForm.cod_componente.$setPristine();
                            app.cod_componenteForm.cod_componente.$setUntouched();
                            app.successMsgCod_Componente = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgCod_Componente = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgCod_Componente = eroare;
                app.disabled = true;
            }

        };

        app.updateCost_Reparatie = function (newCost_Reparatie, valid) {
            app.errorMsgCost_Reparatie = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.cost_reparatie = $scope.newCost_Reparatie;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgCost_Reparatie = data.data.message;

                        $timeout(function () {
                            app.cost_reparatieForm.cost_reparatie.$setPristine();
                            app.cost_reparatieForm.cost_reparatie.$setUntouched();
                            app.successMsgCost_Reparatie = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgCost_Reparatie = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgCost_Reparatie = eroare;
                app.disabled = true;
            }

        };


        app.updateObservatii_Service = function (newObservatii_Service, valid) {
            app.errorMsgObservatii_Service = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.observatii_service = $scope.newObservatii_Service;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Urgenta = data.data.message;

                        $timeout(function () {
                            app.observatii_serviceForm.observatii_service.$setPristine();
                            app.observatii_serviceForm.observatii_service.$setUntouched();
                            app.successMsgTaxa_Urgenta = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_Service = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_Service = eroare;
                app.disabled = true;
            }

        };

        app.updateObservatii_service_Intern = function (Observatii_service_Intern, valid) {
            app.errorMsgObservatii_service_Intern = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.observatii_service_intern = $scope.Observatii_service_Intern;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgObservatii_service_Intern = data.data.message;

                        $timeout(function () {
                            app.observatii_service_internForm.observatii_service_intern.$setPristine();
                            app.observatii_service_internForm.observatii_service_intern.$setUntouched();
                            app.successMsgObservatii_service_Intern = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_service_Intern = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_service_Intern = eroare;
                app.disabled = true;
            }

        };


        app.updateGarantie_Serv = function (newGarantie_Serv, valid) {
            app.errorMsgGarantie_Serv = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.garantie_serv = $scope.newGarantie_Serv;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Urgenta = data.data.message;

                        $timeout(function () {
                            app.garantie_servForm.garantie_serv.$setPristine();
                            app.garantie_servForm.garantie_serv.$setUntouched();
                            app.successMsgTaxa_Urgenta = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgGarantie_Serv = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgGarantie_Serv = eroare;
                app.disabled = true;
            }

        };

        app.updateTaxa_Urgenta = function (newTaxa_Urgenta, valid) {
            app.errorMsgTaxa_Urgenta = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.taxa_urgenta = $scope.newTaxa_Urgenta;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Urgenta = data.data.message;

                        $timeout(function () {
                            app.taxa_urgentaForm.taxa_urgenta.$setPristine();
                            app.taxa_urgentaForm.taxa_urgenta.$setUntouched();
                            app.successMsgTaxa_Urgenta = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgTaxa_Urgenta = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgTaxa_Urgenta = eroare;
                app.disabled = true;
            }

        };

        app.updateTaxa_Constatare = function (newTaxa_Constatare, valid) {
            app.errorMsgTaxa_Constatare = false;
            app.disabled = false;

            if (valid) {
                var serviceObject = {};
                serviceObject._id = app.currentService;
                serviceObject.taxa_constatare = $scope.newTaxa_Constatare;

                Service.editService(serviceObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Constatare = data.data.message;

                        $timeout(function () {
                            app.taxa_constatareForm.taxa_constatare.$setPristine();
                            app.taxa_constatareForm.taxa_constatare.$setUntouched();
                            app.successMsgTaxa_Constatare = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgTaxa_Constatare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgTaxa_Constatare = eroare;
                app.disabled = true;
            }

        };


        app.deleteService = function () {
            app.errorMsgDeleteService = false;
            var deletedService = app.currentService;

            Service.deleteService(deletedService).then(function (data) {
                if (data.data.success) {
                    app.successDeleteService = data.data.message;
                    app.disabled = true;
                    $timeout(function () {
                        $location.path('/registruService/');
                        app.successDeleteService = false;

                    }, 2000);

                } else {
                    app.errorMsgDeleteService = data.data.message;
                    $timeout(function () {
                        $location.path('/');
                        app.successDeleteService = false;

                    }, 2000);

                }
            });
        };


    });




