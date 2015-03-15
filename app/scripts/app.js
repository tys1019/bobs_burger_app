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
    'cart': 'showCart'
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
      debugger

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

        if (localStorage.cart === undefined) localStorage.cart = '';
        if (localStorage.counter === undefined) localStorage.counter = 1;
        var counter = localStorage.counter;


        var burgerString = counter + JSON.stringify({burger: {
              name: $('#burger-name-input').val(),
              ingredients: array,
            }}) + counter +' ';
        localStorage.cart += burgerString;
        localStorage.counter ++;

        $('input:checked').prop('checked', false);
        $('#burger-name-input').val('');

        // Generates regex to grab a specific burger
        // var re = new RegExp("(?:" + number + ")(.*?)(?=" + (parseInt(number) + 1) + ")", "g");

        // Grabs the last digit for iterating purposes
        // localStorage.cart.match(/(\d+)[^\d]*$/g)



      });
    });
  },

  showCart: function(){
    $('#container').empty().load('partials/cart.html', function(){
      var burgerCount = localStorage.cart.match(/(\d+)[^\d]*$/)[1];
      var re, burger, template;

      for (var i = 1; i <= burgerCount; i++) {
        re = new RegExp("(?:" + i + ")(.*?)(?=" + i + ")", "g");
        burger = JSON.parse(String(localStorage.cart.match(re)).replace(/\d/, ''));

        // debugger


        var template = Handlebars.compile($('#cartTemplate').html());
        $('#container').append(template(burger.burger));

      };
    })
  },



});

var router = new AppRouter();
Backbone.history.start();

$(document).ready(function(){

});
