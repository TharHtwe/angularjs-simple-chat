var chatApp = angular.module('chatApp', ['ngRoute']);

chatApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/chat', {
            templateUrl: 'views/chat.html',
            controller: 'ChatController'
        }).otherwise({
            redirectTo: '/chat'
        })
}]);

chatApp.run(function(){});

  chatApp.controller('ChatController', function() {
    var chat = this;
    chat.username = '';
    chat.messages = JSON.parse(localStorage.getItem('messages')) || [];
    chat.newMessage = '';

    chat.sendMessage = function() {
      if (chat.newMessage.trim() !== '') {
        chat.messages.push({ sender: chat.username, text: chat.newMessage });
        localStorage.setItem('messages', JSON.stringify(chat.messages));
        chat.newMessage = '';
      }
    };
  });