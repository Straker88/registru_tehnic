$(document).ready(function () {

    table = $('#tabel').DataTable({
        dom: "Bfrtip",
        pageLength: 100,
        ajax: function (data, callback, settings) {

            $.ajax({
                url: 'api/raportareTehnic',
                type: 'get',
                "dataSrc": "",
                contentType: 'application/x-www-form-urlencoded',
                data: {
                    dataFiltru: $("#filtru_luna").val(),
                },
                success: function (data, textStatus, jQxhr) {
                    callback({
                        data: data,
                    });
                },
                error: function (jqXhr, textStatus, errorThrown) {
                }
            });
        },
        'processing': true,
        'language': {
            "sSearch": "Cautare",
            "sLengthMenu": "Afiseaza _MENU_ inregistrari",
            'loadingRecords': '&nbsp;',
            'processing': '<span style="width:100%;"><img src="/assets/img/clarfon_loader.gif"></span>'
        },
        serverSide: false,
        "ordering": false,
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Exporta in Excel',
                title: "Raport Tehnic",
                init: function (dt, node, config) {
                    $("#filtru_luna").on('change', function () {
                        config.title = "Raport Tehnic Luna:" + ' ' + this.value;
                    })
                }
            }
        ],
        columns: [
            {
                data: "executant",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counter_oliva",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counter_service",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counter_recarcasare",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counter_ite",
                "defaultContent": "<i>0</i>"
            },
        ],
    });


    $('#filtru_luna').on('change', function () {
        $.ajax({

            url: "api/raportareTehnic",
            data: {
                dataFiltru: $("#filtru_luna").val(),
            },

            success: function () {
                table.ajax.reload();

            }
        });
    });
});

