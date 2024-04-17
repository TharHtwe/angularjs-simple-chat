var chatApp = angular.module('chatApp', ['ngRoute', 'ngAnimate', 'ui.scroll', 'ui.scroll.grid']);

  chatApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/chat', {
            templateUrl: 'views/chat.html',
        }).otherwise({
            redirectTo: '/chat'
        });
  }]);

  chatApp.run(function(){});

  chatApp.controller('ChatController', function($interval) {

    var messages = JSON.parse(localStorage.getItem('messages')) || [];
    var chat = this;
    chat.users = JSON.parse(localStorage.getItem('users')) || [];
    chat.newMessage = '';
    chat.username = sessionStorage.getItem('username');
    chat.pageSize = 25;
    chat.pageNumber = 1;
    paginate();

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
        messages.push({ sender: chat.username, text: chat.newMessage });
        localStorage.setItem('messages', JSON.stringify(messages));
        chat.newMessage = '';
      }
    };

    // Live update every 3 seconds
    $interval(function() {
        var storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        if (storedMessages.length !== messages.length) {
            var offset = storedMessages.length - messages.length;
            messages = storedMessages;
            paginate(offset);
        }
      }, 3000);

    chat.loadMoreMessages = function() {
        chat.userScrolling = true;
        if (chat.pageNumber * chat.pageSize < messages.length) {
            chat.pageNumber++;
            paginate();
        }
    };

    function paginate(offset = 0) {
        chat.messages = messages.slice(((chat.pageSize * chat.pageNumber) + offset) * Number(-1))
    }

  });

  chatApp.directive('scrollBottom', function() {
    return {
      scope: {
        scrollBottom: '='
      },
      link: function(scope, el, atts) {
        scope.$watchCollection('scrollBottom', function(newValue) {
          if (newValue) {
            angular.element(el)[0].scrollTop = angular.element(el)[0].scrollHeight;
          }
        })
      }
    }
  })

  chatApp.directive("directiveWhenScrolled", function() {
    return function(scope, elm, attr) {
      var raw = elm[0];
  
      elm.bind('scroll', function() {
        if (raw.scrollTop <= 0) {
            scope.$apply(attr.directiveWhenScrolled);
          }
      });
    };
  });