/*global $:true */
/*global Handlebars:true */
/*global Backbone:true */
'use strict';

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'burgers': 'getBurgers',
    'burgers/:id': 'showBurgers',
    'new-burger': 'newBurger',
    'ingredients': 'getIngredients',
    'orders': 'getOrders',
    'new-album': 'newOrder'
  },

  home: function(){
    $('#container').empty();
    $.ajax({
      url: 'http://localhost:9000'
    }).done(function(){
      var template = Handlebars.compile($('#homeTemplate').html());
      $('#container').html(template());
    }).fail(function(err){
      console.log(err);
    }).always();
  },

  // GET index--------------------------------------------------------------------

  getBurgers: function(){
    $('#container').empty();
    $.ajax({
      url: 'http://localhost:3000/burgers',
      type: 'GET'
    }).done(function(data){
      console.log(data);
      var template = Handlebars.compile($('#burgerIndexTemplate').html());
      $('#container').html(template({
        burgers: data
      }));
    }).fail(function(err){
      console.log(err);
    });
  },

  getIngredients: function(){
    $('#container').empty();
    $.ajax({
      url: 'http://localhost:3000/ingredients',
      type: 'GET'
    }).done(function(data){

      var filteredIngredients = _.groupBy(data, 'category');

      var template = Handlebars.compile($('#ingredientIndexTemplate').html());
      $('#container').html(template({
        categories: filteredIngredients
      }));
    }).fail(function(err){
      console.log(err);
    });
  },

  getOrders: function(){
    $('#container').empty();
    var authToken = localStorage.getItem('authToken');
    $.ajaxPrefilter(function( options ) {
      options.headers = {};
      options.headers['AUTHORIZATION'] = "Token token=" + authToken;
    });
    $.ajax({
      url: 'http://localhost:3000/orders',
      type: 'GET'
    }).done(function(data){
      var template = Handlebars.compile($('#orderIndexTemplate').html());
      $('#container').html(template({
        orders: data
      }));
    }).fail(function(err){
      console.log(err);
      window.location.replace("http://localhost:9000/#/users/sign_in")
    });
  },

  // GET show-----------------------------------------------------------------------------

  showBurgers: function(id){
    $('#container').empty();
    $.ajax({
      url: 'http://localhost:3000/burgers/' + id,
      type: 'GET'
    }).done(function(data){
      var template = Handlebars.compile($('#burgerShowTemp').html());
      $('#container').html(template({
        burger: data
      }));
    }).fail(function(err){
      console.log(err);
    });
  },

  // POST---------------------------------------------------------------------------------

  newBurger: function(event){

    $('#container').empty().load('partials/burger-form.html', function(){

      $.ajax({
        url: 'http://localhost:3000/ingredients',
        type: 'GET'
      }).done(function(data){

        var filteredIngredients = _.groupBy(data, 'category');

        var template = Handlebars.compile($('#ingredientsSelectTemp').html());
        $('#ingredients-container').html(template({
          categories: filteredIngredients
        }));
      }).fail(function(err){
        console.log(err);
      });

      var $form = $('#new-burger-form');
      $form.on('submit', function(event){
        var array = []
        var $selected = $('input:checked').map(function(i){
                              array[i] = $(this).val();
                              return array;
                            });
        if (event.preventDefault) event.preventDefault();
        $.ajax({
          url: 'http://localhost:3000/burgers',
          type: 'POST',
          data: {
            burger: {
              name: $('#burger-name-input').val(),
              ingredients: array
            }
          }
        }).done(function(data){
          console.log(data);
        }).fail(function(err){
          console.log(err);
        });
      });
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
