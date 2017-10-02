(function () {
  'use strict';

  angular
    .module('core')
    .factory('NotificationsService', NotificationsService);

  NotificationsService.$inject = ['$resource'];

	function NotificationsService($resource) {
	  	var Notifications = $resource('/api/notifications', {}, {
	  		listNotifications: {
		      method: 'GET',
		      url: '/api/notifications',
		      isArray: true
		   }
	  	});

	  	angular.extend( Notifications, {
	  		getNotifications: function() {
		      return this.listNotifications().$promise;
		   }
	  	});

  		return Notifications;
  	}
  
}());