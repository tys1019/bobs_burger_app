"use strict";var AppRouter=Backbone.Router.extend({routes:{"":"home",home:"home",burgers:"getBurgers","burgers/:id":"showBurgers","new-burger":"newBurger",ingredients:"getIngredients",orders:"getOrders","edit-burger/:id":"editBurger",checkout:"checkout"},home:function(){$("#container").empty(),$("#full-screen").prepend('<img id=banner-image class=img-responsive src="/bobs_burger_app/images/bob.jpg">');var a=Handlebars.compile($("#homeTemplate").html());$("#container").append(a()),$("a").on("click",function(){$(this).hasClass("not-clear")||$("#banner-image").remove()})},getBurgers:function(){$("#container").empty(),$.ajax({url:App.apiLocation+"burgers",type:"GET"}).done(function(a){console.log(a),a.forEach(function(a){a.price=parseFloat(a.price).toFixed(2)});var b=Handlebars.compile($("#burgerIndexTemplate").html());$("#container").html(b({burgers:a}))}).fail(function(a){console.log(a)})},getIngredients:function(){$("#container").empty(),$.ajax({url:App.apiLocation+"ingredients",type:"GET"}).done(function(a){var b=_.groupBy(a,"category"),c=Handlebars.compile($("#ingredientIndexTemplate").html());$("#container").html(c({categories:b}))}).fail(function(a){console.log(a)})},getOrders:function(){$("#container").empty();var a=localStorage.getItem("authToken");$.ajaxPrefilter(function(b){b.headers={},b.headers.AUTHORIZATION="Token token="+a}),$.ajax({url:App.apiLocation+"orders",type:"GET",datatype:"JSON"}).done(function(a){a.forEach(function(a){a.items=JSON.parse(a.items)});var b=Handlebars.compile($("#orderIndexTemplate").html());$("#container").html(b({orders:a}))}).fail(function(a){console.log(a),window.location.hash="#/users/sign_in"})},showBurgers:function(a){$("#container").empty(),$.ajax({url:App.apiLocation+"burgers/"+a,type:"GET"}).done(function(a){a.price=parseFloat(a.price).toFixed(2);var b=Handlebars.compile($("#burgerShowTemp").html());$("#container").html(b({burger:a})),$("#addToCart").on("click",function(){App.addToCart(a)})}).fail(function(a){console.log(a)})},newBurger:function(){$("#container").empty().load("partials/burger-form.html",function(){$.ajax({url:App.apiLocation+"ingredients",type:"GET"}).done(function(a){var b=_.groupBy(a,"category"),c=Handlebars.compile($("#ingredientsSelectTemp").html());$("#ingredients-container").html(c({categories:b}))}).fail(function(a){console.log(a)});var a=$("#new-burger-form");a.on("submit",function(){var a,b=[],c=($("input:checked").map(function(a){return b[a]=$(this).val(),b}),6.5),d=[],e=($("div#collapse-premium input:checked").map(function(a){d[a]=$(this).val()}),d.length+c);a=localStorage.cart?JSON.parse(localStorage.cart):[];var f={burger:{name:$("#burger-name-input").val(),ingredients:b,quantity:$("#quantity").val()||1,price:e.toFixed(2)||c.toFixed(2)}};a.push(f),localStorage.cart=JSON.stringify(a),$("input:checked").prop("checked",!1),$("#burger-name-input").val(""),App.loadCart(),window.location.hash="#/burgers"})})},editBurger:function(a){$("#container").empty().load("partials/burger-form.html",function(){var b=JSON.parse(localStorage.cart),c=b[a];$.ajax({url:App.apiLocation+"ingredients",type:"GET"}).done(function(a){var b=_.groupBy(a,"category"),d=Handlebars.compile($("#ingredientsSelectTemp").html());$("#ingredients-container").html(d({categories:b})),c.burger.ingredients.forEach(function(a){$('[value="'+a+'"]').prop("checked",!0)}),$("#burger-name-input").val(c.burger.name),$("#quantity").val(c.burger.quantity),$("[type=submit]").text("Save")}).fail(function(a){console.log(a)});var d=$("#new-burger-form");d.on("submit",function(){var c=[],d=($("input:checked").map(function(a){return c[a]=$(this).val(),c}),6.5),e=[],f=($("div#collapse-premium input:checked").map(function(a){e[a]=$(this).val()}),(e.length+d).toFixed(2)),g={burger:{name:$("#burger-name-input").val(),ingredients:c,quantity:$("#quantity").val(),price:f}};b[a]=g,localStorage.cart=JSON.stringify(b),$("input:checked").prop("checked",!1),$("#burger-name-input").val(""),App.loadCart(),window.location.hash="#/burgers"})})},checkout:function(){for(var a=JSON.parse(localStorage.cart),b=0,c=0;c<a.length;c++)b+=a[c].burger.price*a[c].burger.quantity;b=parseFloat(b).toFixed(2);var d=function(a,b){var c=$("#payment-form");if(b.error)c.find(".payment-errors").text(b.error.message),c.find("button").prop("disabled",!1);else{var d=b.id;e(d),$("#container").fadeOut(function(){$(this).html($("<h1 id=success>ORDER SUBMITTED! Thank You!</h1>")).fadeIn()})}},e=function(a){$.ajax({url:App.apiLocation+"orders",type:"POST",data:{order:{items:localStorage.cart,stripe_token:a,total_price:parseFloat($("#total-price").text())}},headers:{AUTHORIZATION:"Token token="+localStorage.authToken}}).done(function(){console.log("success"),localStorage.removeItem("cart"),App.loadCart()}).fail(function(){console.log("error")}).always(function(){console.log("complete")})};$("#container").empty().load("partials/checkout-form.html",function(){var a=JSON.parse(localStorage.cart),c=Handlebars.compile($("#checkout").html());$("#container").append(c({array:a,totalPrice:b})),App.deliveryCheck(b),$("#payment-form").submit(function(){var a=$(this);return a.find("button").prop("disabled",!0),Stripe.card.createToken(a,d),!1})})}}),App=App||{};App.addToCart=function(a){var b;b=localStorage.cart?JSON.parse(localStorage.cart):[];var c=[];a.ingredients.forEach(function(a){c.push(a.name)});var d={};d.burger=a,d.burger.ingredients=c,d.burger.quantity=$("#quantity").val(),b.push(d),localStorage.cart=JSON.stringify(b),App.loadCart(),window.location.hash="#/burgers"},App.deliveryCheck=function(a){$('input[type="radio"]').click(function(){"Delivery"==$(this).attr("value")?$("#zip-box").removeAttr("hidden"):$("#zip-box").prop("hidden","hidden")}),$("#zip-box").keyup(function(){var b=$(this).val();$("#total-price").text(b.match(/\b(021[0-1][013489])|(02210)\b/g)?a+6:b.match(/\b(02[14][3-4][1234569])\b/g)?a+10:a)})},App.freshPage=function(){$("#container").empty(),$("#banner-image").hide()},App.menuToggle=function(){$("#showRightPush").on("click",function(a){a.preventDefault(),$(this).toggleClass("active"),$("body").toggleClass("cbp-spmenu-push-toleft"),$("#slider").toggleClass("cbp-spmenu-open")})},App.loadCart=function(){$(".cart-burger").remove();for(var a=JSON.parse(localStorage.cart),b=0,c=0;c<a.length;c++)b+=a[c].burger.price*a[c].burger.quantity;b=parseFloat(b).toFixed(2);var d=Handlebars.compile($("#shoppingCart").html());$("#slider").html(d({array:a,totalPrice:b})),$(".edit").on("click",function(){$("#banner-image").hide();var a=parseInt(this.id.match(/\d/g));window.location.hash="#/edit-burger/"+a}),$(".delete").on("click",function(){var a=parseInt(this.id.match(/\d/g)),b=JSON.parse(localStorage.cart);b.splice(a,1),localStorage.cart=JSON.stringify(b),$("#burger-"+a).fadeOut(function(){this.remove(),App.loadCart()})}),$("#checkout").on("click",function(){$("#banner-image").hide(),window.location.hash="#/checkout"})},App.apiLocation="https://bobsburgersapi.herokuapp.com/",$(document).ready(function(){new AppRouter;Backbone.history.start(),App.menuToggle(),App.loadCart()});var UserRouter=Backbone.Router.extend({routes:{users:"submitRegistration","users/sign_in":"submitLogin"},submitRegistration:function(){$("#container").empty().load("partials/register-form.html",function(){var a=$("#registration-form");a.on("submit",function(a){a.preventDefault(),$.ajax({url:App.apiLocation+"users",type:"POST",data:{user:{name:$("#user-name").val(),email:$("#user-email").val(),password:$("#user-password").val(),address:$("#user-address").val()}}}).done(App.loginSuccess).fail(function(a){console.log(a)})})})},submitLogin:function(){return $("#container").empty().load("partials/login-form.html",function(){var a=$("#login-form");a.on("submit",function(a){a.preventDefault(),$.ajax({url:App.apiLocation+"users/sign_in",type:"POST",data:{user:{email:$("#user-email").val(),password:$("#user-password").val()}}}).done(App.loginSuccess).fail(function(a){console.log(a)})})}),!1}}),userRouter=new UserRouter,App=App||{},authToken=localStorage.getItem("authToken");App.loginSuccess=function(a){localStorage.setItem("authToken",a.token),console.log(a),console.log("logged in!"),App.hideButtons()},App.setupAjaxRequests=function(){$.ajaxPrefilter(function(a){a.headers={},a.headers.AUTHORIZATION="Token token="+authToken})},App.signOut=function(a){a.preventDefault(),localStorage.removeItem("authToken"),authToken=void 0,App.hideButtons()},App.hideButtons=function(){localStorage.authToken?($(".signed-out").hide(),$(".signed-in").show()):($(".signed-in").hide(),$(".signed-out").show())},$(document).ready(function(){$("#sign-out").on("click",function(a){App.signOut(a)}),App.hideButtons()});