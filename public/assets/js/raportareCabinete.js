
$(document).ready(function () {
    table = $('#tabel').DataTable({
        dom: "Bfrtip",
        pageLength: 100,
        ajax: function (data, callback, settings) {

            $.ajax({
                url: 'api/raportareCabinete',
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
                title: "Raport Cabinete",
                init: function (dt, node, config) {
                    $("#filtru_luna").on('change', function () {
                        config.title = "Raport Cabinete Luna:" + ' ' + this.value;
                    })
                }
            }
        ],

        columns: [
            {
                data: "cabinet",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterServ",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterServBilateral",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterRec",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterRecBilateral",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterIte",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterIteBilateral",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterOliv",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterOlivaBilateral",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterElastica",
                "defaultContent": "<i>0</i>"
            },
            {
                data: "counterDura",
                "defaultContent": "<i>0</i>"
            },
        ],
    });


    $('#filtru_luna').on('change', function () {

        $.ajax({

            url: "api/raportareCabinete",
            data: {
                dataFiltru: $("#filtru_luna").val(),
            },
            success: function () {
                table.ajax.reload();
            },
        });

    });

});
