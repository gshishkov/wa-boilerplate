(function(){
    'use strict';
    
        angular
            .module('app')
            .directive('fileModel', Model);

            function Model($parse) {
                console.log('test');
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var parsedFile = $parse(attrs.fileModel);
                        var parsedFileSetter = parsedFile.assign;
            
                        element.bind('change', function() {
                            console.log(element[0].files[0]);
                            scope.$apply(function() {
                                parsedFileSetter(scope, element[0].files[0]);
                            });
                        });
                    }
                };
            }
})();