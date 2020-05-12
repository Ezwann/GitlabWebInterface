$(document).ready(function() {
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
    var inputs = {};
    $('.input').change(function() {
        inputs.date1 = $('#date-1').val();
        inputs.date2 = $('#date-2').val();
        if(inputs.date1 && inputs.date2) {
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
                    $('#perday').empty();
                    var result = [];
                    response.forEach(function(elem) {
                        var date = new Date(elem['created_at']);
                        var parseDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate()}`;
                        if(result[parseDate])
                            result[parseDate] += 1;
                        else
                            result[parseDate] = 1;
                    });
                    data = [];
                    labels = [];
                    for(var index in result) {
                        labels.push(index);
                        data.push({x: index, y: result[index]});
                    }
                    new Morris.Bar({
                        element: 'perday',
                        data: data,
                        xkey: 'x',
                        ykeys: ['y'],
                        labels: labels
                    });
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
                    $('#closed').empty();
                    var result = [];
                    response.forEach(function(elem) {
                        if(result[elem['closed_by']['name']])
                            result[elem['closed_by']['name']] += 1;
                        else
                            result[elem['closed_by']['name']] = 1;
                    });
                    data = [];
                    labels = [];
                    for(var index in result) {
                        labels.push(index);
                        data.push({x: index, y: result[index]});
                    }
                    new Morris.Bar({
                        element: 'closed',
                        data: data,
                        xkey: 'x',
                        ykeys: ['y'],
                        labels: labels
                    });
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
                    $('#average').empty();
                    var result = 0;
                    response.forEach(function(elem) {
                        result += elem['nbDays'];
                    });
                    result = Math.round(result / response.length);
                    $('#average').html(`Average resolution time : ${result} day(s)`);
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
                    if(response.statistics.counts) {
                        new Morris.Donut({
                            element: 'stats',
                            data: [
                                {label: "Closed", value: response.statistics.counts.closed},
                                {label: "Opened", value: response.statistics.counts.opened}
                            ],
                            colors: ['#FE2EF7','#2EFE2E']
                        });
                    }
                },
                error: function (err) {
                    console.error(err);
                },
                complete: function() {
                    $('#date-1, #date-2').prop('disabled', false);
                }
            });
        }
    });
});