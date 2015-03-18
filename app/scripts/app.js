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
    'edit-burger/:id': 'editBurger',
    'checkout': 'checkout'
  },

  home: function(){
    $('#container').empty();
    $('#full-screen').prepend('<img id=banner-image class=img-responsive src="/bobs_burger_app/images/bob.jpg">');

      var template = Handlebars.compile($('#homeTemplate').html());
      $('#container').append(template());


    $('a, button').on('click', function(){
      if (!$(this).hasClass('not-clear')) {
        $('#banner-image').remove();
      }
    });
  },

  // GET index--------------------------------------------------------------------

  getBurgers: function(){
    $('#container').empty();
    $.ajax({
      url: App.apiLocation + 'burgers',
      type: 'GET'
    }).done(function(data){
      console.log(data);
      var template = Handlebars.compile($('#burgerIndexTemplate').html());
      $('#container').html(template({
        burgers: data
      }));
      // $('.premade').on('click',function(event){
      //   event.preventDefault();
      //   var ingredients = $(this).find('.ingredients').text().replace(/•|\n/g, '').trim().split(/\s{2,}/);
      //  window.location.hash = "#/new-burger";
      //   debugger

      // });
    }).fail(function(err){
      console.log(err);
    });
  },

  getIngredients: function(){
    $('#container').empty();
    $.ajax({
      url: App.apiLocation + 'ingredients',
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
      url: App.apiLocation + 'orders',
      type: 'GET',
      datatype: 'JSON'
    }).done(function(orders){

      orders.forEach(function(order){
        order.items = JSON.parse(order.items);
      });

      var template = Handlebars.compile($('#orderIndexTemplate').html());
      $('#container').html(template({
        orders: orders
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
      url: App.apiLocation + 'burgers/' + id,
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
        url: App.apiLocation + 'ingredients',
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
        window.location.hash = "#/burgers";



      });
    });
  },

  // -------------------------------------------------------------------------------------

  editBurger: function(id){
     $('#container').empty().load('partials/burger-form.html', function(){
        var cart = JSON.parse(localStorage.cart);
        var burger = cart[id];

        $.ajax({
          url: App.apiLocation + 'ingredients',
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

        window.location.hash = "#/burgers";

      });
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
        url: App.apiLocation + 'orders',
        type: 'POST',
        data: { order: {
            items: localStorage.cart,
            stripe_token: token,
            total_price: $('#total-price').text()
          }
        },
        headers: {"AUTHORIZATION": "Token token=" + localStorage.authToken }
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
          array: cart,
          totalPrice: totalPrice
        }));

        App.deliveryCheck(totalPrice);

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

  var ingredients = [];
  data.ingredients.forEach(function(item){
    ingredients.push(item.name);
  });

  var obj = {};
  obj.burger = data;
  obj.burger.ingredients = ingredients;
  obj.burger.quantity = $('#quantity').val();

  cart.push(obj);
  localStorage.cart = JSON.stringify(cart);

  App.loadCart();
  window.location.hash = "#/burgers";
};

App.deliveryCheck = function(totalPrice){
  $('input[type="radio"]').click(function(){
    if($(this).attr("value")=="Delivery"){
      $('#zip-box').removeAttr('hidden');
    }
    else {
      $('#zip-box').prop('hidden', 'hidden');
    }
  });

  $('#zip-box').keyup(function(){
    var zip = $(this).val();
    if (zip.match(/\b(021[0-1][013489])|(02210)\b/g)) {
      $('#total-price').text(totalPrice + 6);
    } else if (zip.match(/\b(02[14][3-4][1234569])\b/g)) {
      $('#total-price').text(totalPrice + 10);
    } else {
      $('#total-price').text(totalPrice);
    }

  });

};

App.menuToggle = function(){
  $('#showRightPush').on('click', function(event){
    event.preventDefault();

    $(this).toggleClass('active');
    $('body').toggleClass('cbp-spmenu-push-toleft' );
    $('#slider').toggleClass('cbp-spmenu-open' );

  });
};

App.loadCart = function(){
    var cart = JSON.parse(localStorage.cart);

    var totalPrice = 0;
    for (var i = 0; i < cart.length; i++) {
      totalPrice += cart[i].burger.price * cart[i].burger.quantity;
    };

    var template = Handlebars.compile($('#shoppingCart').html());
    $('#slider').html(template({
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
        App.loadCart();
      });
    });

    $('#checkout').on('click', function(){
      window.location.hash = "#/checkout";
    });
  };

App.apiLocation = "https://bobsburgersapi.herokuapp.com/";

$(document).ready(function(){
  var router = new AppRouter();
  Backbone.history.start();
  App.menuToggle();
  App.loadCart();
});




