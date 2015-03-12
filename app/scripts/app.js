/*global $:true */
/*global Handlebars:true */
/*global Backbone:true */
'use strict';

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'posts': 'getBurgers',
    'new-post': 'newBurger', // burgers
    'comments': 'getIngredients', // ingredients
    'albums': 'getOrders', // orders
    'new-album': 'newOrder'
  },

  home: function(){
    $.ajax({
      url: 'http://localhost:9000'
    }).done().fail(function(err){
      console.log(err);
    }).always();
  },

  getBurgers: function(){
    $('#container').empty();
    $.ajax({
      url: 'http://jsonplaceholder.typicode.com/posts',
      type: 'GET'
    }).done(function(data){
      console.log(data);
      var template = Handlebars.compile($('#burgerIndexTemplate').html());
      $('#container').html(template({
        posts: data
      }));
    }).fail(function(err){
      console.log(err);
    });
  },

  getIngredients: function(){
    $('#container').empty();
    $.ajax({
      url: 'http://jsonplaceholder.typicode.com/comments',
      type: 'GET'
    }).done(function(data){
      console.log(data);
      var template = Handlebars.compile($('#ingredientIndexTemplate').html());
      $('#container').html(template({
        comments: data
      }));
    }).fail(function(err){
      console.log(err);
    });
  },

  getOrders: function(){
    $('#container').empty();
    $.ajax({
      url: 'http://jsonplaceholder.typicode.com/albums',
      type: 'GET'
    }).done(function(data){
      var template = Handlebars.compile($('#orderIndexTemplate').html());
      $('#container').html(template({
        albums: data
      }));
    }).fail(function(err){
      console.log(err);
    });
  },

  // POST---------------------------------------------------

  newBurger: function(){
    $.ajax({
      url: 'http://jsonplaceholder.typicode.com/posts',
      type: 'POST',
      data: {
        title: 'Bacon Blue-Cheese Burger',
        body: 'Cow meat with bacon and blue cheese on top',
        userId: 1
      }
    }).done(function(data){
      console.log(data);
    }).fail(function(err){
      console.log(err);
    });
  },

  newOrder: function(){
    $.ajax({
      url: 'http://jsonplaceholder.typicode.com/albums',
      type: 'POST',
      data: {
        title: 'Order 122',
        userId: 12
      }
    }).done(function(data){
      console.log(data);
    }).fail(function(err){
      console.log(err);
    });
  },
});

var router = new AppRouter();
Backbone.history.start();

$(document).ready(function(){

});
