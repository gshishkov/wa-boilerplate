(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($scope, $window, UserService, FlashService) {
        var vm = this;
        vm.avatar = null;
        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.photoChanged = photoChanged;
        vm.uploadFile = uploadFile;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function photoChanged(files) {
            if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
                $scope.uploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.thumbnail = {};
                        $scope.thumbnail.dataUrl = e.target.result;
                        $scope.uploading = false;
                        $scope.message = false;
                    });
                };
            } else {
                $scope.thumbnail = {};
                $scope.message = false;
            }
        }

        function uploadFile(){
            console.log($scope.avatar);
            var fd = new FormData();
            fd.append('file', $scope.avatar);
            UserService.UploadPhoto(fd);
        }


    }

})();