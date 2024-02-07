function f(data) {

    monthsData = data.resultset;
    maxLength = monthsData.length;
    fixedMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var startDateByCal = dashboard.getParameterValue('startDateParam');
    var endDateByCal = dashboard.getParameterValue('endDateParam');
    var startMonthYear = moment(startDateByCal).format("MMM YYYY");
    var endMonthYear = moment(endDateByCal).format("MMM YYYY");
    var arrOfMonthsYear = monthsData.toString().split(',');
    var sVal = arrOfMonthsYear.indexOf(startMonthYear) == -1 ? arrOfMonthsYear.length : arrOfMonthsYear.indexOf(startMonthYear) + 1; // Start Month
    var eVal = arrOfMonthsYear.indexOf(endMonthYear) == -1 ? arrOfMonthsYear.length : arrOfMonthsYear.indexOf(endMonthYear) + 1; // End Month

    if (eVal < sVal) {
        eVal = sVal;
    }

    if (sVal == 0 && eVal == 0 || sVal == 0) {
        if (sVal == 0 && eVal != 0) {
            var sVal = 1;
        } else if (eVal == 0 && sVal != 0) {
            var eVal = 1;
        } else {
            var sVal = 1;
            var eVal = 1;
        }
    }
    var v = eVal - sVal;
    if (v > 0 && v >= 11) {
        var s = 0;
        for (; sVal <= maxLength; s++) {
            if (s >= 11) {
                break;
            }
        }
        sVal = eVal - s;
    }

    // Slider Code starts here
    var vm = $("#slider-range").dragslider({
        range: true,
        rangeDrag: true,
        animate: false,
        min: 1,
        max: maxLength,
        step: 1,
        values: [sVal, eVal],
        slide: function(event, ui) {
            var rangeVal = 1 + ui.values[1] - ui.values[0];
            if (rangeVal > 12) {
                return false;
            } else {
                highlightLabel(ui.values[0], ui.values[1]);
            }
            dashboard.setParameter("dateRangeTrigger", "false");
        },
        change: function(event, ui) {
            var rangeVal = 1 + ui.values[1] - ui.values[0];
            if (rangeVal > 12) {
                return false;
            } else {
                highlightLabel(ui.values[0], ui.values[1]);
            }
            leftWidth(ui.values[0], ui.values[1]);
            var sd = getCustomDate(ui.values[0], ui.values[1]);
            var rangeVal = 1 + ui.values[1] - ui.values[0];
            if (dashboard.getParameterValue("dateRangeTrigger") == 'true') {
                    this.dashboard.fireChange("dateRangeTrigger","false");
            } else {
                dashboard.setParameter("startDateParam", sd[0]);
                dashboard.setParameter("endDateParam", sd[1]);
                //dashboard.fireChange("changeStatusApplyButtonParam", "true");
                dashboard.fireChange("customDateTrigger", "true");
            }
        }
        // Rendring Labels of slider (Year and month)    
    }).each(function() {
        var monthsData = data.resultset;
        var vals = maxLength - 1;
        var width = $("#slider-range").width() / (maxLength);
        var width = (width / $("#slider-range").width()) * 100;
        for (var i = 0; i <= vals; i++) {
            var monthN = ("" + monthsData[i] + "").split(" ")[0];
            if (("" + monthsData[i - 1] + "").split(" ")[1] !== ("" + monthsData[i] + "").split(" ")[1])
                var yearEl = $('<label>' + "" + ("" + monthsData[i] + "").split(" ")[1] + '</label>').css({
                    'width': width + '%'
                });
            else
                var yearEl = $('<label>' + " " + '</label>').css({
                    'width': width + '%'
                });
            if ($('#year label').length > vals) {

            } else {
                $("#year").append(yearEl);
            }
            var el = $('<label>' + monthN + '</label>').css({
                'width': width + '%'
            });
            if (i == 0) {
                var elTick = $('<div style="display:inline-block;border-left:0px !important;"></div>').css({
                    'width': width + '%'
                });
            } else {
                var elTick = $('<div style="display:inline-block;"></div>').css({
                    'width': width + '%'
                });
            }
            if ($("#slider-range").find('#ticks div').length > vals) {} else {
                $("#ticks").append(elTick);
                $("#sliderLabels").append(el);
            }
        }
    });

    //To apply default date range.....

    highlightLabel(sVal, eVal);
    leftWidth(sVal, eVal);
    var sd = getCustomDate(vm.slider("values", sVal), vm.slider("values", eVal));
    if (this.dashboard.getParameterValue("dateRangeTrigger") == 'true') {
        //this.dashboard.fireChange("dateRangeTrigger", "false");
    } else {
        dashboard.setParameter("startDateParam", sd[0]);
        dashboard.setParameter("endDateParam", sd[1]);
        dashboard.fireChange("startDateParam", sd[0]);
        dashboard.fireChange("endDateParam", sd[1]);
    }
    //dashboard.fireChange('changeStatusApplyButtonParam', true);
    dashboard.fireChange("customDateTrigger", "true");

    // setting start and end date of particular selected slider block
    function getCustomDate(startMonthIndex, endMonthIndex) {
        var monthsData = data.resultset;
        var startMonth = (monthsData[startMonthIndex - 1]).toString().split(" ")[0];
        var startYear = (monthsData[startMonthIndex - 1]).toString().split(" ")[1];
        var endMonth = (monthsData[endMonthIndex - 1]).toString().split(" ")[0];
        var endMonth = fixedMonth.indexOf(endMonth);
        var endYear = (monthsData[endMonthIndex - 1]).toString().split(" ")[1];
        var sd = moment(startMonth + "01," + startYear + " 01:00:00").format('YYYY-MM-DD');
        if (endMonthIndex == maxLength) {
            var ed = moment().subtract(0, 'd').format('YYYY-MM-DD');
        } else {
            var ed = moment([endYear, endMonth]).endOf('month').format('YYYY-MM-DD');
        }
        return [sd, ed];
    }


    // For highlight tick values in blue color
    function highlightLabel(sCls, eCls) {
        $("#slider-range").find("label").css("display", "block");
        $("#sliderLabels").find("label").css("color", "#EAEAEA");
        $("#sliderLabels").find("label").removeClass("hlgt");
        if (sCls == 0 && eCls == 0) {} else {
            sCls = sCls - 1;
            eCls = eCls - 1;
        }
        $("#slider-range").find("label:eq(" + sCls + ")").css("display", "none");
        $("#slider-range").find("label:eq(" + eCls + ")").css("display", "none");
        for (var l = sCls; l <= eCls; l++) {
            $("#sliderLabels").find("label:eq(" + l + ")").addClass("hlgt");
        }
        length = $("#sliderLabels").find(".hlgt").length;
    }

    // After dragged width adjustment

    function leftWidth(sv, ev) {
        var sliderRangeWidth = $("#slider-range").width() / (maxLength);
        var eachTickWidth = (sliderRangeWidth / $("#slider-range").width()) * 100;

        var width = length * eachTickWidth;
        left = (sv - 1) * eachTickWidth;

        right = (ev) * eachTickWidth;
        $(".ui-slider-range").css({
            'width': width + '%',
            left: left + '%'
        });
        var a1 = $("#slider-range").find('a:first()');
        a1.css({
            left: left + '%'
        });
        var a2 = $("#slider-range").find('a:last()');
        a2.css({
            left: right + '%'
        });

    }

} 
