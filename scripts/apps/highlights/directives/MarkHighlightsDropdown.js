MarkHighlightsDropdown.$inject = ['desks', 'highlightsService', '$timeout'];
export function MarkHighlightsDropdown(desks, highlightsService, $timeout) {
    return {
        templateUrl: 'scripts/apps/highlights/views/mark_highlights_dropdown_directive.html',
        link: function(scope) {

            scope.markItem = function(highlight) {
                scope.item.multiSelect = false;
                highlightsService.markItem(highlight._id, scope.item);
            };

            scope.isMarked = function(highlight) {
                return scope.item && scope.item.highlights && scope.item.highlights.indexOf(highlight._id) >= 0;
            };

            highlightsService.get(desks.getCurrentDeskId()).then(function(result) {
                scope.highlights = result._items;
                $timeout(function() {
                    var highlightDropdown = angular.element('.more-activity-menu.open .dropdown--noarrow');
                    var buttons = highlightDropdown.find('button:not([disabled])');
                    if (buttons.length > 0) {
                        buttons[0].focus();
                    }
                });
            });
        }
    };
}
