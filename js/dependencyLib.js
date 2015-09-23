(function(factory) {
		if (typeof define === "function" && define.amd) {
			define(["jquery"], factory);
		} else if (typeof exports === "object") {
			module.exports = factory(require("jquery"));
		} else {
			factory(jQuery);
		}
	}
	(function($) {

		//helper functions

		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		function indexOf(list, elem) {
			var i = 0,
				len = list.length;
			for (; i < len; i++) {
				if (list[i] === elem) {
					return i;
				}
			}
			return -1;
		}

		var class2type = {},
			classTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
		for (var nameNdx = 0; nameNdx < classTypes.length; nameNdx++) {
			class2type["[object " + classTypes[nameNdx] + "]"] = classTypes[nameNdx].toLowerCase();
		}

		function type(obj) {
			if (obj == null) {
				return obj + "";
			}
			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[class2type.toString.call(obj)] || "object" :
				typeof obj;
		}

		//micro event lib
		function Event(elem) {
			this[0] = elem;
		}

		Event.prototype = {
			on: function() {
				$.fn.on.apply($(this[0]), arguments);
				return this;
			},
			off: function() {
				$.fn.off.apply($(this[0]), arguments);
				return this;
			},
			trigger: function() {
				$.fn.trigger.apply($(this[0]), arguments);
				return this;
			},
			triggerHandler: function() {
				$.fn.triggerHandler.apply($(this[0]), arguments);
				return this;
			}
		};

		function getDomEvents() {
			var domEvents = [];
			for (var i in document) {
				if (i.substring(0, 2) === "on" && (document[i] === null || typeof document[i] === 'function'))
					domEvents.push(i);
			}
			return domEvents;
		};


		function DependencyLib(elem) {
			this[0] = elem;
			if (!(this instanceof DependencyLib)) {
				return new DependencyLib(elem);
			}
		}
		DependencyLib.prototype = Event.prototype;

		//static
		DependencyLib.isFunction = function(obj) {
			return type(obj) === "function";
		};
		DependencyLib.noop = function() {};
		DependencyLib.parseJSON = function(data) {
			return JSON.parse(data + "");
		};
		DependencyLib.isArray = Array.isArray;
		DependencyLib.inArray = function(elem, arr, i) {
			return arr == null ? -1 : indexOf(arr, elem, i);
		};
		DependencyLib.valHooks = $.valHooks;
		DependencyLib.isWindow = function(obj) {
			return obj != null && obj === obj.window;
		};
		DependencyLib.isPlainObject = function(obj) {
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if (type(obj) !== "object" || obj.nodeType || DependencyLib.isWindow(obj)) {
				return false;
			}

			if (obj.constructor && !class2type.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		};

		DependencyLib.extend = function() {
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if (typeof target === "boolean") {
				deep = target;

				// Skip the boolean and the target
				target = arguments[i] || {};
				i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if (typeof target !== "object" && !DependencyLib.isFunction(target)) {
				target = {};
			}

			// Extend jQuery itself if only one argument is passed
			if (i === length) {
				target = this;
				i--;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (DependencyLib.isPlainObject(copy) || (copyIsArray = DependencyLib.isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && DependencyLib.isArray(src) ? src : [];

							} else {
								clone = src && DependencyLib.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = DependencyLib.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};

		DependencyLib.each = $.each;
		DependencyLib.map = $.map;
		DependencyLib.Event = $.Event; //needs to be replaced
		DependencyLib.data = $.data; //needs to be replaced

		window.dependencyLib = DependencyLib;
		return DependencyLib;
	}));
