// describe("Router", function(){
//   afterEach(function(){
//     Backbone.history.stop();
//   });

//   it("should call home", function(){
//     spyOn(Backbone.Router.prototype, "home")
//     var router = new Backbone.Router();
//     Backbone.history.start();

//     router.navigate('home', true);

//     expect(Backbone.Router.prototype.index).toHaveBeenCalled();
//   });
// });
describe('Router', function () {
    it("provides the 'AppRouter' function", function () {
      // Expect exists and is an object.
      expect(AppRouter).to.be.an("function");
    })
});


// describe("AppRouter routes", function(){
//   beforeEach(function(){
//     this.router = new AppRouter();
//     this.routeSpy = sinon.spy();
//     try {
//       Backbone.history.start({silent:true, pushState:true});
//     } catch(e) {}
//     this.router.navigate("");
//   });
//   it("fires the index route with a blank hash", function() {
//     this.router.bind("route:home", this.routeSpy);
//     this.router.navigate("", true);
//     expect(this.routeSpy).toHaveBeenCalledOnce();
//     expect(this.routeSpy).toHaveBeenCalledWith();
//   });
// });
