(function () {
    'use strict';

    angular
        .module('chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket', 'AdminService', '$window'];

    function ChatController($scope, $state, Authentication, Socket, AdminService, $window) {
        var vm = this;

        vm.authentication = Authentication;
        vm.messages = [];
        vm.messageText = '';
        vm.sendMessage = sendMessage;
        vm.text = '';
        vm.chats = [];
        vm.top2 = [];
        vm.send = function (user) {
            vm.chats.push(user);
            vm.selectTop();
        };
        vm.selectTop= function () {
            let l = vm.chats.length;
            if (l > 1) {
                vm.top2 = [vm.chats[l - 1], vm.chats[l - 2]];
            }
            else
                vm.top2 = vm.chats;
        };
        vm.changeUser=function () {
            return vm.chats.filter(user => {
                return user._id !== vm.top2[0]._id && user._id !== vm.top2[1]._id;
            });

        }
        vm.editChat= function (user) {
            vm.top2[1]=user;

        }
        vm.removeUser = function (index) {
            vm.chats.splice(vm.chats.length - 1 - index, 1);
            vm.selectTop();
        }
        vm.sendMessage = sendMessage;
        AdminService.query(function (data) {
            vm.users = data;

        });
        init();

        function init() {
            // If user is not signed in then redirect back home
            if (!Authentication.user) {
                $state.go('home');
            }

            // Make sure the Socket is connected
            if (!Socket.socket) {
                Socket.connect();
            }

            // Add an event listener to the 'chatMessage' event
            Socket.on('chatMessage', function (message) {
                vm.messages.push(message);
            });

            // Remove the event listener when the controller instance is destroyed
            $scope.$on('$destroy', function () {
                Socket.removeListener('chatMessage');
            });
        }

            // Create a controller method for sending messages
            function sendMessage(userId) {
                // Create a new message object
                var message = {
                    text: vm.messageText,
                    id: vm.authentication.user._id,
                    userId: userId,
                    profileImageURL: vm.authentication.user.profileImageURL
                };
                vm.messages.push(message);
                // Emit a 'chatMessage' message event
                Socket.emit('chatMessage', message);

                // Clear the message text
                vm.messageText = '';
            }


            $(function () {
                $('[data-command="toggle-search"]').on('click', function (event) {
                    event.preventDefault();
                    $(this).toggleClass('hide-search');

                    if ($(this).hasClass('hide-search')) {
                        $('.c-search').closest('.row').slideUp(100);
                    } else {
                        $('.c-search').closest('.row').slideDown(100);
                    }
                })

                $('#contact-list').searchable({
                    searchField: '#contact-list-search',
                    selector: 'li',
                    childSelector: '.col-xs-12',
                    show: function (elem) {
                        elem.slideDown(100);
                    },
                    hide: function (elem) {
                        elem.slideUp(100);
                    }
                })
            });
            vm.showChat = function (count) {
                var $ = $window.jQuery;
                var $chatbox = $('.chatbox').eq(count);
                $chatbox.toggleClass('chatbox--tray');
            };


        }


}());
