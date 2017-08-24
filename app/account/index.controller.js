(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($scope, $window,$timeout, UserService, FlashService) {
        var vm = this;
        vm.avatar = null;
        vm.user = null;
        vm.thumbnail = {};
        vm.uploading = false;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.photoChanged = photoChanged;
        vm.uploadFile = uploadFile;

        initController();

        $scope.$watch('avatar', function () {vm.photoChanged();});

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                if(vm.user.avatar){
                    vm.thumbnail = {};
                    vm.thumbnail.dataUrl = '../uploads/images/'+vm.user.avatar;
                }
            });
        }

        function saveUser() {
            var fd = new FormData();
            fd.append('file', $scope.avatar);
            UserService.UploadPhoto(fd).then(function (result) {
                vm.user.avatar = $scope.avatar.name;
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success('User updated');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
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

        function photoChanged() {
            console.log($scope.avatar);
            if ($scope.avatar && $scope.avatar.name.match(/\.(png|jpeg|jpg)$/)) {
                $scope.uploading = true;
                var file = $scope.avatar;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function() {
                        vm.thumbnail = {};
                        vm.thumbnail.dataUrl = e.target.result;
                        vm.uploading = false;
                        //$scope.message = false;
                    });
                };
            } else {
                vm.thumbnail = {};
                //$scope.message = false;
            }
        }

        function uploadFile(){
            var fd = new FormData();
            fd.append('file', $scope.avatar);
            UserService.UploadPhoto(fd);
        }


    }

})();