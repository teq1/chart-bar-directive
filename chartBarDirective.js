/**
 *
 * @date    11/13/13 11:12 AM
 * @author  Wiktor Jamro <w.jamro@smartrecruiters.com>
 *
 */

(function (angular) {
    'use strict';

    var srBarChartDirective = function ($parse, chartBarService) {
        var barHeight = 40,
            barBottomMargin = 5,
            barSize = barHeight + barBottomMargin,
            yAxisNumber = 8,
            barContainer = '.srBarGraph',
            yAxisContainer = '.yAxis .labels';

        var getGraphHeight = function (numberOfBars) {
            var graphHeight = numberOfBars * barSize;
            return graphHeight;
        };
        var setGraphHeight = function (numberOfBars) {
            if (numberOfBars) {
                var graphHeight = getGraphHeight(numberOfBars) - barBottomMargin;
                angular.element(barContainer).css("height", graphHeight);
                angular.element(yAxisContainer).css("height", graphHeight);
            } else {
                angular.element(barContainer).css("height", "");
            }
        };

        var link = function (scope, elem, attr) {
            scope.barWidth = function (width) {
                return {
                    width: width + "%"
                };
            };

            scope.barClass = function (data) {
                return {
                    'orange': data.style === 'aboveAvg',
                    "grey": data.meta === "aggregate",
                    "zeroState": data.width === 0
                };
            };

            scope.$watch('data', function (c) {
                if (c) {
                    if (c.length) {
                        setGraphHeight(c.length);
                        chartBarService.parseValues(c);
                    } else {
                        setGraphHeight(c.length);
                    }
                }
            }, true);

            scope.sourcingAxis = function (data) {
                if (data) {
                    var barNum = (data.length) ? yAxisNumber : 0;
                    return new Array(barNum);
                }
            };
            scope.graphBarTooltipValue = function(bar){
                var text = {
                    group: "View jobs for this ",
                    job: "View sources for this job"
                };
                var tooltipText = "blank analytics tooltip";
                var groupBy = scope.groupedBy;
                if(angular.isDefined(groupBy) && bar && !angular.isDefined(bar.meta)){
                    if(groupBy.value === 'job'){
                        tooltipText = text.job;
                    } else {
                        tooltipText = text.group + angular.lowercase(groupBy.label);
                    }
                }
                return tooltipText;
            };

            var handler = $parse(attr.barClick);
            scope.barClicked = function (bar, e) {
                e.preventDefault();
                var identifier = bar.identifier;
                if (angular.isDefined(identifier) && bar.meta !== 'aggregate') {
                    handler(scope.$parent, {'identifier': identifier});
                }
            };

            /**
             * Group is object
             */
            scope.$watch('group', function (c) {
                scope.groupedBy = c;
            });

            scope.graphShowLocation = function(bar){
                var graphShowLocation = false;
                if(angular.isDefined(bar.location) && scope.groupedBy.value === 'job'){
                    graphShowLocation = true;
                }
                return graphShowLocation;
            };
        };

        return {
            restrict: 'A',
            scope: {
                data: '=srBarChart',
                group: '=srCurrentGroup'
            },
            template: '<section class="srBarGraph">' +
                '<div class="yAxis">' +
                '<ul class="labels">' +
                '<li class="labelPlaceholder"><\/li>' +
                '<li data-ng-repeat="y in sourcingAxis(data) track by $index"><\/li>' +
                '<\/ul>' +
                '<\/div>' +
                '<div class="graphBars">' +
                '<ul>' +
                '<li data-ng-repeat="bar in data" data-ng-class="barClass(bar)">' +
                '<div class="barName group-by-{{groupedBy.value}}">' +
                '<div class="barNameLabel"' +
                      'data-sr-long-content="bar.label" ' +
                      'data-tooltip-class="analytics-tooltip" ' +
                      'data-content-length="169" ' +
                      'data-abbr="{{bar.label}}">' +
                      '{{bar.label}}' +
                      '<\/div>' +
                '<div class="barNameLocation" data-ng-show="graphShowLocation(bar)">{{bar.location}}<\/div>' +
                '<\/div>' +
                '<div class="singleBarContainer">' +
                '<div class="barValue analytics-tooltip tooltip-graph" data-ng-style="barWidth(bar.width)" data-ng-click="barClicked(bar, $event)"' +
                'data-ng-class="barClass(bar)" data-abbr="{{graphBarTooltipValue(bar)}}">' +
                '<span>{{bar.textValue}}<\/span>' +
                '<\/div>' +
                '<\/div>' +
                '<\/li>' +
                '<\/ul>' +
                '<\/div>' +
                '<\/section>',
            link: link
        };
    };

    angular.
        module('charts').
        directive('srBarChart', ['$parse', 'chartBarService', srBarChartDirective]);

}(angular));

