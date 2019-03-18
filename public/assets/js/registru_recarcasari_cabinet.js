var url = window.location.pathname;
var user = url.substr(url.lastIndexOf('/') + 1);

$(document).ready(function () {
    var oTable = $('#tabel').dataTable({
        "serverSide": false,
        "ajax": {
            "url": "api/registruRecarcasariCabinet/" + user,
            "dataType": "json",
            "contentType": "application/json; charset=utf-8",
            "type": "GET",
            "dataSrc": "recarcasare",
        },
        "stateSave": false,
        "deferRender": true,
        "pageLength": 25,
        "searching": true,
        "autoWidth": false,
        'processing': true,
        columns: [
            { data: "nr_comanda_recarcasare" },
            { data: "data_inregistrare" },
            { data: "recarcasare_inregistrat_pacient" },
            { data: "denumire_aparat" },
            { data: "defectiune_reclamata" },
            { data: "iesit_cabinet" },
            { data: "asamblare_sosit" },
            { data: "asamblare_plecat" },
            { data: "predat_pacient" },
            { data: "" },
            { data: "_id" }
        ],
        columnDefs: [
            {
                "targets": 1,
                "orderable": true,
                type: 'date-eu', targets: ([1]),
            },
            {
                "targets": [10],
                "visible": false,
            },
            {
                "aTargets": [9],
                "width": "60px",
                "mRender": function (data, type, row) {
                    return '<a class="btn btn-primary btn-sm" href=/recarcasare/' + row._id + '>' + 'Detalii' + '</a>';
                }
            }],
        "order": [[0, 'desc']],
        'language': {
            "sSearch": "Cautare generala",
            "sLengthMenu": "Afiseaza _MENU_ inregistrari",
            'loadingRecords': '&nbsp;',
            'processing': '<span style="width:100%;"><img src="/assets/img/clarfon_loader.gif"></span>'
        },

    });

    var startdate;
    var enddate;

    $('#reportrange').daterangepicker({
        ranges: {
            "Astazi": [moment(), moment()],
            'Ieri': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Ultimele 7 zile': [moment().subtract(6, 'days'), moment()],
            'Luna curenta': [moment().startOf('month'), moment().endOf('month')],
            'Luna trecuta': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Ultimele 3 luni': [moment().subtract(3, 'month').startOf('month'), moment().endOf('month').endOf('month')],
            'Ultimele 6 luni': [moment().subtract(6, 'month').startOf('month'), moment().endOf('month').endOf('month')],
            'Tot anul': [moment().startOf('year'), moment().endOf('year')],
            'Toate': [moment().subtract(20, 'years'), moment().endOf('year')]


        },
        opens: "right",
        format: 'DD/MM/YYYY',
        dateLimit: { days: 365 },
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplica",
            "cancelLabel": "Anuleaza",
            "fromLabel": "De la",
            "toLabel": "Pana la",
            "customRangeLabel": "Alege interval",
            "daysOfWeek": [
                "Dum",
                "Luni",
                "Mar",
                "Mie",
                "Joi",
                "Vin",
                "Sam"
            ],
            "monthNames": [
                "Ianuarie",
                "Februarie",
                "Martie",
                "Aprilie",
                "Mai",
                "Iunie",
                "Iulie",
                "August",
                "Septembrie",
                "Octombrie",
                "Noiembrie",
                "Decembrie"
            ],
            "firstDay": 1
        },

    },
        function (start, end, label) {
            var s = moment.utc(start.toISOString());
            var e = moment.utc(end.toISOString());
            startdate = s.format("YYYY-MM-DD");
            enddate = e.format("YYYY-MM-DD");
        });
    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        startdate = picker.startDate.format('YYYY-MM-DD');
        enddate = picker.endDate.format('YYYY-MM-DD');

        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {
                if (startdate != undefined) {
                    var coldate = aData[1].split("/");
                    var d = new Date(coldate[2], coldate[1] - 1, coldate[0]);
                    var date = moment(d.toISOString());
                    date = date.format("YYYY-MM-DD");
                    dateMin = startdate.replace(/-/g, "");
                    dateMax = enddate.replace(/-/g, "");
                    date = date.replace(/-/g, "");

                    if (dateMin == "" && date <= dateMax) {
                        return true;
                    }
                    else if (dateMin == "" && date <= dateMax) {
                        return true;
                    }
                    else if (dateMin <= date && "" == dateMax) {
                        return true;
                    }
                    else if (dateMin <= date && date <= dateMax) {
                        return true;
                    }

                    return false;
                }
            }
        );
        oTable.fnDraw();
    });


    $('#tabel .filters .FilterinputSearch').each(function () {
        var title = $('#tabel thead .FilterinputSearch').eq($(this).index()).text();
        $(this).html('<input type="text" placeholder="cautare" />');
    });

    var table = $('#tabel').DataTable();

    table.columns([0, 2, 3, 4, 5, 6, 7, 8]).eq(0).each(function (colIdx) {
        $('input', $('.filters th')[colIdx]).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });
});

var endYear = new Date(new Date().getFullYear(), 11, 31);

$('#pickyDate, #pickyDate1, #pickyDate2, #pickyDate3').datepicker({
    clearBtn: true,
    todayHighlight: true,
    toggleActive: true,
    endDate: endYear,
    language: 'ro',
    format: "mm/yyyy",
    startView: "months",
    minViewMode: "months",
    maxViewMode: "years",
});

$("#fromdate").datepicker({
    minViewMode: 1,

}).on('changeDate', function (ev) {
    $("#todate").datepicker("option", "minDate", ev.date.setMonth(ev.date.getMonth() + 1));
});


//--------------------- Registru Service General
