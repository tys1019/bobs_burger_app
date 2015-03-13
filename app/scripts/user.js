/*global $:true */
/*global Handlebars:true */
/*global Backbone:true */
'use strict';

var UserRouter = Backbone.Router.extend({
  routes: {
    'users': 'submitRegistration',
    'users/sign_in': 'submitLogin'
  },

  submitRegistration: function(event){
    $('#container').empty().load('partials/register-form.html', function(){
      var $form = $('#registration-form');
      $form.on('submit', function(event){
        event.preventDefault();
        $.ajax({
          url: 'localhost:3000/users',
          type: 'POST',
          data: { user: {
            name: $('#user-name').val(),
            password: $('#user-password').val(),
            address: $('#user-address').val()
          }}
        }).done(App.loginSuccess).fail(function(err){
          console.log(err);
        });
      });
    });
  },


  submitLogin: function(event){
    $('#container').empty().load('partials/login-form.html', function(){
      var $form = $('#login-form');
      $form.on('submit', function(event){
        event.preventDefault();
        $.ajax({
          url: 'localhost:3000/users/sign_in',
          type: 'POST',
          data: { user: {
            name: $('#user-name').val(),
            password: $('#user-password').val()
          }}
        }).done(App.loginSuccess).fail(function(err){
          console.log(err);
        });
      });
    });

    return false;
  }

});

var userRouter = new UserRouter();

var App = App || {};

App.loginSuccess = function(userData){
  localStorage.setItem('authToken', userData.token);
  console.log('logged in!');
  window.location.href = '/';
};

App.setupAjaxRequests = function() {
  $.ajaxPrefilter(function( options ) {
    options.headers = {};
    options.headers['AUTHORIZATION'] = "Token token=" + authToken;
  });
};
