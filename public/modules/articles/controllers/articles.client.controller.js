'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Articles', 'Tags', 'ngToast',
    function ($scope, $stateParams, $location, $http, Authentication, Articles, Tags, ngToast) {
        $scope.authentication = Authentication;
        $scope.editor = false;
        $scope.loadTags = function (query) {
            return Tags.query({text: query}).$promise;
        };

        $scope.addTag = function (tag) {
            $scope.article.$addTag({tagId: tag._id});
        };
        $scope.removeTag = function (tag) {
            $scope.article.$removeTag({tagId: tag._id});
        };
        $scope.create = function () {
            var article = new Articles({
                title: this.title,
                content: this.content
            });
            article.$save(function (response) {
                $location.path('articles/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function () {
                    $location.path('articles');
                });
            }
        };

        $scope.update = function () {
            var article = $scope.article;

            article.$update(function () {
                $location.path('articles/' + article._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.articles = Articles.query();
        };

        $scope.findOne = function () {
            $scope.article = Articles.get({
                articleId: $stateParams.articleId
            }, function () {
                $scope.editor = new MediumEditor('.lead', {
                    toolbar: {
                        allowMultiParagraphSelection: true,
                        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
                        diffLeft: 0,
                        diffTop: -10,
                        firstButtonClass: 'medium-editor-button-first',
                        lastButtonClass: 'medium-editor-button-last',
                        standardizeSelectionStart: false,
                        static: false,
                        relativeContainer: null,
                        /* options which only apply when static is true */
                        align: 'center',
                        sticky: false,
                        updateOnEmptySelection: false
                    }
                });
                $scope.editor.subscribe('editableInput', function (event, editable) {
                    $scope.article.content = event.target.innerHTML;
                });
                var port = $location.port();
                $scope.host = $location.protocol() + '://' + $location.host() + ':' + (port === '80' ? '' : port);
                var client = new ZeroClipboard(document.getElementById('permalink-copier'));
                client.on('ready', function (readyEvent) {
                    client.on('aftercopy', function (event) {
                        event.target.style.display = 'none';
                        $scope.$apply(function () {
                            ngToast.create('Copied to clipboard');
                        });
                    });
                });
            });
        };
        $scope.$on('destroy', function () {
            $scope.editor.unsubscribe('editableInput');
        });
    }
]);