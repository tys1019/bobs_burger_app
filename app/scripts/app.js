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
    'cart': 'showCart',
    'edit-burger/:id': 'editBurger',
    'checkout': 'checkout'
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
        window.location.hash = "#/users/sign_in";

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

      $('#addToCart').on('click', function(){
        App.addToCart(data);
      });

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
          categories: filteredIngredients,

        }));
      }).fail(function(err){
        console.log(err);
      });

      var $form = $('#new-burger-form');

      $form.on('submit', function(event){

        var array = [];
        var $selected = $('input:checked').map(function(i){
                              array[i] = $(this).val();
                              return array;
                            });

        var defaultPrice = 6.5;
        var premiumArray = [];
        var addPremium = $('div#premium input:checked').map(function(i){
          premiumArray[i] = $(this).val();
        });

        var finalPrice = premiumArray.length + defaultPrice;

        var cart;
        localStorage.cart ? cart = JSON.parse(localStorage.cart) : cart = [];


        var burgerString = {burger: {
              name: $('#burger-name-input').val(),
              ingredients: array,
              quantity: $('#quantity').val() || 1,
              price: finalPrice || 6.5
            }};

        cart.push(burgerString);
        localStorage.cart = JSON.stringify(cart);


        $('input:checked').prop('checked', false);
        $('#burger-name-input').val('');
        window.location.hash = "#/cart";



      });
    });
  },

  // -------------------------------------------------------------------------------------

  editBurger: function(id){
     $('#container').empty().load('partials/burger-form.html', function(){
        var cart = JSON.parse(localStorage.cart);
        var burger = cart[id];

        $.ajax({
          url: 'http://localhost:3000/ingredients',
          type: 'GET'
        }).done(function(data){

          var filteredIngredients = _.groupBy(data, 'category');

          var template = Handlebars.compile($('#ingredientsSelectTemp').html());
          $('#ingredients-container').html(template({
            categories: filteredIngredients
          }));
          burger.burger.ingredients.forEach(function(ing){
            $('[value="'+ ing +'"]').prop('checked', true);
          });

          $('#burger-name-input').val(burger.burger.name);
          $('#quantity').val(burger.burger.quantity);


          $('[type=submit]').text('Save');

        }).fail(function(err){
          console.log(err);
        });



        // debugger
      var $form = $('#new-burger-form');

      $form.on('submit', function(event){

        var array = []
        var $selected = $('input:checked').map(function(i){
                              array[i] = $(this).val();
                              return array;
                            });
        var array = [];
        var $selected = $('input:checked').map(function(i){
                              array[i] = $(this).val();
                              return array;
                            });

        var defaultPrice = 6.5;
        var premiumArray = [];
        var addPremium = $('div#premium input:checked').map(function(i){
          premiumArray[i] = $(this).val();
        });

        var finalPrice = premiumArray.length + defaultPrice;


        var burgerString = {burger: {
              name: $('#burger-name-input').val(),
              ingredients: array,
              quantity: $('#quantity').val(),
              price: finalPrice
            }};

        cart[id] = burgerString;
        localStorage.cart = JSON.stringify(cart);


        $('input:checked').prop('checked', false);
        $('#burger-name-input').val('');

        window.location.hash = "#/cart";

      });
     });

  },

  showCart: function(){
    $('#container').empty();
    var cart = JSON.parse(localStorage.cart);
    console.log(cart);
    var totalPrice = 0;
    for (var i = 0; i < cart.length; i++) {
      totalPrice += cart[i].burger.price * cart[i].burger.quantity;
      console.log(totalPrice);
    };

    var template = Handlebars.compile($('#shoppingCart').html());
    $('#container').html(template({
      array: cart,
      totalPrice: totalPrice
    }));

    $('.edit').on('click', function(event){
      var id = parseInt(this.id.match(/\d/g));
      window.location.hash = "#/edit-burger/" + id;
    });

    $('.delete').on('click', function(event){
      var id = parseInt(this.id.match(/\d/g));
      var cart = JSON.parse(localStorage.cart);
      cart.splice(id, 1);
      localStorage.cart = JSON.stringify(cart);
      $('#burger-' + id).fadeOut(function(){
        this.remove();
      });
      document.location.reload(true);
    });
  },

  checkout: function(){
    var cart = JSON.parse(localStorage.cart);

    var totalPrice = 0;
    for (var i = 0; i < cart.length; i++) {
      totalPrice += cart[i].burger.price * cart[i].burger.quantity;
    };

    var stripeResponseHandler = function(status, response) {
      var $form = $('#payment-form');

      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
      } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        sendOrderToServer(token);
        // and submit
        $('#container').fadeOut(function(){
          $(this).html($('<div id=success>ORDER SUBMITTED!</div>')).fadeIn();
        });
      }
    };

    var sendOrderToServer = function(token) {
      $.ajax({
        url: 'http://localhost:3000/orders',
        type: 'POST',
        data: { order: {
            items: localStorage.cart,
            stripe_token: token,
            total_price: totalPrice,
            user_token: localStorage.cart.authToken
          }
        },
      })
      .done(function() {
        console.log("success");
        localStorage.removeItem('cart');
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

    };


    $('#container').empty().load('partials/checkout-form.html', function(){
         var cart = JSON.parse(localStorage.cart);


        var template = Handlebars.compile($('#checkout').html());
        $('#container').append(template({
          array: cart
        }));

        $('#payment-form').submit(function(event) {
          var $form = $(this);

          // Disable the submit button to prevent repeated clicks
          $form.find('button').prop('disabled', true);

          Stripe.card.createToken($form, stripeResponseHandler);

          // Prevent the form from submitting with the default action
          return false;
        });
    });




  },
});

var App = App || {};

App.addToCart = function(data){
  var cart;
  localStorage.cart ? cart = JSON.parse(localStorage.cart) : cart = [];

  var obj = {};
  obj.burger = data;

  cart.push(obj);
  localStorage.cart = JSON.stringify(cart);

  console.log(cart);
},

$(document).ready(function(){
  var router = new AppRouter();
  Backbone.history.start();
});
