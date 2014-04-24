/******************************************************************************

 John Resig's Simple JavaScript Inheritance
 http://ejohn.org/blog/simple-javascript-inheritance/
 Inspired by base2 and Prototype

 ===============================================================================

 Example usage...

 var Person = Class.extend({
		  ctor: function(isDancing){
			this.dancing = isDancing;
		  }
		});

 var Ninja = Person.extend({
		  ctor: function(){
				  this._super( false );
		  }
		});

 var p = new Person(true);
 p.dancing; // => true

 var n = new Ninja();
 n.dancing; // => false

 ******************************************************************************/

var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

// The base Class implementation (does nothing)
var Class = function() { };

// Create a new Class that inherits from this class
Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the ctor constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
                return function() {
                    var temporaryValue = this["_super"];
                    var temporaryPresent = this.hasOwnProperty("_super");

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);

                    if (temporaryPresent) {
                        this["_super"] = temporaryValue; // Restore original value
                    } else {
                        delete this["_super"]; // If there were no property, no need to add one
                    }

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    // The dummy class constructor
    function Class() {
        // All construction is actually done in the ctor method
        if ( !initializing && this.ctor )
            this.ctor.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
};

module.exports = Class;