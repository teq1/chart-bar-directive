/**
 *
 * @date    11/20/13 11:34 AM
 * @author  Wiktor Jamro <w.jamro@smartrecruiters.com>
 *
 */

(function (angular) {
    'use strict';
    var chartBarService = function () {

        var sumElements = function (data, prop) {
            var sum = 0;
            angular.forEach(data, function (value) {
                var int = parseInt(value[prop]);
                if (angular.isNumber(int)) {
                    sum += int;
                }
            });
            return sum;
        };

        var getMean = function (sum, elem) {
            return sum / elem;
        };

        var getMaxValue = function (data) {
            var maxVal = -1;
            angular.forEach(data, function (value) {
                var currentVal = value.value;
                if (currentVal > maxVal) {
                    maxVal = currentVal;
                }
            });
            return maxVal;
        };

        var sortDesc = function (data) {
            data.sort(function (a, b) {
                return b.value - a.value;
            });
        };

        this.parseValues = function (data) {
            var sum, max;
            var avg = 0;

            sum = sumElements(data, "value");
            avg = getMean(sum, data.length);
            max = getMaxValue(data);

            angular.forEach(data, function (value) {
                var val = parseInt(value.value);
                if (val < max || sum === 0) {
                    if (val !== 0 && val !== 1) {
                        value.width = Math.round((Math.log(val) * 100) / Math.log(max));
                    } else {
                        value.width = val;
                    }
                } else {
                    value.width = 100;
                }
                value.style = (val > avg + (avg * 0.1)) ? "aboveAvg" : "";
            });

            return data;
        };
    };

    angular.
        module('genericElements').
        service('chartBarService', [chartBarService]);

}(angular));