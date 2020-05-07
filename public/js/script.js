$(document).ready(function() {
    var inputs = {};
    $('.input').change(function() {
        inputs.date1 = $('#date-1').val();
        inputs.date2 = $('#date-2').val();
        if(inputs.date1 && inputs.date2) {
            $.ajax({
                type: "GET",
                url: "/recent",
                beforeSend: function() {
                    $('#date-1, #date-2').prop('disabled', true);
                },
                success: function (response) {
                    $('#recent').empty();
                    var str = '<ul>';
                    response.forEach(function(element) {
                        str += `<li><a href="${element.web_url}">${element.title}</a> (${element.state})</li>`;
                    })
                    str += '</ul>';
                    $('#recent').html(str);
                },
                error: function (err) {
                    console.error(err);
                },
                complete: function() {
                    $('#date-1, #date-2').prop('disabled', false);
                }
            });
            $.ajax({
                type: "POST",
                url: "/opened",
                data: {
                    created_after: inputs.date1,
                    created_before: inputs.date2
                },
                beforeSend: function() {
                    $('#date-1, #date-2').prop('disabled', true);
                },
                success: function (response) {
                    console.log(response)
                },
                error: function (err) {
                    console.error(err);
                },
                complete: function() {
                    $('#date-1, #date-2').prop('disabled', false);
                }
            });
            $.ajax({
                type: "POST",
                url: "/closed",
                data: {
                    created_after: inputs.date1,
                    created_before: inputs.date2
                },
                beforeSend: function() {
                    $('#date-1, #date-2').prop('disabled', true);
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (err) {
                    console.error(err);
                },
                complete: function() {
                    $('#date-1, #date-2').prop('disabled', false);
                }
            });
            $.ajax({
                type: "POST",
                url: "/average",
                data: {
                    created_after: inputs.date1,
                    created_before: inputs.date2
                },
                beforeSend: function() {
                    $('#date-1, #date-2').prop('disabled', true);
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (err) {
                    console.error(err);
                },
                complete: function() {
                    $('#date-1, #date-2').prop('disabled', false);
                }
            });
            $.ajax({
                type: "POST",
                url: "/stats",
                data: {
                    created_after: inputs.date1,
                    created_before: inputs.date2
                },
                beforeSend: function() {
                    $('#date-1, #date-2').prop('disabled', true);
                },
                success: function (response) {
                    $('#stats').empty();
                    Morris.Donut({
                        element: 'stats',
                        data: [
                          {label: "Closed", value: response.statistics.counts.closed},
                          {label: "Opened", value: response.statistics.counts.opened}
                        ]
                      });
                },
                error: function (err) {
                    console.error(err);
                },
                complete: function() {
                    $('#date-1, #date-2').prop('disabled', false);
                }
            });
        }
    })
    /* $.ajax({
        type: "GET",
        url: "url",
        data: "data",
        success: function (response) {
            
        }
    }); */
});