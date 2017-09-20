(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$resource', '$state','Authentication', 'menuService', '$timeout', 'NotificationsService'];

  function HeaderController($scope, $resource, $state, Authentication, menuService, $timeout, NotificationsService) {
    var vm = this;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.has_message = true;

    //get all new notifications
    if(vm.user){
      NotificationsService.getNotifications()
        .then(whenGetSuccess)
        .catch(whenGetError);

      function whenGetSuccess(res) {
        vm.notificationsReadFalse = res[1].listAllNotificationsWithReadFalse.length;
        if(vm.notificationsReadFalse > 0){
          vm.has_message = false;
        }
      }
      function whenGetError(err) {
        console.log(err)
      }
    }

    // get all notifications from Notification Service and using ui-scroll to loading  
    vm.notificationsDataSource = {
      get: (index, count, callback) => {

        if(vm.user){
          NotificationsService.getNotifications()
            .then(getSuccess)
            .catch(getError);

          function getSuccess(response) {            
            // get all notifications of current user
            vm.notifications = response[0].listAllNotifications
            
            vm.isLoadNotification = false;
            
            $timeout(function () {
              var i, items = [], item;
              for (i = index; i <= index + count - 1; i++) {
                if(item = vm.notifications[i]){
                  items.push(item);
                }
              };
              callback(items);
            }, 50);
          }
          function getError(err) {
            console.log(err)
          }
        }
      }
    };

    // click to check all new notifications and update all of them become true 
    vm.check_notification = () => {
      $resource('/api/notifications-read').save( () => {
          vm.has_message = true;
      });
    }

    vm.signOut = function () {
      window.location.href = '/api/auth/signout';
    };
  }
}());
