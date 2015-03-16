// newBurger: function(event){

//     $('#container').empty().load('partials/burger-form.html', function(){

//       $.ajax({
//         url: 'http://localhost:3000/ingredients',
//         type: 'GET'
//       }).done(function(data){

//         var filteredIngredients = _.groupBy(data, 'category');

//         var template = Handlebars.compile($('#ingredientsSelectTemp').html());
//         $('#ingredients-container').html(template({
//           categories: filteredIngredients
//         }));
//       }).fail(function(err){
//         console.log(err);
//       });

//       var $form = $('#new-burger-form');
//       $form.on('submit', function(event){
//         var array = []
//         var $selected = $('input:checked').map(function(i){
//                               array[i] = $(this).val();
//                               return array;
//                             });

//         if (event.preventDefault) event.preventDefault();
//         $.ajax({
//           url: 'http://localhost:3000/burgers',
//           type: 'POST',
//           data: {
//             burger: {
//               name: $('#burger-name-input').val(),
//               ingredients: array,
//             }
//           }
//         }).done(function(data){
//           console.log(data);
//         }).fail(function(err){
//           console.log(err);
//         });
//       });
//     });
//   },
