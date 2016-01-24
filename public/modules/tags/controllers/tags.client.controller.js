'use strict';

// Tags controller
angular.module('tags').controller('TagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tags',
    function ($scope, $stateParams, $location, Authentication, Tags) {
        $scope.authentication = Authentication;
        $scope.query = {
            text: '',
            search: function () {
                $scope.tags = Tags.query({
                    text: $scope.query.text
                });
            }
        };

        // Find a list of Tags
        $scope.find = function () {
            $scope.tags = Tags.query();
        };

        // Find existing Tag
        $scope.findOne = function () {
            $scope.tag = Tags.get({
                tagId: $stateParams.tagId
            });
        };
    }
]);