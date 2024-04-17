var chatApp = angular.module('chatApp', ['ngRoute']);

chatApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/chat', {
            templateUrl: 'views/chat.html',
        }).otherwise({
            redirectTo: '/chat'
        });
}]);

chatApp.run(function(){
});

  chatApp.controller('ChatController', function() {
    console.log('controller initialized');
    var chat = this;
    chat.users = JSON.parse(localStorage.getItem('users')) || [];
    chat.messages = JSON.parse(localStorage.getItem('messages')) || [];
    chat.newMessage = '';
    chat.username = sessionStorage.getItem('username');

    if (!chat.username) {
        let person = prompt("Please enter your name", "");
        while (!person || chat.users.filter((u) => u == person).length > 0) {
            person = prompt("Please choose another name", "");
        }
        chat.users.push(person);
        localStorage.setItem('users', JSON.stringify(chat.users));
        chat.username = person;
        sessionStorage.setItem('username', person);
    }

    chat.sendMessage = function() {
      if (chat.newMessage.trim() !== '') {
        chat.messages.push({ sender: chat.username, text: chat.newMessage });
        localStorage.setItem('messages', JSON.stringify(chat.messages));
        chat.newMessage = '';
      }
    };
  });