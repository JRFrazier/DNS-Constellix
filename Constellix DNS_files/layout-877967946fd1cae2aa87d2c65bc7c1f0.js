/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );

//= require /js/common/jquery/jquery-1.10.2.js
/*! jQuery UI - v1.10.3 - 2013-10-20
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var s,n,r,o=t.nodeName.toLowerCase();return"area"===o?(s=t.parentNode,n=s.name,t.href&&n&&"map"===s.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&a(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&a(t)}function a(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,a){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),a&&a.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var a,s,n=e(this[0]);n.length&&n[0]!==document;){if(a=n.css("position"),("absolute"===a||"relative"===a||"fixed"===a)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,a){return!!e.data(t,a[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var a=e.attr(t,"tabindex"),s=isNaN(a);return(s||a>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,a){function s(t,i,a,s){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,a&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===a?["Left","Right"]:["Top","Bottom"],r=a.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+a]=function(i){return i===t?o["inner"+a].call(this):this.each(function(){e(this).css(r,s(this,i)+"px")})},e.fn["outer"+a]=function(t,i){return"number"!=typeof t?o["outer"+a].call(this,t):this.each(function(){e(this).css(r,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,a){var s,n=e.ui[t].prototype;for(s in a)n.plugins[s]=n.plugins[s]||[],n.plugins[s].push([i,a[s]])},call:function(e,t,i){var a,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(a=0;s.length>a;a++)e.options[s[a][0]]&&s[a][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var a=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[a]>0?!0:(t[a]=1,s=t[a]>0,t[a]=0,s)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,a=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(n){}a(t)},e.widget=function(i,s,a){var n,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],n=u+"-"+i,a||(a=s,s=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:a.version,_proto:e.extend({},a),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(a,function(i,a){return e.isFunction(a)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,n=this._superApply;return this._super=e,this._superApply=t,i=a.apply(this,arguments),this._super=s,this._superApply=n,i}}(),t):(l[i]=a,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:n}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var a,n,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(a in r[o])n=r[o][a],r[o].hasOwnProperty(a)&&n!==t&&(i[a]=e.isPlainObject(n)?e.isPlainObject(i[a])?e.widget.extend({},i[a],n):e.widget.extend({},n):n);return i},e.widget.bridge=function(i,a){var n=a.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,a=e.data(this,n);return a?e.isFunction(a[r])&&"_"!==r.charAt(0)?(s=a[r].apply(a,h),s!==a&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,n);t?t.option(r||{})._init():e.data(this,n,new a(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var a,n,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},a=i.split("."),i=a.shift(),a.length){for(n=o[i]=e.widget.extend({},this.options[i]),r=0;a.length-1>r;r++)n[a[r]]=n[a[r]]||{},n=n[a[r]];if(i=a.pop(),s===t)return n[i]===t?null:n[i];n[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,a){var n,r=this;"boolean"!=typeof i&&(a=s,s=i,i=!1),a?(s=n=e(s),this.bindings=this.bindings.add(s)):(a=s,s=this.element,n=this.widget()),e.each(a,function(a,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=a.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?n.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var a,n,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],n=i.originalEvent)for(a in n)a in i||(i[a]=n[a]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,a,n){"string"==typeof a&&(a={effect:a});var r,o=a?a===!0||"number"==typeof a?i:a.effect||i:t;a=a||{},"number"==typeof a&&(a={duration:a}),r=!e.isEmptyObject(a),a.complete=n,a.delay&&s.delay(a.delay),r&&e.effects&&e.effects.effect[o]?s[t](a):o!==t&&s[o]?s[o](a.duration,a.easing,n):s.queue(function(i){e(this)[t](),n&&n.call(s[0]),i()})}})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,a=1===i.which,n="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return a&&!n&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(e,t){function i(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function s(t,i){return parseInt(e.css(t,i),10)||0}function a(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,r=Math.max,o=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,c=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(n!==t)return n;var i,s,a=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),r=a.children()[0];return e("body").append(a),i=r.offsetWidth,a.css("overflow","scroll"),s=r.offsetWidth,i===s&&(s=a[0].clientWidth),a.remove(),n=i-s},getScrollInfo:function(t){var i=t.isWindow?"":t.element.css("overflow-x"),s=t.isWindow?"":t.element.css("overflow-y"),a="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,n="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:n?e.position.scrollbarWidth():0,height:a?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return f.apply(this,arguments);t=e.extend({},t);var n,p,m,g,v,y,b=e(t.of),_=e.position.getWithinInfo(t.within),x=e.position.getScrollInfo(_),k=(t.collision||"flip").split(" "),w={};return y=a(b),b[0].preventDefault&&(t.at="left top"),p=y.width,m=y.height,g=y.offset,v=e.extend({},g),e.each(["my","at"],function(){var e,i,s=(t[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):u.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=u.test(s[1])?s[1]:"center",e=c.exec(s[0]),i=c.exec(s[1]),w[this]=[e?e[0]:0,i?i[0]:0],t[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===t.at[0]?v.left+=p:"center"===t.at[0]&&(v.left+=p/2),"bottom"===t.at[1]?v.top+=m:"center"===t.at[1]&&(v.top+=m/2),n=i(w.at,p,m),v.left+=n[0],v.top+=n[1],this.each(function(){var a,l,u=e(this),c=u.outerWidth(),d=u.outerHeight(),f=s(this,"marginLeft"),y=s(this,"marginTop"),D=c+f+s(this,"marginRight")+x.width,T=d+y+s(this,"marginBottom")+x.height,M=e.extend({},v),S=i(w.my,u.outerWidth(),u.outerHeight());"right"===t.my[0]?M.left-=c:"center"===t.my[0]&&(M.left-=c/2),"bottom"===t.my[1]?M.top-=d:"center"===t.my[1]&&(M.top-=d/2),M.left+=S[0],M.top+=S[1],e.support.offsetFractions||(M.left=h(M.left),M.top=h(M.top)),a={marginLeft:f,marginTop:y},e.each(["left","top"],function(i,s){e.ui.position[k[i]]&&e.ui.position[k[i]][s](M,{targetWidth:p,targetHeight:m,elemWidth:c,elemHeight:d,collisionPosition:a,collisionWidth:D,collisionHeight:T,offset:[n[0]+S[0],n[1]+S[1]],my:t.my,at:t.at,within:_,elem:u})}),t.using&&(l=function(e){var i=g.left-M.left,s=i+p-c,a=g.top-M.top,n=a+m-d,h={target:{element:b,left:g.left,top:g.top,width:p,height:m},element:{element:u,left:M.left,top:M.top,width:c,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>n?"top":a>0?"bottom":"middle"};c>p&&p>o(i+s)&&(h.horizontal="center"),d>m&&m>o(a+n)&&(h.vertical="middle"),h.important=r(o(i),o(s))>r(o(a),o(n))?"horizontal":"vertical",t.using.call(this,e,h)}),u.offset(e.extend(M,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,a=s.isWindow?s.scrollLeft:s.offset.left,n=s.width,o=e.left-t.collisionPosition.marginLeft,h=a-o,l=o+t.collisionWidth-n-a;t.collisionWidth>n?h>0&&0>=l?(i=e.left+h+t.collisionWidth-n-a,e.left+=h-i):e.left=l>0&&0>=h?a:h>l?a+n-t.collisionWidth:a:h>0?e.left+=h:l>0?e.left-=l:e.left=r(e.left-o,e.left)},top:function(e,t){var i,s=t.within,a=s.isWindow?s.scrollTop:s.offset.top,n=t.within.height,o=e.top-t.collisionPosition.marginTop,h=a-o,l=o+t.collisionHeight-n-a;t.collisionHeight>n?h>0&&0>=l?(i=e.top+h+t.collisionHeight-n-a,e.top+=h-i):e.top=l>0&&0>=h?a:h>l?a+n-t.collisionHeight:a:h>0?e.top+=h:l>0?e.top-=l:e.top=r(e.top-o,e.top)}},flip:{left:function(e,t){var i,s,a=t.within,n=a.offset.left+a.scrollLeft,r=a.width,h=a.isWindow?a.scrollLeft:a.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,c=l+t.collisionWidth-r-h,d="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+d+p+f+t.collisionWidth-r-n,(0>i||o(u)>i)&&(e.left+=d+p+f)):c>0&&(s=e.left-t.collisionPosition.marginLeft+d+p+f-h,(s>0||c>o(s))&&(e.left+=d+p+f))},top:function(e,t){var i,s,a=t.within,n=a.offset.top+a.scrollTop,r=a.height,h=a.isWindow?a.scrollTop:a.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,c=l+t.collisionHeight-r-h,d="top"===t.my[1],p=d?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-r-n,e.top+p+f+m>u&&(0>s||o(u)>s)&&(e.top+=p+f+m)):c>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,e.top+p+f+m>c&&(i>0||c>o(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,a,n,r=document.getElementsByTagName("body")[0],o=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(n in s)t.style[n]=s[n];t.appendChild(o),i=r||document.documentElement,i.insertBefore(t,i.firstChild),o.style.cssText="position: absolute; left: 10.7432222px;",a=e(o).offset().left,e.support.offsetFractions=a>10&&11>a,t.innerHTML="",i.removeChild(t)}()})(jQuery);(function(e){e.widget("ui.draggable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var i=this.options;return this.helper||i.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(e(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),!i){var a=this._uiHash();if(this._trigger("drag",t,a)===!1)return this._mouseUp({}),!1;this.position=a.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i=this,a=!1;return e.ui.ddmanager&&!this.options.dropBehaviour&&(a=e.ui.ddmanager.drop(this,t)),this.dropped&&(a=this.dropped,this.dropped=!1),"original"!==this.options.helper||e.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!a||"valid"===this.options.revert&&a||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,a)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",t)!==!1&&i._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1):!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(t){var i=this.options,a=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return a.parents("body").length||a.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),a[0]===this.element[0]||/(fixed|absolute)/.test(a.css("position"))||a.css("position","absolute"),a},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,a,s=this.options;return s.containment?"window"===s.containment?(this.containment=[e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,e(window).scrollLeft()+e(window).width()-this.helperProportions.width-this.margins.left,e(window).scrollTop()+(e(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===s.containment?(this.containment=[0,0,e(document).width()-this.helperProportions.width-this.margins.left,(e(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):s.containment.constructor===Array?(this.containment=s.containment,undefined):("parent"===s.containment&&(s.containment=this.helper[0].parentNode),i=e(s.containment),a=i[0],a&&(t="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(t?Math.max(a.scrollWidth,a.offsetWidth):a.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(a.scrollHeight,a.offsetHeight):a.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(t,i){i||(i=this.position);var a="absolute"===t?1:-1,s="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:s.scrollTop(),left:s.scrollLeft()}),{top:i.top+this.offset.relative.top*a+this.offset.parent.top*a-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*a,left:i.left+this.offset.relative.left*a+this.offset.parent.left*a-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*a}},_generatePosition:function(t){var i,a,s,n,r=this.options,o="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=t.pageX,h=t.pageY;return this.offset.scroll||(this.offset.scroll={top:o.scrollTop(),left:o.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(a=this.relative_container.offset(),i=[this.containment[0]+a.left,this.containment[1]+a.top,this.containment[2]+a.left,this.containment[3]+a.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),r.grid&&(s=r.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/r.grid[1])*r.grid[1]:this.originalPageY,h=i?s-this.offset.click.top>=i[1]||s-this.offset.click.top>i[3]?s:s-this.offset.click.top>=i[1]?s-r.grid[1]:s+r.grid[1]:s,n=r.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/r.grid[0])*r.grid[0]:this.originalPageX,l=i?n-this.offset.click.left>=i[0]||n-this.offset.click.left>i[2]?n:n-this.offset.click.left>=i[0]?n-r.grid[0]:n+r.grid[0]:n)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,i,a){return a=a||this._uiHash(),e.ui.plugin.call(this,t,[i,a]),"drag"===t&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,i,a)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i){var a=e(this).data("ui-draggable"),s=a.options,n=e.extend({},i,{item:a.element});a.sortables=[],e(s.connectToSortable).each(function(){var i=e.data(this,"ui-sortable");i&&!i.options.disabled&&(a.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,n))})},stop:function(t,i){var a=e(this).data("ui-draggable"),s=e.extend({},i,{item:a.element});e.each(a.sortables,function(){this.instance.isOver?(this.instance.isOver=0,a.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,"original"===a.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,s))})},drag:function(t,i){var a=e(this).data("ui-draggable"),s=this;e.each(a.sortables,function(){var n=!1,r=this;this.instance.positionAbs=a.positionAbs,this.instance.helperProportions=a.helperProportions,this.instance.offset.click=a.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(n=!0,e.each(a.sortables,function(){return this.instance.positionAbs=a.positionAbs,this.instance.helperProportions=a.helperProportions,this.instance.offset.click=a.offset.click,this!==r&&this.instance._intersectsWith(this.instance.containerCache)&&e.contains(r.instance.element[0],this.instance.element[0])&&(n=!1),n})),n?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(s).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=a.offset.click.top,this.instance.offset.click.left=a.offset.click.left,this.instance.offset.parent.left-=a.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=a.offset.parent.top-this.instance.offset.parent.top,a._trigger("toSortable",t),a.dropped=this.instance.element,a.currentItem=a.element,this.instance.fromOutside=a),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),a._trigger("fromSortable",t),a.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(){var t=e("body"),i=e(this).data("ui-draggable").options;t.css("cursor")&&(i._cursor=t.css("cursor")),t.css("cursor",i.cursor)},stop:function(){var t=e(this).data("ui-draggable").options;t._cursor&&e("body").css("cursor",t._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i){var a=e(i.helper),s=e(this).data("ui-draggable").options;a.css("opacity")&&(s._opacity=a.css("opacity")),a.css("opacity",s.opacity)},stop:function(t,i){var a=e(this).data("ui-draggable").options;a._opacity&&e(i.helper).css("opacity",a._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(){var t=e(this).data("ui-draggable");t.scrollParent[0]!==document&&"HTML"!==t.scrollParent[0].tagName&&(t.overflowOffset=t.scrollParent.offset())},drag:function(t){var i=e(this).data("ui-draggable"),a=i.options,s=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(a.axis&&"x"===a.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-t.pageY<a.scrollSensitivity?i.scrollParent[0].scrollTop=s=i.scrollParent[0].scrollTop+a.scrollSpeed:t.pageY-i.overflowOffset.top<a.scrollSensitivity&&(i.scrollParent[0].scrollTop=s=i.scrollParent[0].scrollTop-a.scrollSpeed)),a.axis&&"y"===a.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-t.pageX<a.scrollSensitivity?i.scrollParent[0].scrollLeft=s=i.scrollParent[0].scrollLeft+a.scrollSpeed:t.pageX-i.overflowOffset.left<a.scrollSensitivity&&(i.scrollParent[0].scrollLeft=s=i.scrollParent[0].scrollLeft-a.scrollSpeed))):(a.axis&&"x"===a.axis||(t.pageY-e(document).scrollTop()<a.scrollSensitivity?s=e(document).scrollTop(e(document).scrollTop()-a.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<a.scrollSensitivity&&(s=e(document).scrollTop(e(document).scrollTop()+a.scrollSpeed))),a.axis&&"y"===a.axis||(t.pageX-e(document).scrollLeft()<a.scrollSensitivity?s=e(document).scrollLeft(e(document).scrollLeft()-a.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<a.scrollSensitivity&&(s=e(document).scrollLeft(e(document).scrollLeft()+a.scrollSpeed)))),s!==!1&&e.ui.ddmanager&&!a.dropBehaviour&&e.ui.ddmanager.prepareOffsets(i,t)}}),e.ui.plugin.add("draggable","snap",{start:function(){var t=e(this).data("ui-draggable"),i=t.options;t.snapElements=[],e(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=e(this),a=i.offset();this!==t.element[0]&&t.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:a.top,left:a.left})})},drag:function(t,i){var a,s,n,r,o,l,h,u,d,c,p=e(this).data("ui-draggable"),f=p.options,m=f.snapTolerance,g=i.offset.left,v=g+p.helperProportions.width,y=i.offset.top,b=y+p.helperProportions.height;for(d=p.snapElements.length-1;d>=0;d--)o=p.snapElements[d].left,l=o+p.snapElements[d].width,h=p.snapElements[d].top,u=h+p.snapElements[d].height,o-m>v||g>l+m||h-m>b||y>u+m||!e.contains(p.snapElements[d].item.ownerDocument,p.snapElements[d].item)?(p.snapElements[d].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[d].item})),p.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(a=m>=Math.abs(h-b),s=m>=Math.abs(u-y),n=m>=Math.abs(o-v),r=m>=Math.abs(l-g),a&&(i.position.top=p._convertPositionTo("relative",{top:h-p.helperProportions.height,left:0}).top-p.margins.top),s&&(i.position.top=p._convertPositionTo("relative",{top:u,left:0}).top-p.margins.top),n&&(i.position.left=p._convertPositionTo("relative",{top:0,left:o-p.helperProportions.width}).left-p.margins.left),r&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l}).left-p.margins.left)),c=a||s||n||r,"outer"!==f.snapMode&&(a=m>=Math.abs(h-y),s=m>=Math.abs(u-b),n=m>=Math.abs(o-g),r=m>=Math.abs(l-v),a&&(i.position.top=p._convertPositionTo("relative",{top:h,left:0}).top-p.margins.top),s&&(i.position.top=p._convertPositionTo("relative",{top:u-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.left=p._convertPositionTo("relative",{top:0,left:o}).left-p.margins.left),r&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[d].snapping&&(a||s||n||r||c)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[d].item})),p.snapElements[d].snapping=a||s||n||r||c)}}),e.ui.plugin.add("draggable","stack",{start:function(){var t,i=this.data("ui-draggable").options,a=e.makeArray(e(i.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});a.length&&(t=parseInt(e(a[0]).css("zIndex"),10)||0,e(a).each(function(i){e(this).css("zIndex",t+i)}),this.css("zIndex",t+a.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i){var a=e(i.helper),s=e(this).data("ui-draggable").options;a.css("zIndex")&&(s._zIndex=a.css("zIndex")),a.css("zIndex",s.zIndex)},stop:function(t,i){var a=e(this).data("ui-draggable").options;a._zIndex&&e(i.helper).css("zIndex",a._zIndex)}})})(jQuery);(function(e){function t(e,t,i){return e>t&&t+i>e}e.widget("ui.droppable",{version:"1.10.3",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t=this.options,i=t.accept;this.isover=!1,this.isout=!0,this.accept=e.isFunction(i)?i:function(e){return e.is(i)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},e.ui.ddmanager.droppables[t.scope]=e.ui.ddmanager.droppables[t.scope]||[],e.ui.ddmanager.droppables[t.scope].push(this),t.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var t=0,i=e.ui.ddmanager.droppables[this.options.scope];i.length>t;t++)i[t]===this&&i.splice(t,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,i){"accept"===t&&(this.accept=e.isFunction(i)?i:function(e){return e.is(i)}),e.Widget.prototype._setOption.apply(this,arguments)},_activate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",t,this.ui(i))},_deactivate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",t,this.ui(i))},_over:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(i)))},_out:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(i)))},_drop:function(t,i){var a=i||e.ui.ddmanager.current,s=!1;return a&&(a.currentItem||a.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var t=e.data(this,"ui-droppable");return t.options.greedy&&!t.options.disabled&&t.options.scope===a.options.scope&&t.accept.call(t.element[0],a.currentItem||a.element)&&e.ui.intersect(a,e.extend(t,{offset:t.element.offset()}),t.options.tolerance)?(s=!0,!1):undefined}),s?!1:this.accept.call(this.element[0],a.currentItem||a.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(a)),this.element):!1):!1},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(e,i,a){if(!i.offset)return!1;var s,n,r=(e.positionAbs||e.position.absolute).left,o=r+e.helperProportions.width,l=(e.positionAbs||e.position.absolute).top,h=l+e.helperProportions.height,u=i.offset.left,d=u+i.proportions.width,c=i.offset.top,p=c+i.proportions.height;switch(a){case"fit":return r>=u&&d>=o&&l>=c&&p>=h;case"intersect":return r+e.helperProportions.width/2>u&&d>o-e.helperProportions.width/2&&l+e.helperProportions.height/2>c&&p>h-e.helperProportions.height/2;case"pointer":return s=(e.positionAbs||e.position.absolute).left+(e.clickOffset||e.offset.click).left,n=(e.positionAbs||e.position.absolute).top+(e.clickOffset||e.offset.click).top,t(n,c,i.proportions.height)&&t(s,u,i.proportions.width);case"touch":return(l>=c&&p>=l||h>=c&&p>=h||c>l&&h>p)&&(r>=u&&d>=r||o>=u&&d>=o||u>r&&o>d);default:return!1}},e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,i){var a,s,n=e.ui.ddmanager.droppables[t.options.scope]||[],r=i?i.type:null,o=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();e:for(a=0;n.length>a;a++)if(!(n[a].options.disabled||t&&!n[a].accept.call(n[a].element[0],t.currentItem||t.element))){for(s=0;o.length>s;s++)if(o[s]===n[a].element[0]){n[a].proportions.height=0;continue e}n[a].visible="none"!==n[a].element.css("display"),n[a].visible&&("mousedown"===r&&n[a]._activate.call(n[a],i),n[a].offset=n[a].element.offset(),n[a].proportions={width:n[a].element[0].offsetWidth,height:n[a].element[0].offsetHeight})}},drop:function(t,i){var a=!1;return e.each((e.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance)&&(a=this._drop.call(this,i)||a),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),a},dragStart:function(t,i){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)})},drag:function(t,i){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,i),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var a,s,n,r=e.ui.intersect(t,this,this.options.tolerance),o=!r&&this.isover?"isout":r&&!this.isover?"isover":null;o&&(this.options.greedy&&(s=this.options.scope,n=this.element.parents(":data(ui-droppable)").filter(function(){return e.data(this,"ui-droppable").options.scope===s}),n.length&&(a=e.data(n[0],"ui-droppable"),a.greedyChild="isover"===o)),a&&"isover"===o&&(a.isover=!1,a.isout=!0,a._out.call(a,i)),this[o]=!0,this["isout"===o?"isover":"isout"]=!1,this["isover"===o?"_over":"_out"].call(this,i),a&&"isout"===o&&(a.isout=!1,a.isover=!0,a._over.call(a,i)))}})},dragStop:function(t,i){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)}}})(jQuery);(function(e){function t(e){return parseInt(e,10)||0}function i(e){return!isNaN(parseInt(e,10))}e.widget("ui.resizable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var t,i,s,a,n,r=this,o=this.options;if(this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!o.aspectRatio,aspectRatio:o.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:o.helper||o.ghost||o.animate?o.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=o.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),t=this.handles.split(","),this.handles={},i=0;t.length>i;i++)s=e.trim(t[i]),n="ui-resizable-"+s,a=e("<div class='ui-resizable-handle "+n+"'></div>"),a.css({zIndex:o.zIndex}),"se"===s&&a.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(a);this._renderAxis=function(t){var i,s,a,n;t=t||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=e(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=e(this.handles[i],this.element),n=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),a=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),t.css(a,n),this._proportionallyResize()),e(this.handles[i]).length},this._renderAxis(this.element),this._handles=e(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){r.resizing||(this.className&&(a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=a&&a[1]?a[1]:"se")}),o.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){o.disabled||(e(this).removeClass("ui-resizable-autohide"),r._handles.show())}).mouseleave(function(){o.disabled||r.resizing||(e(this).addClass("ui-resizable-autohide"),r._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var t,i=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),t=this.element,this.originalElement.css({position:t.css("position"),width:t.outerWidth(),height:t.outerHeight(),top:t.css("top"),left:t.css("left")}).insertAfter(t),t.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(t){var i,s,a=!1;for(i in this.handles)s=e(this.handles[i])[0],(s===t.target||e.contains(s,t.target))&&(a=!0);return!this.options.disabled&&a},_mouseStart:function(i){var s,a,n,r=this.options,o=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:o.top,left:o.left}),this._renderProxy(),s=t(this.helper.css("left")),a=t(this.helper.css("top")),r.containment&&(s+=e(r.containment).scrollLeft()||0,a+=e(r.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:a},this.size=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:a},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof r.aspectRatio?r.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=e(".ui-resizable-"+this.axis).css("cursor"),e("body").css("cursor","auto"===n?this.axis+"-resize":n),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(t){var i,s=this.helper,a={},n=this.originalMousePosition,r=this.axis,o=this.position.top,h=this.position.left,l=this.size.width,u=this.size.height,c=t.pageX-n.left||0,d=t.pageY-n.top||0,p=this._change[r];return p?(i=p.apply(this,[t,c,d]),this._updateVirtualBoundaries(t.shiftKey),(this._aspectRatio||t.shiftKey)&&(i=this._updateRatio(i,t)),i=this._respectSize(i,t),this._updateCache(i),this._propagate("resize",t),this.position.top!==o&&(a.top=this.position.top+"px"),this.position.left!==h&&(a.left=this.position.left+"px"),this.size.width!==l&&(a.width=this.size.width+"px"),this.size.height!==u&&(a.height=this.size.height+"px"),s.css(a),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),e.isEmptyObject(a)||this._trigger("resize",t,this.ui()),!1):!1},_mouseStop:function(t){this.resizing=!1;var i,s,a,n,r,o,h,l=this.options,u=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),a=s&&e.ui.hasScroll(i[0],"left")?0:u.sizeDiff.height,n=s?0:u.sizeDiff.width,r={width:u.helper.width()-n,height:u.helper.height()-a},o=parseInt(u.element.css("left"),10)+(u.position.left-u.originalPosition.left)||null,h=parseInt(u.element.css("top"),10)+(u.position.top-u.originalPosition.top)||null,l.animate||this.element.css(e.extend(r,{top:h,left:o})),u.helper.height(u.size.height),u.helper.width(u.size.width),this._helper&&!l.animate&&this._proportionallyResize()),e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(e){var t,s,a,n,r,o=this.options;r={minWidth:i(o.minWidth)?o.minWidth:0,maxWidth:i(o.maxWidth)?o.maxWidth:1/0,minHeight:i(o.minHeight)?o.minHeight:0,maxHeight:i(o.maxHeight)?o.maxHeight:1/0},(this._aspectRatio||e)&&(t=r.minHeight*this.aspectRatio,a=r.minWidth/this.aspectRatio,s=r.maxHeight*this.aspectRatio,n=r.maxWidth/this.aspectRatio,t>r.minWidth&&(r.minWidth=t),a>r.minHeight&&(r.minHeight=a),r.maxWidth>s&&(r.maxWidth=s),r.maxHeight>n&&(r.maxHeight=n)),this._vBoundaries=r},_updateCache:function(e){this.offset=this.helper.offset(),i(e.left)&&(this.position.left=e.left),i(e.top)&&(this.position.top=e.top),i(e.height)&&(this.size.height=e.height),i(e.width)&&(this.size.width=e.width)},_updateRatio:function(e){var t=this.position,s=this.size,a=this.axis;return i(e.height)?e.width=e.height*this.aspectRatio:i(e.width)&&(e.height=e.width/this.aspectRatio),"sw"===a&&(e.left=t.left+(s.width-e.width),e.top=null),"nw"===a&&(e.top=t.top+(s.height-e.height),e.left=t.left+(s.width-e.width)),e},_respectSize:function(e){var t=this._vBoundaries,s=this.axis,a=i(e.width)&&t.maxWidth&&t.maxWidth<e.width,n=i(e.height)&&t.maxHeight&&t.maxHeight<e.height,r=i(e.width)&&t.minWidth&&t.minWidth>e.width,o=i(e.height)&&t.minHeight&&t.minHeight>e.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,u=/sw|nw|w/.test(s),c=/nw|ne|n/.test(s);return r&&(e.width=t.minWidth),o&&(e.height=t.minHeight),a&&(e.width=t.maxWidth),n&&(e.height=t.maxHeight),r&&u&&(e.left=h-t.minWidth),a&&u&&(e.left=h-t.maxWidth),o&&c&&(e.top=l-t.minHeight),n&&c&&(e.top=l-t.maxHeight),e.width||e.height||e.left||!e.top?e.width||e.height||e.top||!e.left||(e.left=null):e.top=null,e},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var e,t,i,s,a,n=this.helper||this.element;for(e=0;this._proportionallyResizeElements.length>e;e++){if(a=this._proportionallyResizeElements[e],!this.borderDif)for(this.borderDif=[],i=[a.css("borderTopWidth"),a.css("borderRightWidth"),a.css("borderBottomWidth"),a.css("borderLeftWidth")],s=[a.css("paddingTop"),a.css("paddingRight"),a.css("paddingBottom"),a.css("paddingLeft")],t=0;i.length>t;t++)this.borderDif[t]=(parseInt(i[t],10)||0)+(parseInt(s[t],10)||0);a.css({height:n.height()-this.borderDif[0]-this.borderDif[2]||0,width:n.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var t=this.element,i=this.options;this.elementOffset=t.offset(),this._helper?(this.helper=this.helper||e("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(e,t){return{width:this.originalSize.width+t}},w:function(e,t){var i=this.originalSize,s=this.originalPosition;return{left:s.left+t,width:i.width-t}},n:function(e,t,i){var s=this.originalSize,a=this.originalPosition;return{top:a.top+i,height:s.height-i}},s:function(e,t,i){return{height:this.originalSize.height+i}},se:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},sw:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,i,s]))},ne:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},nw:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,i,s]))}},_propagate:function(t,i){e.ui.plugin.call(this,t,[i,this.ui()]),"resize"!==t&&this._trigger(t,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),e.ui.plugin.add("resizable","animate",{stop:function(t){var i=e(this).data("ui-resizable"),s=i.options,a=i._proportionallyResizeElements,n=a.length&&/textarea/i.test(a[0].nodeName),r=n&&e.ui.hasScroll(a[0],"left")?0:i.sizeDiff.height,o=n?0:i.sizeDiff.width,h={width:i.size.width-o,height:i.size.height-r},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,u=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(e.extend(h,u&&l?{top:u,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};a&&a.length&&e(a[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",t)}})}}),e.ui.plugin.add("resizable","containment",{start:function(){var i,s,a,n,r,o,h,l=e(this).data("ui-resizable"),u=l.options,c=l.element,d=u.containment,p=d instanceof e?d.get(0):/parent/.test(d)?c.parent().get(0):d;p&&(l.containerElement=e(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}):(i=e(p),s=[],e(["Top","Right","Left","Bottom"]).each(function(e,a){s[e]=t(i.css("padding"+a))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},a=l.containerOffset,n=l.containerSize.height,r=l.containerSize.width,o=e.ui.hasScroll(p,"left")?p.scrollWidth:r,h=e.ui.hasScroll(p)?p.scrollHeight:n,l.parentData={element:p,left:a.left,top:a.top,width:o,height:h}))},resize:function(t){var i,s,a,n,r=e(this).data("ui-resizable"),o=r.options,h=r.containerOffset,l=r.position,u=r._aspectRatio||t.shiftKey,c={top:0,left:0},d=r.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(c=h),l.left<(r._helper?h.left:0)&&(r.size.width=r.size.width+(r._helper?r.position.left-h.left:r.position.left-c.left),u&&(r.size.height=r.size.width/r.aspectRatio),r.position.left=o.helper?h.left:0),l.top<(r._helper?h.top:0)&&(r.size.height=r.size.height+(r._helper?r.position.top-h.top:r.position.top),u&&(r.size.width=r.size.height*r.aspectRatio),r.position.top=r._helper?h.top:0),r.offset.left=r.parentData.left+r.position.left,r.offset.top=r.parentData.top+r.position.top,i=Math.abs((r._helper?r.offset.left-c.left:r.offset.left-c.left)+r.sizeDiff.width),s=Math.abs((r._helper?r.offset.top-c.top:r.offset.top-h.top)+r.sizeDiff.height),a=r.containerElement.get(0)===r.element.parent().get(0),n=/relative|absolute/.test(r.containerElement.css("position")),a&&n&&(i-=r.parentData.left),i+r.size.width>=r.parentData.width&&(r.size.width=r.parentData.width-i,u&&(r.size.height=r.size.width/r.aspectRatio)),s+r.size.height>=r.parentData.height&&(r.size.height=r.parentData.height-s,u&&(r.size.width=r.size.height*r.aspectRatio))},stop:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.containerOffset,a=t.containerPosition,n=t.containerElement,r=e(t.helper),o=r.offset(),h=r.outerWidth()-t.sizeDiff.width,l=r.outerHeight()-t.sizeDiff.height;t._helper&&!i.animate&&/relative/.test(n.css("position"))&&e(this).css({left:o.left-a.left-s.left,width:h,height:l}),t._helper&&!i.animate&&/static/.test(n.css("position"))&&e(this).css({left:o.left-a.left-s.left,width:h,height:l})}}),e.ui.plugin.add("resizable","alsoResize",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=function(t){e(t).each(function(){var t=e(this);t.data("ui-resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):e.each(i.alsoResize,function(e){s(e)})},resize:function(t,i){var s=e(this).data("ui-resizable"),a=s.options,n=s.originalSize,r=s.originalPosition,o={height:s.size.height-n.height||0,width:s.size.width-n.width||0,top:s.position.top-r.top||0,left:s.position.left-r.left||0},h=function(t,s){e(t).each(function(){var t=e(this),a=e(this).data("ui-resizable-alsoresize"),n={},r=s&&s.length?s:t.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(e,t){var i=(a[t]||0)+(o[t]||0);i&&i>=0&&(n[t]=i||null)}),t.css(n)})};"object"!=typeof a.alsoResize||a.alsoResize.nodeType?h(a.alsoResize):e.each(a.alsoResize,function(e,t){h(e,t)})},stop:function(){e(this).removeData("resizable-alsoresize")}}),e.ui.plugin.add("resizable","ghost",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size;t.ghost=t.originalElement.clone(),t.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),t.ghost.appendTo(t.helper)},resize:function(){var t=e(this).data("ui-resizable");t.ghost&&t.ghost.css({position:"relative",height:t.size.height,width:t.size.width})},stop:function(){var t=e(this).data("ui-resizable");t.ghost&&t.helper&&t.helper.get(0).removeChild(t.ghost.get(0))}}),e.ui.plugin.add("resizable","grid",{resize:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size,a=t.originalSize,n=t.originalPosition,r=t.axis,o="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=o[0]||1,l=o[1]||1,u=Math.round((s.width-a.width)/h)*h,c=Math.round((s.height-a.height)/l)*l,d=a.width+u,p=a.height+c,f=i.maxWidth&&d>i.maxWidth,m=i.maxHeight&&p>i.maxHeight,g=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=o,g&&(d+=h),v&&(p+=l),f&&(d-=h),m&&(p-=l),/^(se|s|e)$/.test(r)?(t.size.width=d,t.size.height=p):/^(ne)$/.test(r)?(t.size.width=d,t.size.height=p,t.position.top=n.top-c):/^(sw)$/.test(r)?(t.size.width=d,t.size.height=p,t.position.left=n.left-u):(t.size.width=d,t.size.height=p,t.position.top=n.top-c,t.position.left=n.left-u)}})})(jQuery);(function(e){e.widget("ui.selectable",e.ui.mouse,{version:"1.10.3",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var t,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){t=e(i.options.filter,i.element[0]),t.addClass("ui-selectee"),t.each(function(){var t=e(this),i=t.offset();e.data(this,"selectable-item",{element:this,$element:t,left:i.left,top:i.top,right:i.left+t.outerWidth(),bottom:i.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=t.addClass("ui-selectee"),this._mouseInit(),this.helper=e("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(t){var i=this,s=this.options;this.opos=[t.pageX,t.pageY],this.options.disabled||(this.selectees=e(s.filter,this.element[0]),this._trigger("start",t),e(s.appendTo).append(this.helper),this.helper.css({left:t.pageX,top:t.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=e.data(this,"selectable-item");s.startselected=!0,t.metaKey||t.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",t,{unselecting:s.element}))}),e(t.target).parents().addBack().each(function(){var s,a=e.data(this,"selectable-item");return a?(s=!t.metaKey&&!t.ctrlKey||!a.$element.hasClass("ui-selected"),a.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),a.unselecting=!s,a.selecting=s,a.selected=s,s?i._trigger("selecting",t,{selecting:a.element}):i._trigger("unselecting",t,{unselecting:a.element}),!1):undefined}))},_mouseDrag:function(t){if(this.dragged=!0,!this.options.disabled){var i,s=this,a=this.options,n=this.opos[0],r=this.opos[1],o=t.pageX,h=t.pageY;return n>o&&(i=o,o=n,n=i),r>h&&(i=h,h=r,r=i),this.helper.css({left:n,top:r,width:o-n,height:h-r}),this.selectees.each(function(){var i=e.data(this,"selectable-item"),l=!1;i&&i.element!==s.element[0]&&("touch"===a.tolerance?l=!(i.left>o||n>i.right||i.top>h||r>i.bottom):"fit"===a.tolerance&&(l=i.left>n&&o>i.right&&i.top>r&&h>i.bottom),l?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",t,{selecting:i.element}))):(i.selecting&&((t.metaKey||t.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",t,{unselecting:i.element}))),i.selected&&(t.metaKey||t.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",t,{unselecting:i.element})))))}),!1}},_mouseStop:function(t){var i=this;return this.dragged=!1,e(".ui-unselecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",t,{unselected:s.element})}),e(".ui-selecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",t,{selected:s.element})}),this._trigger("stop",t),this.helper.remove(),!1}})})(jQuery);(function(e){function t(e,t,i){return e>t&&t+i>e}function i(e){return/left|right/.test(e.css("float"))||/inline|table-cell/.test(e.css("display"))}e.widget("ui.sortable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var e=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===e.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData(this.widgetName+"-item");return this},_setOption:function(t,i){"disabled"===t?(this.options[t]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):e.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(t,i){var s=null,a=!1,n=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(t),e(t.target).parents().each(function(){return e.data(this,n.widgetName+"-item")===n?(s=e(this),!1):undefined}),e.data(t.target,n.widgetName+"-item")===n&&(s=e(t.target)),s?!this.options.handle||i||(e(this.options.handle,s).find("*").addBack().each(function(){this===t.target&&(a=!0)}),a)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(t,i,s){var a,n,r=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,r.cursorAt&&this._adjustOffsetFromHelper(r.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),r.containment&&this._setContainment(),r.cursor&&"auto"!==r.cursor&&(n=this.document.find("body"),this.storedCursor=n.css("cursor"),n.css("cursor",r.cursor),this.storedStylesheet=e("<style>*{ cursor: "+r.cursor+" !important; }</style>").appendTo(n)),r.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",r.opacity)),r.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",r.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(a=this.containers.length-1;a>=0;a--)this.containers[a]._trigger("activate",t,this._uiHash(this));return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!r.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){var i,s,a,n,r=this.options,o=!1;for(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<r.scrollSensitivity?this.scrollParent[0].scrollTop=o=this.scrollParent[0].scrollTop+r.scrollSpeed:t.pageY-this.overflowOffset.top<r.scrollSensitivity&&(this.scrollParent[0].scrollTop=o=this.scrollParent[0].scrollTop-r.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<r.scrollSensitivity?this.scrollParent[0].scrollLeft=o=this.scrollParent[0].scrollLeft+r.scrollSpeed:t.pageX-this.overflowOffset.left<r.scrollSensitivity&&(this.scrollParent[0].scrollLeft=o=this.scrollParent[0].scrollLeft-r.scrollSpeed)):(t.pageY-e(document).scrollTop()<r.scrollSensitivity?o=e(document).scrollTop(e(document).scrollTop()-r.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<r.scrollSensitivity&&(o=e(document).scrollTop(e(document).scrollTop()+r.scrollSpeed)),t.pageX-e(document).scrollLeft()<r.scrollSensitivity?o=e(document).scrollLeft(e(document).scrollLeft()-r.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<r.scrollSensitivity&&(o=e(document).scrollLeft(e(document).scrollLeft()+r.scrollSpeed))),o!==!1&&e.ui.ddmanager&&!r.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],a=s.item[0],n=this._intersectsWithPointer(s),n&&s.instance===this.currentContainer&&a!==this.currentItem[0]&&this.placeholder[1===n?"next":"prev"]()[0]!==a&&!e.contains(this.placeholder[0],a)&&("semi-dynamic"===this.options.type?!e.contains(this.element[0],a):!0)){if(this.direction=1===n?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(t,s),this._trigger("change",t,this._uiHash());break}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,i){if(t){if(e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t),this.options.revert){var s=this,a=this.placeholder.offset(),n=this.options.axis,r={};n&&"x"!==n||(r.left=a.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),n&&"y"!==n||(r.top=a.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,e(this.helper).animate(r,parseInt(this.options.revert,10)||500,function(){s._clear(t)})}else this._clear(t,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},e(i).each(function(){var i=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[\-=_](.+)/);i&&s.push((t.key||i[1]+"[]")+"="+(t.key&&t.expression?i[1]:i[2]))}),!s.length&&t.key&&s.push(t.key+"="),s.join("&")},toArray:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},i.each(function(){s.push(e(t.item||this).attr(t.attribute||"id")||"")}),s},_intersectsWith:function(e){var t=this.positionAbs.left,i=t+this.helperProportions.width,s=this.positionAbs.top,a=s+this.helperProportions.height,n=e.left,r=n+e.width,o=e.top,h=o+e.height,l=this.offset.click.top,u=this.offset.click.left,c="x"===this.options.axis||s+l>o&&h>s+l,d="y"===this.options.axis||t+u>n&&r>t+u,p=c&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?p:t+this.helperProportions.width/2>n&&r>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>o&&h>a-this.helperProportions.height/2},_intersectsWithPointer:function(e){var i="x"===this.options.axis||t(this.positionAbs.top+this.offset.click.top,e.top,e.height),s="y"===this.options.axis||t(this.positionAbs.left+this.offset.click.left,e.left,e.width),a=i&&s,n=this._getDragVerticalDirection(),r=this._getDragHorizontalDirection();return a?this.floating?r&&"right"===r||"down"===n?2:1:n&&("down"===n?2:1):!1},_intersectsWithSides:function(e){var i=t(this.positionAbs.top+this.offset.click.top,e.top+e.height/2,e.height),s=t(this.positionAbs.left+this.offset.click.left,e.left+e.width/2,e.width),a=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&s||"left"===n&&!s:a&&("down"===a&&i||"up"===a&&!i)},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return 0!==e&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return 0!==e&&(e>0?"right":"left")},refresh:function(e){return this._refreshItems(e),this.refreshPositions(),this},_connectWith:function(){var e=this.options;return e.connectWith.constructor===String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){var i,s,a,n,r=[],o=[],h=this._connectWith();if(h&&t)for(i=h.length-1;i>=0;i--)for(a=e(h[i]),s=a.length-1;s>=0;s--)n=e.data(a[s],this.widgetFullName),n&&n!==this&&!n.options.disabled&&o.push([e.isFunction(n.options.items)?n.options.items.call(n.element):e(n.options.items,n.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),n]);for(o.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=o.length-1;i>=0;i--)o[i][0].each(function(){r.push(this)});return e(r)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=e.grep(this.items,function(e){for(var i=0;t.length>i;i++)if(t[i]===e.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[],this.containers=[this];var i,s,a,n,r,o,h,l,u=this.items,c=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(a=e(d[i]),s=a.length-1;s>=0;s--)n=e.data(a[s],this.widgetFullName),n&&n!==this&&!n.options.disabled&&(c.push([e.isFunction(n.options.items)?n.options.items.call(n.element[0],t,{item:this.currentItem}):e(n.options.items,n.element),n]),this.containers.push(n));for(i=c.length-1;i>=0;i--)for(r=c[i][1],o=c[i][0],s=0,l=o.length;l>s;s++)h=e(o[s]),h.data(this.widgetName+"-item",r),u.push({item:h,instance:r,width:0,height:0,left:0,top:0})},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,a,n;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(a=this.options.toleranceElement?e(this.options.toleranceElement,s.item):s.item,t||(s.width=a.outerWidth(),s.height=a.outerHeight()),n=a.offset(),s.left=n.left,s.top=n.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)n=this.containers[i].element.offset(),this.containers[i].containerCache.left=n.left,this.containers[i].containerCache.top=n.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(t){t=t||this;var i,s=t.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=t.currentItem[0].nodeName.toLowerCase(),a=e("<"+s+">",t.document[0]).addClass(i||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?t.currentItem.children().each(function(){e("<td>&#160;</td>",t.document[0]).attr("colspan",e(this).attr("colspan")||1).appendTo(a)}):"img"===s&&a.attr("src",t.currentItem.attr("src")),i||a.css("visibility","hidden"),a},update:function(e,a){(!i||s.forcePlaceholderSize)&&(a.height()||a.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),a.width()||a.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10)))}}),t.placeholder=e(s.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),s.placeholder.update(t,t.placeholder)},_contactContainers:function(s){var a,n,r,o,h,l,u,c,d,p,f=null,m=null;for(a=this.containers.length-1;a>=0;a--)if(!e.contains(this.currentItem[0],this.containers[a].element[0]))if(this._intersectsWith(this.containers[a].containerCache)){if(f&&e.contains(this.containers[a].element[0],f.element[0]))continue;f=this.containers[a],m=a}else this.containers[a].containerCache.over&&(this.containers[a]._trigger("out",s,this._uiHash(this)),this.containers[a].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[m].containerCache.over||(this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1);else{for(r=1e4,o=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",u=this.positionAbs[h]+this.offset.click[h],n=this.items.length-1;n>=0;n--)e.contains(this.containers[m].element[0],this.items[n].item[0])&&this.items[n].item[0]!==this.currentItem[0]&&(!p||t(this.positionAbs.top+this.offset.click.top,this.items[n].top,this.items[n].height))&&(c=this.items[n].item.offset()[h],d=!1,Math.abs(c-u)>Math.abs(c+this.items[n][l]-u)&&(d=!0,c+=this.items[n][l]),r>Math.abs(c-u)&&(r=Math.abs(c-u),o=this.items[n],this.direction=d?"up":"down"));if(!o&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[m])return;o?this._rearrange(s,o,null,!0):this._rearrange(s,null,this.containers[m].element,!0),this._trigger("change",s,this._uiHash()),this.containers[m]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[m],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1}},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||e("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,a=this.options;"parent"===a.containment&&(a.containment=this.helper[0].parentNode),("document"===a.containment||"window"===a.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e("document"===a.containment?document:window).width()-this.helperProportions.width-this.margins.left,(e("document"===a.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(a.containment)||(t=e(a.containment)[0],i=e(a.containment).offset(),s="hidden"!==e(t).css("overflow"),this.containment=[i.left+(parseInt(e(t).css("borderLeftWidth"),10)||0)+(parseInt(e(t).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(e(t).css("borderTopWidth"),10)||0)+(parseInt(e(t).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(e(t).css("borderLeftWidth"),10)||0)-(parseInt(e(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(e(t).css("borderTopWidth"),10)||0)-(parseInt(e(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,a="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,n=/(html|body)/i.test(a[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():n?0:a.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():n?0:a.scrollLeft())*s}},_generatePosition:function(t){var i,s,a=this.options,n=t.pageX,r=t.pageY,o="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(o[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(n=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(r=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(n=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(r=this.containment[3]+this.offset.click.top)),a.grid&&(i=this.originalPageY+Math.round((r-this.originalPageY)/a.grid[1])*a.grid[1],r=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-a.grid[1]:i+a.grid[1]:i,s=this.originalPageX+Math.round((n-this.originalPageX)/a.grid[0])*a.grid[0],n=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-a.grid[0]:s+a.grid[0]:s)),{top:r-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:o.scrollTop()),left:n-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:o.scrollLeft())}},_rearrange:function(e,t,i,s){i?i[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var a=this.counter;this._delay(function(){a===this.counter&&this.refreshPositions(!s)})},_clear:function(e,t){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!t&&s.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||t||s.push(function(e){this._trigger("update",e,this._uiHash())}),this!==this.currentContainer&&(t||(s.push(function(e){this._trigger("remove",e,this._uiHash())}),s.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)t||s.push(function(e){return function(t){e._trigger("deactivate",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(e){return function(t){e._trigger("out",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!t){for(this._trigger("beforeStop",e,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!1}if(t||this._trigger("beforeStop",e,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!t){for(i=0;s.length>i;i++)s[i].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var i=t||this;return{helper:i.helper,placeholder:i.placeholder||e([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:t?t.element:null}}})})(jQuery);(function(e){var t=0,i={},a={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",a.height=a.paddingTop=a.paddingBottom=a.borderTopWidth=a.borderBottomWidth="show",e.widget("ui.accordion",{version:"1.10.3",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var t=this.options;this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),t.collapsible||t.active!==!1&&null!=t.active||(t.active=0),this._processPanels(),0>t.active&&(t.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():e(),content:this.active.length?this.active.next():e()}},_createIcons:function(){var t=this.options.icons;t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var e;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),e=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&e.css("height","")},_setOption:function(e,t){return"active"===e?(this._activate(t),undefined):("event"===e&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),"collapsible"!==e||t||this.options.active!==!1||this._activate(0),"icons"===e&&(this._destroyIcons(),t&&this._createIcons()),"disabled"===e&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t),undefined)},_keydown:function(t){if(!t.altKey&&!t.ctrlKey){var i=e.ui.keyCode,a=this.headers.length,s=this.headers.index(t.target),n=!1;switch(t.keyCode){case i.RIGHT:case i.DOWN:n=this.headers[(s+1)%a];break;case i.LEFT:case i.UP:n=this.headers[(s-1+a)%a];break;case i.SPACE:case i.ENTER:this._eventHandler(t);break;case i.HOME:n=this.headers[0];break;case i.END:n=this.headers[a-1]}n&&(e(t.target).attr("tabIndex",-1),e(n).attr("tabIndex",0),n.focus(),t.preventDefault())}},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus()},refresh:function(){var t=this.options;this._processPanels(),t.active===!1&&t.collapsible===!0||!this.headers.length?(t.active=!1,this.active=e()):t.active===!1?this._activate(0):this.active.length&&!e.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(t.active=!1,this.active=e()):this._activate(Math.max(0,t.active-1)):t.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,a=this.options,s=a.heightStyle,n=this.element.parent(),r=this.accordionId="ui-accordion-"+(this.element.attr("id")||++t);this.active=this._findActive(a.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(t){var i=e(this),a=i.attr("id"),s=i.next(),n=s.attr("id");a||(a=r+"-header-"+t,i.attr("id",a)),n||(n=r+"-panel-"+t,s.attr("id",n)),i.attr("aria-controls",n),s.attr("aria-labelledby",a)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(a.event),"fill"===s?(i=n.height(),this.element.siblings(":visible").each(function(){var t=e(this),a=t.css("position");"absolute"!==a&&"fixed"!==a&&(i-=t.outerHeight(!0))}),this.headers.each(function(){i-=e(this).outerHeight(!0)}),this.headers.next().each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===s&&(i=0,this.headers.next().each(function(){i=Math.max(i,e(this).css("height","").height())}).height(i))},_activate:function(t){var i=this._findActive(t)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return"number"==typeof t?this.headers.eq(t):e()},_setupEvents:function(t){var i={keydown:"_keydown"};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(t){var i=this.options,a=this.active,s=e(t.currentTarget),n=s[0]===a[0],r=n&&i.collapsible,o=r?e():s.next(),h=a.next(),l={oldHeader:a,oldPanel:h,newHeader:r?e():s,newPanel:o};t.preventDefault(),n&&!i.collapsible||this._trigger("beforeActivate",t,l)===!1||(i.active=r?!1:this.headers.index(s),this.active=n?e():s,this._toggle(l),a.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&a.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),n||(s.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),s.next().addClass("ui-accordion-content-active")))},_toggle:function(t){var i=t.newPanel,a=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=a,this.options.animate?this._animate(i,a,t):(a.hide(),i.show(),this._toggleComplete(t)),a.attr({"aria-expanded":"false","aria-hidden":"true"}),a.prev().attr("aria-selected","false"),i.length&&a.length?a.prev().attr("tabIndex",-1):i.length&&this.headers.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(e,t,s){var n,r,o,h=this,l=0,u=e.length&&(!t.length||e.index()<t.index()),d=this.options.animate||{},c=u&&d.down||d,p=function(){h._toggleComplete(s)};return"number"==typeof c&&(o=c),"string"==typeof c&&(r=c),r=r||c.easing||d.easing,o=o||c.duration||d.duration,t.length?e.length?(n=e.show().outerHeight(),t.animate(i,{duration:o,easing:r,step:function(e,t){t.now=Math.round(e)}}),e.hide().animate(a,{duration:o,easing:r,complete:p,step:function(e,i){i.now=Math.round(e),"height"!==i.prop?l+=i.now:"content"!==h.options.heightStyle&&(i.now=Math.round(n-t.outerHeight()-l),l=0)}}),undefined):t.animate(i,o,r,p):e.animate(a,o,r,p)},_toggleComplete:function(e){var t=e.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e)}})})(jQuery);(function(e){var t=0;e.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var t,i,a,s=this.element[0].nodeName.toLowerCase(),n="textarea"===s,r="input"===s;this.isMultiLine=n?!0:r?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[n||r?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(s){if(this.element.prop("readOnly"))return t=!0,a=!0,i=!0,undefined;t=!1,a=!1,i=!1;var n=e.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:t=!0,this._move("previousPage",s);break;case n.PAGE_DOWN:t=!0,this._move("nextPage",s);break;case n.UP:t=!0,this._keyEvent("previous",s);break;case n.DOWN:t=!0,this._keyEvent("next",s);break;case n.ENTER:case n.NUMPAD_ENTER:this.menu.active&&(t=!0,s.preventDefault(),this.menu.select(s));break;case n.TAB:this.menu.active&&this.menu.select(s);break;case n.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(s),s.preventDefault());break;default:i=!0,this._searchTimeout(s)}},keypress:function(a){if(t)return t=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&a.preventDefault(),undefined;if(!i){var s=e.ui.keyCode;switch(a.keyCode){case s.PAGE_UP:this._move("previousPage",a);break;case s.PAGE_DOWN:this._move("nextPage",a);break;case s.UP:this._keyEvent("previous",a);break;case s.DOWN:this._keyEvent("next",a)}}},input:function(e){return a?(a=!1,e.preventDefault(),undefined):(this._searchTimeout(e),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(e),this._change(e),undefined)}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(a){a.target===t.element[0]||a.target===i||e.contains(i,a.target)||t.close()})})},menufocus:function(t,i){if(this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent)}),undefined;var a=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",t,{item:a})?t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(a.value):this.liveRegion.text(a.value)},menuselect:function(e,t){var i=t.item.data("ui-autocomplete-item"),a=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=a,this._delay(function(){this.previous=a,this.selectedItem=i})),!1!==this._trigger("select",e,{item:i})&&this._value(i.value),this.term=this._value(),this.close(e),this.selectedItem=i}}),this.liveRegion=e("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(e,t){this._super(e,t),"source"===e&&this._initSource(),"appendTo"===e&&this.menu.element.appendTo(this._appendTo()),"disabled"===e&&t&&this.xhr&&this.xhr.abort()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?e(t):this.document.find(t).eq(0)),t||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_initSource:function(){var t,i,a=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(i,a){a(e.ui.autocomplete.filter(t,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(t,s){a.xhr&&a.xhr.abort(),a.xhr=e.ajax({url:i,data:t,dataType:"json",success:function(e){s(e)},error:function(){s([])}})}):this.source=this.options.source},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,e))},this.options.delay)},search:function(e,t){return e=null!=e?e:this._value(),this.term=this._value(),e.length<this.options.minLength?this.close(t):this._trigger("search",t)!==!1?this._search(e):undefined},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response())},_response:function(){var e=this,i=++t;return function(a){i===t&&e.__response(a),e.pending--,e.pending||e.element.removeClass("ui-autocomplete-loading")}},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close()},close:function(e){this.cancelSearch=!0,this._close(e)},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e))},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return"string"==typeof t?{label:t,value:t}:e.extend({label:t.label||t.value,value:t.value||t.label},t)})},_suggest:function(t){var i=this.menu.element.empty();this._renderMenu(i,t),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var a=this;e.each(i,function(e,i){a._renderItemData(t,i)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t)},_renderItem:function(t,i){return e("<li>").append(e("<a>").text(i.label)).appendTo(t)},_move:function(e,t){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[e](t),undefined):(this.search(null,t),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(e,t){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(e,t),t.preventDefault())}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,i){var a=RegExp(e.ui.autocomplete.escapeRegex(i),"i");return e.grep(t,function(e){return a.test(e.label||e.value||e)})}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(e){var t;this._superApply(arguments),this.options.disabled||this.cancelSearch||(t=e&&e.length?this.options.messages.results(e.length):this.options.messages.noResults,this.liveRegion.text(t))}})})(jQuery);(function(e){var t,i,a,s,n="ui-button ui-widget ui-state-default ui-corner-all",r="ui-state-hover ui-state-active ",o="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var t=e(this);setTimeout(function(){t.find(":ui-button").button("refresh")},1)},l=function(t){var i=t.name,a=t.form,s=e([]);return i&&(i=i.replace(/'/g,"\\'"),s=a?e(a).find("[name='"+i+"']"):e("[name='"+i+"']",t.ownerDocument).filter(function(){return!this.form})),s};e.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var r=this,o=this.options,u="checkbox"===this.type||"radio"===this.type,d=u?"":"ui-state-active",c="ui-state-focus";null===o.label&&(o.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(n).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){o.disabled||this===t&&e(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){o.disabled||e(this).removeClass(d)}).bind("click"+this.eventNamespace,function(e){o.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){r.buttonElement.addClass(c)}).bind("blur"+this.eventNamespace,function(){r.buttonElement.removeClass(c)}),u&&(this.element.bind("change"+this.eventNamespace,function(){s||r.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(e){o.disabled||(s=!1,i=e.pageX,a=e.pageY)}).bind("mouseup"+this.eventNamespace,function(e){o.disabled||(i!==e.pageX||a!==e.pageY)&&(s=!0)})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return o.disabled||s?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(o.disabled||s)return!1;e(this).addClass("ui-state-active"),r.buttonElement.attr("aria-pressed","true");var t=r.element[0];l(t).not(t).map(function(){return e(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return o.disabled?!1:(e(this).addClass("ui-state-active"),t=this,r.document.one("mouseup",function(){t=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return o.disabled?!1:(e(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(t){return o.disabled?!1:((t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){e(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click()})),this._setOption("disabled",o.disabled),this._resetButton()},_determineButtonType:function(){var e,t,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(n+" "+r+" "+o).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(e,t){return this._super(e,t),"disabled"===e?(t?this.element.prop("disabled",!0):this.element.prop("disabled",!1),undefined):(this._resetButton(),undefined)},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t),"radio"===this.type?l(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var t=this.buttonElement.removeClass(o),i=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),a=this.options.icons,s=a.primary&&a.secondary,n=[];a.primary||a.secondary?(this.options.text&&n.push("ui-button-text-icon"+(s?"s":a.primary?"-primary":"-secondary")),a.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+a.primary+"'></span>"),a.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+a.secondary+"'></span>"),this.options.text||(n.push(s?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(i)))):n.push("ui-button-text-only"),t.addClass(n.join(" "))}}),e.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(e,t){"disabled"===e&&this.buttons.button("option",e,t),this._super(e,t)},refresh:function(){var t="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})})(jQuery);(function(e,t){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},e.extend(this._defaults,this.regional[""]),this.dpDiv=a(e("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function a(t){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return t.delegate(i,"mouseout",function(){e(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){e.datepicker._isDisabledDatepicker(n.inline?t.parent()[0]:n.input[0])||(e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),e(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).addClass("ui-datepicker-next-hover"))})}function s(t,i){e.extend(t,i);for(var a in i)null==i[a]&&(t[a]=i[a]);return t}e.extend(e.ui,{datepicker:{version:"1.10.3"}});var n,r="datepicker";e.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return s(this._defaults,e||{}),this},_attachDatepicker:function(t,i){var a,s,n;a=t.nodeName.toLowerCase(),s="div"===a||"span"===a,t.id||(this.uuid+=1,t.id="dp"+this.uuid),n=this._newInst(e(t),s),n.settings=e.extend({},i||{}),"input"===a?this._connectDatepicker(t,n):s&&this._inlineDatepicker(t,n)},_newInst:function(t,i){var s=t[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:t,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?a(e("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(t,i){var a=e(t);i.append=e([]),i.trigger=e([]),a.hasClass(this.markerClassName)||(this._attachments(a,i),a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),e.data(t,r,i),i.settings.disabled&&this._disableDatepicker(t))},_attachments:function(t,i){var a,s,n,r=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove(),r&&(i.append=e("<span class='"+this._appendClass+"'>"+r+"</span>"),t[o?"before":"after"](i.append)),t.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),a=this._get(i,"showOn"),("focus"===a||"both"===a)&&t.focus(this._showDatepicker),("button"===a||"both"===a)&&(s=this._get(i,"buttonText"),n=this._get(i,"buttonImage"),i.trigger=e(this._get(i,"buttonImageOnly")?e("<img/>").addClass(this._triggerClass).attr({src:n,alt:s,title:s}):e("<button type='button'></button>").addClass(this._triggerClass).html(n?e("<img/>").attr({src:n,alt:s,title:s}):s)),t[o?"before":"after"](i.trigger),i.trigger.click(function(){return e.datepicker._datepickerShowing&&e.datepicker._lastInput===t[0]?e.datepicker._hideDatepicker():e.datepicker._datepickerShowing&&e.datepicker._lastInput!==t[0]?(e.datepicker._hideDatepicker(),e.datepicker._showDatepicker(t[0])):e.datepicker._showDatepicker(t[0]),!1}))},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t,i,a,s,n=new Date(2009,11,20),r=this._get(e,"dateFormat");r.match(/[DM]/)&&(t=function(e){for(i=0,a=0,s=0;e.length>s;s++)e[s].length>i&&(i=e[s].length,a=s);return a},n.setMonth(t(this._get(e,r.match(/MM/)?"monthNames":"monthNamesShort"))),n.setDate(t(this._get(e,r.match(/DD/)?"dayNames":"dayNamesShort"))+20-n.getDay())),e.input.attr("size",this._formatDate(e,n).length)}},_inlineDatepicker:function(t,i){var a=e(t);a.hasClass(this.markerClassName)||(a.addClass(this.markerClassName).append(i.dpDiv),e.data(t,r,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(t),i.dpDiv.css("display","block"))},_dialogDatepicker:function(t,i,a,n,o){var h,l,u,d,c,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=e("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),e("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},e.data(this._dialogInput[0],r,p)),s(p.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(l=document.documentElement.clientWidth,u=document.documentElement.clientHeight,d=document.documentElement.scrollLeft||document.body.scrollLeft,c=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+d,u/2-150+c]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=a,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),e.blockUI&&e.blockUI(this.dpDiv),e.data(this._dialogInput[0],r,p),this},_destroyDatepicker:function(t){var i,a=e(t),s=e.data(t,r);a.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),e.removeData(t,r),"input"===i?(s.append.remove(),s.trigger.remove(),a.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&a.removeClass(this.markerClassName).empty())},_enableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!1,n.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().removeClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}))},_disableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!0,n.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().addClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;this._disabledInputs.length>t;t++)if(this._disabledInputs[t]===e)return!0;return!1},_getInst:function(t){try{return e.data(t,r)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,a,n){var r,o,h,l,u=this._getInst(i);return 2===arguments.length&&"string"==typeof a?"defaults"===a?e.extend({},e.datepicker._defaults):u?"all"===a?e.extend({},u.settings):this._get(u,a):null:(r=a||{},"string"==typeof a&&(r={},r[a]=n),u&&(this._curInst===u&&this._hideDatepicker(),o=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(u,"min"),l=this._getMinMaxDate(u,"max"),s(u.settings,r),null!==h&&r.dateFormat!==t&&r.minDate===t&&(u.settings.minDate=this._formatDate(u,h)),null!==l&&r.dateFormat!==t&&r.maxDate===t&&(u.settings.maxDate=this._formatDate(u,l)),"disabled"in r&&(r.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(e(i),u),this._autoSize(u),this._setDate(u,o),this._updateAlternate(u),this._updateDatepicker(u)),t)},_changeDatepicker:function(e,t,i){this._optionDatepicker(e,t,i)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var i=this._getInst(e);i&&(this._setDate(i,t),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(e,t){var i=this._getInst(e);return i&&!i.inline&&this._setDateFromField(i,t),i?this._getDate(i):null},_doKeyDown:function(t){var i,a,s,n=e.datepicker._getInst(t.target),r=!0,o=n.dpDiv.is(".ui-datepicker-rtl");if(n._keyEvent=!0,e.datepicker._datepickerShowing)switch(t.keyCode){case 9:e.datepicker._hideDatepicker(),r=!1;break;case 13:return s=e("td."+e.datepicker._dayOverClass+":not(."+e.datepicker._currentClass+")",n.dpDiv),s[0]&&e.datepicker._selectDay(t.target,n.selectedMonth,n.selectedYear,s[0]),i=e.datepicker._get(n,"onSelect"),i?(a=e.datepicker._formatDate(n),i.apply(n.input?n.input[0]:null,[a,n])):e.datepicker._hideDatepicker(),!1;case 27:e.datepicker._hideDatepicker();break;case 33:e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 34:e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 35:(t.ctrlKey||t.metaKey)&&e.datepicker._clearDate(t.target),r=t.ctrlKey||t.metaKey;break;case 36:(t.ctrlKey||t.metaKey)&&e.datepicker._gotoToday(t.target),r=t.ctrlKey||t.metaKey;break;case 37:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?1:-1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 38:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,-7,"D"),r=t.ctrlKey||t.metaKey;break;case 39:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?-1:1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 40:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,7,"D"),r=t.ctrlKey||t.metaKey;break;default:r=!1}else 36===t.keyCode&&t.ctrlKey?e.datepicker._showDatepicker(this):r=!1;r&&(t.preventDefault(),t.stopPropagation())},_doKeyPress:function(i){var a,s,n=e.datepicker._getInst(i.target);return e.datepicker._get(n,"constrainInput")?(a=e.datepicker._possibleChars(e.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">s||!a||a.indexOf(s)>-1):t},_doKeyUp:function(t){var i,a=e.datepicker._getInst(t.target);if(a.input.val()!==a.lastVal)try{i=e.datepicker.parseDate(e.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,e.datepicker._getFormatConfig(a)),i&&(e.datepicker._setDateFromField(a),e.datepicker._updateAlternate(a),e.datepicker._updateDatepicker(a))}catch(s){}return!0},_showDatepicker:function(t){if(t=t.target||t,"input"!==t.nodeName.toLowerCase()&&(t=e("input",t.parentNode)[0]),!e.datepicker._isDisabledDatepicker(t)&&e.datepicker._lastInput!==t){var i,a,n,r,o,h,l;i=e.datepicker._getInst(t),e.datepicker._curInst&&e.datepicker._curInst!==i&&(e.datepicker._curInst.dpDiv.stop(!0,!0),i&&e.datepicker._datepickerShowing&&e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),a=e.datepicker._get(i,"beforeShow"),n=a?a.apply(t,[t,i]):{},n!==!1&&(s(i.settings,n),i.lastVal=null,e.datepicker._lastInput=t,e.datepicker._setDateFromField(i),e.datepicker._inDialog&&(t.value=""),e.datepicker._pos||(e.datepicker._pos=e.datepicker._findPos(t),e.datepicker._pos[1]+=t.offsetHeight),r=!1,e(t).parents().each(function(){return r|="fixed"===e(this).css("position"),!r}),o={left:e.datepicker._pos[0],top:e.datepicker._pos[1]},e.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),e.datepicker._updateDatepicker(i),o=e.datepicker._checkOffset(i,o,r),i.dpDiv.css({position:e.datepicker._inDialog&&e.blockUI?"static":r?"fixed":"absolute",display:"none",left:o.left+"px",top:o.top+"px"}),i.inline||(h=e.datepicker._get(i,"showAnim"),l=e.datepicker._get(i,"duration"),i.dpDiv.zIndex(e(t).zIndex()+1),e.datepicker._datepickerShowing=!0,e.effects&&e.effects.effect[h]?i.dpDiv.show(h,e.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),e.datepicker._shouldFocusInput(i)&&i.input.focus(),e.datepicker._curInst=i))}},_updateDatepicker:function(t){this.maxRows=4,n=t,t.dpDiv.empty().append(this._generateHTML(t)),this._attachHandlers(t),t.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,a=this._getNumberOfMonths(t),s=a[1],r=17;t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),s>1&&t.dpDiv.addClass("ui-datepicker-multi-"+s).css("width",r*s+"em"),t.dpDiv[(1!==a[0]||1!==a[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),t.dpDiv[(this._get(t,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),t===e.datepicker._curInst&&e.datepicker._datepickerShowing&&e.datepicker._shouldFocusInput(t)&&t.input.focus(),t.yearshtml&&(i=t.yearshtml,setTimeout(function(){i===t.yearshtml&&t.yearshtml&&t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml),i=t.yearshtml=null},0))},_shouldFocusInput:function(e){return e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&!e.input.is(":focus")},_checkOffset:function(t,i,a){var s=t.dpDiv.outerWidth(),n=t.dpDiv.outerHeight(),r=t.input?t.input.outerWidth():0,o=t.input?t.input.outerHeight():0,h=document.documentElement.clientWidth+(a?0:e(document).scrollLeft()),l=document.documentElement.clientHeight+(a?0:e(document).scrollTop());return i.left-=this._get(t,"isRTL")?s-r:0,i.left-=a&&i.left===t.input.offset().left?e(document).scrollLeft():0,i.top-=a&&i.top===t.input.offset().top+o?e(document).scrollTop():0,i.left-=Math.min(i.left,i.left+s>h&&h>s?Math.abs(i.left+s-h):0),i.top-=Math.min(i.top,i.top+n>l&&l>n?Math.abs(n+o):0),i},_findPos:function(t){for(var i,a=this._getInst(t),s=this._get(a,"isRTL");t&&("hidden"===t.type||1!==t.nodeType||e.expr.filters.hidden(t));)t=t[s?"previousSibling":"nextSibling"];return i=e(t).offset(),[i.left,i.top]},_hideDatepicker:function(t){var i,a,s,n,o=this._curInst;!o||t&&o!==e.data(t,r)||this._datepickerShowing&&(i=this._get(o,"showAnim"),a=this._get(o,"duration"),s=function(){e.datepicker._tidyDialog(o)},e.effects&&(e.effects.effect[i]||e.effects[i])?o.dpDiv.hide(i,e.datepicker._get(o,"showOptions"),a,s):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?a:null,s),i||s(),this._datepickerShowing=!1,n=this._get(o,"onClose"),n&&n.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),e.blockUI&&(e.unblockUI(),e("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(t){if(e.datepicker._curInst){var i=e(t.target),a=e.datepicker._getInst(i[0]);(i[0].id!==e.datepicker._mainDivId&&0===i.parents("#"+e.datepicker._mainDivId).length&&!i.hasClass(e.datepicker.markerClassName)&&!i.closest("."+e.datepicker._triggerClass).length&&e.datepicker._datepickerShowing&&(!e.datepicker._inDialog||!e.blockUI)||i.hasClass(e.datepicker.markerClassName)&&e.datepicker._curInst!==a)&&e.datepicker._hideDatepicker()}},_adjustDate:function(t,i,a){var s=e(t),n=this._getInst(s[0]);this._isDisabledDatepicker(s[0])||(this._adjustInstDate(n,i+("M"===a?this._get(n,"showCurrentAtPos"):0),a),this._updateDatepicker(n))},_gotoToday:function(t){var i,a=e(t),s=this._getInst(a[0]);this._get(s,"gotoCurrent")&&s.currentDay?(s.selectedDay=s.currentDay,s.drawMonth=s.selectedMonth=s.currentMonth,s.drawYear=s.selectedYear=s.currentYear):(i=new Date,s.selectedDay=i.getDate(),s.drawMonth=s.selectedMonth=i.getMonth(),s.drawYear=s.selectedYear=i.getFullYear()),this._notifyChange(s),this._adjustDate(a)},_selectMonthYear:function(t,i,a){var s=e(t),n=this._getInst(s[0]);n["selected"+("M"===a?"Month":"Year")]=n["draw"+("M"===a?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(n),this._adjustDate(s)},_selectDay:function(t,i,a,s){var n,r=e(t);e(s).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||(n=this._getInst(r[0]),n.selectedDay=n.currentDay=e("a",s).html(),n.selectedMonth=n.currentMonth=i,n.selectedYear=n.currentYear=a,this._selectDate(t,this._formatDate(n,n.currentDay,n.currentMonth,n.currentYear)))},_clearDate:function(t){var i=e(t);this._selectDate(i,"")},_selectDate:function(t,i){var a,s=e(t),n=this._getInst(s[0]);i=null!=i?i:this._formatDate(n),n.input&&n.input.val(i),this._updateAlternate(n),a=this._get(n,"onSelect"),a?a.apply(n.input?n.input[0]:null,[i,n]):n.input&&n.input.trigger("change"),n.inline?this._updateDatepicker(n):(this._hideDatepicker(),this._lastInput=n.input[0],"object"!=typeof n.input[0]&&n.input.focus(),this._lastInput=null)},_updateAlternate:function(t){var i,a,s,n=this._get(t,"altField");n&&(i=this._get(t,"altFormat")||this._get(t,"dateFormat"),a=this._getDate(t),s=this.formatDate(i,a,this._getFormatConfig(t)),e(n).each(function(){e(this).val(s)}))},noWeekends:function(e){var t=e.getDay();return[t>0&&6>t,""]},iso8601Week:function(e){var t,i=new Date(e.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),t=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((t-i)/864e5)/7)+1},parseDate:function(i,a,s){if(null==i||null==a)throw"Invalid arguments";if(a="object"==typeof a?""+a:a+"",""===a)return null;var n,r,o,h,l=0,u=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,d="string"!=typeof u?u:(new Date).getFullYear()%100+parseInt(u,10),c=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,p=(s?s.dayNames:null)||this._defaults.dayNames,m=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,f=(s?s.monthNames:null)||this._defaults.monthNames,g=-1,v=-1,y=-1,b=-1,_=!1,k=function(e){var t=i.length>n+1&&i.charAt(n+1)===e;return t&&n++,t},x=function(e){var t=k(e),i="@"===e?14:"!"===e?20:"y"===e&&t?4:"o"===e?3:2,s=RegExp("^\\d{1,"+i+"}"),n=a.substring(l).match(s);if(!n)throw"Missing number at position "+l;return l+=n[0].length,parseInt(n[0],10)},D=function(i,s,n){var r=-1,o=e.map(k(i)?n:s,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)});if(e.each(o,function(e,i){var s=i[1];return a.substr(l,s.length).toLowerCase()===s.toLowerCase()?(r=i[0],l+=s.length,!1):t}),-1!==r)return r+1;throw"Unknown name at position "+l},w=function(){if(a.charAt(l)!==i.charAt(n))throw"Unexpected literal at position "+l;l++};for(n=0;i.length>n;n++)if(_)"'"!==i.charAt(n)||k("'")?w():_=!1;else switch(i.charAt(n)){case"d":y=x("d");break;case"D":D("D",c,p);break;case"o":b=x("o");break;case"m":v=x("m");break;case"M":v=D("M",m,f);break;case"y":g=x("y");break;case"@":h=new Date(x("@")),g=h.getFullYear(),v=h.getMonth()+1,y=h.getDate();break;case"!":h=new Date((x("!")-this._ticksTo1970)/1e4),g=h.getFullYear(),v=h.getMonth()+1,y=h.getDate();break;case"'":k("'")?w():_=!0;break;default:w()}if(a.length>l&&(o=a.substr(l),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(d>=g?0:-100)),b>-1)for(v=1,y=b;;){if(r=this._getDaysInMonth(g,v-1),r>=y)break;v++,y-=r}if(h=this._daylightSavingAdjust(new Date(g,v-1,y)),h.getFullYear()!==g||h.getMonth()+1!==v||h.getDate()!==y)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(e,t,i){if(!t)return"";var a,s=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,n=(i?i.dayNames:null)||this._defaults.dayNames,r=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,o=(i?i.monthNames:null)||this._defaults.monthNames,h=function(t){var i=e.length>a+1&&e.charAt(a+1)===t;return i&&a++,i},l=function(e,t,i){var a=""+t;if(h(e))for(;i>a.length;)a="0"+a;return a},u=function(e,t,i,a){return h(e)?a[t]:i[t]},d="",c=!1;if(t)for(a=0;e.length>a;a++)if(c)"'"!==e.charAt(a)||h("'")?d+=e.charAt(a):c=!1;else switch(e.charAt(a)){case"d":d+=l("d",t.getDate(),2);break;case"D":d+=u("D",t.getDay(),s,n);break;case"o":d+=l("o",Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5),3);break;case"m":d+=l("m",t.getMonth()+1,2);break;case"M":d+=u("M",t.getMonth(),r,o);break;case"y":d+=h("y")?t.getFullYear():(10>t.getYear()%100?"0":"")+t.getYear()%100;break;case"@":d+=t.getTime();break;case"!":d+=1e4*t.getTime()+this._ticksTo1970;break;case"'":h("'")?d+="'":c=!0;break;default:d+=e.charAt(a)}return d},_possibleChars:function(e){var t,i="",a=!1,s=function(i){var a=e.length>t+1&&e.charAt(t+1)===i;return a&&t++,a};for(t=0;e.length>t;t++)if(a)"'"!==e.charAt(t)||s("'")?i+=e.charAt(t):a=!1;else switch(e.charAt(t)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":s("'")?i+="'":a=!0;break;default:i+=e.charAt(t)}return i},_get:function(e,i){return e.settings[i]!==t?e.settings[i]:this._defaults[i]},_setDateFromField:function(e,t){if(e.input.val()!==e.lastVal){var i=this._get(e,"dateFormat"),a=e.lastVal=e.input?e.input.val():null,s=this._getDefaultDate(e),n=s,r=this._getFormatConfig(e);try{n=this.parseDate(i,a,r)||s}catch(o){a=t?"":a}e.selectedDay=n.getDate(),e.drawMonth=e.selectedMonth=n.getMonth(),e.drawYear=e.selectedYear=n.getFullYear(),e.currentDay=a?n.getDate():0,e.currentMonth=a?n.getMonth():0,e.currentYear=a?n.getFullYear():0,this._adjustInstDate(e)}},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(t,i,a){var s=function(e){var t=new Date;return t.setDate(t.getDate()+e),t},n=function(i){try{return e.datepicker.parseDate(e.datepicker._get(t,"dateFormat"),i,e.datepicker._getFormatConfig(t))}catch(a){}for(var s=(i.toLowerCase().match(/^c/)?e.datepicker._getDate(t):null)||new Date,n=s.getFullYear(),r=s.getMonth(),o=s.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":o+=parseInt(l[1],10);break;case"w":case"W":o+=7*parseInt(l[1],10);break;case"m":case"M":r+=parseInt(l[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r));break;case"y":case"Y":n+=parseInt(l[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r))}l=h.exec(i)}return new Date(n,r,o)},r=null==i||""===i?a:"string"==typeof i?n(i):"number"==typeof i?isNaN(i)?a:s(i):new Date(i.getTime());return r=r&&"Invalid Date"==""+r?a:r,r&&(r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0)),this._daylightSavingAdjust(r)},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},_setDate:function(e,t,i){var a=!t,s=e.selectedMonth,n=e.selectedYear,r=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=r.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=r.getMonth(),e.drawYear=e.selectedYear=e.currentYear=r.getFullYear(),s===e.selectedMonth&&n===e.selectedYear||i||this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(a?"":this._formatDate(e))},_getDate:function(e){var t=!e.currentYear||e.input&&""===e.input.val()?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return t},_attachHandlers:function(t){var i=this._get(t,"stepMonths"),a="#"+t.id.replace(/\\\\/g,"\\");t.dpDiv.find("[data-handler]").map(function(){var t={prev:function(){e.datepicker._adjustDate(a,-i,"M")},next:function(){e.datepicker._adjustDate(a,+i,"M")},hide:function(){e.datepicker._hideDatepicker()},today:function(){e.datepicker._gotoToday(a)},selectDay:function(){return e.datepicker._selectDay(a,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return e.datepicker._selectMonthYear(a,this,"M"),!1},selectYear:function(){return e.datepicker._selectMonthYear(a,this,"Y"),!1}};e(this).bind(this.getAttribute("data-event"),t[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t,i,a,s,n,r,o,h,l,u,d,c,p,m,f,g,v,y,b,_,k,x,D,w,T,M,S,N,C,A,P,I,F,j,H,E,z,L,O,R=new Date,W=this._daylightSavingAdjust(new Date(R.getFullYear(),R.getMonth(),R.getDate())),Y=this._get(e,"isRTL"),J=this._get(e,"showButtonPanel"),$=this._get(e,"hideIfNoPrevNext"),Q=this._get(e,"navigationAsDateFormat"),B=this._getNumberOfMonths(e),K=this._get(e,"showCurrentAtPos"),V=this._get(e,"stepMonths"),U=1!==B[0]||1!==B[1],G=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),q=this._getMinMaxDate(e,"min"),X=this._getMinMaxDate(e,"max"),Z=e.drawMonth-K,et=e.drawYear;if(0>Z&&(Z+=12,et--),X)for(t=this._daylightSavingAdjust(new Date(X.getFullYear(),X.getMonth()-B[0]*B[1]+1,X.getDate())),t=q&&q>t?q:t;this._daylightSavingAdjust(new Date(et,Z,1))>t;)Z--,0>Z&&(Z=11,et--);for(e.drawMonth=Z,e.drawYear=et,i=this._get(e,"prevText"),i=Q?this.formatDate(i,this._daylightSavingAdjust(new Date(et,Z-V,1)),this._getFormatConfig(e)):i,a=this._canAdjustMonth(e,-1,et,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":$?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",s=this._get(e,"nextText"),s=Q?this.formatDate(s,this._daylightSavingAdjust(new Date(et,Z+V,1)),this._getFormatConfig(e)):s,n=this._canAdjustMonth(e,1,et,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+s+"</span></a>":$?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+s+"</span></a>",r=this._get(e,"currentText"),o=this._get(e,"gotoCurrent")&&e.currentDay?G:W,r=Q?this.formatDate(r,o,this._getFormatConfig(e)):r,h=e.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(e,"closeText")+"</button>",l=J?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(e,o)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+r+"</button>":"")+(Y?"":h)+"</div>":"",u=parseInt(this._get(e,"firstDay"),10),u=isNaN(u)?0:u,d=this._get(e,"showWeek"),c=this._get(e,"dayNames"),p=this._get(e,"dayNamesMin"),m=this._get(e,"monthNames"),f=this._get(e,"monthNamesShort"),g=this._get(e,"beforeShowDay"),v=this._get(e,"showOtherMonths"),y=this._get(e,"selectOtherMonths"),b=this._getDefaultDate(e),_="",x=0;B[0]>x;x++){for(D="",this.maxRows=4,w=0;B[1]>w;w++){if(T=this._daylightSavingAdjust(new Date(et,Z,e.selectedDay)),M=" ui-corner-all",S="",U){if(S+="<div class='ui-datepicker-group",B[1]>1)switch(w){case 0:S+=" ui-datepicker-group-first",M=" ui-corner-"+(Y?"right":"left");break;case B[1]-1:S+=" ui-datepicker-group-last",M=" ui-corner-"+(Y?"left":"right");break;default:S+=" ui-datepicker-group-middle",M=""}S+="'>"}for(S+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+M+"'>"+(/all|left/.test(M)&&0===x?Y?n:a:"")+(/all|right/.test(M)&&0===x?Y?a:n:"")+this._generateMonthYearHeader(e,Z,et,q,X,x>0||w>0,m,f)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",N=d?"<th class='ui-datepicker-week-col'>"+this._get(e,"weekHeader")+"</th>":"",k=0;7>k;k++)C=(k+u)%7,N+="<th"+((k+u+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+c[C]+"'>"+p[C]+"</span></th>";for(S+=N+"</tr></thead><tbody>",A=this._getDaysInMonth(et,Z),et===e.selectedYear&&Z===e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,A)),P=(this._getFirstDayOfMonth(et,Z)-u+7)%7,I=Math.ceil((P+A)/7),F=U?this.maxRows>I?this.maxRows:I:I,this.maxRows=F,j=this._daylightSavingAdjust(new Date(et,Z,1-P)),H=0;F>H;H++){for(S+="<tr>",E=d?"<td class='ui-datepicker-week-col'>"+this._get(e,"calculateWeek")(j)+"</td>":"",k=0;7>k;k++)z=g?g.apply(e.input?e.input[0]:null,[j]):[!0,""],L=j.getMonth()!==Z,O=L&&!y||!z[0]||q&&q>j||X&&j>X,E+="<td class='"+((k+u+6)%7>=5?" ui-datepicker-week-end":"")+(L?" ui-datepicker-other-month":"")+(j.getTime()===T.getTime()&&Z===e.selectedMonth&&e._keyEvent||b.getTime()===j.getTime()&&b.getTime()===T.getTime()?" "+this._dayOverClass:"")+(O?" "+this._unselectableClass+" ui-state-disabled":"")+(L&&!v?"":" "+z[1]+(j.getTime()===G.getTime()?" "+this._currentClass:"")+(j.getTime()===W.getTime()?" ui-datepicker-today":""))+"'"+(L&&!v||!z[2]?"":" title='"+z[2].replace(/'/g,"&#39;")+"'")+(O?"":" data-handler='selectDay' data-event='click' data-month='"+j.getMonth()+"' data-year='"+j.getFullYear()+"'")+">"+(L&&!v?"&#xa0;":O?"<span class='ui-state-default'>"+j.getDate()+"</span>":"<a class='ui-state-default"+(j.getTime()===W.getTime()?" ui-state-highlight":"")+(j.getTime()===G.getTime()?" ui-state-active":"")+(L?" ui-priority-secondary":"")+"' href='#'>"+j.getDate()+"</a>")+"</td>",j.setDate(j.getDate()+1),j=this._daylightSavingAdjust(j);S+=E+"</tr>"}Z++,Z>11&&(Z=0,et++),S+="</tbody></table>"+(U?"</div>"+(B[0]>0&&w===B[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),D+=S}_+=D}return _+=l,e._keyEvent=!1,_},_generateMonthYearHeader:function(e,t,i,a,s,n,r,o){var h,l,u,d,c,p,m,f,g=this._get(e,"changeMonth"),v=this._get(e,"changeYear"),y=this._get(e,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",_="";if(n||!g)_+="<span class='ui-datepicker-month'>"+r[t]+"</span>";else{for(h=a&&a.getFullYear()===i,l=s&&s.getFullYear()===i,_+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",u=0;12>u;u++)(!h||u>=a.getMonth())&&(!l||s.getMonth()>=u)&&(_+="<option value='"+u+"'"+(u===t?" selected='selected'":"")+">"+o[u]+"</option>");_+="</select>"}if(y||(b+=_+(!n&&g&&v?"":"&#xa0;")),!e.yearshtml)if(e.yearshtml="",n||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(d=this._get(e,"yearRange").split(":"),c=(new Date).getFullYear(),p=function(e){var t=e.match(/c[+\-].*/)?i+parseInt(e.substring(1),10):e.match(/[+\-].*/)?c+parseInt(e,10):parseInt(e,10);
return isNaN(t)?c:t},m=p(d[0]),f=Math.max(m,p(d[1]||"")),m=a?Math.max(m,a.getFullYear()):m,f=s?Math.min(f,s.getFullYear()):f,e.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";f>=m;m++)e.yearshtml+="<option value='"+m+"'"+(m===i?" selected='selected'":"")+">"+m+"</option>";e.yearshtml+="</select>",b+=e.yearshtml,e.yearshtml=null}return b+=this._get(e,"yearSuffix"),y&&(b+=(!n&&g&&v?"":"&#xa0;")+_),b+="</div>"},_adjustInstDate:function(e,t,i){var a=e.drawYear+("Y"===i?t:0),s=e.drawMonth+("M"===i?t:0),n=Math.min(e.selectedDay,this._getDaysInMonth(a,s))+("D"===i?t:0),r=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(a,s,n)));e.selectedDay=r.getDate(),e.drawMonth=e.selectedMonth=r.getMonth(),e.drawYear=e.selectedYear=r.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(e)},_restrictMinMax:function(e,t){var i=this._getMinMaxDate(e,"min"),a=this._getMinMaxDate(e,"max"),s=i&&i>t?i:t;return a&&s>a?a:s},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return null==t?[1,1]:"number"==typeof t?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return new Date(e,t,1).getDay()},_canAdjustMonth:function(e,t,i,a){var s=this._getNumberOfMonths(e),n=this._daylightSavingAdjust(new Date(i,a+(0>t?t:s[0]*s[1]),1));return 0>t&&n.setDate(this._getDaysInMonth(n.getFullYear(),n.getMonth())),this._isInRange(e,n)},_isInRange:function(e,t){var i,a,s=this._getMinMaxDate(e,"min"),n=this._getMinMaxDate(e,"max"),r=null,o=null,h=this._get(e,"yearRange");return h&&(i=h.split(":"),a=(new Date).getFullYear(),r=parseInt(i[0],10),o=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=a),i[1].match(/[+\-].*/)&&(o+=a)),(!s||t.getTime()>=s.getTime())&&(!n||t.getTime()<=n.getTime())&&(!r||t.getFullYear()>=r)&&(!o||o>=t.getFullYear())},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return t="string"!=typeof t?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,i,a){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var s=t?"object"==typeof t?t:this._daylightSavingAdjust(new Date(a,i,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),s,this._getFormatConfig(e))}}),e.fn.datepicker=function(t){if(!this.length)return this;e.datepicker.initialized||(e(document).mousedown(e.datepicker._checkExternalClick),e.datepicker.initialized=!0),0===e("#"+e.datepicker._mainDivId).length&&e("body").append(e.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof t||"isDisabled"!==t&&"getDate"!==t&&"widget"!==t?"option"===t&&2===arguments.length&&"string"==typeof arguments[1]?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof t?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this].concat(i)):e.datepicker._attachDatepicker(this,t)}):e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i))},e.datepicker=new i,e.datepicker.initialized=!1,e.datepicker.uuid=(new Date).getTime(),e.datepicker.version="1.10.3"})(jQuery);(function(e){var t={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};e.widget("ui.dialog",{version:"1.10.3",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var i=e(this).css(t).offset().top;0>i&&e(this).css("top",t.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&e.fn.draggable&&this._makeDraggable(),this.options.resizable&&e.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var t=this.options.appendTo;return t&&(t.jquery||t.nodeType)?e(t):this.document.find(t||"body").eq(0)},_destroy:function(){var e,t=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},disable:e.noop,enable:e.noop,close:function(t){var i=this;this._isOpen&&this._trigger("beforeClose",t)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||e(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",t)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,t){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!t&&this._trigger("focus",e),i},open:function(){var t=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=e(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){t._focusTabbable(),t._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var e=this.element.find("[autofocus]");e.length||(e=this.element.find(":tabbable")),e.length||(e=this.uiDialogButtonPane.find(":tabbable")),e.length||(e=this.uiDialogTitlebarClose.filter(":tabbable")),e.length||(e=this.uiDialog),e.eq(0).focus()},_keepFocus:function(t){function i(){var t=this.document[0].activeElement,i=this.uiDialog[0]===t||e.contains(this.uiDialog[0],t);i||this._focusTabbable()}t.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=e("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(t){if(this.options.closeOnEscape&&!t.isDefaultPrevented()&&t.keyCode&&t.keyCode===e.ui.keyCode.ESCAPE)return t.preventDefault(),this.close(t),undefined;if(t.keyCode===e.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),a=i.filter(":first"),s=i.filter(":last");t.target!==s[0]&&t.target!==this.uiDialog[0]||t.shiftKey?t.target!==a[0]&&t.target!==this.uiDialog[0]||!t.shiftKey||(s.focus(1),t.preventDefault()):(a.focus(1),t.preventDefault())}},mousedown:function(e){this._moveToTop(e)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var t;this.uiDialogTitlebar=e("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(t){e(t.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=e("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(e){e.preventDefault(),this.close(e)}}),t=e("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(t),this.uiDialog.attr({"aria-labelledby":t.attr("id")})},_title:function(e){this.options.title||e.html("&#160;"),e.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=e("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=e("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var t=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),e.isEmptyObject(i)||e.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(e.each(i,function(i,a){var s,n;a=e.isFunction(a)?{click:a,text:i}:a,a=e.extend({type:"button"},a),s=a.click,a.click=function(){s.apply(t.element[0],arguments)},n={icons:a.icons,text:a.showText},delete a.icons,delete a.showText,e("<button></button>",a).button(n).appendTo(t.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function t(e){return{position:e.position,offset:e.offset}}var i=this,a=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(a,s){e(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",a,t(s))},drag:function(e,a){i._trigger("drag",e,t(a))},stop:function(s,n){a.position=[n.position.left-i.document.scrollLeft(),n.position.top-i.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",s,t(n))}})},_makeResizable:function(){function t(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}var i=this,a=this.options,s=a.resizable,n=this.uiDialog.css("position"),r="string"==typeof s?s:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:a.maxWidth,maxHeight:a.maxHeight,minWidth:a.minWidth,minHeight:this._minHeight(),handles:r,start:function(a,s){e(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",a,t(s))},resize:function(e,a){i._trigger("resize",e,t(a))},stop:function(s,n){a.height=e(this).height(),a.width=e(this).width(),e(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",s,t(n))}}).css("position",n)},_minHeight:function(){var e=this.options;return"auto"===e.height?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(){var e=this.uiDialog.is(":visible");e||this.uiDialog.show(),this.uiDialog.position(this.options.position),e||this.uiDialog.hide()},_setOptions:function(a){var s=this,n=!1,r={};e.each(a,function(e,a){s._setOption(e,a),e in t&&(n=!0),e in i&&(r[e]=a)}),n&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",r)},_setOption:function(e,t){var i,a,s=this.uiDialog;"dialogClass"===e&&s.removeClass(this.options.dialogClass).addClass(t),"disabled"!==e&&(this._super(e,t),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:""+t}),"draggable"===e&&(i=s.is(":data(ui-draggable)"),i&&!t&&s.draggable("destroy"),!i&&t&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(a=s.is(":data(ui-resizable)"),a&&!t&&s.resizable("destroy"),a&&"string"==typeof t&&s.resizable("option","handles",t),a||t===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var e,t,i,a=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),a.minWidth>a.width&&(a.width=a.minWidth),e=this.uiDialog.css({height:"auto",width:a.width}).outerHeight(),t=Math.max(0,a.minHeight-e),i="number"==typeof a.maxHeight?Math.max(0,a.maxHeight-e):"none","auto"===a.height?this.element.css({minHeight:t,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,a.height-e)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var t=e(this);return e("<div>").css({position:"absolute",width:t.outerWidth(),height:t.outerHeight()}).appendTo(t.parent()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(t){return e(t.target).closest(".ui-dialog").length?!0:!!e(t.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var t=this,i=this.widgetFullName;e.ui.dialog.overlayInstances||this._delay(function(){e.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(a){t._allowInteraction(a)||(a.preventDefault(),e(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=e("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),e.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(e.ui.dialog.overlayInstances--,e.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),e.ui.dialog.overlayInstances=0,e.uiBackCompat!==!1&&e.widget("ui.dialog",e.ui.dialog,{_position:function(){var t,i=this.options.position,a=[],s=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(a=i.split?i.split(" "):[i[0],i[1]],1===a.length&&(a[1]=a[0]),e.each(["left","top"],function(e,t){+a[e]===a[e]&&(s[e]=a[e],a[e]=t)}),i={my:a[0]+(0>s[0]?s[0]:"+"+s[0])+" "+a[1]+(0>s[1]?s[1]:"+"+s[1]),at:a.join(" ")}),i=e.extend({},e.ui.dialog.prototype.options.position,i)):i=e.ui.dialog.prototype.options.position,t=this.uiDialog.is(":visible"),t||this.uiDialog.show(),this.uiDialog.position(i),t||this.uiDialog.hide()}})})(jQuery);(function(e){e.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,e.proxy(function(e){this.options.disabled&&e.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(e){e.preventDefault()},"click .ui-state-disabled > a":function(e){e.preventDefault()},"click .ui-menu-item:has(a)":function(t){var i=e(t.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(t),i.has(".ui-menu").length?this.expand(t):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){var i=e(t.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(t,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(e,t){var i=this.active||this.element.children(".ui-menu-item").eq(0);t||this.focus(e,i)},blur:function(t){this._delay(function(){e.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){e(t.target).closest(".ui-menu").length||this.collapseAll(t),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);t.data("ui-menu-submenu-carat")&&t.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(t){function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,a,n,r,o,h=!0;switch(t.keyCode){case e.ui.keyCode.PAGE_UP:this.previousPage(t);break;case e.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case e.ui.keyCode.HOME:this._move("first","first",t);break;case e.ui.keyCode.END:this._move("last","last",t);break;case e.ui.keyCode.UP:this.previous(t);break;case e.ui.keyCode.DOWN:this.next(t);break;case e.ui.keyCode.LEFT:this.collapse(t);break;case e.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._activate(t);break;case e.ui.keyCode.ESCAPE:this.collapse(t);break;default:h=!1,a=this.previousFilter||"",n=String.fromCharCode(t.keyCode),r=!1,clearTimeout(this.filterTimer),n===a?r=!0:n=a+n,o=RegExp("^"+i(n),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text())}),s=r&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(n=String.fromCharCode(t.keyCode),o=RegExp("^"+i(n),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text())})),s.length?(this.focus(t,s),s.length>1?(this.previousFilter=n,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&t.preventDefault()},_activate:function(e){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(e):this.select(e))},refresh:function(){var t,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var t=e(this),s=t.prev("a"),a=e("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(a),t.attr("aria-labelledby",s.attr("id"))}),t=s.add(this.element),t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),t.children(":not(.ui-menu-item)").each(function(){var t=e(this);/[^\-\u2014\u2013\s]/.test(t.text())||t.addClass("ui-widget-content ui-menu-divider")}),t.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!e.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(e,t){"icons"===e&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu),this._super(e,t)},focus:function(e,t){var i,s;this.blur(e,e&&"focus"===e.type),this._scrollIntoView(t),this.active=t.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),e&&"keydown"===e.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=t.children(".ui-menu"),i.length&&/^mouse/.test(e.type)&&this._startOpening(i),this.activeMenu=t.parent(),this._trigger("focus",e,{item:t})},_scrollIntoView:function(t){var i,s,a,n,r,o;this._hasScroll()&&(i=parseFloat(e.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(e.css(this.activeMenu[0],"paddingTop"))||0,a=t.offset().top-this.activeMenu.offset().top-i-s,n=this.activeMenu.scrollTop(),r=this.activeMenu.height(),o=t.height(),0>a?this.activeMenu.scrollTop(n+a):a+o>r&&this.activeMenu.scrollTop(n+a-r+o))},blur:function(e,t){t||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",e,{item:this.active}))},_startOpening:function(e){clearTimeout(this.timer),"true"===e.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(e)},this.delay))},_open:function(t){var i=e.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(t,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:e(t&&t.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(t),this.activeMenu=s},this.delay)},_close:function(e){e||(e=this.active?this.active.parent():this.element),e.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(e){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);t&&t.length&&(this._close(),this.focus(e,t))},expand:function(e){var t=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(e,t)}))},next:function(e){this._move("next","first",e)},previous:function(e){this._move("prev","last",e)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(e,t,i){var s;this.active&&(s="first"===e||"last"===e?this.active["first"===e?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[e+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[t]()),this.focus(i,s)},nextPage:function(t){var i,s,a;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,a=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=e(this),0>i.offset().top-s-a}),this.focus(t,i)):this.focus(t,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(t),undefined)},previousPage:function(t){var i,s,a;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,a=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=e(this),i.offset().top-s+a>0}),this.focus(t,i)):this.focus(t,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(t),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||e(t.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,i)}})})(jQuery);(function(e,t){e.widget("ui.progressbar",{version:"1.10.3",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(e){return e===t?this.options.value:(this.options.value=this._constrainedValue(e),this._refreshValue(),t)},_constrainedValue:function(e){return e===t&&(e=this.options.value),this.indeterminate=e===!1,"number"!=typeof e&&(e=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,e))},_setOptions:function(e){var t=e.value;delete e.value,this._super(e),this.options.value=this._constrainedValue(t),this._refreshValue()},_setOption:function(e,t){"max"===e&&(t=Math.max(this.min,t)),this._super(e,t)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var t=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||t>this.min).toggleClass("ui-corner-right",t===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=e("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":t}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==t&&(this.oldValue=t,this._trigger("change")),t===this.options.max&&this._trigger("complete")}})})(jQuery);(function(e){var t=5;e.widget("ui.slider",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var t,i,s=this.options,a=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),n="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",r=[];for(i=s.values&&s.values.length||1,a.length>i&&(a.slice(i).remove(),a=a.slice(0,i)),t=a.length;i>t;t++)r.push(n);this.handles=a.add(e(r.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)})},_createRange:function(){var t=this.options,i="";t.range?(t.range===!0&&(t.values?t.values.length&&2!==t.values.length?t.values=[t.values[0],t.values[0]]:e.isArray(t.values)&&(t.values=t.values.slice(0)):t.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=e("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===t.range||"max"===t.range?" ui-slider-range-"+t.range:""))):this.range=e([])},_setupEvents:function(){var e=this.handles.add(this.range).filter("a");this._off(e),this._on(e,this._handleEvents),this._hoverable(e),this._focusable(e)},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var i,s,a,n,r,o,h,l,u=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:t.pageX,y:t.pageY},s=this._normValueFromMouse(i),a=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var i=Math.abs(s-u.values(t));(a>i||a===i&&(t===u._lastChangedValue||u.values(t)===c.min))&&(a=i,n=e(this),r=t)}),o=this._start(t,r),o===!1?!1:(this._mouseSliding=!0,this._handleIndex=r,n.addClass("ui-state-active").focus(),h=n.offset(),l=!e(t.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:t.pageX-h.left-n.width()/2,top:t.pageY-h.top-n.height()/2-(parseInt(n.css("borderTopWidth"),10)||0)-(parseInt(n.css("borderBottomWidth"),10)||0)+(parseInt(n.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,r,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,i),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,i,s,a,n;return"horizontal"===this.orientation?(t=this.elementSize.width,i=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,i=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/t,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),a=this._valueMax()-this._valueMin(),n=this._valueMin()+s*a,this._trimAlignValue(n)},_start:function(e,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",e,i)},_slide:function(e,t,i){var s,a,n;this.options.values&&this.options.values.length?(s=this.values(t?0:1),2===this.options.values.length&&this.options.range===!0&&(0===t&&i>s||1===t&&s>i)&&(i=s),i!==this.values(t)&&(a=this.values(),a[t]=i,n=this._trigger("slide",e,{handle:this.handles[t],value:i,values:a}),s=this.values(t?0:1),n!==!1&&this.values(t,i,!0))):i!==this.value()&&(n=this._trigger("slide",e,{handle:this.handles[t],value:i}),n!==!1&&this.value(i))},_stop:function(e,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("stop",e,i)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._lastChangedValue=t,this._trigger("change",e,i)}},value:function(e){return arguments.length?(this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(t,i){var s,a,n;if(arguments.length>1)return this.options.values[t]=this._trimAlignValue(i),this._refreshValue(),this._change(null,t),undefined;if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();for(s=this.options.values,a=arguments[0],n=0;s.length>n;n+=1)s[n]=this._trimAlignValue(a[n]),this._change(null,n);this._refreshValue()},_setOption:function(t,i){var s,a=0;switch("range"===t&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),e.isArray(this.options.values)&&(a=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments),t){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;a>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_values:function(e){var t,i,s;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(e){if(this._valueMin()>=e)return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=i>0?t:-t),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var t,i,s,a,n,r=this.options.range,o=this.options,h=this,l=this._animateOff?!1:o.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),u["horizontal"===h.orientation?"left":"bottom"]=i+"%",e(this).stop(1,1)[l?"animate":"css"](u,o.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},o.animate),1===s&&h.range[l?"animate":"css"]({width:i-t+"%"},{queue:!1,duration:o.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},o.animate),1===s&&h.range[l?"animate":"css"]({height:i-t+"%"},{queue:!1,duration:o.animate}))),t=i}):(s=this.value(),a=this._valueMin(),n=this._valueMax(),i=n!==a?100*((s-a)/(n-a)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](u,o.animate),"min"===r&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},o.animate),"max"===r&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:o.animate}),"min"===r&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},o.animate),"max"===r&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:o.animate}))},_handleEvents:{keydown:function(i){var s,a,n,r,o=e(i.target).data("ui-slider-handle-index");switch(i.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,e(i.target).addClass("ui-state-active"),s=this._start(i,o),s===!1))return}switch(r=this.options.step,a=n=this.options.values&&this.options.values.length?this.values(o):this.value(),i.keyCode){case e.ui.keyCode.HOME:n=this._valueMin();break;case e.ui.keyCode.END:n=this._valueMax();break;case e.ui.keyCode.PAGE_UP:n=this._trimAlignValue(a+(this._valueMax()-this._valueMin())/t);break;case e.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(a-(this._valueMax()-this._valueMin())/t);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(a===this._valueMax())return;n=this._trimAlignValue(a+r);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(a===this._valueMin())return;n=this._trimAlignValue(a-r)}this._slide(i,o,n)},click:function(e){e.preventDefault()},keyup:function(t){var i=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,i),this._change(t,i),e(t.target).removeClass("ui-state-active"))}}})})(jQuery);(function(e){function t(e){return function(){var t=this.element.val();e.apply(this,arguments),this._refresh(),t!==this.element.val()&&this._trigger("change")}}e.widget("ui.spinner",{version:"1.10.3",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var t={},i=this.element;return e.each(["min","max","step"],function(e,s){var a=i.attr(s);void 0!==a&&a.length&&(t[s]=a)}),t},_events:{keydown:function(e){this._start(e)&&this._keydown(e)&&e.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",e),void 0)},mousewheel:function(e,t){if(t){if(!this.spinning&&!this._start(e))return!1;this._spin((t>0?1:-1)*this.options.step,e),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(e)},100),e.preventDefault()}},"mousedown .ui-spinner-button":function(t){function i(){var e=this.element[0]===this.document[0].activeElement;e||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),t.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(t)!==!1&&this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(t){return e(t.currentTarget).hasClass("ui-state-active")?this._start(t)===!1?!1:(this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var e=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=e.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*e.height())&&e.height()>0&&e.height(e.height()),this.options.disabled&&this.disable()},_keydown:function(t){var i=this.options,s=e.ui.keyCode;switch(t.keyCode){case s.UP:return this._repeat(null,1,t),!0;case s.DOWN:return this._repeat(null,-1,t),!0;case s.PAGE_UP:return this._repeat(null,i.page,t),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,t),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(e){return this.spinning||this._trigger("start",e)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(e,t,i){e=e||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,t,i)},e),this._spin(t*this.options.step,i)},_spin:function(e,t){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+e*this._increment(this.counter)),this.spinning&&this._trigger("spin",t,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(t){var i=this.options.incremental;return i?e.isFunction(i)?i(t):Math.floor(t*t*t/5e4-t*t/500+17*t/200+1):1},_precision:function(){var e=this._precisionOf(this.options.step);return null!==this.options.min&&(e=Math.max(e,this._precisionOf(this.options.min))),e},_precisionOf:function(e){var t=""+e,i=t.indexOf(".");return-1===i?0:t.length-i-1},_adjustValue:function(e){var t,i,s=this.options;return t=null!==s.min?s.min:0,i=e-t,i=Math.round(i/s.step)*s.step,e=t+i,e=parseFloat(e.toFixed(this._precision())),null!==s.max&&e>s.max?s.max:null!==s.min&&s.min>e?s.min:e},_stop:function(e){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",e))},_setOption:function(e,t){if("culture"===e||"numberFormat"===e){var i=this._parse(this.element.val());return this.options[e]=t,this.element.val(this._format(i)),void 0}("max"===e||"min"===e||"step"===e)&&"string"==typeof t&&(t=this._parse(t)),"icons"===e&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(t.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(t.down)),this._super(e,t),"disabled"===e&&(t?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:t(function(e){this._super(e),this._value(this.element.val())}),_parse:function(e){return"string"==typeof e&&""!==e&&(e=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(e,10,this.options.culture):+e),""===e||isNaN(e)?null:e},_format:function(e){return""===e?"":window.Globalize&&this.options.numberFormat?Globalize.format(e,this.options.numberFormat,this.options.culture):e},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(e,t){var i;""!==e&&(i=this._parse(e),null!==i&&(t||(i=this._adjustValue(i)),e=this._format(i))),this.element.val(e),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:t(function(e){this._stepUp(e)}),_stepUp:function(e){this._start()&&(this._spin((e||1)*this.options.step),this._stop())},stepDown:t(function(e){this._stepDown(e)}),_stepDown:function(e){this._start()&&(this._spin((e||1)*-this.options.step),this._stop())},pageUp:t(function(e){this._stepUp((e||1)*this.options.page)}),pageDown:t(function(e){this._stepDown((e||1)*this.options.page)}),value:function(e){return arguments.length?(t(this._value).call(this,e),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}})})(jQuery);(function(e,t){function i(){return++a}function s(e){return e.hash.length>1&&decodeURIComponent(e.href.replace(n,""))===decodeURIComponent(location.href.replace(n,""))}var a=0,n=/#.*$/;e.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var t=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),e.isArray(i.disabled)&&(i.disabled=e.unique(i.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):e(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,a=location.hash.substring(1);return null===i&&(a&&this.tabs.each(function(s,n){return e(n).attr("aria-controls")===a?(i=s,!1):t}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(i){var s=e(this.document[0].activeElement).closest("li"),a=this.tabs.index(s),n=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:a++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:n=!1,a--;break;case e.ui.keyCode.END:a=this.anchors.length-1;break;case e.ui.keyCode.HOME:a=0;break;case e.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(a),t;case e.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(a===this.options.active?!1:a),t;default:return}i.preventDefault(),clearTimeout(this.activating),a=this._focusNextTab(a,n),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(a).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",a)},this.delay))}},_panelKeydown:function(t){this._handlePageNav(t)||t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===e.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===e.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):t},_findNextTab:function(t,i){function s(){return t>a&&(t=0),0>t&&(t=a),t}for(var a=this.tabs.length-1;-1!==e.inArray(s(),this.options.disabled);)t=i?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,i){return"active"===e?(this._activate(i),t):"disabled"===e?(this._setupDisabled(i),t):(this._super(e,i),"collapsible"===e&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===e&&this._setupEvents(i),"heightStyle"===e&&this._setupHeightStyle(i),t)},_tabId:function(e){return e.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,i=this.tablist.children(":has(a[href])");t.disabled=e.map(i.filter(".ui-state-disabled"),function(e){return i.index(e)}),this._processTabs(),t.active!==!1&&this.anchors.length?this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active):(t.active=!1,this.active=e()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(i,a){var n,r,o,h=e(a).uniqueId().attr("id"),l=e(a).closest("li"),u=l.attr("aria-controls");s(a)?(n=a.hash,r=t.element.find(t._sanitizeSelector(n))):(o=t._tabId(l),n="#"+o,r=t.element.find(n),r.length||(r=t._createPanel(o),r.insertAfter(t.panels[i-1]||t.tablist)),r.attr("aria-live","polite")),r.length&&(t.panels=t.panels.add(r)),u&&l.data("ui-tabs-aria-controls",u),l.attr({"aria-controls":n.substring(1),"aria-labelledby":h}),r.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var i,s=0;i=this.tabs[s];s++)t===!0||-1!==e.inArray(s,t)?e(i).addClass("ui-state-disabled").attr("aria-disabled","true"):e(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var i={click:function(e){e.preventDefault()}};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var i,s=this.element.parent();"fill"===t?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),s=t.css("position");"absolute"!==s&&"fixed"!==s&&(i-=t.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===t&&(i=0,this.panels.each(function(){i=Math.max(i,e(this).height("").height())}).height(i))},_eventHandler:function(t){var i=this.options,s=this.active,a=e(t.currentTarget),n=a.closest("li"),r=n[0]===s[0],o=r&&i.collapsible,h=o?e():this._getPanelForTab(n),l=s.length?this._getPanelForTab(s):e(),u={oldTab:s,oldPanel:l,newTab:o?e():n,newPanel:h};t.preventDefault(),n.hasClass("ui-state-disabled")||n.hasClass("ui-tabs-loading")||this.running||r&&!i.collapsible||this._trigger("beforeActivate",t,u)===!1||(i.active=o?!1:this.tabs.index(n),this.active=r?e():n,this.xhr&&this.xhr.abort(),l.length||h.length||e.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(n),t),this._toggle(t,u))},_toggle:function(t,i){function s(){n.running=!1,n._trigger("activate",t,i)}function a(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),r.length&&n.options.show?n._show(r,n.options.show,s):(r.show(),s())}var n=this,r=i.newPanel,o=i.oldPanel;this.running=!0,o.length&&this.options.hide?this._hide(o,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),a()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),o.hide(),a()),o.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),r.length&&o.length?i.oldTab.attr("tabIndex",-1):r.length&&this.tabs.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),r.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(t){var i,s=this._findActive(t);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),i=t.data("ui-tabs-aria-controls");i?t.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===t?s=!1:(i=this._getIndex(i),s=e.isArray(s)?e.map(s,function(e){return e!==i?e:null}):e.map(this.tabs,function(e,t){return t!==i?t:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===t)s=!0;else{if(i=this._getIndex(i),-1!==e.inArray(i,s))return;s=e.isArray(s)?e.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(t,i){t=this._getIndex(t);var a=this,n=this.tabs.eq(t),r=n.find(".ui-tabs-anchor"),o=this._getPanelForTab(n),h={tab:n,panel:o};s(r[0])||(this.xhr=e.ajax(this._ajaxSettings(r,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(n.addClass("ui-tabs-loading"),o.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){o.html(e),a._trigger("load",i,h)},1)}).complete(function(e,t){setTimeout(function(){"abort"===t&&a.panels.stop(!1,!0),n.removeClass("ui-tabs-loading"),o.removeAttr("aria-busy"),e===a.xhr&&delete a.xhr},1)})))},_ajaxSettings:function(t,i,s){var a=this;return{url:t.attr("href"),beforeSend:function(t,n){return a._trigger("beforeLoad",i,e.extend({jqXHR:t,ajaxSettings:n},s))}}},_getPanelForTab:function(t){var i=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})})(jQuery);(function(e){function t(t,i){var s=(t.attr("aria-describedby")||"").split(/\s+/);s.push(i),t.data("ui-tooltip-id",i).attr("aria-describedby",e.trim(s.join(" ")))}function i(t){var i=t.data("ui-tooltip-id"),s=(t.attr("aria-describedby")||"").split(/\s+/),a=e.inArray(i,s);-1!==a&&s.splice(a,1),t.removeData("ui-tooltip-id"),s=e.trim(s.join(" ")),s?t.attr("aria-describedby",s):t.removeAttr("aria-describedby")}var s=0;e.widget("ui.tooltip",{version:"1.10.3",options:{content:function(){var t=e(this).attr("title")||"";return e("<a>").text(t).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(t,i){var s=this;return"disabled"===t?(this[i?"_disable":"_enable"](),this.options[t]=i,void 0):(this._super(t,i),"content"===t&&e.each(this.tooltips,function(e,t){s._updateContent(t)}),void 0)},_disable:function(){var t=this;e.each(this.tooltips,function(i,s){var a=e.Event("blur");a.target=a.currentTarget=s[0],t.close(a,!0)}),this.element.find(this.options.items).addBack().each(function(){var t=e(this);t.is("[title]")&&t.data("ui-tooltip-title",t.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var t=e(this);t.data("ui-tooltip-title")&&t.attr("title",t.data("ui-tooltip-title"))})},open:function(t){var i=this,s=e(t?t.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),t&&"mouseover"===t.type&&s.parents().each(function(){var t,s=e(this);s.data("ui-tooltip-open")&&(t=e.Event("blur"),t.target=t.currentTarget=this,i.close(t,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,t))},_updateContent:function(e,t){var i,s=this.options.content,a=this,n=t?t.type:null;return"string"==typeof s?this._open(t,e,s):(i=s.call(e[0],function(i){e.data("ui-tooltip-open")&&a._delay(function(){t&&(t.type=n),this._open(t,e,i)})}),i&&this._open(t,e,i),void 0)},_open:function(i,s,a){function n(e){l.of=e,r.is(":hidden")||r.position(l)}var r,o,h,l=e.extend({},this.options.position);if(a){if(r=this._find(s),r.length)return r.find(".ui-tooltip-content").html(a),void 0;s.is("[title]")&&(i&&"mouseover"===i.type?s.attr("title",""):s.removeAttr("title")),r=this._tooltip(s),t(s,r.attr("id")),r.find(".ui-tooltip-content").html(a),this.options.track&&i&&/^mouse/.test(i.type)?(this._on(this.document,{mousemove:n}),n(i)):r.position(e.extend({of:s},this.options.position)),r.hide(),this._show(r,this.options.show),this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){r.is(":visible")&&(n(l.of),clearInterval(h))},e.fx.interval)),this._trigger("open",i,{tooltip:r}),o={keyup:function(t){if(t.keyCode===e.ui.keyCode.ESCAPE){var i=e.Event(t);i.currentTarget=s[0],this.close(i,!0)}},remove:function(){this._removeTooltip(r)}},i&&"mouseover"!==i.type||(o.mouseleave="close"),i&&"focusin"!==i.type||(o.focusout="close"),this._on(!0,s,o)}},close:function(t){var s=this,a=e(t?t.currentTarget:this.element),n=this._find(a);this.closing||(clearInterval(this.delayedShow),a.data("ui-tooltip-title")&&a.attr("title",a.data("ui-tooltip-title")),i(a),n.stop(!0),this._hide(n,this.options.hide,function(){s._removeTooltip(e(this))}),a.removeData("ui-tooltip-open"),this._off(a,"mouseleave focusout keyup"),a[0]!==this.element[0]&&this._off(a,"remove"),this._off(this.document,"mousemove"),t&&"mouseleave"===t.type&&e.each(this.parents,function(t,i){e(i.element).attr("title",i.title),delete s.parents[t]}),this.closing=!0,this._trigger("close",t,{tooltip:n}),this.closing=!1)},_tooltip:function(t){var i="ui-tooltip-"+s++,a=e("<div>").attr({id:i,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return e("<div>").addClass("ui-tooltip-content").appendTo(a),a.appendTo(this.document[0].body),this.tooltips[i]=t,a},_find:function(t){var i=t.data("ui-tooltip-id");return i?e("#"+i):e()},_removeTooltip:function(e){e.remove(),delete this.tooltips[e.attr("id")]},_destroy:function(){var t=this;e.each(this.tooltips,function(i,s){var a=e.Event("blur");a.target=a.currentTarget=s[0],t.close(a,!0),e("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))})}})})(jQuery);(function(e,t){var i="ui-effects-";e.effects={effect:{}},function(e,t){function i(e,t,i){var s=c[t.type]||{};return null==e?i||!t.def?null:t.def:(e=s.floor?~~e:parseFloat(e),isNaN(e)?t.def:s.mod?(e+s.mod)%s.mod:0>e?0:e>s.max?s.max:e)}function s(i){var s=l(),a=s._rgba=[];return i=i.toLowerCase(),f(h,function(e,n){var r,o=n.re.exec(i),h=o&&n.parse(o),l=n.space||"rgba";return h?(r=s[l](h),s[u[l].cache]=r[u[l].cache],a=s._rgba=r._rgba,!1):t}),a.length?("0,0,0,0"===a.join()&&e.extend(a,n.transparent),s):n[i]}function a(e,t,i){return i=(i+1)%1,1>6*i?e+6*(t-e)*i:1>2*i?t:2>3*i?e+6*(t-e)*(2/3-i):e}var n,r="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",o=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1],e[2],e[3],e[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(e){return[2.55*e[1],2.55*e[2],2.55*e[3],e[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(e){return[e[1],e[2]/100,e[3]/100,e[4]]}}],l=e.Color=function(t,i,s,a){return new e.Color.fn.parse(t,i,s,a)},u={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},c={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=e("<p>")[0],f=e.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(u,function(e,t){t.cache="_"+e,t.props.alpha={idx:3,type:"percent",def:1}}),l.fn=e.extend(l.prototype,{parse:function(a,r,o,h){if(a===t)return this._rgba=[null,null,null,null],this;(a.jquery||a.nodeType)&&(a=e(a).css(r),r=t);var c=this,d=e.type(a),p=this._rgba=[];return r!==t&&(a=[a,r,o,h],d="array"),"string"===d?this.parse(s(a)||n._default):"array"===d?(f(u.rgba.props,function(e,t){p[t.idx]=i(a[t.idx],t)}),this):"object"===d?(a instanceof l?f(u,function(e,t){a[t.cache]&&(c[t.cache]=a[t.cache].slice())}):f(u,function(t,s){var n=s.cache;f(s.props,function(e,t){if(!c[n]&&s.to){if("alpha"===e||null==a[e])return;c[n]=s.to(c._rgba)}c[n][t.idx]=i(a[e],t,!0)}),c[n]&&0>e.inArray(null,c[n].slice(0,3))&&(c[n][3]=1,s.from&&(c._rgba=s.from(c[n])))}),this):t},is:function(e){var i=l(e),s=!0,a=this;return f(u,function(e,n){var r,o=i[n.cache];return o&&(r=a[n.cache]||n.to&&n.to(a._rgba)||[],f(n.props,function(e,i){return null!=o[i.idx]?s=o[i.idx]===r[i.idx]:t})),s}),s},_space:function(){var e=[],t=this;return f(u,function(i,s){t[s.cache]&&e.push(i)}),e.pop()},transition:function(e,t){var s=l(e),a=s._space(),n=u[a],r=0===this.alpha()?l("transparent"):this,o=r[n.cache]||n.to(r._rgba),h=o.slice();return s=s[n.cache],f(n.props,function(e,a){var n=a.idx,r=o[n],l=s[n],u=c[a.type]||{};null!==l&&(null===r?h[n]=l:(u.mod&&(l-r>u.mod/2?r+=u.mod:r-l>u.mod/2&&(r-=u.mod)),h[n]=i((l-r)*t+r,a)))}),this[a](h)},blend:function(t){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),a=l(t)._rgba;return l(e.map(i,function(e,t){return(1-s)*a[t]+s*e}))},toRgbaString:function(){var t="rgba(",i=e.map(this._rgba,function(e,t){return null==e?t>2?1:0:e});return 1===i[3]&&(i.pop(),t="rgb("),t+i.join()+")"},toHslaString:function(){var t="hsla(",i=e.map(this.hsla(),function(e,t){return null==e&&(e=t>2?1:0),t&&3>t&&(e=Math.round(100*e)+"%"),e});return 1===i[3]&&(i.pop(),t="hsl("),t+i.join()+")"},toHexString:function(t){var i=this._rgba.slice(),s=i.pop();return t&&i.push(~~(255*s)),"#"+e.map(i,function(e){return e=(e||0).toString(16),1===e.length?"0"+e:e}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,u.hsla.to=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t,i,s=e[0]/255,a=e[1]/255,n=e[2]/255,r=e[3],o=Math.max(s,a,n),h=Math.min(s,a,n),l=o-h,u=o+h,c=.5*u;return t=h===o?0:s===o?60*(a-n)/l+360:a===o?60*(n-s)/l+120:60*(s-a)/l+240,i=0===l?0:.5>=c?l/u:l/(2-u),[Math.round(t)%360,i,c,null==r?1:r]},u.hsla.from=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t=e[0]/360,i=e[1],s=e[2],n=e[3],r=.5>=s?s*(1+i):s+i-s*i,o=2*s-r;return[Math.round(255*a(o,r,t+1/3)),Math.round(255*a(o,r,t)),Math.round(255*a(o,r,t-1/3)),n]},f(u,function(s,a){var n=a.props,r=a.cache,h=a.to,u=a.from;l.fn[s]=function(s){if(h&&!this[r]&&(this[r]=h(this._rgba)),s===t)return this[r].slice();var a,o=e.type(s),c="array"===o||"object"===o?s:arguments,d=this[r].slice();return f(n,function(e,t){var s=c["object"===o?e:t.idx];null==s&&(s=d[t.idx]),d[t.idx]=i(s,t)}),u?(a=l(u(d)),a[r]=d,a):l(d)},f(n,function(t,i){l.fn[t]||(l.fn[t]=function(a){var n,r=e.type(a),h="alpha"===t?this._hsla?"hsla":"rgba":s,l=this[h](),u=l[i.idx];return"undefined"===r?u:("function"===r&&(a=a.call(this,u),r=e.type(a)),null==a&&i.empty?this:("string"===r&&(n=o.exec(a),n&&(a=u+parseFloat(n[2])*("+"===n[1]?1:-1))),l[i.idx]=a,this[h](l)))})})}),l.hook=function(t){var i=t.split(" ");f(i,function(t,i){e.cssHooks[i]={set:function(t,a){var n,r,o="";if("transparent"!==a&&("string"!==e.type(a)||(n=s(a)))){if(a=l(n||a),!d.rgba&&1!==a._rgba[3]){for(r="backgroundColor"===i?t.parentNode:t;(""===o||"transparent"===o)&&r&&r.style;)try{o=e.css(r,"backgroundColor"),r=r.parentNode}catch(h){}a=a.blend(o&&"transparent"!==o?o:"_default")}a=a.toRgbaString()}try{t.style[i]=a}catch(h){}}},e.fx.step[i]=function(t){t.colorInit||(t.start=l(t.elem,i),t.end=l(t.end),t.colorInit=!0),e.cssHooks[i].set(t.elem,t.start.transition(t.end,t.pos))}})},l.hook(r),e.cssHooks.borderColor={expand:function(e){var t={};return f(["Top","Right","Bottom","Left"],function(i,s){t["border"+s+"Color"]=e}),t}},n=e.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(t){var i,s,a=t.ownerDocument.defaultView?t.ownerDocument.defaultView.getComputedStyle(t,null):t.currentStyle,n={};if(a&&a.length&&a[0]&&a[a[0]])for(s=a.length;s--;)i=a[s],"string"==typeof a[i]&&(n[e.camelCase(i)]=a[i]);else for(i in a)"string"==typeof a[i]&&(n[i]=a[i]);return n}function s(t,i){var s,a,r={};for(s in i)a=i[s],t[s]!==a&&(n[s]||(e.fx.step[s]||!isNaN(parseFloat(a)))&&(r[s]=a));return r}var a=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};e.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,i){e.fx.step[i]=function(e){("none"!==e.end&&!e.setAttr||1===e.pos&&!e.setAttr)&&(jQuery.style(e.elem,i,e.end),e.setAttr=!0)}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e.effects.animateClass=function(t,n,r,o){var h=e.speed(n,r,o);return this.queue(function(){var n,r=e(this),o=r.attr("class")||"",l=h.children?r.find("*").addBack():r;l=l.map(function(){var t=e(this);return{el:t,start:i(this)}}),n=function(){e.each(a,function(e,i){t[i]&&r[i+"Class"](t[i])})},n(),l=l.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),r.attr("class",o),l=l.map(function(){var t=this,i=e.Deferred(),s=e.extend({},h,{queue:!1,complete:function(){i.resolve(t)}});return this.el.animate(this.diff,s),i.promise()}),e.when.apply(e,l.get()).done(function(){n(),e.each(arguments,function(){var t=this.el;e.each(this.diff,function(e){t.css(e,"")})}),h.complete.call(r[0])})})},e.fn.extend({addClass:function(t){return function(i,s,a,n){return s?e.effects.animateClass.call(this,{add:i},s,a,n):t.apply(this,arguments)}}(e.fn.addClass),removeClass:function(t){return function(i,s,a,n){return arguments.length>1?e.effects.animateClass.call(this,{remove:i},s,a,n):t.apply(this,arguments)}}(e.fn.removeClass),toggleClass:function(i){return function(s,a,n,r,o){return"boolean"==typeof a||a===t?n?e.effects.animateClass.call(this,a?{add:s}:{remove:s},n,r,o):i.apply(this,arguments):e.effects.animateClass.call(this,{toggle:s},a,n,r)}}(e.fn.toggleClass),switchClass:function(t,i,s,a,n){return e.effects.animateClass.call(this,{add:i,remove:t},s,a,n)}})}(),function(){function s(t,i,s,a){return e.isPlainObject(t)&&(i=t,t=t.effect),t={effect:t},null==i&&(i={}),e.isFunction(i)&&(a=i,s=null,i={}),("number"==typeof i||e.fx.speeds[i])&&(a=s,s=i,i={}),e.isFunction(s)&&(a=s,s=null),i&&e.extend(t,i),s=s||i.duration,t.duration=e.fx.off?0:"number"==typeof s?s:s in e.fx.speeds?e.fx.speeds[s]:e.fx.speeds._default,t.complete=a||i.complete,t}function a(t){return!t||"number"==typeof t||e.fx.speeds[t]?!0:"string"!=typeof t||e.effects.effect[t]?e.isFunction(t)?!0:"object"!=typeof t||t.effect?!1:!0:!0}e.extend(e.effects,{version:"1.10.3",save:function(e,t){for(var s=0;t.length>s;s++)null!==t[s]&&e.data(i+t[s],e[0].style[t[s]])},restore:function(e,s){var a,n;for(n=0;s.length>n;n++)null!==s[n]&&(a=e.data(i+s[n]),a===t&&(a=""),e.css(s[n],a))},setMode:function(e,t){return"toggle"===t&&(t=e.is(":hidden")?"show":"hide"),t},getBaseline:function(e,t){var i,s;switch(e[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=e[0]/t.height}switch(e[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=e[1]/t.width}return{x:s,y:i}},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper"))return t.parent();var i={width:t.outerWidth(!0),height:t.outerHeight(!0),"float":t.css("float")},s=e("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),a={width:t.width(),height:t.height()},n=document.activeElement;try{n.id}catch(r){n=document.body}return t.wrap(s),(t[0]===n||e.contains(t[0],n))&&e(n).focus(),s=t.parent(),"static"===t.css("position")?(s.css({position:"relative"}),t.css({position:"relative"})):(e.extend(i,{position:t.css("position"),zIndex:t.css("z-index")}),e.each(["top","left","bottom","right"],function(e,s){i[s]=t.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(a),s.css(i).show()},removeWrapper:function(t){var i=document.activeElement;return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===i||e.contains(t[0],i))&&e(i).focus()),t},setTransition:function(t,i,s,a){return a=a||{},e.each(i,function(e,i){var n=t.cssUnit(i);n[0]>0&&(a[i]=n[0]*s+n[1])}),a}}),e.fn.extend({effect:function(){function t(t){function s(){e.isFunction(n)&&n.call(a[0]),e.isFunction(t)&&t()}var a=e(this),n=i.complete,o=i.mode;(a.is(":hidden")?"hide"===o:"show"===o)?(a[o](),s()):r.call(a[0],i,s)}var i=s.apply(this,arguments),a=i.mode,n=i.queue,r=e.effects.effect[i.effect];return e.fx.off||!r?a?this[a](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):n===!1?this.each(t):this.queue(n||"fx",t)},show:function(e){return function(t){if(a(t))return e.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(e.fn.show),hide:function(e){return function(t){if(a(t))return e.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(e.fn.hide),toggle:function(e){return function(t){if(a(t)||"boolean"==typeof t)return e.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(e.fn.toggle),cssUnit:function(t){var i=this.css(t),s=[];return e.each(["em","px","%","pt"],function(e,t){i.indexOf(t)>0&&(s=[parseFloat(i),t])}),s}})}(),function(){var t={};e.each(["Quad","Cubic","Quart","Quint","Expo"],function(e,i){t[i]=function(t){return Math.pow(t,e+2)}}),e.extend(t,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return 0===e||1===e?e:-Math.pow(2,8*(e-1))*Math.sin((80*(e-1)-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){for(var t,i=4;((t=Math.pow(2,--i))-1)/11>e;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*t-2)/22-e,2)}}),e.each(t,function(t,i){e.easing["easeIn"+t]=i,e.easing["easeOut"+t]=function(e){return 1-i(1-e)},e.easing["easeInOut"+t]=function(e){return.5>e?i(2*e)/2:1-i(-2*e+2)/2}})}()})(jQuery);(function(e){var t=/up|down|vertical/,i=/up|left|vertical|horizontal/;e.effects.effect.blind=function(a,s){var n,r,o,l=e(this),h=["position","top","bottom","left","right","height","width"],u=e.effects.setMode(l,a.mode||"hide"),d=a.direction||"up",c=t.test(d),p=c?"height":"width",f=c?"top":"left",m=i.test(d),g={},v="show"===u;l.parent().is(".ui-effects-wrapper")?e.effects.save(l.parent(),h):e.effects.save(l,h),l.show(),n=e.effects.createWrapper(l).css({overflow:"hidden"}),r=n[p](),o=parseFloat(n.css(f))||0,g[p]=v?r:0,m||(l.css(c?"bottom":"right",0).css(c?"top":"left","auto").css({position:"absolute"}),g[f]=v?o:r+o),v&&(n.css(p,0),m||n.css(f,o+r)),n.animate(g,{duration:a.duration,easing:a.easing,queue:!1,complete:function(){"hide"===u&&l.hide(),e.effects.restore(l,h),e.effects.removeWrapper(l),s()}})}})(jQuery);(function(e){e.effects.effect.bounce=function(t,i){var a,s,n,r=e(this),o=["position","top","bottom","left","right","height","width"],l=e.effects.setMode(r,t.mode||"effect"),h="hide"===l,u="show"===l,d=t.direction||"up",c=t.distance,p=t.times||5,f=2*p+(u||h?1:0),m=t.duration/f,g=t.easing,v="up"===d||"down"===d?"top":"left",y="up"===d||"left"===d,b=r.queue(),_=b.length;for((u||h)&&o.push("opacity"),e.effects.save(r,o),r.show(),e.effects.createWrapper(r),c||(c=r["top"===v?"outerHeight":"outerWidth"]()/3),u&&(n={opacity:1},n[v]=0,r.css("opacity",0).css(v,y?2*-c:2*c).animate(n,m,g)),h&&(c/=Math.pow(2,p-1)),n={},n[v]=0,a=0;p>a;a++)s={},s[v]=(y?"-=":"+=")+c,r.animate(s,m,g).animate(n,m,g),c=h?2*c:c/2;h&&(s={opacity:0},s[v]=(y?"-=":"+=")+c,r.animate(s,m,g)),r.queue(function(){h&&r.hide(),e.effects.restore(r,o),e.effects.removeWrapper(r),i()}),_>1&&b.splice.apply(b,[1,0].concat(b.splice(_,f+1))),r.dequeue()}})(jQuery);(function(e){e.effects.effect.clip=function(t,i){var a,s,n,r=e(this),o=["position","top","bottom","left","right","height","width"],l=e.effects.setMode(r,t.mode||"hide"),h="show"===l,u=t.direction||"vertical",d="vertical"===u,c=d?"height":"width",p=d?"top":"left",f={};e.effects.save(r,o),r.show(),a=e.effects.createWrapper(r).css({overflow:"hidden"}),s="IMG"===r[0].tagName?a:r,n=s[c](),h&&(s.css(c,0),s.css(p,n/2)),f[c]=h?n:0,f[p]=h?0:n/2,s.animate(f,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){h||r.hide(),e.effects.restore(r,o),e.effects.removeWrapper(r),i()}})}})(jQuery);(function(e){e.effects.effect.drop=function(t,i){var a,s=e(this),n=["position","top","bottom","left","right","opacity","height","width"],r=e.effects.setMode(s,t.mode||"hide"),o="show"===r,l=t.direction||"left",h="up"===l||"down"===l?"top":"left",u="up"===l||"left"===l?"pos":"neg",d={opacity:o?1:0};e.effects.save(s,n),s.show(),e.effects.createWrapper(s),a=t.distance||s["top"===h?"outerHeight":"outerWidth"](!0)/2,o&&s.css("opacity",0).css(h,"pos"===u?-a:a),d[h]=(o?"pos"===u?"+=":"-=":"pos"===u?"-=":"+=")+a,s.animate(d,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){"hide"===r&&s.hide(),e.effects.restore(s,n),e.effects.removeWrapper(s),i()}})}})(jQuery);(function(e){e.effects.effect.explode=function(t,i){function s(){b.push(this),b.length===d*c&&a()}function a(){p.css({visibility:"visible"}),e(b).remove(),m||p.hide(),i()}var n,r,o,l,h,u,d=t.pieces?Math.round(Math.sqrt(t.pieces)):3,c=d,p=e(this),f=e.effects.setMode(p,t.mode||"hide"),m="show"===f,g=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/c),y=Math.ceil(p.outerHeight()/d),b=[];for(n=0;d>n;n++)for(l=g.top+n*y,u=n-(d-1)/2,r=0;c>r;r++)o=g.left+r*v,h=r-(c-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-r*v,top:-n*y}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:y,left:o+(m?h*v:0),top:l+(m?u*y:0),opacity:m?0:1}).animate({left:o+(m?0:h*v),top:l+(m?0:u*y),opacity:m?1:0},t.duration||500,t.easing,s)}})(jQuery);(function(e){e.effects.effect.fade=function(t,i){var s=e(this),a=e.effects.setMode(s,t.mode||"toggle");s.animate({opacity:a},{queue:!1,duration:t.duration,easing:t.easing,complete:i})}})(jQuery);(function(e){e.effects.effect.fold=function(t,i){var s,a,n=e(this),r=["position","top","bottom","left","right","height","width"],o=e.effects.setMode(n,t.mode||"hide"),l="show"===o,h="hide"===o,u=t.size||15,d=/([0-9]+)%/.exec(u),c=!!t.horizFirst,p=l!==c,f=p?["width","height"]:["height","width"],m=t.duration/2,g={},v={};e.effects.save(n,r),n.show(),s=e.effects.createWrapper(n).css({overflow:"hidden"}),a=p?[s.width(),s.height()]:[s.height(),s.width()],d&&(u=parseInt(d[1],10)/100*a[h?0:1]),l&&s.css(c?{height:0,width:u}:{height:u,width:0}),g[f[0]]=l?a[0]:u,v[f[1]]=l?a[1]:0,s.animate(g,m,t.easing).animate(v,m,t.easing,function(){h&&n.hide(),e.effects.restore(n,r),e.effects.removeWrapper(n),i()})}})(jQuery);(function(e){e.effects.effect.highlight=function(t,i){var s=e(this),a=["backgroundImage","backgroundColor","opacity"],n=e.effects.setMode(s,t.mode||"show"),r={backgroundColor:s.css("backgroundColor")};"hide"===n&&(r.opacity=0),e.effects.save(s,a),s.show().css({backgroundImage:"none",backgroundColor:t.color||"#ffff99"}).animate(r,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){"hide"===n&&s.hide(),e.effects.restore(s,a),i()}})}})(jQuery);(function(e){e.effects.effect.pulsate=function(t,i){var s,a=e(this),n=e.effects.setMode(a,t.mode||"show"),r="show"===n,o="hide"===n,l=r||"hide"===n,h=2*(t.times||5)+(l?1:0),u=t.duration/h,d=0,c=a.queue(),p=c.length;for((r||!a.is(":visible"))&&(a.css("opacity",0).show(),d=1),s=1;h>s;s++)a.animate({opacity:d},u,t.easing),d=1-d;a.animate({opacity:d},u,t.easing),a.queue(function(){o&&a.hide(),i()}),p>1&&c.splice.apply(c,[1,0].concat(c.splice(p,h+1))),a.dequeue()}})(jQuery);(function(e){e.effects.effect.puff=function(t,i){var s=e(this),a=e.effects.setMode(s,t.mode||"hide"),n="hide"===a,r=parseInt(t.percent,10)||150,o=r/100,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};e.extend(t,{effect:"scale",queue:!1,fade:!0,mode:a,complete:i,percent:n?r:100,from:n?h:{height:h.height*o,width:h.width*o,outerHeight:h.outerHeight*o,outerWidth:h.outerWidth*o}}),s.effect(t)},e.effects.effect.scale=function(t,i){var s=e(this),a=e.extend(!0,{},t),n=e.effects.setMode(s,t.mode||"effect"),r=parseInt(t.percent,10)||(0===parseInt(t.percent,10)?0:"hide"===n?0:100),o=t.direction||"both",h=t.origin,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},u={y:"horizontal"!==o?r/100:1,x:"vertical"!==o?r/100:1};a.effect="size",a.queue=!1,a.complete=i,"effect"!==n&&(a.origin=h||["middle","center"],a.restore=!0),a.from=t.from||("show"===n?{height:0,width:0,outerHeight:0,outerWidth:0}:l),a.to={height:l.height*u.y,width:l.width*u.x,outerHeight:l.outerHeight*u.y,outerWidth:l.outerWidth*u.x},a.fade&&("show"===n&&(a.from.opacity=0,a.to.opacity=1),"hide"===n&&(a.from.opacity=1,a.to.opacity=0)),s.effect(a)},e.effects.effect.size=function(t,i){var s,a,n,r=e(this),o=["position","top","bottom","left","right","width","height","overflow","opacity"],h=["position","top","bottom","left","right","overflow","opacity"],l=["width","height","overflow"],u=["fontSize"],d=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],c=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=e.effects.setMode(r,t.mode||"effect"),f=t.restore||"effect"!==p,m=t.scale||"both",g=t.origin||["middle","center"],v=r.css("position"),y=f?o:h,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&r.show(),s={height:r.height(),width:r.width(),outerHeight:r.outerHeight(),outerWidth:r.outerWidth()},"toggle"===t.mode&&"show"===p?(r.from=t.to||b,r.to=t.from||s):(r.from=t.from||("show"===p?b:s),r.to=t.to||("hide"===p?b:s)),n={from:{y:r.from.height/s.height,x:r.from.width/s.width},to:{y:r.to.height/s.height,x:r.to.width/s.width}},("box"===m||"both"===m)&&(n.from.y!==n.to.y&&(y=y.concat(d),r.from=e.effects.setTransition(r,d,n.from.y,r.from),r.to=e.effects.setTransition(r,d,n.to.y,r.to)),n.from.x!==n.to.x&&(y=y.concat(c),r.from=e.effects.setTransition(r,c,n.from.x,r.from),r.to=e.effects.setTransition(r,c,n.to.x,r.to))),("content"===m||"both"===m)&&n.from.y!==n.to.y&&(y=y.concat(u).concat(l),r.from=e.effects.setTransition(r,u,n.from.y,r.from),r.to=e.effects.setTransition(r,u,n.to.y,r.to)),e.effects.save(r,y),r.show(),e.effects.createWrapper(r),r.css("overflow","hidden").css(r.from),g&&(a=e.effects.getBaseline(g,s),r.from.top=(s.outerHeight-r.outerHeight())*a.y,r.from.left=(s.outerWidth-r.outerWidth())*a.x,r.to.top=(s.outerHeight-r.to.outerHeight)*a.y,r.to.left=(s.outerWidth-r.to.outerWidth)*a.x),r.css(r.from),("content"===m||"both"===m)&&(d=d.concat(["marginTop","marginBottom"]).concat(u),c=c.concat(["marginLeft","marginRight"]),l=o.concat(d).concat(c),r.find("*[width]").each(function(){var i=e(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&e.effects.save(i,l),i.from={height:s.height*n.from.y,width:s.width*n.from.x,outerHeight:s.outerHeight*n.from.y,outerWidth:s.outerWidth*n.from.x},i.to={height:s.height*n.to.y,width:s.width*n.to.x,outerHeight:s.height*n.to.y,outerWidth:s.width*n.to.x},n.from.y!==n.to.y&&(i.from=e.effects.setTransition(i,d,n.from.y,i.from),i.to=e.effects.setTransition(i,d,n.to.y,i.to)),n.from.x!==n.to.x&&(i.from=e.effects.setTransition(i,c,n.from.x,i.from),i.to=e.effects.setTransition(i,c,n.to.x,i.to)),i.css(i.from),i.animate(i.to,t.duration,t.easing,function(){f&&e.effects.restore(i,l)})})),r.animate(r.to,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){0===r.to.opacity&&r.css("opacity",r.from.opacity),"hide"===p&&r.hide(),e.effects.restore(r,y),f||("static"===v?r.css({position:"relative",top:r.to.top,left:r.to.left}):e.each(["top","left"],function(e,t){r.css(t,function(t,i){var s=parseInt(i,10),a=e?r.to.left:r.to.top;return"auto"===i?a+"px":s+a+"px"})})),e.effects.removeWrapper(r),i()}})}})(jQuery);(function(e){e.effects.effect.shake=function(t,i){var s,a=e(this),n=["position","top","bottom","left","right","height","width"],r=e.effects.setMode(a,t.mode||"effect"),o=t.direction||"left",h=t.distance||20,l=t.times||3,u=2*l+1,d=Math.round(t.duration/u),c="up"===o||"down"===o?"top":"left",p="up"===o||"left"===o,f={},m={},g={},v=a.queue(),y=v.length;for(e.effects.save(a,n),a.show(),e.effects.createWrapper(a),f[c]=(p?"-=":"+=")+h,m[c]=(p?"+=":"-=")+2*h,g[c]=(p?"-=":"+=")+2*h,a.animate(f,d,t.easing),s=1;l>s;s++)a.animate(m,d,t.easing).animate(g,d,t.easing);a.animate(m,d,t.easing).animate(f,d/2,t.easing).queue(function(){"hide"===r&&a.hide(),e.effects.restore(a,n),e.effects.removeWrapper(a),i()}),y>1&&v.splice.apply(v,[1,0].concat(v.splice(y,u+1))),a.dequeue()}})(jQuery);(function(e){e.effects.effect.slide=function(t,i){var s,a=e(this),n=["position","top","bottom","left","right","width","height"],r=e.effects.setMode(a,t.mode||"show"),o="show"===r,h=t.direction||"left",l="up"===h||"down"===h?"top":"left",u="up"===h||"left"===h,d={};e.effects.save(a,n),a.show(),s=t.distance||a["top"===l?"outerHeight":"outerWidth"](!0),e.effects.createWrapper(a).css({overflow:"hidden"}),o&&a.css(l,u?isNaN(s)?"-"+s:-s:s),d[l]=(o?u?"+=":"-=":u?"-=":"+=")+s,a.animate(d,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){"hide"===r&&a.hide(),e.effects.restore(a,n),e.effects.removeWrapper(a),i()}})}})(jQuery);(function(e){e.effects.effect.transfer=function(t,i){var s=e(this),a=e(t.to),n="fixed"===a.css("position"),r=e("body"),o=n?r.scrollTop():0,h=n?r.scrollLeft():0,l=a.offset(),u={top:l.top-o,left:l.left-h,height:a.innerHeight(),width:a.innerWidth()},d=s.offset(),c=e("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(t.className).css({top:d.top-o,left:d.left-h,height:s.innerHeight(),width:s.innerWidth(),position:n?"fixed":"absolute"}).animate(u,t.duration,t.easing,function(){c.remove(),i()})}})(jQuery);
//! require----jquery.js
//= require /jquery-ui/js/jquery-ui-1.10.3.custom.min.js
/*!
 * Bootstrap v3.0.1 by @fat and @mdo
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 *
 * Designed and built with all the love in the world by @mdo and @fat.
 */

if (typeof jQuery === "undefined") {
    throw new Error("Bootstrap requires jQuery")
}

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd otransitionend', 'transition': 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false, $el = this
        $(this).one($.support.transition.end, function () {
            called = true
        })
        var callback = function () {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()
    })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.prototype.close = function (e) {
        var $this = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.hasClass('alert') ? $this : $this.parent()
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            $parent.trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one($.support.transition.end, removeElement)
                .emulateTransitionEnd(150) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    var old = $.fn.alert

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Button.DEFAULTS, options)
    }

    Button.DEFAULTS = {
        loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
        var d = 'disabled'
        var $el = this.$element
        var val = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state = state + 'Text'

        if (!data.resetText) $el.data('resetText', $el[val]())

        $el[val](data[state] || this.options[state])

        // push to event loop to allow forms to submit
        setTimeout(function () {
            state == 'loadingText' ?
                $el.addClass(d).attr(d, d) :
                $el.removeClass(d).removeAttr(d);
        }, 0)
    }

    Button.prototype.toggle = function () {
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
            var $input = this.$element.find('input')
                .prop('checked', !this.$element.hasClass('active'))
                .trigger('change')
            if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
        }

        this.$element.toggleClass('active')
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    var old = $.fn.button

    $.fn.button = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.button')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.button', (data = new Button(this, options)))

            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
    }


    // BUTTON DATA-API
    // ===============

    $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        $btn.button('toggle')
        e.preventDefault()
    })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused =
            this.sliding =
                this.interval =
                    this.$active =
                        this.$items = null

        this.options.pause == 'hover' && this.$element
            .on('mouseenter', $.proxy(this.pause, this))
            .on('mouseleave', $.proxy(this.cycle, this))
    }

    Carousel.DEFAULTS = {
        interval: 5000, pause: 'hover', wrap: true
    }

    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
            && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getActiveIndex = function () {
        this.$active = this.$element.find('.item.active')
        this.$items = this.$active.parent().children()

        return this.$items.index(this.$active)
    }

    Carousel.prototype.to = function (pos) {
        var that = this
        var activeIndex = this.getActiveIndex()

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding)       return this.$element.one('slid', function () {
            that.to(pos)
        })
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition.end) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || $active[type]()
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback = type == 'next' ? 'first' : 'last'
        var that = this

        if (!$next.length) {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }

        this.sliding = true

        isCycling && this.pause()

        var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

        if ($next.hasClass('active')) return

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            this.$element.one('slid', function () {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
                $nextIndicator && $nextIndicator.addClass('active')
            })
        }

        if ($.support.transition && this.$element.hasClass('slide')) {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one($.support.transition.end, function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () {
                        that.$element.trigger('slid')
                    }, 0)
                })
                .emulateTransitionEnd(600)
        } else {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid')
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    var old = $.fn.carousel

    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
        var $this = $(this), href
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        $target.carousel(options)

        if (slideIndex = $this.attr('data-slide-to')) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    })

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            $carousel.carousel($carousel.data())
        })
    })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.transitioning = null

        if (this.options.parent) this.$parent = $(this.options.parent)
        if (this.options.toggle) this.toggle()
    }

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var actives = this.$parent && this.$parent.find('> .panel > .in')

        if (actives && actives.length) {
            var hasData = actives.data('bs.collapse')
            if (hasData && hasData.transitioning) return
            actives.collapse('hide')
            hasData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')
            [dimension](0)

        this.transitioning = 1

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('in')
                [dimension]('auto')
            this.transitioning = 0
            this.$element.trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one($.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(350)
            [dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element
            [dimension](this.$element[dimension]())
            [0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse')
            .removeClass('in')

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0
            this.$element
                .trigger('hidden.bs.collapse')
                .removeClass('collapsing')
                .addClass('collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
            [dimension](0)
            .one($.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(350)
    }

    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    var old = $.fn.collapse

    $.fn.collapse = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
        var $this = $(this), href
        var target = $this.attr('data-target')
            || e.preventDefault()
            || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        var $target = $(target)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()
        var parent = $this.attr('data-parent')
        var $parent = parent && $(parent)

        if (!data || !data.transitioning) {
            if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
            $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
        }

        $target.collapse(option)
    })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle=dropdown]'
    var Dropdown = function (element) {
        var $el = $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }

            $parent.trigger(e = $.Event('show.bs.dropdown'))

            if (e.isDefaultPrevented()) return

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown')

            $this.focus()
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27)/.test(e.keyCode)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive || (isActive && e.keyCode == 27)) {
            if (e.which == 27) $parent.find(toggle).focus()
            return $this.click()
        }

        var $items = $('[role=menu] li:not(.divider):visible a', $parent)

        if (!$items.length) return

        var index = $items.index($items.filter(':focus'))

        if (e.keyCode == 38 && index > 0)                 index--                        // up
        if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
        if (!~index)                                      index = 0

        $items.eq(index).focus()
    }

    function clearMenus() {
        $(backdrop).remove()
        $(toggle).each(function (e) {
            var $parent = getParent($(this))
            if (!$parent.hasClass('open')) return
            $parent.trigger(e = $.Event('hide.bs.dropdown'))
            if (e.isDefaultPrevented()) return
            $parent.removeClass('open').trigger('hidden.bs.dropdown')
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('dropdown')

            if (!data) $this.data('dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
            e.stopPropagation()
        })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]', Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
            this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Modal.DEFAULTS = {
        backdrop: true, keyboard: true, show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move modals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
                that.$element.find('.modal-dialog') // wait for modal to slide in
                    .one($.support.transition.end, function () {
                        that.$element.focus().trigger(e)
                    })
                    .emulateTransitionEnd(300) :
                that.$element.focus().trigger(e)
        })
    }

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one($.support.transition.end, $.proxy(this.hideModal, this))
                .emulateTransitionEnd(300) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.focus()
                }
            }, this))
    }

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                    ? this.$element[0].focus.call(this.$element[0])
                    : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                    .one($.support.transition.end, callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one($.support.transition.end, callback)
                    .emulateTransitionEnd(150) :
                callback()

        } else if (callback) {
            callback()
        }
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    var old = $.fn.modal

    $.fn.modal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
            .modal(option, this)
            .one('hide', function () {
                $this.is(':visible') && $this.focus()
            })
    })

    $(document)
        .on('show.bs.modal', '.modal', function () {
            $(document.body).addClass('modal-open')
        })
        .on('hidden.bs.modal', '.modal', function () {
            $(document.body).removeClass('modal-open')
        })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type =
            this.options =
                this.enabled =
                    this.timeout =
                        this.hoverState =
                            this.$element = null

        this.init('tooltip', element, options)
    }

    Tooltip.DEFAULTS = {
        animation: true, placement: 'top', selector: false, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: 'hover focus', title: '', delay: 0, html: false, container: false
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay, hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return

            var $tip = this.tip()

            this.setContent()

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var $parent = this.$element.parent()

                var orgPlacement = placement
                var docScroll = document.documentElement.scrollTop || document.body.scrollTop
                var parentWidth = this.options.container == 'body' ? window.innerWidth : $parent.outerWidth()
                var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
                var parentLeft = this.options.container == 'body' ? 0 : $parent.offset().left

                placement = placement == 'bottom' && pos.top + pos.height + actualHeight - docScroll > parentHeight ? 'top' :
                    placement == 'top' && pos.top - docScroll - actualHeight < 0 ? 'bottom' :
                        placement == 'right' && pos.right + actualWidth > parentWidth ? 'left' :
                            placement == 'left' && pos.left - actualWidth < parentLeft ? 'right' :
                                placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)
            this.$element.trigger('shown.bs.' + this.type)
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var replace
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top = offset.top + marginTop
        offset.left = offset.left + marginLeft

        $tip
            .offset(offset)
            .addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            replace = true
            offset.top = offset.top + height - actualHeight
        }

        if (/bottom|top/.test(placement)) {
            var delta = 0

            if (offset.left < 0) {
                delta = offset.left * -2
                offset.left = 0

                $tip.offset(offset)

                actualWidth = $tip[0].offsetWidth
                actualHeight = $tip[0].offsetHeight
            }

            this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
        } else {
            this.replaceArrow(actualHeight - height, actualHeight, 'top')
        }

        if (replace) $tip.offset(offset)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
        this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function () {
        var that = this
        var $tip = this.tip()
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && this.$tip.hasClass('fade') ?
            $tip
                .one($.support.transition.end, complete)
                .emulateTransitionEnd(150) :
            complete()

        this.$element.trigger('hidden.bs.' + this.type)

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function () {
        var el = this.$element[0]
        return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
            width: el.offsetWidth, height: el.offsetHeight
        }, this.$element.offset())
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2  } :
            placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
                placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
    }

    Tooltip.prototype.tip = function () {
        return this.$tip = this.$tip || $(this.options.template)
    }

    Tooltip.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
    }

    Tooltip.prototype.validate = function () {
        if (!this.$element[0].parentNode) {
            this.hide()
            this.$element = null
            this.options = null
        }
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function () {
        this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    var old = $.fn.tooltip

    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right', trigger: 'click', content: '', template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o = this.options

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
    }

    Popover.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find('.arrow')
    }

    Popover.prototype.tip = function () {
        if (!this.$tip) this.$tip = $(this.options.template)
        return this.$tip
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    var old = $.fn.popover

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
        var href
        var process = $.proxy(this.process, this)

        this.$element = $(element).is('body') ? $(window) : $(element)
        this.$body = $('body')
        this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target
            || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            || '') + ' .nav li > a'
        this.offsets = $([])
        this.targets = $([])
        this.activeTarget = null

        this.refresh()
        this.process()
    }

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.refresh = function () {
        var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

        this.offsets = $([])
        this.targets = $([])

        var self = this
        var $targets = this.$body
            .find(this.selector)
            .map(function () {
                var $el = $(this)
                var href = $el.data('target') || $el.attr('href')
                var $href = /^#\w/.test(href) && $(href)

                return ($href
                    && $href.length
                    && [
                    [ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]
                ]) || null
            })
            .sort(function (a, b) {
                return a[0] - b[0]
            })
            .each(function () {
                self.offsets.push(this[0])
                self.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
        var maxScroll = scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets.last()[0]) && this.activate(i)
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
                && scrollTop >= offsets[i]
                && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate(targets[i])
        }
    }

    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target

        $(this.selector)
            .parents('.active')
            .removeClass('active')

        var selector = this.selector
            + '[data-target="' + target + '"],'
            + this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    var old = $.fn.scrollspy

    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            $spy.scrollspy($spy.data())
        })
    })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        this.element = $(element)
    }

    Tab.prototype.show = function () {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var previous = $ul.find('.active:last a')[0]
        var e = $.Event('show.bs.tab', {
            relatedTarget: previous
        })

        $this.trigger(e)

        if (e.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.parent('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $this.trigger({
                type: 'shown.bs.tab', relatedTarget: previous
            })
        })
    }

    Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback
            && $.support.transition
            && $active.hasClass('fade')

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')

            element.addClass('active')

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu')) {
                element.closest('li.dropdown').addClass('active')
            }

            callback && callback()
        }

        transition ?
            $active
                .one($.support.transition.end, next)
                .emulateTransitionEnd(150) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    var old = $.fn.tab

    $.fn.tab = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
    "use strict";

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)
        this.$window = $(window)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

        this.$element = $(element)
        this.affixed =
            this.unpin = null

        this.checkPosition()
    }

    Affix.RESET = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0
    }

    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var scrollHeight = $(document).height()
        var scrollTop = this.$window.scrollTop()
        var position = this.$element.offset()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom

        if (typeof offset != 'object')         offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function')    offsetTop = offset.top()
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

        var affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ? false :
            offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop != null && (scrollTop <= offsetTop) ? 'top' : false

        if (this.affixed === affix) return
        if (this.unpin) this.$element.css('top', '')

        this.affixed = affix
        this.unpin = affix == 'bottom' ? position.top - scrollTop : null

        this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

        if (affix == 'bottom') {
            this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    var old = $.fn.affix

    $.fn.affix = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom) data.offset.bottom = data.offsetBottom
            if (data.offsetTop)    data.offset.top = data.offsetTop

            $spy.affix(data)
        })
    })

}(window.jQuery);

(function ($) {/*
 jQuery Toggles v2.0.4
 Copyright 2013 Simon Tabor - MIT License
 https://github.com/simontabor/jquery-toggles / http://simontabor.com/labs/toggles
 */
    $.fn.toggles = function (d) {
        function p(e, b, f, c) {
            var r = e.toggleClass("active").hasClass("active");
            if (c !== r) {
                var d = e.find(".toggle-inner").css(w);
                e.find(".toggle-off").toggleClass("active");
                e.find(".toggle-on").toggleClass("active");
                a.checkbox.prop("checked", r);
                if (!k) {
                    var l = r ? 0 : -b + f;
                    d.css("margin-left", l);
                    setTimeout(function () {
                        d.css(x);
                        d.css("margin-left", l)
                    }, a.animate)
                }
            }
        }

        d = d || {};
        var a = $.extend({drag: !0, click: !0, text: {on: "ON", off: "OFF"}, on: !1, animate: 250, transition: "ease-in-out", checkbox: null, clicker: null,
            width: 50, height: 20, type: "compact"}, d), k = "select" == a.type;
        a.checkbox = $(a.checkbox);
        a.clicker && (a.clicker = $(a.clicker));
        d = "margin-left " + a.animate + "ms " + a.transition;
        var w = {"-webkit-transition": d, "-moz-transition": d, transition: d}, x = {"-webkit-transition": "", "-moz-transition": "", transition: ""};
        return this.each(function () {
            var e = $(this), b = e.height(), f = e.width();
            if (!b || !f)e.height(b = a.height), e.width(f = a.width);
            var c = $('<div class="toggle-slide">'), d = $('<div class="toggle-inner">'), t = $('<div class="toggle-on">'),
                l = $('<div class="toggle-off">'), h = $('<div class="toggle-blob">'), m = b / 2, s = f - m;
            t.css({height: b, width: s, textAlign: "center", textIndent: k ? "" : -m, lineHeight: b + "px"}).html(a.text.on);
            l.css({height: b, width: s, marginLeft: k ? "" : -m, textAlign: "center", textIndent: k ? "" : m, lineHeight: b + "px"}).html(a.text.off).addClass("active");
            h.css({height: b, width: b, marginLeft: -m});
            d.css({width: 2 * f - b, marginLeft: k ? 0 : -f + b});
            k && (c.addClass("toggle-select"), e.css("width", 2 * s), h.hide());
            e.html(c.html(d.append(t, h, l)));
            c.on("toggle", function (a, d) {
                a && a.stopPropagation();
                p(c, f, b);
                e.trigger("toggle", !d)
            });
            e.on("toggleOn", function () {
                p(c, f, b, !1)
            });
            e.on("toggleOff", function () {
                p(c, f, b, !0)
            });
            a.on && p(c, f, b);
            if (a.click && (!a.clicker || !a.clicker.has(e).length))e.on("click", function (b) {
                (b.target != h[0] || !a.drag) && c.trigger("toggle", c.hasClass("active"))
            });
            if (a.clicker)a.clicker.on("click", function (b) {
                (b.target != h[0] || !a.drag) && c.trigger("toggle", c.hasClass("active"))
            });
            if (a.drag && !k) {
                var g, u = (f - b) / 4, v = function (k) {
                    e.off("mousemove");
                    c.off("mouseleave");
                    h.off("mouseup");
                    var q = c.hasClass("active");
                    !g && a.click && "mouseleave" !== k.type ? c.trigger("toggle", q) : q ? g < -u ? c.trigger("toggle", q) : d.animate({marginLeft: 0}, a.animate / 2) : g > u ? c.trigger("toggle", q) : d.animate({marginLeft: -f + b}, a.animate / 2)
                }, n = -f + b;
                h.on("mousedown", function (a) {
                    g = 0;
                    h.off("mouseup");
                    c.off("mouseleave");
                    var b = a.pageX;
                    e.on("mousemove", h, function (a) {
                        g = a.pageX - b;
                        c.hasClass("active") ? (a = g, 0 < g && (a = 0), g < n && (a = n)) : (a = g + n, 0 > g && (a = n), g > -n && (a = 0));
                        d.css("margin-left", a)
                    });
                    h.on("mouseup", v);
                    c.on("mouseleave",
                        v)
                })
            }
        })
    };
})(jQuery);
/*!
 * enquire.js v2.1.0 - Awesome Media Queries in JavaScript
 * Copyright (c) 2013 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

;
(function (name, context, factory) {
    var matchMedia = context.matchMedia;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(matchMedia);
    }
    else if (typeof define === 'function' && define.amd) {
        define(function () {
            return (context[name] = factory(matchMedia));
        });
    }
    else {
        context[name] = factory(matchMedia);
    }
}('enquire', this, function (matchMedia) {

    'use strict';

    /*jshint unused:false */
    /**
     * Helper function for iterating over a collection
     *
     * @param collection
     * @param fn
     */
    function each(collection, fn) {
        var i = 0,
            length = collection.length,
            cont;

        for (i; i < length; i++) {
            cont = fn(collection[i], i);
            if (cont === false) {
                break; //allow early exit
            }
        }
    }

    /**
     * Helper function for determining whether target object is an array
     *
     * @param target the object under test
     * @return {Boolean} true if array, false otherwise
     */
    function isArray(target) {
        return Object.prototype.toString.apply(target) === '[object Array]';
    }

    /**
     * Helper function for determining whether target object is a function
     *
     * @param target the object under test
     * @return {Boolean} true if function, false otherwise
     */
    function isFunction(target) {
        return typeof target === 'function';
    }

    /**
     * Delegate to handle a media query being matched and unmatched.
     *
     * @param {object} options
     * @param {function} options.match callback for when the media query is matched
     * @param {function} [options.unmatch] callback for when the media query is unmatched
     * @param {function} [options.setup] one-time callback triggered the first time a query is matched
     * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
     * @constructor
     */
    function QueryHandler(options) {
        this.options = options;
        !options.deferSetup && this.setup();
    }

    QueryHandler.prototype = {

        /**
         * coordinates setup of the handler
         *
         * @function
         */
        setup: function () {
            if (this.options.setup) {
                this.options.setup();
            }
            this.initialised = true;
        },

        /**
         * coordinates setup and triggering of the handler
         *
         * @function
         */
        on: function () {
            !this.initialised && this.setup();
            this.options.match && this.options.match();
        },

        /**
         * coordinates the unmatch event for the handler
         *
         * @function
         */
        off: function () {
            this.options.unmatch && this.options.unmatch();
        },

        /**
         * called when a handler is to be destroyed.
         * delegates to the destroy or unmatch callbacks, depending on availability.
         *
         * @function
         */
        destroy: function () {
            this.options.destroy ? this.options.destroy() : this.off();
        },

        /**
         * determines equality by reference.
         * if object is supplied compare options, if function, compare match callback
         *
         * @function
         * @param {object || function} [target] the target for comparison
         */
        equals: function (target) {
            return this.options === target || this.options.match === target;
        }

    };
    /**
     * Represents a single media query, manages it's state and registered handlers for this query
     *
     * @constructor
     * @param {string} query the media query string
     * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
     */
    function MediaQuery(query, isUnconditional) {
        this.query = query;
        this.isUnconditional = isUnconditional;
        this.handlers = [];
        this.mql = matchMedia(query);

        var self = this;
        this.listener = function (mql) {
            self.mql = mql;
            self.assess();
        };
        this.mql.addListener(this.listener);
    }

    MediaQuery.prototype = {

        /**
         * add a handler for this query, triggering if already active
         *
         * @param {object} handler
         * @param {function} handler.match callback for when query is activated
         * @param {function} [handler.unmatch] callback for when query is deactivated
         * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
         * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
         */
        addHandler: function (handler) {
            var qh = new QueryHandler(handler);
            this.handlers.push(qh);

            this.matches() && qh.on();
        },

        /**
         * removes the given handler from the collection, and calls it's destroy methods
         *
         * @param {object || function} handler the handler to remove
         */
        removeHandler: function (handler) {
            var handlers = this.handlers;
            each(handlers, function (h, i) {
                if (h.equals(handler)) {
                    h.destroy();
                    return !handlers.splice(i, 1); //remove from array and exit each early
                }
            });
        },

        /**
         * Determine whether the media query should be considered a match
         *
         * @return {Boolean} true if media query can be considered a match, false otherwise
         */
        matches: function () {
            return this.mql.matches || this.isUnconditional;
        },

        /**
         * Clears all handlers and unbinds events
         */
        clear: function () {
            each(this.handlers, function (handler) {
                handler.destroy();
            });
            this.mql.removeListener(this.listener);
            this.handlers.length = 0; //clear array
        },

        /*
         * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
         */
        assess: function () {
            var action = this.matches() ? 'on' : 'off';

            each(this.handlers, function (handler) {
                handler[action]();
            });
        }
    };
    /**
     * Allows for registration of query handlers.
     * Manages the query handler's state and is responsible for wiring up browser events
     *
     * @constructor
     */
    function MediaQueryDispatch() {
        if (!matchMedia) {
            throw new Error('matchMedia not present, legacy browsers require a polyfill');
        }

        this.queries = {};
        this.browserIsIncapable = !matchMedia('only all').matches;
    }

    MediaQueryDispatch.prototype = {

        /**
         * Registers a handler for the given media query
         *
         * @param {string} q the media query
         * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
         * @param {function} options.match fired when query matched
         * @param {function} [options.unmatch] fired when a query is no longer matched
         * @param {function} [options.setup] fired when handler first triggered
         * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
         * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
         */
        register: function (q, options, shouldDegrade) {
            var queries = this.queries,
                isUnconditional = shouldDegrade && this.browserIsIncapable;

            if (!queries[q]) {
                queries[q] = new MediaQuery(q, isUnconditional);
            }

            //normalise to object in an array
            if (isFunction(options)) {
                options = { match: options };
            }
            if (!isArray(options)) {
                options = [options];
            }
            each(options, function (handler) {
                queries[q].addHandler(handler);
            });

            return this;
        },

        /**
         * unregisters a query and all it's handlers, or a specific handler for a query
         *
         * @param {string} q the media query to target
         * @param {object || function} [handler] specific handler to unregister
         */
        unregister: function (q, handler) {
            var query = this.queries[q];

            if (query) {
                if (handler) {
                    query.removeHandler(handler);
                }
                else {
                    query.clear();
                    delete this.queries[q];
                }
            }

            return this;
        }
    };

    return new MediaQueryDispatch();

}));

/*
 * Copyright (c) 2013 Shane Carr
 * https://github.com/vote539/placeholdr
 * 
 * HTML5 Placeholders for <IE10
 */

!function (a, b, c, d) {
    var e = function () {
        var e = a(this);
        e[d]() || (e.addClass(b), "password" === e.attr("type") && (e.attr("type", "text"), e.data(b + "-pwd", !0)), e[d](e.attr(c)))
    }, f = function () {
        var e = a(this);
        e.removeClass(b), e.data(b + "-pwd") && e.attr("type", "password"), e[d]() === e.attr(c) && e[d]("")
    }, g = function () {
        a(this).find("[" + c + "]").each(function () {
            a(this).data(b) && f.call(this)
        })
    };
    a.fn.placeholdr = function () {
        c in document.createElement("input") || (a(this).find("[" + c + "]").each(function () {
            var c = a(this);
            c.data(b) || (c.data(b, !0), e.call(this), c.focus(f), c.blur(e))
        }), a(this).find("form").each(function () {
            var c = a(this);
            c.data(b) || (c.data(b, !0), c.submit(g))
        }))
    }, a.fn[d] = a.fn.val, a.fn.val = function (e) {
        var g = a(this);
        return"undefined" === a.type(e) && g.data(b) && g[d]() === g.attr(c) ? "" : ("string" === a.type(e) && f.call(this), a.fn[d].apply(this, arguments))
    }, a(function () {
        a(document).placeholdr()
    }), document.write("<style>.placeholdr{color:#AAA;}</style>")
}(jQuery, "placeholdr", "placeholder", "placeholdrVal");
//= require /js/layout/bootstrap.js
//= require /js/form-toggle/toggle.min.js
//= require /js/layout/enquire.js
//= require /js/layout/placeholder.js
/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 */

!function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function (a) {
    function c(a) {
        return a
    }

    function d(a) {
        return decodeURIComponent(a.replace(b, " "))
    }

    function e(a) {
        0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return f.json ? JSON.parse(a) : a
        } catch (b) {
        }
    }

    var b = /\+/g, f = a.cookie = function (b, g, h) {
        if (void 0 !== g) {
            if (h = a.extend({}, f.defaults, h), "number" == typeof h.expires) {
                var i = h.expires, j = h.expires = new Date;
                j.setDate(j.getDate() + i)
            }
            return g = f.json ? JSON.stringify(g) : String(g), document.cookie = [f.raw ? b : encodeURIComponent(b), "=", f.raw ? g : encodeURIComponent(g), h.expires ? "; expires=" + h.expires.toUTCString() : "", h.path ? "; path=" + h.path : "", h.domain ? "; domain=" + h.domain : "", h.secure ? "; secure" : ""].join("")
        }
        for (var k = f.raw ? c : d, l = document.cookie.split("; "), m = b ? void 0 : {}, n = 0, o = l.length; o > n; n++) {
            var p = l[n].split("="), q = k(p.shift()), r = k(p.join("="));
            if (b && b === q) {
                m = e(r);
                break
            }
            b || (m[q] = e(r))
        }
        return m
    };
    f.defaults = {}, a.removeCookie = function (b, c) {
        return void 0 !== a.cookie(b) ? (a.cookie(b, "", a.extend({}, c, {expires: -1})), !0) : !1
    }
});
/* jquery.nicescroll 3.2.0 InuYaksa*2013 MIT http://areaaperta.com/nicescroll */
(function (e) {
    var y = !1, D = !1, J = 5E3, K = 2E3, x = 0, L = function () {
        var e = document.getElementsByTagName("script"), e = e[e.length - 1].src.split("?")[0];
        return 0 < e.split("/").length ? e.split("/").slice(0, -1).join("/") + "/" : ""
    }();
    Array.prototype.forEach || (Array.prototype.forEach = function (e, c) {
        for (var h = 0, l = this.length; h < l; ++h)e.call(c, this[h], h, this)
    });
    var v = window.requestAnimationFrame || !1, w = window.cancelAnimationFrame || !1;
    ["ms", "moz", "webkit", "o"].forEach(function (e) {
        v || (v = window[e + "RequestAnimationFrame"]);
        w || (w =
            window[e + "CancelAnimationFrame"] || window[e + "CancelRequestAnimationFrame"])
    });
    var z = window.MutationObserver || window.WebKitMutationObserver || !1, F = {zindex: "auto", cursoropacitymin: 0, cursoropacitymax: 1, cursorcolor: "#424242", cursorwidth: "5px", cursorborder: "1px solid #fff", cursorborderradius: "5px", scrollspeed: 60, mousescrollstep: 24, touchbehavior: !1, hwacceleration: !0, usetransition: !0, boxzoom: !1, dblclickzoom: !0, gesturezoom: !0, grabcursorenabled: !0, autohidemode: !0, background: "", iframeautoresize: !0, cursorminheight: 32,
            preservenativescrolling: !0, railoffset: !1, bouncescroll: !0, spacebarenabled: !0, railpadding: {top: 0, right: 0, left: 0, bottom: 0}, disableoutline: !0, horizrailenabled: !0, railalign: "right", railvalign: "bottom", enabletranslate3d: !0, enablemousewheel: !0, enablekeyboard: !0, smoothscroll: !0, sensitiverail: !0, enablemouselockapi: !0, cursorfixedheight: !1, directionlockdeadzone: 6, hidecursordelay: 400, nativeparentscrolling: !0, enablescrollonselection: !0, overflowx: !0, overflowy: !0, cursordragspeed: 0.3, rtlmode: !1, cursordragontouch: !1},
        E = !1, M = function () {
            if (E)return E;
            var e = document.createElement("DIV"), c = {haspointerlock: "pointerLockElement"in document || "mozPointerLockElement"in document || "webkitPointerLockElement"in document};
            c.isopera = "opera"in window;
            c.isopera12 = c.isopera && "getUserMedia"in navigator;
            c.isie = "all"in document && "attachEvent"in e && !c.isopera;
            c.isieold = c.isie && !("msInterpolationMode"in e.style);
            c.isie7 = c.isie && !c.isieold && (!("documentMode"in document) || 7 == document.documentMode);
            c.isie8 = c.isie && "documentMode"in document &&
                8 == document.documentMode;
            c.isie9 = c.isie && "performance"in window && 9 <= document.documentMode;
            c.isie10 = c.isie && "performance"in window && 10 <= document.documentMode;
            c.isie9mobile = /iemobile.9/i.test(navigator.userAgent);
            c.isie9mobile && (c.isie9 = !1);
            c.isie7mobile = !c.isie9mobile && c.isie7 && /iemobile/i.test(navigator.userAgent);
            c.ismozilla = "MozAppearance"in e.style;
            c.iswebkit = "WebkitAppearance"in e.style;
            c.ischrome = "chrome"in window;
            c.ischrome22 = c.ischrome && c.haspointerlock;
            c.ischrome26 = c.ischrome && "transition"in
                e.style;
            c.cantouch = "ontouchstart"in document.documentElement || "ontouchstart"in window;
            c.hasmstouch = window.navigator.msPointerEnabled || !1;
            c.ismac = /^mac$/i.test(navigator.platform);
            c.isios = c.cantouch && /iphone|ipad|ipod/i.test(navigator.platform);
            c.isios4 = c.isios && !("seal"in Object);
            c.isandroid = /android/i.test(navigator.userAgent);
            c.trstyle = !1;
            c.hastransform = !1;
            c.hastranslate3d = !1;
            c.transitionstyle = !1;
            c.hastransition = !1;
            c.transitionend = !1;
            for (var h = ["transform", "msTransform", "webkitTransform", "MozTransform",
                "OTransform"], l = 0; l < h.length; l++)if ("undefined" != typeof e.style[h[l]]) {
                c.trstyle = h[l];
                break
            }
            c.hastransform = !1 != c.trstyle;
            c.hastransform && (e.style[c.trstyle] = "translate3d(1px,2px,3px)", c.hastranslate3d = /translate3d/.test(e.style[c.trstyle]));
            c.transitionstyle = !1;
            c.prefixstyle = "";
            c.transitionend = !1;
            for (var h = "transition webkitTransition MozTransition OTransition OTransition msTransition KhtmlTransition".split(" "), n = " -webkit- -moz- -o- -o -ms- -khtml-".split(" "), t = "transitionend webkitTransitionEnd transitionend otransitionend oTransitionEnd msTransitionEnd KhtmlTransitionEnd".split(" "),
                     l = 0; l < h.length; l++)if (h[l]in e.style) {
                c.transitionstyle = h[l];
                c.prefixstyle = n[l];
                c.transitionend = t[l];
                break
            }
            c.ischrome26 && (c.prefixstyle = n[1]);
            c.hastransition = c.transitionstyle;
            a:{
                h = ["-moz-grab", "-webkit-grab", "grab"];
                if (c.ischrome && !c.ischrome22 || c.isie)h = [];
                for (l = 0; l < h.length; l++)if (n = h[l], e.style.cursor = n, e.style.cursor == n) {
                    h = n;
                    break a
                }
                h = "url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize"
            }
            c.cursorgrabvalue = h;
            c.hasmousecapture = "setCapture"in e;
            c.hasMutationObserver = !1 !== z;
            return E =
                c
        }, N = function (k, c) {
            function h() {
                var d = b.win;
                if ("zIndex"in d)return d.zIndex();
                for (; 0 < d.length && 9 != d[0].nodeType;) {
                    var c = d.css("zIndex");
                    if (!isNaN(c) && 0 != c)return parseInt(c);
                    d = d.parent()
                }
                return!1
            }

            function l(d, c, g) {
                c = d.css(c);
                d = parseFloat(c);
                return isNaN(d) ? (d = u[c] || 0, g = 3 == d ? g ? b.win.outerHeight() - b.win.innerHeight() : b.win.outerWidth() - b.win.innerWidth() : 1, b.isie8 && d && (d += 1), g ? d : 0) : d
            }

            function n(d, c, g, e) {
                b._bind(d, c, function (b) {
                    b = b ? b : window.event;
                    var e = {original: b, target: b.target || b.srcElement, type: "wheel",
                        deltaMode: "MozMousePixelScroll" == b.type ? 0 : 1, deltaX: 0, deltaZ: 0, preventDefault: function () {
                            b.preventDefault ? b.preventDefault() : b.returnValue = !1;
                            return!1
                        }, stopImmediatePropagation: function () {
                            b.stopImmediatePropagation ? b.stopImmediatePropagation() : b.cancelBubble = !0
                        }};
                    "mousewheel" == c ? (e.deltaY = -0.025 * b.wheelDelta, b.wheelDeltaX && (e.deltaX = -0.025 * b.wheelDeltaX)) : e.deltaY = b.detail;
                    return g.call(d, e)
                }, e)
            }

            function t(d, c, g) {
                var e, f;
                0 == d.deltaMode ? (e = -Math.floor(d.deltaX * (b.opt.mousescrollstep / 54)), f = -Math.floor(d.deltaY *
                    (b.opt.mousescrollstep / 54))) : 1 == d.deltaMode && (e = -Math.floor(d.deltaX * b.opt.mousescrollstep), f = -Math.floor(d.deltaY * b.opt.mousescrollstep));
                c && (0 == e && f) && (e = f, f = 0);
                e && (b.scrollmom && b.scrollmom.stop(), b.lastdeltax += e, b.debounced("mousewheelx", function () {
                    var d = b.lastdeltax;
                    b.lastdeltax = 0;
                    b.rail.drag || b.doScrollLeftBy(d)
                }, 120));
                if (f) {
                    if (b.opt.nativeparentscrolling && g && !b.ispage && !b.zoomactive)if (0 > f) {
                        if (b.getScrollTop() >= b.page.maxh)return!0
                    } else if (0 >= b.getScrollTop())return!0;
                    b.scrollmom && b.scrollmom.stop();
                    b.lastdeltay += f;
                    b.debounced("mousewheely", function () {
                        var d = b.lastdeltay;
                        b.lastdeltay = 0;
                        b.rail.drag || b.doScrollBy(d)
                    }, 120)
                }
                d.stopImmediatePropagation();
                return d.preventDefault()
            }

            var b = this;
            this.version = "3.4.0";
            this.name = "nicescroll";
            this.me = c;
            this.opt = {doc: e("body"), win: !1};
            e.extend(this.opt, F);
            this.opt.snapbackspeed = 80;
            if (k)for (var q in b.opt)"undefined" != typeof k[q] && (b.opt[q] = k[q]);
            this.iddoc = (this.doc = b.opt.doc) && this.doc[0] ? this.doc[0].id || "" : "";
            this.ispage = /BODY|HTML/.test(b.opt.win ? b.opt.win[0].nodeName :
                this.doc[0].nodeName);
            this.haswrapper = !1 !== b.opt.win;
            this.win = b.opt.win || (this.ispage ? e(window) : this.doc);
            this.docscroll = this.ispage && !this.haswrapper ? e(window) : this.win;
            this.body = e("body");
            this.iframe = this.isfixed = this.viewport = !1;
            this.isiframe = "IFRAME" == this.doc[0].nodeName && "IFRAME" == this.win[0].nodeName;
            this.istextarea = "TEXTAREA" == this.win[0].nodeName;
            this.forcescreen = !1;
            this.canshowonmouseevent = "scroll" != b.opt.autohidemode;
            this.page = this.view = this.onzoomout = this.onzoomin = this.onscrollcancel =
                this.onscrollend = this.onscrollstart = this.onclick = this.ongesturezoom = this.onkeypress = this.onmousewheel = this.onmousemove = this.onmouseup = this.onmousedown = !1;
            this.scroll = {x: 0, y: 0};
            this.scrollratio = {x: 0, y: 0};
            this.cursorheight = 20;
            this.scrollvaluemax = 0;
            this.observerremover = this.observer = this.scrollmom = this.scrollrunning = this.checkrtlmode = !1;
            do this.id = "ascrail" + K++; while (document.getElementById(this.id));
            this.hasmousefocus = this.hasfocus = this.zoomactive = this.zoom = this.selectiondrag = this.cursorfreezed = this.cursor =
                this.rail = !1;
            this.visibility = !0;
            this.hidden = this.locked = !1;
            this.cursoractive = !0;
            this.overflowx = b.opt.overflowx;
            this.overflowy = b.opt.overflowy;
            this.nativescrollingarea = !1;
            this.checkarea = 0;
            this.events = [];
            this.saved = {};
            this.delaylist = {};
            this.synclist = {};
            this.lastdeltay = this.lastdeltax = 0;
            this.detected = M();
            var f = e.extend({}, this.detected);
            this.ishwscroll = (this.canhwscroll = f.hastransform && b.opt.hwacceleration) && b.haswrapper;
            this.istouchcapable = !1;
            f.cantouch && (f.ischrome && !f.isios && !f.isandroid) && (this.istouchcapable = !0, f.cantouch = !1);
            f.cantouch && (f.ismozilla && !f.isios) && (this.istouchcapable = !0, f.cantouch = !1);
            b.opt.enablemouselockapi || (f.hasmousecapture = !1, f.haspointerlock = !1);
            this.delayed = function (d, c, g, e) {
                var f = b.delaylist[d], h = (new Date).getTime();
                if (!e && f && f.tt)return!1;
                f && f.tt && clearTimeout(f.tt);
                if (f && f.last + g > h && !f.tt)b.delaylist[d] = {last: h + g, tt: setTimeout(function () {
                    b.delaylist[d].tt = 0;
                    c.call()
                }, g)}; else if (!f || !f.tt)b.delaylist[d] = {last: h, tt: 0}, setTimeout(function () {
                    c.call()
                }, 0)
            };
            this.debounced = function (d, c, g) {
                var f = b.delaylist[d];
                (new Date).getTime();
                b.delaylist[d] = c;
                f || setTimeout(function () {
                    var c = b.delaylist[d];
                    b.delaylist[d] = !1;
                    c.call()
                }, g)
            };
            this.synched = function (d, c) {
                b.synclist[d] = c;
                (function () {
                    b.onsync || (v(function () {
                        b.onsync = !1;
                        for (d in b.synclist) {
                            var c = b.synclist[d];
                            c && c.call(b);
                            b.synclist[d] = !1
                        }
                    }), b.onsync = !0)
                })();
                return d
            };
            this.unsynched = function (d) {
                b.synclist[d] && (b.synclist[d] = !1)
            };
            this.css = function (d, c) {
                for (var g in c)b.saved.css.push([d, g, d.css(g)]), d.css(g, c[g])
            };
            this.scrollTop = function (d) {
                return"undefined" == typeof d ? b.getScrollTop() : b.setScrollTop(d)
            };
            this.scrollLeft = function (d) {
                return"undefined" == typeof d ? b.getScrollLeft() : b.setScrollLeft(d)
            };
            BezierClass = function (b, c, g, f, e, h, l) {
                this.st = b;
                this.ed = c;
                this.spd = g;
                this.p1 = f || 0;
                this.p2 = e || 1;
                this.p3 = h || 0;
                this.p4 = l || 1;
                this.ts = (new Date).getTime();
                this.df = this.ed - this.st
            };
            BezierClass.prototype = {B2: function (b) {
                return 3 * b * b * (1 - b)
            }, B3: function (b) {
                return 3 * b * (1 - b) * (1 - b)
            }, B4: function (b) {
                return(1 - b) * (1 - b) * (1 - b)
            }, getNow: function () {
                var b = 1 - ((new Date).getTime() - this.ts) /
                    this.spd, c = this.B2(b) + this.B3(b) + this.B4(b);
                return 0 > b ? this.ed : this.st + Math.round(this.df * c)
            }, update: function (b, c) {
                this.st = this.getNow();
                this.ed = b;
                this.spd = c;
                this.ts = (new Date).getTime();
                this.df = this.ed - this.st;
                return this
            }};
            if (this.ishwscroll) {
                this.doc.translate = {x: 0, y: 0, tx: "0px", ty: "0px"};
                f.hastranslate3d && f.isios && this.doc.css("-webkit-backface-visibility", "hidden");
                var r = function () {
                    var d = b.doc.css(f.trstyle);
                    return d && "matrix" == d.substr(0, 6) ? d.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, "").split(/, +/) :
                        !1
                };
                this.getScrollTop = function (d) {
                    if (!d) {
                        if (d = r())return 16 == d.length ? -d[13] : -d[5];
                        if (b.timerscroll && b.timerscroll.bz)return b.timerscroll.bz.getNow()
                    }
                    return b.doc.translate.y
                };
                this.getScrollLeft = function (d) {
                    if (!d) {
                        if (d = r())return 16 == d.length ? -d[12] : -d[4];
                        if (b.timerscroll && b.timerscroll.bh)return b.timerscroll.bh.getNow()
                    }
                    return b.doc.translate.x
                };
                this.notifyScrollEvent = document.createEvent ? function (b) {
                    var c = document.createEvent("UIEvents");
                    c.initUIEvent("scroll", !1, !0, window, 1);
                    b.dispatchEvent(c)
                } :
                    document.fireEvent ? function (b) {
                        var c = document.createEventObject();
                        b.fireEvent("onscroll");
                        c.cancelBubble = !0
                    } : function (b, c) {
                    };
                f.hastranslate3d && b.opt.enabletranslate3d ? (this.setScrollTop = function (d, c) {
                    b.doc.translate.y = d;
                    b.doc.translate.ty = -1 * d + "px";
                    b.doc.css(f.trstyle, "translate3d(" + b.doc.translate.tx + "," + b.doc.translate.ty + ",0px)");
                    c || b.notifyScrollEvent(b.win[0])
                }, this.setScrollLeft = function (d, c) {
                    b.doc.translate.x = d;
                    b.doc.translate.tx = -1 * d + "px";
                    b.doc.css(f.trstyle, "translate3d(" + b.doc.translate.tx +
                        "," + b.doc.translate.ty + ",0px)");
                    c || b.notifyScrollEvent(b.win[0])
                }) : (this.setScrollTop = function (d, c) {
                    b.doc.translate.y = d;
                    b.doc.translate.ty = -1 * d + "px";
                    b.doc.css(f.trstyle, "translate(" + b.doc.translate.tx + "," + b.doc.translate.ty + ")");
                    c || b.notifyScrollEvent(b.win[0])
                }, this.setScrollLeft = function (d, c) {
                    b.doc.translate.x = d;
                    b.doc.translate.tx = -1 * d + "px";
                    b.doc.css(f.trstyle, "translate(" + b.doc.translate.tx + "," + b.doc.translate.ty + ")");
                    c || b.notifyScrollEvent(b.win[0])
                })
            } else this.getScrollTop = function () {
                return b.docscroll.scrollTop()
            },
                this.setScrollTop = function (d) {
                    return b.docscroll.scrollTop(d)
                }, this.getScrollLeft = function () {
                return b.docscroll.scrollLeft()
            }, this.setScrollLeft = function (d) {
                return b.docscroll.scrollLeft(d)
            };
            this.getTarget = function (b) {
                return!b ? !1 : b.target ? b.target : b.srcElement ? b.srcElement : !1
            };
            this.hasParent = function (b, c) {
                if (!b)return!1;
                for (var g = b.target || b.srcElement || b || !1; g && g.id != c;)g = g.parentNode || !1;
                return!1 !== g
            };
            var u = {thin: 1, medium: 3, thick: 5};
            this.getOffset = function () {
                if (b.isfixed)return{top: parseFloat(b.win.css("top")),
                    left: parseFloat(b.win.css("left"))};
                if (!b.viewport)return b.win.offset();
                var d = b.win.offset(), c = b.viewport.offset();
                return{top: d.top - c.top + b.viewport.scrollTop(), left: d.left - c.left + b.viewport.scrollLeft()}
            };
            this.updateScrollBar = function (d) {
                if (b.ishwscroll)b.rail.css({height: b.win.innerHeight()}), b.railh && b.railh.css({width: b.win.innerWidth()}); else {
                    var c = b.getOffset(), g = c.top, f = c.left, g = g + l(b.win, "border-top-width", !0);
                    b.win.outerWidth();
                    b.win.innerWidth();
                    var f = f + (b.rail.align ? b.win.outerWidth() -
                        l(b.win, "border-right-width") - b.rail.width : l(b.win, "border-left-width")), e = b.opt.railoffset;
                    e && (e.top && (g += e.top), b.rail.align && e.left && (f += e.left));
                    b.locked || b.rail.css({top: g, left: f, height: d ? d.h : b.win.innerHeight()});
                    b.zoom && b.zoom.css({top: g + 1, left: 1 == b.rail.align ? f - 20 : f + b.rail.width + 4});
                    b.railh && !b.locked && (g = c.top, f = c.left, d = b.railh.align ? g + l(b.win, "border-top-width", !0) + b.win.innerHeight() - b.railh.height : g + l(b.win, "border-top-width", !0), f += l(b.win, "border-left-width"), b.railh.css({top: d, left: f,
                        width: b.railh.width}))
                }
            };
            this.doRailClick = function (d, c, g) {
                var f;
                b.locked || (b.cancelEvent(d), c ? (c = g ? b.doScrollLeft : b.doScrollTop, f = g ? (d.pageX - b.railh.offset().left - b.cursorwidth / 2) * b.scrollratio.x : (d.pageY - b.rail.offset().top - b.cursorheight / 2) * b.scrollratio.y, c(f)) : (c = g ? b.doScrollLeftBy : b.doScrollBy, f = g ? b.scroll.x : b.scroll.y, d = g ? d.pageX - b.railh.offset().left : d.pageY - b.rail.offset().top, g = g ? b.view.w : b.view.h, f >= d ? c(g) : c(-g)))
            };
            b.hasanimationframe = v;
            b.hascancelanimationframe = w;
            b.hasanimationframe ? b.hascancelanimationframe ||
                (w = function () {
                    b.cancelAnimationFrame = !0
                }) : (v = function (b) {
                return setTimeout(b, 15 - Math.floor(+new Date / 1E3) % 16)
            }, w = clearInterval);
            this.init = function () {
                b.saved.css = [];
                if (f.isie7mobile)return!0;
                f.hasmstouch && b.css(b.ispage ? e("html") : b.win, {"-ms-touch-action": "none"});
                b.zindex = "auto";
                b.zindex = !b.ispage && "auto" == b.opt.zindex ? h() || "auto" : b.opt.zindex;
                !b.ispage && "auto" != b.zindex && b.zindex > x && (x = b.zindex);
                b.isie && (0 == b.zindex && "auto" == b.opt.zindex) && (b.zindex = "auto");
                if (!b.ispage || !f.cantouch && !f.isieold && !f.isie9mobile) {
                    var d = b.docscroll;
                    b.ispage && (d = b.haswrapper ? b.win : b.doc);
                    f.isie9mobile || b.css(d, {"overflow-y": "hidden"});
                    b.ispage && f.isie7 && ("BODY" == b.doc[0].nodeName ? b.css(e("html"), {"overflow-y": "hidden"}) : "HTML" == b.doc[0].nodeName && b.css(e("body"), {"overflow-y": "hidden"}));
                    f.isios && (!b.ispage && !b.haswrapper) && b.css(e("body"), {"-webkit-overflow-scrolling": "touch"});
                    var c = e(document.createElement("div"));
                    c.css({position: "relative", top: 0, "float": "right", width: b.opt.cursorwidth, height: "0px", "background-color": b.opt.cursorcolor,
                        border: b.opt.cursorborder, "background-clip": "padding-box", "-webkit-border-radius": b.opt.cursorborderradius, "-moz-border-radius": b.opt.cursorborderradius, "border-radius": b.opt.cursorborderradius});
                    c.hborder = parseFloat(c.outerHeight() - c.innerHeight());
                    b.cursor = c;
                    var g = e(document.createElement("div"));
                    g.attr("id", b.id);
                    g.addClass("nicescroll-rails");
                    var l, k, n = ["left", "right"], G;
                    for (G in n)k = n[G], (l = b.opt.railpadding[k]) ? g.css("padding-" + k, l + "px") : b.opt.railpadding[k] = 0;
                    g.append(c);
                    g.width = Math.max(parseFloat(b.opt.cursorwidth),
                        c.outerWidth()) + b.opt.railpadding.left + b.opt.railpadding.right;
                    g.css({width: g.width + "px", zIndex: b.zindex, background: b.opt.background, cursor: "default"});
                    g.visibility = !0;
                    g.scrollable = !0;
                    g.align = "left" == b.opt.railalign ? 0 : 1;
                    b.rail = g;
                    c = b.rail.drag = !1;
                    b.opt.boxzoom && (!b.ispage && !f.isieold) && (c = document.createElement("div"), b.bind(c, "click", b.doZoom), b.zoom = e(c), b.zoom.css({cursor: "pointer", "z-index": b.zindex, backgroundImage: "url(" + L + "zoomico.png)", height: 18, width: 18, backgroundPosition: "0px 0px"}), b.opt.dblclickzoom &&
                        b.bind(b.win, "dblclick", b.doZoom), f.cantouch && b.opt.gesturezoom && (b.ongesturezoom = function (d) {
                        1.5 < d.scale && b.doZoomIn(d);
                        0.8 > d.scale && b.doZoomOut(d);
                        return b.cancelEvent(d)
                    }, b.bind(b.win, "gestureend", b.ongesturezoom)));
                    b.railh = !1;
                    if (b.opt.horizrailenabled) {
                        b.css(d, {"overflow-x": "hidden"});
                        c = e(document.createElement("div"));
                        c.css({position: "relative", top: 0, height: b.opt.cursorwidth, width: "0px", "background-color": b.opt.cursorcolor, border: b.opt.cursorborder, "background-clip": "padding-box", "-webkit-border-radius": b.opt.cursorborderradius,
                            "-moz-border-radius": b.opt.cursorborderradius, "border-radius": b.opt.cursorborderradius});
                        c.wborder = parseFloat(c.outerWidth() - c.innerWidth());
                        b.cursorh = c;
                        var m = e(document.createElement("div"));
                        m.attr("id", b.id + "-hr");
                        m.addClass("nicescroll-rails");
                        m.height = Math.max(parseFloat(b.opt.cursorwidth), c.outerHeight());
                        m.css({height: m.height + "px", zIndex: b.zindex, background: b.opt.background});
                        m.append(c);
                        m.visibility = !0;
                        m.scrollable = !0;
                        m.align = "top" == b.opt.railvalign ? 0 : 1;
                        b.railh = m;
                        b.railh.drag = !1
                    }
                    b.ispage ?
                        (g.css({position: "fixed", top: "0px", height: "100%"}), g.align ? g.css({right: "0px"}) : g.css({left: "0px"}), b.body.append(g), b.railh && (m.css({position: "fixed", left: "0px", width: "100%"}), m.align ? m.css({bottom: "0px"}) : m.css({top: "0px"}), b.body.append(m))) : (b.ishwscroll ? ("static" == b.win.css("position") && b.css(b.win, {position: "relative"}), d = "HTML" == b.win[0].nodeName ? b.body : b.win, b.zoom && (b.zoom.css({position: "absolute", top: 1, right: 0, "margin-right": g.width + 4}), d.append(b.zoom)), g.css({position: "absolute", top: 0}),
                        g.align ? g.css({right: 0}) : g.css({left: 0}), d.append(g), m && (m.css({position: "absolute", left: 0, bottom: 0}), m.align ? m.css({bottom: 0}) : m.css({top: 0}), d.append(m))) : (b.isfixed = "fixed" == b.win.css("position"), d = b.isfixed ? "fixed" : "absolute", b.isfixed || (b.viewport = b.getViewport(b.win[0])), b.viewport && (b.body = b.viewport, !1 == /relative|absolute/.test(b.viewport.css("position")) && b.css(b.viewport, {position: "relative"})), g.css({position: d}), b.zoom && b.zoom.css({position: d}), b.updateScrollBar(), b.body.append(g), b.zoom &&
                        b.body.append(b.zoom), b.railh && (m.css({position: d}), b.body.append(m))), f.isios && b.css(b.win, {"-webkit-tap-highlight-color": "rgba(0,0,0,0)", "-webkit-touch-callout": "none"}), f.isie && b.opt.disableoutline && b.win.attr("hideFocus", "true"), f.iswebkit && b.opt.disableoutline && b.win.css({outline: "none"}));
                    !1 === b.opt.autohidemode ? (b.autohidedom = !1, b.rail.css({opacity: b.opt.cursoropacitymax}), b.railh && b.railh.css({opacity: b.opt.cursoropacitymax})) : !0 === b.opt.autohidemode ? (b.autohidedom = e().add(b.rail), f.isie8 &&
                        (b.autohidedom = b.autohidedom.add(b.cursor)), b.railh && (b.autohidedom = b.autohidedom.add(b.railh)), b.railh && f.isie8 && (b.autohidedom = b.autohidedom.add(b.cursorh))) : "scroll" == b.opt.autohidemode ? (b.autohidedom = e().add(b.rail), b.railh && (b.autohidedom = b.autohidedom.add(b.railh))) : "cursor" == b.opt.autohidemode ? (b.autohidedom = e().add(b.cursor), b.railh && (b.autohidedom = b.autohidedom.add(b.cursorh))) : "hidden" == b.opt.autohidemode && (b.autohidedom = !1, b.hide(), b.locked = !1);
                    if (f.isie9mobile)b.scrollmom = new H(b), b.onmangotouch =
                        function (d) {
                            d = b.getScrollTop();
                            var c = b.getScrollLeft();
                            if (d == b.scrollmom.lastscrolly && c == b.scrollmom.lastscrollx)return!0;
                            var g = d - b.mangotouch.sy, f = c - b.mangotouch.sx;
                            if (0 != Math.round(Math.sqrt(Math.pow(f, 2) + Math.pow(g, 2)))) {
                                var p = 0 > g ? -1 : 1, e = 0 > f ? -1 : 1, h = +new Date;
                                b.mangotouch.lazy && clearTimeout(b.mangotouch.lazy);
                                80 < h - b.mangotouch.tm || b.mangotouch.dry != p || b.mangotouch.drx != e ? (b.scrollmom.stop(), b.scrollmom.reset(c, d), b.mangotouch.sy = d, b.mangotouch.ly = d, b.mangotouch.sx = c, b.mangotouch.lx = c, b.mangotouch.dry =
                                    p, b.mangotouch.drx = e, b.mangotouch.tm = h) : (b.scrollmom.stop(), b.scrollmom.update(b.mangotouch.sx - f, b.mangotouch.sy - g), b.mangotouch.tm = h, g = Math.max(Math.abs(b.mangotouch.ly - d), Math.abs(b.mangotouch.lx - c)), b.mangotouch.ly = d, b.mangotouch.lx = c, 2 < g && (b.mangotouch.lazy = setTimeout(function () {
                                    b.mangotouch.lazy = !1;
                                    b.mangotouch.dry = 0;
                                    b.mangotouch.drx = 0;
                                    b.mangotouch.tm = 0;
                                    b.scrollmom.doMomentum(30)
                                }, 100)))
                            }
                        }, g = b.getScrollTop(), m = b.getScrollLeft(), b.mangotouch = {sy: g, ly: g, dry: 0, sx: m, lx: m, drx: 0, lazy: !1, tm: 0}, b.bind(b.docscroll,
                        "scroll", b.onmangotouch); else {
                        if (f.cantouch || b.istouchcapable || b.opt.touchbehavior || f.hasmstouch) {
                            b.scrollmom = new H(b);
                            b.ontouchstart = function (d) {
                                if (d.pointerType && 2 != d.pointerType)return!1;
                                if (!b.locked) {
                                    if (f.hasmstouch)for (var c = d.target ? d.target : !1; c;) {
                                        var g = e(c).getNiceScroll();
                                        if (0 < g.length && g[0].me == b.me)break;
                                        if (0 < g.length)return!1;
                                        if ("DIV" == c.nodeName && c.id == b.id)break;
                                        c = c.parentNode ? c.parentNode : !1
                                    }
                                    b.cancelScroll();
                                    if ((c = b.getTarget(d)) && /INPUT/i.test(c.nodeName) && /range/i.test(c.type))return b.stopPropagation(d);
                                    !("clientX"in d) && "changedTouches"in d && (d.clientX = d.changedTouches[0].clientX, d.clientY = d.changedTouches[0].clientY);
                                    b.forcescreen && (g = d, d = {original: d.original ? d.original : d}, d.clientX = g.screenX, d.clientY = g.screenY);
                                    b.rail.drag = {x: d.clientX, y: d.clientY, sx: b.scroll.x, sy: b.scroll.y, st: b.getScrollTop(), sl: b.getScrollLeft(), pt: 2, dl: !1};
                                    if (b.ispage || !b.opt.directionlockdeadzone)b.rail.drag.dl = "f"; else {
                                        var g = e(window).width(), p = e(window).height(), h = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                                            l = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), p = Math.max(0, l - p), g = Math.max(0, h - g);
                                        b.rail.drag.ck = !b.rail.scrollable && b.railh.scrollable ? 0 < p ? "v" : !1 : b.rail.scrollable && !b.railh.scrollable ? 0 < g ? "h" : !1 : !1;
                                        b.rail.drag.ck || (b.rail.drag.dl = "f")
                                    }
                                    b.opt.touchbehavior && (b.isiframe && f.isie) && (g = b.win.position(), b.rail.drag.x += g.left, b.rail.drag.y += g.top);
                                    b.hasmoving = !1;
                                    b.lastmouseup = !1;
                                    b.scrollmom.reset(d.clientX, d.clientY);
                                    if (!f.cantouch && !this.istouchcapable && !f.hasmstouch) {
                                        if (!c || !/INPUT|SELECT|TEXTAREA/i.test(c.nodeName))return!b.ispage && f.hasmousecapture && c.setCapture(), b.cancelEvent(d);
                                        /SUBMIT|CANCEL|BUTTON/i.test(e(c).attr("type")) && (pc = {tg: c, click: !1}, b.preventclick = pc)
                                    }
                                }
                            };
                            b.ontouchend = function (d) {
                                if (d.pointerType && 2 != d.pointerType)return!1;
                                if (b.rail.drag && 2 == b.rail.drag.pt && (b.scrollmom.doMomentum(), b.rail.drag = !1, b.hasmoving && (b.hasmoving = !1, b.lastmouseup = !0, b.hideCursor(), f.hasmousecapture && document.releaseCapture(), !f.cantouch)))return b.cancelEvent(d)
                            };
                            var q = b.opt.touchbehavior &&
                                b.isiframe && !f.hasmousecapture;
                            b.ontouchmove = function (d, c) {
                                if (d.pointerType && 2 != d.pointerType)return!1;
                                if (b.rail.drag && 2 == b.rail.drag.pt) {
                                    if (f.cantouch && "undefined" == typeof d.original)return!0;
                                    b.hasmoving = !0;
                                    b.preventclick && !b.preventclick.click && (b.preventclick.click = b.preventclick.tg.onclick || !1, b.preventclick.tg.onclick = b.onpreventclick);
                                    d = e.extend({original: d}, d);
                                    "changedTouches"in d && (d.clientX = d.changedTouches[0].clientX, d.clientY = d.changedTouches[0].clientY);
                                    if (b.forcescreen) {
                                        var g = d;
                                        d = {original: d.original ?
                                            d.original : d};
                                        d.clientX = g.screenX;
                                        d.clientY = g.screenY
                                    }
                                    g = ofy = 0;
                                    if (q && !c) {
                                        var p = b.win.position(), g = -p.left;
                                        ofy = -p.top
                                    }
                                    var h = d.clientY + ofy, p = h - b.rail.drag.y, l = d.clientX + g, k = l - b.rail.drag.x, s = b.rail.drag.st - p;
                                    b.ishwscroll && b.opt.bouncescroll ? 0 > s ? s = Math.round(s / 2) : s > b.page.maxh && (s = b.page.maxh + Math.round((s - b.page.maxh) / 2)) : (0 > s && (h = s = 0), s > b.page.maxh && (s = b.page.maxh, h = 0));
                                    if (b.railh && b.railh.scrollable) {
                                        var m = b.rail.drag.sl - k;
                                        b.ishwscroll && b.opt.bouncescroll ? 0 > m ? m = Math.round(m / 2) : m > b.page.maxw && (m = b.page.maxw +
                                            Math.round((m - b.page.maxw) / 2)) : (0 > m && (l = m = 0), m > b.page.maxw && (m = b.page.maxw, l = 0))
                                    }
                                    g = !1;
                                    if (b.rail.drag.dl)g = !0, "v" == b.rail.drag.dl ? m = b.rail.drag.sl : "h" == b.rail.drag.dl && (s = b.rail.drag.st); else {
                                        var p = Math.abs(p), k = Math.abs(k), n = b.opt.directionlockdeadzone;
                                        if ("v" == b.rail.drag.ck) {
                                            if (p > n && k <= 0.3 * p)return b.rail.drag = !1, !0;
                                            k > n && (b.rail.drag.dl = "f", e("body").scrollTop(e("body").scrollTop()))
                                        } else if ("h" == b.rail.drag.ck) {
                                            if (k > n && p <= 0.3 * az)return b.rail.drag = !1, !0;
                                            p > n && (b.rail.drag.dl = "f", e("body").scrollLeft(e("body").scrollLeft()))
                                        }
                                    }
                                    b.synched("touchmove",
                                        function () {
                                            b.rail.drag && 2 == b.rail.drag.pt && (b.prepareTransition && b.prepareTransition(0), b.rail.scrollable && b.setScrollTop(s), b.scrollmom.update(l, h), b.railh && b.railh.scrollable ? (b.setScrollLeft(m), b.showCursor(s, m)) : b.showCursor(s), f.isie10 && document.selection.clear())
                                        });
                                    f.ischrome && b.istouchcapable && (g = !1);
                                    if (g)return b.cancelEvent(d)
                                }
                            }
                        }
                        b.onmousedown = function (d, c) {
                            if (!(b.rail.drag && 1 != b.rail.drag.pt)) {
                                if (b.locked)return b.cancelEvent(d);
                                b.cancelScroll();
                                b.rail.drag = {x: d.clientX, y: d.clientY, sx: b.scroll.x,
                                    sy: b.scroll.y, pt: 1, hr: !!c};
                                var g = b.getTarget(d);
                                !b.ispage && f.hasmousecapture && g.setCapture();
                                b.isiframe && !f.hasmousecapture && (b.saved.csspointerevents = b.doc.css("pointer-events"), b.css(b.doc, {"pointer-events": "none"}));
                                return b.cancelEvent(d)
                            }
                        };
                        b.onmouseup = function (d) {
                            if (b.rail.drag && (f.hasmousecapture && document.releaseCapture(), b.isiframe && !f.hasmousecapture && b.doc.css("pointer-events", b.saved.csspointerevents), 1 == b.rail.drag.pt))return b.rail.drag = !1, b.cancelEvent(d)
                        };
                        b.onmousemove = function (d) {
                            if (b.rail.drag &&
                                1 == b.rail.drag.pt) {
                                if (f.ischrome && 0 == d.which)return b.onmouseup(d);
                                b.cursorfreezed = !0;
                                if (b.rail.drag.hr) {
                                    b.scroll.x = b.rail.drag.sx + (d.clientX - b.rail.drag.x);
                                    0 > b.scroll.x && (b.scroll.x = 0);
                                    var c = b.scrollvaluemaxw;
                                    b.scroll.x > c && (b.scroll.x = c)
                                } else b.scroll.y = b.rail.drag.sy + (d.clientY - b.rail.drag.y), 0 > b.scroll.y && (b.scroll.y = 0), c = b.scrollvaluemax, b.scroll.y > c && (b.scroll.y = c);
                                b.synched("mousemove", function () {
                                    b.rail.drag && 1 == b.rail.drag.pt && (b.showCursor(), b.rail.drag.hr ? b.doScrollLeft(Math.round(b.scroll.x *
                                        b.scrollratio.x), b.opt.cursordragspeed) : b.doScrollTop(Math.round(b.scroll.y * b.scrollratio.y), b.opt.cursordragspeed))
                                });
                                return b.cancelEvent(d)
                            }
                        };
                        if (f.cantouch || b.opt.touchbehavior)b.onpreventclick = function (d) {
                            if (b.preventclick)return b.preventclick.tg.onclick = b.preventclick.click, b.preventclick = !1, b.cancelEvent(d)
                        }, b.bind(b.win, "mousedown", b.ontouchstart), b.onclick = f.isios ? !1 : function (d) {
                            return b.lastmouseup ? (b.lastmouseup = !1, b.cancelEvent(d)) : !0
                        }, b.opt.grabcursorenabled && f.cursorgrabvalue && (b.css(b.ispage ?
                            b.doc : b.win, {cursor: f.cursorgrabvalue}), b.css(b.rail, {cursor: f.cursorgrabvalue})); else {
                            var r = function (d) {
                                if (b.selectiondrag) {
                                    if (d) {
                                        var c = b.win.outerHeight();
                                        d = d.pageY - b.selectiondrag.top;
                                        0 < d && d < c && (d = 0);
                                        d >= c && (d -= c);
                                        b.selectiondrag.df = d
                                    }
                                    0 != b.selectiondrag.df && (b.doScrollBy(2 * -Math.floor(b.selectiondrag.df / 6)), b.debounced("doselectionscroll", function () {
                                        r()
                                    }, 50))
                                }
                            };
                            b.hasTextSelected = "getSelection"in document ? function () {
                                return 0 < document.getSelection().rangeCount
                            } : "selection"in document ? function () {
                                return"None" !=
                                    document.selection.type
                            } : function () {
                                return!1
                            };
                            b.onselectionstart = function (d) {
                                b.ispage || (b.selectiondrag = b.win.offset())
                            };
                            b.onselectionend = function (d) {
                                b.selectiondrag = !1
                            };
                            b.onselectiondrag = function (d) {
                                b.selectiondrag && b.hasTextSelected() && b.debounced("selectionscroll", function () {
                                    r(d)
                                }, 250)
                            }
                        }
                        f.hasmstouch && (b.css(b.rail, {"-ms-touch-action": "none"}), b.css(b.cursor, {"-ms-touch-action": "none"}), b.bind(b.win, "MSPointerDown", b.ontouchstart), b.bind(document, "MSPointerUp", b.ontouchend), b.bind(document, "MSPointerMove",
                            b.ontouchmove), b.bind(b.cursor, "MSGestureHold", function (b) {
                            b.preventDefault()
                        }), b.bind(b.cursor, "contextmenu", function (b) {
                            b.preventDefault()
                        }));
                        this.istouchcapable && (b.bind(b.win, "touchstart", b.ontouchstart), b.bind(document, "touchend", b.ontouchend), b.bind(document, "touchcancel", b.ontouchend), b.bind(document, "touchmove", b.ontouchmove));
                        b.bind(b.cursor, "mousedown", b.onmousedown);
                        b.bind(b.cursor, "mouseup", b.onmouseup);
                        b.railh && (b.bind(b.cursorh, "mousedown", function (d) {
                            b.onmousedown(d, !0)
                        }), b.bind(b.cursorh,
                            "mouseup", function (d) {
                                if (!(b.rail.drag && 2 == b.rail.drag.pt))return b.rail.drag = !1, b.hasmoving = !1, b.hideCursor(), f.hasmousecapture && document.releaseCapture(), b.cancelEvent(d)
                            }));
                        if (b.opt.cursordragontouch || !f.cantouch && !b.opt.touchbehavior)b.rail.css({cursor: "default"}), b.railh && b.railh.css({cursor: "default"}), b.jqbind(b.rail, "mouseenter", function () {
                            b.canshowonmouseevent && b.showCursor();
                            b.rail.active = !0
                        }), b.jqbind(b.rail, "mouseleave", function () {
                            b.rail.active = !1;
                            b.rail.drag || b.hideCursor()
                        }), b.opt.sensitiverail &&
                            (b.bind(b.rail, "click", function (d) {
                                b.doRailClick(d, !1, !1)
                            }), b.bind(b.rail, "dblclick", function (d) {
                                b.doRailClick(d, !0, !1)
                            }), b.bind(b.cursor, "click", function (d) {
                                b.cancelEvent(d)
                            }), b.bind(b.cursor, "dblclick", function (d) {
                                b.cancelEvent(d)
                            })), b.railh && (b.jqbind(b.railh, "mouseenter", function () {
                            b.canshowonmouseevent && b.showCursor();
                            b.rail.active = !0
                        }), b.jqbind(b.railh, "mouseleave", function () {
                            b.rail.active = !1;
                            b.rail.drag || b.hideCursor()
                        }), b.opt.sensitiverail && (b.bind(b.railh, "click", function (d) {
                            b.doRailClick(d,
                                !1, !0)
                        }), b.bind(b.railh, "dblclick", function (d) {
                            b.doRailClick(d, !0, !0)
                        }), b.bind(b.cursorh, "click", function (d) {
                            b.cancelEvent(d)
                        }), b.bind(b.cursorh, "dblclick", function (d) {
                            b.cancelEvent(d)
                        })));
                        !f.cantouch && !b.opt.touchbehavior ? (b.bind(f.hasmousecapture ? b.win : document, "mouseup", b.onmouseup), b.bind(document, "mousemove", b.onmousemove), b.onclick && b.bind(document, "click", b.onclick), !b.ispage && b.opt.enablescrollonselection && (b.bind(b.win[0], "mousedown", b.onselectionstart), b.bind(document, "mouseup", b.onselectionend),
                            b.bind(b.cursor, "mouseup", b.onselectionend), b.cursorh && b.bind(b.cursorh, "mouseup", b.onselectionend), b.bind(document, "mousemove", b.onselectiondrag)), b.zoom && (b.jqbind(b.zoom, "mouseenter", function () {
                            b.canshowonmouseevent && b.showCursor();
                            b.rail.active = !0
                        }), b.jqbind(b.zoom, "mouseleave", function () {
                            b.rail.active = !1;
                            b.rail.drag || b.hideCursor()
                        }))) : (b.bind(f.hasmousecapture ? b.win : document, "mouseup", b.ontouchend), b.bind(document, "mousemove", b.ontouchmove), b.onclick && b.bind(document, "click", b.onclick), b.opt.cursordragontouch &&
                            (b.bind(b.cursor, "mousedown", b.onmousedown), b.bind(b.cursor, "mousemove", b.onmousemove), b.cursorh && b.bind(b.cursorh, "mousedown", b.onmousedown), b.cursorh && b.bind(b.cursorh, "mousemove", b.onmousemove)));
                        b.opt.enablemousewheel && (b.isiframe || b.bind(f.isie && b.ispage ? document : b.docscroll, "mousewheel", b.onmousewheel), b.bind(b.rail, "mousewheel", b.onmousewheel), b.railh && b.bind(b.railh, "mousewheel", b.onmousewheelhr));
                        !b.ispage && (!f.cantouch && !/HTML|BODY/.test(b.win[0].nodeName)) && (b.win.attr("tabindex") || b.win.attr({tabindex: J++}),
                            b.jqbind(b.win, "focus", function (d) {
                                y = b.getTarget(d).id || !0;
                                b.hasfocus = !0;
                                b.canshowonmouseevent && b.noticeCursor()
                            }), b.jqbind(b.win, "blur", function (d) {
                            y = !1;
                            b.hasfocus = !1
                        }), b.jqbind(b.win, "mouseenter", function (d) {
                            D = b.getTarget(d).id || !0;
                            b.hasmousefocus = !0;
                            b.canshowonmouseevent && b.noticeCursor()
                        }), b.jqbind(b.win, "mouseleave", function () {
                            D = !1;
                            b.hasmousefocus = !1
                        }))
                    }
                    b.onkeypress = function (d) {
                        if (b.locked && 0 == b.page.maxh)return!0;
                        d = d ? d : window.e;
                        var c = b.getTarget(d);
                        if (c && /INPUT|TEXTAREA|SELECT|OPTION/.test(c.nodeName) &&
                            (!c.getAttribute("type") && !c.type || !/submit|button|cancel/i.tp))return!0;
                        if (b.hasfocus || b.hasmousefocus && !y || b.ispage && !y && !D) {
                            c = d.keyCode;
                            if (b.locked && 27 != c)return b.cancelEvent(d);
                            var g = d.ctrlKey || !1, p = d.shiftKey || !1, f = !1;
                            switch (c) {
                                case 38:
                                case 63233:
                                    b.doScrollBy(72);
                                    f = !0;
                                    break;
                                case 40:
                                case 63235:
                                    b.doScrollBy(-72);
                                    f = !0;
                                    break;
                                case 37:
                                case 63232:
                                    b.railh && (g ? b.doScrollLeft(0) : b.doScrollLeftBy(72), f = !0);
                                    break;
                                case 39:
                                case 63234:
                                    b.railh && (g ? b.doScrollLeft(b.page.maxw) : b.doScrollLeftBy(-72), f = !0);
                                    break;
                                case 33:
                                case 63276:
                                    b.doScrollBy(b.view.h);
                                    f = !0;
                                    break;
                                case 34:
                                case 63277:
                                    b.doScrollBy(-b.view.h);
                                    f = !0;
                                    break;
                                case 36:
                                case 63273:
                                    b.railh && g ? b.doScrollPos(0, 0) : b.doScrollTo(0);
                                    f = !0;
                                    break;
                                case 35:
                                case 63275:
                                    b.railh && g ? b.doScrollPos(b.page.maxw, b.page.maxh) : b.doScrollTo(b.page.maxh);
                                    f = !0;
                                    break;
                                case 32:
                                    b.opt.spacebarenabled && (p ? b.doScrollBy(b.view.h) : b.doScrollBy(-b.view.h), f = !0);
                                    break;
                                case 27:
                                    b.zoomactive && (b.doZoom(), f = !0)
                            }
                            if (f)return b.cancelEvent(d)
                        }
                    };
                    b.opt.enablekeyboard && b.bind(document, f.isopera && !f.isopera12 ? "keypress" : "keydown", b.onkeypress);
                    b.bind(window, "resize", b.lazyResize);
                    b.bind(window, "orientationchange", b.lazyResize);
                    b.bind(window, "load", b.lazyResize);
                    if (f.ischrome && !b.ispage && !b.haswrapper) {
                        var t = b.win.attr("style"), g = parseFloat(b.win.css("width")) + 1;
                        b.win.css("width", g);
                        b.synched("chromefix", function () {
                            b.win.attr("style", t)
                        })
                    }
                    b.onAttributeChange = function (d) {
                        b.lazyResize(250)
                    };
                    !b.ispage && !b.haswrapper && (!1 !== z ? (b.observer = new z(function (d) {
                        d.forEach(b.onAttributeChange)
                    }), b.observer.observe(b.win[0],
                        {childList: !0, characterData: !1, attributes: !0, subtree: !1}), b.observerremover = new z(function (d) {
                        d.forEach(function (d) {
                            if (0 < d.removedNodes.length)for (var c in d.removedNodes)if (d.removedNodes[c] == b.win[0])return b.remove()
                        })
                    }), b.observerremover.observe(b.win[0].parentNode, {childList: !0, characterData: !1, attributes: !1, subtree: !1})) : (b.bind(b.win, f.isie && !f.isie9 ? "propertychange" : "DOMAttrModified", b.onAttributeChange), f.isie9 && b.win[0].attachEvent("onpropertychange", b.onAttributeChange), b.bind(b.win, "DOMNodeRemoved",
                        function (d) {
                            d.target == b.win[0] && b.remove()
                        })));
                    !b.ispage && b.opt.boxzoom && b.bind(window, "resize", b.resizeZoom);
                    b.istextarea && b.bind(b.win, "mouseup", b.lazyResize);
                    b.checkrtlmode = !0;
                    b.lazyResize(30)
                }
                if ("IFRAME" == this.doc[0].nodeName) {
                    var I = function (d) {
                        b.iframexd = !1;
                        try {
                            var c = "contentDocument"in this ? this.contentDocument : this.contentWindow.document
                        } catch (g) {
                            b.iframexd = !0, c = !1
                        }
                        if (b.iframexd)return"console"in window && console.log("NiceScroll error: policy restriced iframe"), !0;
                        b.forcescreen = !0;
                        b.isiframe &&
                        (b.iframe = {doc: e(c), html: b.doc.contents().find("html")[0], body: b.doc.contents().find("body")[0]}, b.getContentSize = function () {
                            return{w: Math.max(b.iframe.html.scrollWidth, b.iframe.body.scrollWidth), h: Math.max(b.iframe.html.scrollHeight, b.iframe.body.scrollHeight)}
                        }, b.docscroll = e(b.iframe.body));
                        !f.isios && (b.opt.iframeautoresize && !b.isiframe) && (b.win.scrollTop(0), b.doc.height(""), d = Math.max(c.getElementsByTagName("html")[0].scrollHeight, c.body.scrollHeight), b.doc.height(d));
                        b.lazyResize(30);
                        f.isie7 &&
                        b.css(e(b.iframe.html), {"overflow-y": "hidden"});
                        b.css(e(b.iframe.body), {"overflow-y": "hidden"});
                        "contentWindow"in this ? b.bind(this.contentWindow, "scroll", b.onscroll) : b.bind(c, "scroll", b.onscroll);
                        b.opt.enablemousewheel && b.bind(c, "mousewheel", b.onmousewheel);
                        b.opt.enablekeyboard && b.bind(c, f.isopera ? "keypress" : "keydown", b.onkeypress);
                        if (f.cantouch || b.opt.touchbehavior)b.bind(c, "mousedown", b.onmousedown), b.bind(c, "mousemove", function (d) {
                            b.onmousemove(d, !0)
                        }), b.opt.grabcursorenabled && f.cursorgrabvalue &&
                            b.css(e(c.body), {cursor: f.cursorgrabvalue});
                        b.bind(c, "mouseup", b.onmouseup);
                        b.zoom && (b.opt.dblclickzoom && b.bind(c, "dblclick", b.doZoom), b.ongesturezoom && b.bind(c, "gestureend", b.ongesturezoom))
                    };
                    this.doc[0].readyState && "complete" == this.doc[0].readyState && setTimeout(function () {
                        I.call(b.doc[0], !1)
                    }, 500);
                    b.bind(this.doc, "load", I)
                }
            };
            this.showCursor = function (d, c) {
                b.cursortimeout && (clearTimeout(b.cursortimeout), b.cursortimeout = 0);
                if (b.rail) {
                    b.autohidedom && (b.autohidedom.stop().css({opacity: b.opt.cursoropacitymax}),
                        b.cursoractive = !0);
                    if (!b.rail.drag || 1 != b.rail.drag.pt)"undefined" != typeof d && !1 !== d && (b.scroll.y = Math.round(1 * d / b.scrollratio.y)), "undefined" != typeof c && (b.scroll.x = Math.round(1 * c / b.scrollratio.x));
                    b.cursor.css({height: b.cursorheight, top: b.scroll.y});
                    b.cursorh && (!b.rail.align && b.rail.visibility ? b.cursorh.css({width: b.cursorwidth, left: b.scroll.x + b.rail.width}) : b.cursorh.css({width: b.cursorwidth, left: b.scroll.x}), b.cursoractive = !0);
                    b.zoom && b.zoom.stop().css({opacity: b.opt.cursoropacitymax})
                }
            };
            this.hideCursor =
                function (d) {
                    !b.cursortimeout && (b.rail && b.autohidedom) && (b.cursortimeout = setTimeout(function () {
                        if (!b.rail.active || !b.showonmouseevent)b.autohidedom.stop().animate({opacity: b.opt.cursoropacitymin}), b.zoom && b.zoom.stop().animate({opacity: b.opt.cursoropacitymin}), b.cursoractive = !1;
                        b.cursortimeout = 0
                    }, d || b.opt.hidecursordelay))
                };
            this.noticeCursor = function (d, c, g) {
                b.showCursor(c, g);
                b.rail.active || b.hideCursor(d)
            };
            this.getContentSize = b.ispage ? function () {
                return{w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                    h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)}
            } : b.haswrapper ? function () {
                return{w: b.doc.outerWidth() + parseInt(b.win.css("paddingLeft")) + parseInt(b.win.css("paddingRight")), h: b.doc.outerHeight() + parseInt(b.win.css("paddingTop")) + parseInt(b.win.css("paddingBottom"))}
            } : function () {
                return{w: b.docscroll[0].scrollWidth, h: b.docscroll[0].scrollHeight}
            };
            this.onResize = function (d, c) {
                if (!b.win)return!1;
                if (!b.haswrapper && !b.ispage) {
                    if ("none" == b.win.css("display"))return b.visibility &&
                        b.hideRail().hideRailHr(), !1;
                    !b.hidden && !b.visibility && b.showRail().showRailHr()
                }
                var g = b.page.maxh, f = b.page.maxw, e = b.view.w;
                b.view = {w: b.ispage ? b.win.width() : parseInt(b.win[0].clientWidth), h: b.ispage ? b.win.height() : parseInt(b.win[0].clientHeight)};
                b.page = c ? c : b.getContentSize();
                b.page.maxh = Math.max(0, b.page.h - b.view.h);
                b.page.maxw = Math.max(0, b.page.w - b.view.w);
                if (b.page.maxh == g && b.page.maxw == f && b.view.w == e) {
                    if (b.ispage)return b;
                    g = b.win.offset();
                    if (b.lastposition && (f = b.lastposition, f.top == g.top && f.left ==
                        g.left))return b;
                    b.lastposition = g
                }
                0 == b.page.maxh ? (b.hideRail(), b.scrollvaluemax = 0, b.scroll.y = 0, b.scrollratio.y = 0, b.cursorheight = 0, b.setScrollTop(0), b.rail.scrollable = !1) : b.rail.scrollable = !0;
                0 == b.page.maxw ? (b.hideRailHr(), b.scrollvaluemaxw = 0, b.scroll.x = 0, b.scrollratio.x = 0, b.cursorwidth = 0, b.setScrollLeft(0), b.railh.scrollable = !1) : b.railh.scrollable = !0;
                b.locked = 0 == b.page.maxh && 0 == b.page.maxw;
                if (b.locked)return b.ispage || b.updateScrollBar(b.view), !1;
                !b.hidden && !b.visibility ? b.showRail().showRailHr() :
                    !b.hidden && !b.railh.visibility && b.showRailHr();
                b.istextarea && (b.win.css("resize") && "none" != b.win.css("resize")) && (b.view.h -= 20);
                b.cursorheight = Math.min(b.view.h, Math.round(b.view.h * (b.view.h / b.page.h)));
                b.cursorheight = b.opt.cursorfixedheight ? b.opt.cursorfixedheight : Math.max(b.opt.cursorminheight, b.cursorheight);
                b.cursorwidth = Math.min(b.view.w, Math.round(b.view.w * (b.view.w / b.page.w)));
                b.cursorwidth = b.opt.cursorfixedheight ? b.opt.cursorfixedheight : Math.max(b.opt.cursorminheight, b.cursorwidth);
                b.scrollvaluemax =
                    b.view.h - b.cursorheight - b.cursor.hborder;
                b.railh && (b.railh.width = 0 < b.page.maxh ? b.view.w - b.rail.width : b.view.w, b.scrollvaluemaxw = b.railh.width - b.cursorwidth - b.cursorh.wborder);
                b.checkrtlmode && b.railh && (b.checkrtlmode = !1, b.opt.rtlmode && 0 == b.scroll.x && b.setScrollLeft(b.page.maxw));
                b.ispage || b.updateScrollBar(b.view);
                b.scrollratio = {x: b.page.maxw / b.scrollvaluemaxw, y: b.page.maxh / b.scrollvaluemax};
                b.getScrollTop() > b.page.maxh ? b.doScrollTop(b.page.maxh) : (b.scroll.y = Math.round(b.getScrollTop() * (1 / b.scrollratio.y)),
                    b.scroll.x = Math.round(b.getScrollLeft() * (1 / b.scrollratio.x)), b.cursoractive && b.noticeCursor());
                b.scroll.y && 0 == b.getScrollTop() && b.doScrollTo(Math.floor(b.scroll.y * b.scrollratio.y));
                return b
            };
            this.resize = b.onResize;
            this.lazyResize = function (d) {
                d = isNaN(d) ? 30 : d;
                b.delayed("resize", b.resize, d);
                return b
            };
            this._bind = function (d, c, g, f) {
                b.events.push({e: d, n: c, f: g, b: f, q: !1});
                d.addEventListener ? d.addEventListener(c, g, f || !1) : d.attachEvent ? d.attachEvent("on" + c, g) : d["on" + c] = g
            };
            this.jqbind = function (d, c, g) {
                b.events.push({e: d,
                    n: c, f: g, q: !0});
                e(d).bind(c, g)
            };
            this.bind = function (d, c, g, e) {
                var h = "jquery"in d ? d[0] : d;
                "mousewheel" == c ? "onwheel"in b.win ? b._bind(h, "wheel", g, e || !1) : (d = "undefined" != typeof document.onmousewheel ? "mousewheel" : "DOMMouseScroll", n(h, d, g, e || !1), "DOMMouseScroll" == d && n(h, "MozMousePixelScroll", g, e || !1)) : h.addEventListener ? (f.cantouch && /mouseup|mousedown|mousemove/.test(c) && b._bind(h, "mousedown" == c ? "touchstart" : "mouseup" == c ? "touchend" : "touchmove", function (b) {
                    if (b.touches) {
                        if (2 > b.touches.length) {
                            var d = b.touches.length ?
                                b.touches[0] : b;
                            d.original = b;
                            g.call(this, d)
                        }
                    } else b.changedTouches && (d = b.changedTouches[0], d.original = b, g.call(this, d))
                }, e || !1), b._bind(h, c, g, e || !1), f.cantouch && "mouseup" == c && b._bind(h, "touchcancel", g, e || !1)) : b._bind(h, c, function (d) {
                    if ((d = d || window.event || !1) && d.srcElement)d.target = d.srcElement;
                    "pageY"in d || (d.pageX = d.clientX + document.documentElement.scrollLeft, d.pageY = d.clientY + document.documentElement.scrollTop);
                    return!1 === g.call(h, d) || !1 === e ? b.cancelEvent(d) : !0
                })
            };
            this._unbind = function (b, c, g, f) {
                b.removeEventListener ?
                    b.removeEventListener(c, g, f) : b.detachEvent ? b.detachEvent("on" + c, g) : b["on" + c] = !1
            };
            this.unbindAll = function () {
                for (var d = 0; d < b.events.length; d++) {
                    var c = b.events[d];
                    c.q ? c.e.unbind(c.n, c.f) : b._unbind(c.e, c.n, c.f, c.b)
                }
            };
            this.cancelEvent = function (b) {
                b = b.original ? b.original : b ? b : window.event || !1;
                if (!b)return!1;
                b.preventDefault && b.preventDefault();
                b.stopPropagation && b.stopPropagation();
                b.preventManipulation && b.preventManipulation();
                b.cancelBubble = !0;
                b.cancel = !0;
                return b.returnValue = !1
            };
            this.stopPropagation =
                function (b) {
                    b = b.original ? b.original : b ? b : window.event || !1;
                    if (!b)return!1;
                    if (b.stopPropagation)return b.stopPropagation();
                    b.cancelBubble && (b.cancelBubble = !0);
                    return!1
                };
            this.showRail = function () {
                if (0 != b.page.maxh && (b.ispage || "none" != b.win.css("display")))b.visibility = !0, b.rail.visibility = !0, b.rail.css("display", "block");
                return b
            };
            this.showRailHr = function () {
                if (!b.railh)return b;
                if (0 != b.page.maxw && (b.ispage || "none" != b.win.css("display")))b.railh.visibility = !0, b.railh.css("display", "block");
                return b
            };
            this.hideRail =
                function () {
                    b.visibility = !1;
                    b.rail.visibility = !1;
                    b.rail.css("display", "none");
                    return b
                };
            this.hideRailHr = function () {
                if (!b.railh)return b;
                b.railh.visibility = !1;
                b.railh.css("display", "none");
                return b
            };
            this.show = function () {
                b.hidden = !1;
                b.locked = !1;
                return b.showRail().showRailHr()
            };
            this.hide = function () {
                b.hidden = !0;
                b.locked = !0;
                return b.hideRail().hideRailHr()
            };
            this.toggle = function () {
                return b.hidden ? b.show() : b.hide()
            };
            this.remove = function () {
                b.stop();
                b.cursortimeout && clearTimeout(b.cursortimeout);
                b.doZoomOut();
                b.unbindAll();
                !1 !== b.observer && b.observer.disconnect();
                !1 !== b.observerremover && b.observerremover.disconnect();
                b.events = [];
                b.cursor && (b.cursor.remove(), b.cursor = null);
                b.cursorh && (b.cursorh.remove(), b.cursorh = null);
                b.rail && (b.rail.remove(), b.rail = null);
                b.railh && (b.railh.remove(), b.railh = null);
                b.zoom && (b.zoom.remove(), b.zoom = null);
                for (var d = 0; d < b.saved.css.length; d++) {
                    var c = b.saved.css[d];
                    c[0].css(c[1], "undefined" == typeof c[2] ? "" : c[2])
                }
                b.saved = !1;
                b.me.data("__nicescroll", "");
                b.me = null;
                b.doc = null;
                b.docscroll =
                    null;
                b.win = null;
                return b
            };
            this.scrollstart = function (d) {
                this.onscrollstart = d;
                return b
            };
            this.scrollend = function (d) {
                this.onscrollend = d;
                return b
            };
            this.scrollcancel = function (d) {
                this.onscrollcancel = d;
                return b
            };
            this.zoomin = function (d) {
                this.onzoomin = d;
                return b
            };
            this.zoomout = function (d) {
                this.onzoomout = d;
                return b
            };
            this.isScrollable = function (b) {
                b = b.target ? b.target : b;
                if ("OPTION" == b.nodeName)return!0;
                for (; b && 1 == b.nodeType && !/BODY|HTML/.test(b.nodeName);) {
                    var c = e(b), c = c.css("overflowY") || c.css("overflowX") || c.css("overflow") ||
                        "";
                    if (/scroll|auto/.test(c))return b.clientHeight != b.scrollHeight;
                    b = b.parentNode ? b.parentNode : !1
                }
                return!1
            };
            this.getViewport = function (b) {
                for (b = b && b.parentNode ? b.parentNode : !1; b && 1 == b.nodeType && !/BODY|HTML/.test(b.nodeName);) {
                    var c = e(b), g = c.css("overflowY") || c.css("overflowX") || c.css("overflow") || "";
                    if (/scroll|auto/.test(g) && b.clientHeight != b.scrollHeight || 0 < c.getNiceScroll().length)return c;
                    b = b.parentNode ? b.parentNode : !1
                }
                return!1
            };
            this.onmousewheel = function (d) {
                if (b.locked)return!0;
                if (b.rail.drag)return b.cancelEvent(d);
                if (!b.rail.scrollable)return b.railh && b.railh.scrollable ? b.onmousewheelhr(d) : !0;
                var c = +new Date, g = !1;
                b.opt.preservenativescrolling && b.checkarea + 600 < c && (b.nativescrollingarea = b.isScrollable(d), g = !0);
                b.checkarea = c;
                if (b.nativescrollingarea)return!0;
                if (d = t(d, !1, g))b.checkarea = 0;
                return d
            };
            this.onmousewheelhr = function (d) {
                if (b.locked || !b.railh.scrollable)return!0;
                if (b.rail.drag)return b.cancelEvent(d);
                var c = +new Date, g = !1;
                b.opt.preservenativescrolling && b.checkarea + 600 < c && (b.nativescrollingarea = b.isScrollable(d),
                    g = !0);
                b.checkarea = c;
                return b.nativescrollingarea ? !0 : b.locked ? b.cancelEvent(d) : t(d, !0, g)
            };
            this.stop = function () {
                b.cancelScroll();
                b.scrollmon && b.scrollmon.stop();
                b.cursorfreezed = !1;
                b.scroll.y = Math.round(b.getScrollTop() * (1 / b.scrollratio.y));
                b.noticeCursor();
                return b
            };
            this.getTransitionSpeed = function (c) {
                var f = Math.round(10 * b.opt.scrollspeed);
                c = Math.min(f, Math.round(c / 20 * b.opt.scrollspeed));
                return 20 < c ? c : 0
            };
            b.opt.smoothscroll ? b.ishwscroll && f.hastransition && b.opt.usetransition ? (this.prepareTransition = function (c, e) {
                var g = e ? 20 < c ? c : 0 : b.getTransitionSpeed(c), h = g ? f.prefixstyle + "transform " + g + "ms ease-out" : "";
                if (!b.lasttransitionstyle || b.lasttransitionstyle != h)b.lasttransitionstyle = h, b.doc.css(f.transitionstyle, h);
                return g
            }, this.doScrollLeft = function (c, f) {
                var g = b.scrollrunning ? b.newscrolly : b.getScrollTop();
                b.doScrollPos(c, g, f)
            }, this.doScrollTop = function (c, f) {
                var g = b.scrollrunning ? b.newscrollx : b.getScrollLeft();
                b.doScrollPos(g, c, f)
            }, this.doScrollPos = function (c, e, g) {
                var h = b.getScrollTop(), l = b.getScrollLeft();
                (0 >
                    (b.newscrolly - h) * (e - h) || 0 > (b.newscrollx - l) * (c - l)) && b.cancelScroll();
                !1 == b.opt.bouncescroll && (0 > e ? e = 0 : e > b.page.maxh && (e = b.page.maxh), 0 > c ? c = 0 : c > b.page.maxw && (c = b.page.maxw));
                if (b.scrollrunning && c == b.newscrollx && e == b.newscrolly)return!1;
                b.newscrolly = e;
                b.newscrollx = c;
                b.newscrollspeed = g || !1;
                if (b.timer)return!1;
                b.timer = setTimeout(function () {
                    var g = b.getScrollTop(), h = b.getScrollLeft(), l, k;
                    l = c - h;
                    k = e - g;
                    l = Math.round(Math.sqrt(Math.pow(l, 2) + Math.pow(k, 2)));
                    l = b.newscrollspeed && 1 < b.newscrollspeed ? b.newscrollspeed :
                        b.getTransitionSpeed(l);
                    b.newscrollspeed && 1 >= b.newscrollspeed && (l *= b.newscrollspeed);
                    b.prepareTransition(l, !0);
                    b.timerscroll && b.timerscroll.tm && clearInterval(b.timerscroll.tm);
                    0 < l && (!b.scrollrunning && b.onscrollstart && b.onscrollstart.call(b, {type: "scrollstart", current: {x: h, y: g}, request: {x: c, y: e}, end: {x: b.newscrollx, y: b.newscrolly}, speed: l}), f.transitionend ? b.scrollendtrapped || (b.scrollendtrapped = !0, b.bind(b.doc, f.transitionend, b.onScrollEnd, !1)) : (b.scrollendtrapped && clearTimeout(b.scrollendtrapped),
                        b.scrollendtrapped = setTimeout(b.onScrollEnd, l)), b.timerscroll = {bz: new BezierClass(g, b.newscrolly, l, 0, 0, 0.58, 1), bh: new BezierClass(h, b.newscrollx, l, 0, 0, 0.58, 1)}, b.cursorfreezed || (b.timerscroll.tm = setInterval(function () {
                        b.showCursor(b.getScrollTop(), b.getScrollLeft())
                    }, 60)));
                    b.synched("doScroll-set", function () {
                        b.timer = 0;
                        b.scrollendtrapped && (b.scrollrunning = !0);
                        b.setScrollTop(b.newscrolly);
                        b.setScrollLeft(b.newscrollx);
                        if (!b.scrollendtrapped)b.onScrollEnd()
                    })
                }, 50)
            }, this.cancelScroll = function () {
                if (!b.scrollendtrapped)return!0;
                var c = b.getScrollTop(), e = b.getScrollLeft();
                b.scrollrunning = !1;
                f.transitionend || clearTimeout(f.transitionend);
                b.scrollendtrapped = !1;
                b._unbind(b.doc, f.transitionend, b.onScrollEnd);
                b.prepareTransition(0);
                b.setScrollTop(c);
                b.railh && b.setScrollLeft(e);
                b.timerscroll && b.timerscroll.tm && clearInterval(b.timerscroll.tm);
                b.timerscroll = !1;
                b.cursorfreezed = !1;
                b.showCursor(c, e);
                return b
            }, this.onScrollEnd = function () {
                b.scrollendtrapped && b._unbind(b.doc, f.transitionend, b.onScrollEnd);
                b.scrollendtrapped = !1;
                b.prepareTransition(0);
                b.timerscroll && b.timerscroll.tm && clearInterval(b.timerscroll.tm);
                b.timerscroll = !1;
                var c = b.getScrollTop(), e = b.getScrollLeft();
                b.setScrollTop(c);
                b.railh && b.setScrollLeft(e);
                b.noticeCursor(!1, c, e);
                b.cursorfreezed = !1;
                0 > c ? c = 0 : c > b.page.maxh && (c = b.page.maxh);
                0 > e ? e = 0 : e > b.page.maxw && (e = b.page.maxw);
                if (c != b.newscrolly || e != b.newscrollx)return b.doScrollPos(e, c, b.opt.snapbackspeed);
                b.onscrollend && b.scrollrunning && b.onscrollend.call(b, {type: "scrollend", current: {x: e, y: c}, end: {x: b.newscrollx, y: b.newscrolly}});
                b.scrollrunning = !1
            }) : (this.doScrollLeft = function (c, f) {
                var g = b.scrollrunning ? b.newscrolly : b.getScrollTop();
                b.doScrollPos(c, g, f)
            }, this.doScrollTop = function (c, f) {
                var g = b.scrollrunning ? b.newscrollx : b.getScrollLeft();
                b.doScrollPos(g, c, f)
            }, this.doScrollPos = function (c, f, g) {
                function e() {
                    if (b.cancelAnimationFrame)return!0;
                    b.scrollrunning = !0;
                    if (r = 1 - r)return b.timer = v(e) || 1;
                    var c = 0, d = sy = b.getScrollTop();
                    if (b.dst.ay) {
                        var d = b.bzscroll ? b.dst.py + b.bzscroll.getNow() * b.dst.ay : b.newscrolly, g = d - sy;
                        if (0 > g && d < b.newscrolly || 0 < g && d > b.newscrolly)d =
                            b.newscrolly;
                        b.setScrollTop(d);
                        d == b.newscrolly && (c = 1)
                    } else c = 1;
                    var f = sx = b.getScrollLeft();
                    if (b.dst.ax) {
                        f = b.bzscroll ? b.dst.px + b.bzscroll.getNow() * b.dst.ax : b.newscrollx;
                        g = f - sx;
                        if (0 > g && f < b.newscrollx || 0 < g && f > b.newscrollx)f = b.newscrollx;
                        b.setScrollLeft(f);
                        f == b.newscrollx && (c += 1)
                    } else c += 1;
                    2 == c ? (b.timer = 0, b.cursorfreezed = !1, b.bzscroll = !1, b.scrollrunning = !1, 0 > d ? d = 0 : d > b.page.maxh && (d = b.page.maxh), 0 > f ? f = 0 : f > b.page.maxw && (f = b.page.maxw), f != b.newscrollx || d != b.newscrolly ? b.doScrollPos(f, d) : b.onscrollend && b.onscrollend.call(b,
                        {type: "scrollend", current: {x: sx, y: sy}, end: {x: b.newscrollx, y: b.newscrolly}})) : b.timer = v(e) || 1
                }

                f = "undefined" == typeof f || !1 === f ? b.getScrollTop(!0) : f;
                if (b.timer && b.newscrolly == f && b.newscrollx == c)return!0;
                b.timer && w(b.timer);
                b.timer = 0;
                var h = b.getScrollTop(), l = b.getScrollLeft();
                (0 > (b.newscrolly - h) * (f - h) || 0 > (b.newscrollx - l) * (c - l)) && b.cancelScroll();
                b.newscrolly = f;
                b.newscrollx = c;
                if (!b.bouncescroll || !b.rail.visibility)0 > b.newscrolly ? b.newscrolly = 0 : b.newscrolly > b.page.maxh && (b.newscrolly = b.page.maxh);
                if (!b.bouncescroll || !b.railh.visibility)0 > b.newscrollx ? b.newscrollx = 0 : b.newscrollx > b.page.maxw && (b.newscrollx = b.page.maxw);
                b.dst = {};
                b.dst.x = c - l;
                b.dst.y = f - h;
                b.dst.px = l;
                b.dst.py = h;
                var k = Math.round(Math.sqrt(Math.pow(b.dst.x, 2) + Math.pow(b.dst.y, 2)));
                b.dst.ax = b.dst.x / k;
                b.dst.ay = b.dst.y / k;
                var n = 0, q = k;
                0 == b.dst.x ? (n = h, q = f, b.dst.ay = 1, b.dst.py = 0) : 0 == b.dst.y && (n = l, q = c, b.dst.ax = 1, b.dst.px = 0);
                k = b.getTransitionSpeed(k);
                g && 1 >= g && (k *= g);
                b.bzscroll = 0 < k ? b.bzscroll ? b.bzscroll.update(q, k) : new BezierClass(n, q, k, 0, 1, 0, 1) : !1;
                if (!b.timer) {
                    (h ==
                        b.page.maxh && f >= b.page.maxh || l == b.page.maxw && c >= b.page.maxw) && b.checkContentSize();
                    var r = 1;
                    b.cancelAnimationFrame = !1;
                    b.timer = 1;
                    b.onscrollstart && !b.scrollrunning && b.onscrollstart.call(b, {type: "scrollstart", current: {x: l, y: h}, request: {x: c, y: f}, end: {x: b.newscrollx, y: b.newscrolly}, speed: k});
                    e();
                    (h == b.page.maxh && f >= h || l == b.page.maxw && c >= l) && b.checkContentSize();
                    b.noticeCursor()
                }
            }, this.cancelScroll = function () {
                b.timer && w(b.timer);
                b.timer = 0;
                b.bzscroll = !1;
                b.scrollrunning = !1;
                return b
            }) : (this.doScrollLeft = function (c, f) {
                var g = b.getScrollTop();
                b.doScrollPos(c, g, f)
            }, this.doScrollTop = function (c, f) {
                var g = b.getScrollLeft();
                b.doScrollPos(g, c, f)
            }, this.doScrollPos = function (c, f, g) {
                var e = c > b.page.maxw ? b.page.maxw : c;
                0 > e && (e = 0);
                var h = f > b.page.maxh ? b.page.maxh : f;
                0 > h && (h = 0);
                b.synched("scroll", function () {
                    b.setScrollTop(h);
                    b.setScrollLeft(e)
                })
            }, this.cancelScroll = function () {
            });
            this.doScrollBy = function (c, f) {
                var g = 0, g = f ? Math.floor((b.scroll.y - c) * b.scrollratio.y) : (b.timer ? b.newscrolly : b.getScrollTop(!0)) - c;
                if (b.bouncescroll) {
                    var e =
                        Math.round(b.view.h / 2);
                    g < -e ? g = -e : g > b.page.maxh + e && (g = b.page.maxh + e)
                }
                b.cursorfreezed = !1;
                py = b.getScrollTop(!0);
                if (0 > g && 0 >= py)return b.noticeCursor();
                if (g > b.page.maxh && py >= b.page.maxh)return b.checkContentSize(), b.noticeCursor();
                b.doScrollTop(g)
            };
            this.doScrollLeftBy = function (c, f) {
                var g = 0, g = f ? Math.floor((b.scroll.x - c) * b.scrollratio.x) : (b.timer ? b.newscrollx : b.getScrollLeft(!0)) - c;
                if (b.bouncescroll) {
                    var e = Math.round(b.view.w / 2);
                    g < -e ? g = -e : g > b.page.maxw + e && (g = b.page.maxw + e)
                }
                b.cursorfreezed = !1;
                px = b.getScrollLeft(!0);
                if (0 > g && 0 >= px || g > b.page.maxw && px >= b.page.maxw)return b.noticeCursor();
                b.doScrollLeft(g)
            };
            this.doScrollTo = function (c, f) {
                f && Math.round(c * b.scrollratio.y);
                b.cursorfreezed = !1;
                b.doScrollTop(c)
            };
            this.checkContentSize = function () {
                var c = b.getContentSize();
                (c.h != b.page.h || c.w != b.page.w) && b.resize(!1, c)
            };
            b.onscroll = function (c) {
                b.rail.drag || b.cursorfreezed || b.synched("scroll", function () {
                    b.scroll.y = Math.round(b.getScrollTop() * (1 / b.scrollratio.y));
                    b.railh && (b.scroll.x = Math.round(b.getScrollLeft() * (1 / b.scrollratio.x)));
                    b.noticeCursor()
                })
            };
            b.bind(b.docscroll, "scroll", b.onscroll);
            this.doZoomIn = function (c) {
                if (!b.zoomactive) {
                    b.zoomactive = !0;
                    b.zoomrestore = {style: {}};
                    var h = "position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight".split(" "), g = b.win[0].style, l;
                    for (l in h) {
                        var k = h[l];
                        b.zoomrestore.style[k] = "undefined" != typeof g[k] ? g[k] : ""
                    }
                    b.zoomrestore.style.width = b.win.css("width");
                    b.zoomrestore.style.height = b.win.css("height");
                    b.zoomrestore.padding = {w: b.win.outerWidth() - b.win.width(), h: b.win.outerHeight() -
                        b.win.height()};
                    f.isios4 && (b.zoomrestore.scrollTop = e(window).scrollTop(), e(window).scrollTop(0));
                    b.win.css({position: f.isios4 ? "absolute" : "fixed", top: 0, left: 0, "z-index": x + 100, margin: "0px"});
                    h = b.win.css("backgroundColor");
                    ("" == h || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(h)) && b.win.css("backgroundColor", "#fff");
                    b.rail.css({"z-index": x + 101});
                    b.zoom.css({"z-index": x + 102});
                    b.zoom.css("backgroundPosition", "0px -18px");
                    b.resizeZoom();
                    b.onzoomin && b.onzoomin.call(b);
                    return b.cancelEvent(c)
                }
            };
            this.doZoomOut =
                function (c) {
                    if (b.zoomactive)return b.zoomactive = !1, b.win.css("margin", ""), b.win.css(b.zoomrestore.style), f.isios4 && e(window).scrollTop(b.zoomrestore.scrollTop), b.rail.css({"z-index": b.zindex}), b.zoom.css({"z-index": b.zindex}), b.zoomrestore = !1, b.zoom.css("backgroundPosition", "0px 0px"), b.onResize(), b.onzoomout && b.onzoomout.call(b), b.cancelEvent(c)
                };
            this.doZoom = function (c) {
                return b.zoomactive ? b.doZoomOut(c) : b.doZoomIn(c)
            };
            this.resizeZoom = function () {
                if (b.zoomactive) {
                    var c = b.getScrollTop();
                    b.win.css({width: e(window).width() -
                        b.zoomrestore.padding.w + "px", height: e(window).height() - b.zoomrestore.padding.h + "px"});
                    b.onResize();
                    b.setScrollTop(Math.min(b.page.maxh, c))
                }
            };
            this.init();
            e.nicescroll.push(this)
        }, H = function (e) {
            var c = this;
            this.nc = e;
            this.steptime = this.lasttime = this.speedy = this.speedx = this.lasty = this.lastx = 0;
            this.snapy = this.snapx = !1;
            this.demuly = this.demulx = 0;
            this.lastscrolly = this.lastscrollx = -1;
            this.timer = this.chky = this.chkx = 0;
            this.time = function () {
                return+new Date
            };
            this.reset = function (e, l) {
                c.stop();
                var k = c.time();
                c.steptime =
                    0;
                c.lasttime = k;
                c.speedx = 0;
                c.speedy = 0;
                c.lastx = e;
                c.lasty = l;
                c.lastscrollx = -1;
                c.lastscrolly = -1
            };
            this.update = function (e, l) {
                var k = c.time();
                c.steptime = k - c.lasttime;
                c.lasttime = k;
                var k = l - c.lasty, t = e - c.lastx, b = c.nc.getScrollTop(), q = c.nc.getScrollLeft(), b = b + k, q = q + t;
                c.snapx = 0 > q || q > c.nc.page.maxw;
                c.snapy = 0 > b || b > c.nc.page.maxh;
                c.speedx = t;
                c.speedy = k;
                c.lastx = e;
                c.lasty = l
            };
            this.stop = function () {
                c.nc.unsynched("domomentum2d");
                c.timer && clearTimeout(c.timer);
                c.timer = 0;
                c.lastscrollx = -1;
                c.lastscrolly = -1
            };
            this.doSnapy = function (e, l) {
                var k = !1;
                0 > l ? (l = 0, k = !0) : l > c.nc.page.maxh && (l = c.nc.page.maxh, k = !0);
                0 > e ? (e = 0, k = !0) : e > c.nc.page.maxw && (e = c.nc.page.maxw, k = !0);
                k && c.nc.doScrollPos(e, l, c.nc.opt.snapbackspeed)
            };
            this.doMomentum = function (e) {
                var l = c.time(), k = e ? l + e : c.lasttime;
                e = c.nc.getScrollLeft();
                var t = c.nc.getScrollTop(), b = c.nc.page.maxh, q = c.nc.page.maxw;
                c.speedx = 0 < q ? Math.min(60, c.speedx) : 0;
                c.speedy = 0 < b ? Math.min(60, c.speedy) : 0;
                k = k && 50 >= l - k;
                if (0 > t || t > b || 0 > e || e > q)k = !1;
                e = c.speedx && k ? c.speedx : !1;
                if (c.speedy && k && c.speedy || e) {
                    var f = Math.max(16,
                        c.steptime);
                    50 < f && (e = f / 50, c.speedx *= e, c.speedy *= e, f = 50);
                    c.demulxy = 0;
                    c.lastscrollx = c.nc.getScrollLeft();
                    c.chkx = c.lastscrollx;
                    c.lastscrolly = c.nc.getScrollTop();
                    c.chky = c.lastscrolly;
                    var r = c.lastscrollx, u = c.lastscrolly, d = function () {
                        var e = 600 < c.time() - l ? 0.04 : 0.02;
                        if (c.speedx && (r = Math.floor(c.lastscrollx - c.speedx * (1 - c.demulxy)), c.lastscrollx = r, 0 > r || r > q))e = 0.1;
                        if (c.speedy && (u = Math.floor(c.lastscrolly - c.speedy * (1 - c.demulxy)), c.lastscrolly = u, 0 > u || u > b))e = 0.1;
                        c.demulxy = Math.min(1, c.demulxy + e);
                        c.nc.synched("domomentum2d",
                            function () {
                                c.speedx && (c.nc.getScrollLeft() != c.chkx && c.stop(), c.chkx = r, c.nc.setScrollLeft(r));
                                c.speedy && (c.nc.getScrollTop() != c.chky && c.stop(), c.chky = u, c.nc.setScrollTop(u));
                                c.timer || (c.nc.hideCursor(), c.doSnapy(r, u))
                            });
                        1 > c.demulxy ? c.timer = setTimeout(d, f) : (c.stop(), c.nc.hideCursor(), c.doSnapy(r, u))
                    };
                    d()
                } else c.doSnapy(c.nc.getScrollLeft(), c.nc.getScrollTop())
            }
        }, A = e.fn.scrollTop;
    e.cssHooks.pageYOffset = {get: function (k, c, h) {
        return(c = e.data(k, "__nicescroll") || !1) && c.ishwscroll ? c.getScrollTop() : A.call(k)
    },
        set: function (k, c) {
            var h = e.data(k, "__nicescroll") || !1;
            h && h.ishwscroll ? h.setScrollTop(parseInt(c)) : A.call(k, c);
            return this
        }};
    e.fn.scrollTop = function (k) {
        if ("undefined" == typeof k) {
            var c = this[0] ? e.data(this[0], "__nicescroll") || !1 : !1;
            return c && c.ishwscroll ? c.getScrollTop() : A.call(this)
        }
        return this.each(function () {
            var c = e.data(this, "__nicescroll") || !1;
            c && c.ishwscroll ? c.setScrollTop(parseInt(k)) : A.call(e(this), k)
        })
    };
    var B = e.fn.scrollLeft;
    e.cssHooks.pageXOffset = {get: function (k, c, h) {
        return(c = e.data(k, "__nicescroll") || !1) && c.ishwscroll ? c.getScrollLeft() : B.call(k)
    }, set: function (k, c) {
        var h = e.data(k, "__nicescroll") || !1;
        h && h.ishwscroll ? h.setScrollLeft(parseInt(c)) : B.call(k, c);
        return this
    }};
    e.fn.scrollLeft = function (k) {
        if ("undefined" == typeof k) {
            var c = this[0] ? e.data(this[0], "__nicescroll") || !1 : !1;
            return c && c.ishwscroll ? c.getScrollLeft() : B.call(this)
        }
        return this.each(function () {
            var c = e.data(this, "__nicescroll") || !1;
            c && c.ishwscroll ? c.setScrollLeft(parseInt(k)) : B.call(e(this), k)
        })
    };
    var C = function (k) {
        var c = this;
        this.length =
            0;
        this.name = "nicescrollarray";
        this.each = function (e) {
            for (var h = 0; h < c.length; h++)e.call(c[h]);
            return c
        };
        this.push = function (e) {
            c[c.length] = e;
            c.length++
        };
        this.eq = function (e) {
            return c[e]
        };
        if (k)for (a = 0; a < k.length; a++) {
            var h = e.data(k[a], "__nicescroll") || !1;
            h && (this[this.length] = h, this.length++)
        }
        return this
    };
    (function (e, c, h) {
        for (var l = 0; l < c.length; l++)h(e, c[l])
    })(C.prototype, "show hide toggle onResize resize remove stop doScrollPos".split(" "), function (e, c) {
        e[c] = function () {
            var e = arguments;
            return this.each(function () {
                this[c].apply(this,
                    e)
            })
        }
    });
    e.fn.getNiceScroll = function (k) {
        return"undefined" == typeof k ? new C(this) : e.data(this[k], "__nicescroll") || !1
    };
    e.extend(e.expr[":"], {nicescroll: function (k) {
        return e.data(k, "__nicescroll") ? !0 : !1
    }});
    e.fn.niceScroll = function (k, c) {
        "undefined" == typeof c && ("object" == typeof k && !("jquery"in k)) && (c = k, k = !1);
        var h = new C;
        "undefined" == typeof c && (c = {});
        k && (c.doc = e(k), c.win = e(this));
        var l = !("doc"in c);
        !l && !("win"in c) && (c.win = e(this));
        this.each(function () {
            var k = e(this).data("__nicescroll") || !1;
            k || (c.doc = l ?
                e(this) : c.doc, k = new N(c, e(this)), e(this).data("__nicescroll", k));
            h.push(k)
        });
        return 1 == h.length ? h[0] : h
    };
    window.NiceScroll = {getjQuery: function () {
        return e
    }};
    e.nicescroll || (e.nicescroll = new C, e.nicescroll.options = F)
})(jQuery);

var q = null;
window.PR_SHOULD_USE_CONTINUATION = !0;
(function () {
    function L(a) {
        function m(a) {
            var f = a.charCodeAt(0);
            if (f !== 92)return f;
            var b = a.charAt(1);
            return(f = r[b]) ? f : "0" <= b && b <= "7" ? parseInt(a.substring(1), 8) : b === "u" || b === "x" ? parseInt(a.substring(2), 16) : a.charCodeAt(1)
        }

        function e(a) {
            if (a < 32)return(a < 16 ? "\\x0" : "\\x") + a.toString(16);
            a = String.fromCharCode(a);
            if (a === "\\" || a === "-" || a === "[" || a === "]")a = "\\" + a;
            return a
        }

        function h(a) {
            for (var f = a.substring(1, a.length - 1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g), a =
                [], b = [], o = f[0] === "^", c = o ? 1 : 0, i = f.length; c < i; ++c) {
                var j = f[c];
                if (/\\[bdsw]/i.test(j))a.push(j); else {
                    var j = m(j), d;
                    c + 2 < i && "-" === f[c + 1] ? (d = m(f[c + 2]), c += 2) : d = j;
                    b.push([j, d]);
                    d < 65 || j > 122 || (d < 65 || j > 90 || b.push([Math.max(65, j) | 32, Math.min(d, 90) | 32]), d < 97 || j > 122 || b.push([Math.max(97, j) & -33, Math.min(d, 122) & -33]))
                }
            }
            b.sort(function (a, f) {
                return a[0] - f[0] || f[1] - a[1]
            });
            f = [];
            j = [NaN, NaN];
            for (c = 0; c < b.length; ++c)i = b[c], i[0] <= j[1] + 1 ? j[1] = Math.max(j[1], i[1]) : f.push(j = i);
            b = ["["];
            o && b.push("^");
            b.push.apply(b, a);
            for (c = 0; c <
                f.length; ++c)i = f[c], b.push(e(i[0])), i[1] > i[0] && (i[1] + 1 > i[0] && b.push("-"), b.push(e(i[1])));
            b.push("]");
            return b.join("")
        }

        function y(a) {
            for (var f = a.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g), b = f.length, d = [], c = 0, i = 0; c < b; ++c) {
                var j = f[c];
                j === "(" ? ++i : "\\" === j.charAt(0) && (j = +j.substring(1)) && j <= i && (d[j] = -1)
            }
            for (c = 1; c < d.length; ++c)-1 === d[c] && (d[c] = ++t);
            for (i = c = 0; c < b; ++c)j = f[c], j === "(" ? (++i, d[i] === void 0 && (f[c] = "(?:")) : "\\" === j.charAt(0) &&
                (j = +j.substring(1)) && j <= i && (f[c] = "\\" + d[i]);
            for (i = c = 0; c < b; ++c)"^" === f[c] && "^" !== f[c + 1] && (f[c] = "");
            if (a.ignoreCase && s)for (c = 0; c < b; ++c)j = f[c], a = j.charAt(0), j.length >= 2 && a === "[" ? f[c] = h(j) : a !== "\\" && (f[c] = j.replace(/[A-Za-z]/g, function (a) {
                a = a.charCodeAt(0);
                return"[" + String.fromCharCode(a & -33, a | 32) + "]"
            }));
            return f.join("")
        }

        for (var t = 0, s = !1, l = !1, p = 0, d = a.length; p < d; ++p) {
            var g = a[p];
            if (g.ignoreCase)l = !0; else if (/[a-z]/i.test(g.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi, ""))) {
                s = !0;
                l = !1;
                break
            }
        }
        for (var r =
        {b: 8, t: 9, n: 10, v: 11, f: 12, r: 13}, n = [], p = 0, d = a.length; p < d; ++p) {
            g = a[p];
            if (g.global || g.multiline)throw Error("" + g);
            n.push("(?:" + y(g) + ")")
        }
        return RegExp(n.join("|"), l ? "gi" : "g")
    }

    function M(a) {
        function m(a) {
            switch (a.nodeType) {
                case 1:
                    if (e.test(a.className))break;
                    for (var g = a.firstChild; g; g = g.nextSibling)m(g);
                    g = a.nodeName;
                    if ("BR" === g || "LI" === g)h[s] = "\n", t[s << 1] = y++, t[s++ << 1 | 1] = a;
                    break;
                case 3:
                case 4:
                    g = a.nodeValue, g.length && (g = p ? g.replace(/\r\n?/g, "\n") : g.replace(/[\t\n\r ]+/g, " "), h[s] = g, t[s << 1] = y, y += g.length,
                        t[s++ << 1 | 1] = a)
            }
        }

        var e = /(?:^|\s)nocode(?:\s|$)/, h = [], y = 0, t = [], s = 0, l;
        a.currentStyle ? l = a.currentStyle.whiteSpace : window.getComputedStyle && (l = document.defaultView.getComputedStyle(a, q).getPropertyValue("white-space"));
        var p = l && "pre" === l.substring(0, 3);
        m(a);
        return{a: h.join("").replace(/\n$/, ""), c: t}
    }

    function B(a, m, e, h) {
        m && (a = {a: m, d: a}, e(a), h.push.apply(h, a.e))
    }

    function x(a, m) {
        function e(a) {
            for (var l = a.d, p = [l, "pln"], d = 0, g = a.a.match(y) || [], r = {}, n = 0, z = g.length; n < z; ++n) {
                var f = g[n], b = r[f], o = void 0, c;
                if (typeof b ===
                    "string")c = !1; else {
                    var i = h[f.charAt(0)];
                    if (i)o = f.match(i[1]), b = i[0]; else {
                        for (c = 0; c < t; ++c)if (i = m[c], o = f.match(i[1])) {
                            b = i[0];
                            break
                        }
                        o || (b = "pln")
                    }
                    if ((c = b.length >= 5 && "lang-" === b.substring(0, 5)) && !(o && typeof o[1] === "string"))c = !1, b = "src";
                    c || (r[f] = b)
                }
                i = d;
                d += f.length;
                if (c) {
                    c = o[1];
                    var j = f.indexOf(c), k = j + c.length;
                    o[2] && (k = f.length - o[2].length, j = k - c.length);
                    b = b.substring(5);
                    B(l + i, f.substring(0, j), e, p);
                    B(l + i + j, c, C(b, c), p);
                    B(l + i + k, f.substring(k), e, p)
                } else p.push(l + i, b)
            }
            a.e = p
        }

        var h = {}, y;
        (function () {
            for (var e = a.concat(m),
                     l = [], p = {}, d = 0, g = e.length; d < g; ++d) {
                var r = e[d], n = r[3];
                if (n)for (var k = n.length; --k >= 0;)h[n.charAt(k)] = r;
                r = r[1];
                n = "" + r;
                p.hasOwnProperty(n) || (l.push(r), p[n] = q)
            }
            l.push(/[\S\s]/);
            y = L(l)
        })();
        var t = m.length;
        return e
    }

    function u(a) {
        var m = [], e = [];
        a.tripleQuotedStrings ? m.push(["str", /^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/, q, "'\""]) : a.multiLineStrings ? m.push(["str", /^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,
            q, "'\"`"]) : m.push(["str", /^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/, q, "\"'"]);
        a.verbatimStrings && e.push(["str", /^@"(?:[^"]|"")*(?:"|$)/, q]);
        var h = a.hashComments;
        h && (a.cStyleComments ? (h > 1 ? m.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, q, "#"]) : m.push(["com", /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/, q, "#"]), e.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, q])) : m.push(["com", /^#[^\n\r]*/,
            q, "#"]));
        a.cStyleComments && (e.push(["com", /^\/\/[^\n\r]*/, q]), e.push(["com", /^\/\*[\S\s]*?(?:\*\/|$)/, q]));
        a.regexLiterals && e.push(["lang-regex", /^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]);
        (h = a.types) && e.push(["typ", h]);
        a = ("" + a.keywords).replace(/^ | $/g,
            "");
        a.length && e.push(["kwd", RegExp("^(?:" + a.replace(/[\s,]+/g, "|") + ")\\b"), q]);
        m.push(["pln", /^\s+/, q, " \r\n\t\xa0"]);
        e.push(["lit", /^@[$_a-z][\w$@]*/i, q], ["typ", /^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/, q], ["pln", /^[$_a-z][\w$@]*/i, q], ["lit", /^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i, q, "0123456789"], ["pln", /^\\[\S\s]?/, q], ["pun", /^.[^\s\w"-$'./@\\`]*/, q]);
        return x(m, e)
    }

    function D(a, m) {
        function e(a) {
            switch (a.nodeType) {
                case 1:
                    if (k.test(a.className))break;
                    if ("BR" === a.nodeName)h(a),
                        a.parentNode && a.parentNode.removeChild(a); else for (a = a.firstChild; a; a = a.nextSibling)e(a);
                    break;
                case 3:
                case 4:
                    if (p) {
                        var b = a.nodeValue, d = b.match(t);
                        if (d) {
                            var c = b.substring(0, d.index);
                            a.nodeValue = c;
                            (b = b.substring(d.index + d[0].length)) && a.parentNode.insertBefore(s.createTextNode(b), a.nextSibling);
                            h(a);
                            c || a.parentNode.removeChild(a)
                        }
                    }
            }
        }

        function h(a) {
            function b(a, d) {
                var e = d ? a.cloneNode(!1) : a, f = a.parentNode;
                if (f) {
                    var f = b(f, 1), g = a.nextSibling;
                    f.appendChild(e);
                    for (var h = g; h; h = g)g = h.nextSibling, f.appendChild(h)
                }
                return e
            }

            for (; !a.nextSibling;)if (a = a.parentNode, !a)return;
            for (var a = b(a.nextSibling, 0), e; (e = a.parentNode) && e.nodeType === 1;)a = e;
            d.push(a)
        }

        var k = /(?:^|\s)nocode(?:\s|$)/, t = /\r\n?|\n/, s = a.ownerDocument, l;
        a.currentStyle ? l = a.currentStyle.whiteSpace : window.getComputedStyle && (l = s.defaultView.getComputedStyle(a, q).getPropertyValue("white-space"));
        var p = l && "pre" === l.substring(0, 3);
        for (l = s.createElement("LI"); a.firstChild;)l.appendChild(a.firstChild);
        for (var d = [l], g = 0; g < d.length; ++g)e(d[g]);
        m === (m | 0) && d[0].setAttribute("value",
            m);
        var r = s.createElement("OL");
        r.className = "linenums";
        for (var n = Math.max(0, m - 1 | 0) || 0, g = 0, z = d.length; g < z; ++g)l = d[g], l.className = "L" + (g + n) % 10, l.firstChild || l.appendChild(s.createTextNode("\xa0")), r.appendChild(l);
        a.appendChild(r)
    }

    function k(a, m) {
        for (var e = m.length; --e >= 0;) {
            var h = m[e];
            A.hasOwnProperty(h) ? window.console && console.warn("cannot override language handler %s", h) : A[h] = a
        }
    }

    function C(a, m) {
        if (!a || !A.hasOwnProperty(a))a = /^\s*</.test(m) ? "default-markup" : "default-code";
        return A[a]
    }

    function E(a) {
        var m =
            a.g;
        try {
            var e = M(a.h), h = e.a;
            a.a = h;
            a.c = e.c;
            a.d = 0;
            C(m, h)(a);
            var k = /\bMSIE\b/.test(navigator.userAgent), m = /\n/g, t = a.a, s = t.length, e = 0, l = a.c, p = l.length, h = 0, d = a.e, g = d.length, a = 0;
            d[g] = s;
            var r, n;
            for (n = r = 0; n < g;)d[n] !== d[n + 2] ? (d[r++] = d[n++], d[r++] = d[n++]) : n += 2;
            g = r;
            for (n = r = 0; n < g;) {
                for (var z = d[n], f = d[n + 1], b = n + 2; b + 2 <= g && d[b + 1] === f;)b += 2;
                d[r++] = z;
                d[r++] = f;
                n = b
            }
            for (d.length = r; h < p;) {
                var o = l[h + 2] || s, c = d[a + 2] || s, b = Math.min(o, c), i = l[h + 1], j;
                if (i.nodeType !== 1 && (j = t.substring(e, b))) {
                    k && (j = j.replace(m, "\r"));
                    i.nodeValue =
                        j;
                    var u = i.ownerDocument, v = u.createElement("SPAN");
                    v.className = d[a + 1];
                    var x = i.parentNode;
                    x.replaceChild(v, i);
                    v.appendChild(i);
                    e < o && (l[h + 1] = i = u.createTextNode(t.substring(b, o)), x.insertBefore(i, v.nextSibling))
                }
                e = b;
                e >= o && (h += 2);
                e >= c && (a += 2)
            }
        } catch (w) {
            "console"in window && console.log(w && w.stack ? w.stack : w)
        }
    }

    var v = ["break,continue,do,else,for,if,return,while"], w = [
            [v, "auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],
            "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"
        ], F = [w, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"], G = [w, "abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],
        H = [G, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"], w = [w, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"], I = [v, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
        J = [v, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"], v = [v, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"], K = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/, N = /\S/, O = u({keywords: [F, H, w, "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END" +
            I, J, v], hashComments: !0, cStyleComments: !0, multiLineStrings: !0, regexLiterals: !0}), A = {};
    k(O, ["default-code"]);
    k(x([], [
        ["pln", /^[^<?]+/],
        ["dec", /^<!\w[^>]*(?:>|$)/],
        ["com", /^<\!--[\S\s]*?(?:--\>|$)/],
        ["lang-", /^<\?([\S\s]+?)(?:\?>|$)/],
        ["lang-", /^<%([\S\s]+?)(?:%>|$)/],
        ["pun", /^(?:<[%?]|[%?]>)/],
        ["lang-", /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],
        ["lang-js", /^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],
        ["lang-css", /^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],
        ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]
    ]),
        ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]);
    k(x([
        ["pln", /^\s+/, q, " \t\r\n"],
        ["atv", /^(?:"[^"]*"?|'[^']*'?)/, q, "\"'"]
    ], [
        ["tag", /^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],
        ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
        ["lang-uq.val", /^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],
        ["pun", /^[/<->]+/],
        ["lang-js", /^on\w+\s*=\s*"([^"]+)"/i],
        ["lang-js", /^on\w+\s*=\s*'([^']+)'/i],
        ["lang-js", /^on\w+\s*=\s*([^\s"'>]+)/i],
        ["lang-css", /^style\s*=\s*"([^"]+)"/i],
        ["lang-css", /^style\s*=\s*'([^']+)'/i],
        ["lang-css",
            /^style\s*=\s*([^\s"'>]+)/i]
    ]), ["in.tag"]);
    k(x([], [
        ["atv", /^[\S\s]+/]
    ]), ["uq.val"]);
    k(u({keywords: F, hashComments: !0, cStyleComments: !0, types: K}), ["c", "cc", "cpp", "cxx", "cyc", "m"]);
    k(u({keywords: "null,true,false"}), ["json"]);
    k(u({keywords: H, hashComments: !0, cStyleComments: !0, verbatimStrings: !0, types: K}), ["cs"]);
    k(u({keywords: G, cStyleComments: !0}), ["java"]);
    k(u({keywords: v, hashComments: !0, multiLineStrings: !0}), ["bsh", "csh", "sh"]);
    k(u({keywords: I, hashComments: !0, multiLineStrings: !0, tripleQuotedStrings: !0}),
        ["cv", "py"]);
    k(u({keywords: "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END", hashComments: !0, multiLineStrings: !0, regexLiterals: !0}), ["perl", "pl", "pm"]);
    k(u({keywords: J, hashComments: !0, multiLineStrings: !0, regexLiterals: !0}), ["rb"]);
    k(u({keywords: w, cStyleComments: !0, regexLiterals: !0}), ["js"]);
    k(u({keywords: "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes",
        hashComments: 3, cStyleComments: !0, multilineStrings: !0, tripleQuotedStrings: !0, regexLiterals: !0}), ["coffee"]);
    k(x([], [
        ["str", /^[\S\s]+/]
    ]), ["regex"]);
    window.prettyPrintOne = function (a, m, e) {
        var h = document.createElement("PRE");
        h.innerHTML = a;
        e && D(h, e);
        E({g: m, i: e, h: h});
        return h.innerHTML
    };
    window.prettyPrint = function (a) {
        function m() {
            for (var e = window.PR_SHOULD_USE_CONTINUATION ? l.now() + 250 : Infinity; p < h.length && l.now() < e; p++) {
                var n = h[p], k = n.className;
                if (k.indexOf("prettyprint") >= 0) {
                    var k = k.match(g), f, b;
                    if (b = !k) {
                        b = n;
                        for (var o = void 0, c = b.firstChild; c; c = c.nextSibling)var i = c.nodeType, o = i === 1 ? o ? b : c : i === 3 ? N.test(c.nodeValue) ? b : o : o;
                        b = (f = o === b ? void 0 : o) && "CODE" === f.tagName
                    }
                    b && (k = f.className.match(g));
                    k && (k = k[1]);
                    b = !1;
                    for (o = n.parentNode; o; o = o.parentNode)if ((o.tagName === "pre" || o.tagName === "code" || o.tagName === "xmp") && o.className && o.className.indexOf("prettyprint") >= 0) {
                        b = !0;
                        break
                    }
                    b || ((b = (b = n.className.match(/\blinenums\b(?::(\d+))?/)) ? b[1] && b[1].length ? +b[1] : !0 : !1) && D(n, b), d = {g: k, h: n, i: b}, E(d))
                }
            }
            p < h.length ? setTimeout(m,
                250) : a && a()
        }

        for (var e = [document.getElementsByTagName("pre"), document.getElementsByTagName("code"), document.getElementsByTagName("xmp")], h = [], k = 0; k < e.length; ++k)for (var t = 0, s = e[k].length; t < s; ++t)h.push(e[k][t]);
        var e = q, l = Date;
        l.now || (l = {now: function () {
            return+new Date
        }});
        var p = 0, d, g = /\blang(?:uage)?-([\w.]+)(?!\S)/;
        m()
    };
    window.PR = {createSimpleLexer: x, registerLangHandler: k, sourceDecorator: u, PR_ATTRIB_NAME: "atn", PR_ATTRIB_VALUE: "atv", PR_COMMENT: "com", PR_DECLARATION: "dec", PR_KEYWORD: "kwd", PR_LITERAL: "lit",
        PR_NOCODE: "nocode", PR_PLAIN: "pln", PR_PUNCTUATION: "pun", PR_SOURCE: "src", PR_STRING: "str", PR_TAG: "tag", PR_TYPE: "typ"}
})();
/**!
 * easyPieChart
 * Lightweight plugin to render simple, animated and retina optimized pie charts
 *
 * @license Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * @author Robert Fleischmann <rendro87@gmail.com> (http://robert-fleischmann.de)
 * @version 2.0.1
 **/
!function (a) {
    var b = function (a, b) {
        var c = document.createElement("canvas");
        "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(c);
        var d = c.getContext("2d");
        if (c.width = c.height = b.size, a.appendChild(c), window.devicePixelRatio > 1) {
            var e = window.devicePixelRatio;
            c.style.width = c.style.height = [b.size, "px"].join(""), c.width = c.height = b.size * e, d.scale(e, e)
        }
        d.translate(b.size / 2, b.size / 2), d.rotate((-0.5 + b.rotate / 180) * Math.PI);
        var f = (b.size - b.lineWidth) / 2;
        b.scaleColor && b.scaleLength && (f -= b.scaleLength + 2);
        var g = function (a, b, c) {
            c = Math.min(Math.max(0, c || 1), 1), d.beginPath(), d.arc(0, 0, f, 0, 2 * Math.PI * c, !1), d.strokeStyle = a, d.lineWidth = b, d.stroke()
        }, h = function () {
            var a, c, e = 24;
            d.lineWidth = 1, d.fillStyle = b.scaleColor, d.save();
            for (var e = 24; e >= 0; --e)0 === e % 6 ? (c = b.scaleLength, a = 0) : (c = .6 * b.scaleLength, a = b.scaleLength - c), d.fillRect(-b.size / 2 + a, 0, c, 1), d.rotate(Math.PI / 12);
            d.restore()
        };
        Date.now = Date.now || function () {
            return+new Date
        };
        var i = function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) {
                window.setTimeout(a, 1e3 / 60)
            }
        }();
        this.clear = function () {
            d.clearRect(b.size / -2, b.size / -2, b.size, b.size)
        }, this.draw = function (a) {
            this.clear(), b.scaleColor && h(), b.trackColor && g(b.trackColor, b.lineWidth), d.lineCap = b.lineCap;
            var c;
            c = "function" == typeof b.barColor ? b.barColor(a) : b.barColor, a > 0 && g(c, b.lineWidth, a / 100)
        }.bind(this), this.animate = function (a, c) {
            var d = Date.now();
            b.onStart(a, c);
            var e = function () {
                var f = Math.min(Date.now() - d, b.animate), g = b.easing(this, f, a, c - a, b.animate);
                this.draw(g), b.onStep(a, c, g), f >= b.animate ? b.onStop(a, c) : i(e)
            }.bind(this);
            i(e)
        }.bind(this)
    }, c = function (a, c) {
        var d, e = {barColor: "#ef1e25", trackColor: "#f9f9f9", scaleColor: "#dfe0e0", scaleLength: 5, lineCap: "round", lineWidth: 3, size: 110, rotate: 0, animate: 1e3, renderer: b, easing: function (a, b, c, d, e) {
            return(b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
        }, onStart: function () {
        }, onStep: function () {
        }, onStop: function () {
        }}, f = {}, g = 0, h = function () {
            this.el = a, this.options = f;
            for (var b in e)e.hasOwnProperty(b) && (f[b] = c && "undefined" != typeof c[b] ? c[b] : e[b], "function" == typeof f[b] && (f[b] = f[b].bind(this)));
            f.easing = "string" == typeof f.easing && "undefined" != typeof jQuery && jQuery.isFunction(jQuery.easing[f.easing]) ? jQuery.easing[f.easing] : e.easing, d = new f.renderer(a, f), d.draw(g), a.dataset && a.dataset.percent && this.update(parseInt(a.dataset.percent, 10))
        }.bind(this);
        this.update = function (a) {
            return a = parseInt(a, 10), f.animate ? d.animate(g, a) : d.draw(a), g = a, this
        }.bind(this), h()
    };
    a.fn.easyPieChart = function (b) {
        return this.each(function () {
            a.data(this, "easyPieChart") || a.data(this, "easyPieChart", new c(this, b))
        })
    }
}(jQuery);
/* jquery.sparkline 2.1.2 - http://omnipotent.net/jquery.sparkline/ 
 ** Licensed under the New BSD License - see above site for details */

(function (a, b, c) {
    (function (a) {
        typeof define == "function" && define.amd ? define(["jquery"], a) : jQuery && !jQuery.fn.sparkline && a(jQuery)
    })(function (d) {
        "use strict";
        var e = {}, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L = 0;
        f = function () {
            return{common: {type: "line", lineColor: "#00f", fillColor: "#cdf", defaultPixelsPerValue: 3, width: "auto", height: "auto", composite: !1, tagValuesAttribute: "values", tagOptionsPrefix: "spark", enableTagOptions: !1, enableHighlight: !0, highlightLighten: 1.4, tooltipSkipNull: !0, tooltipPrefix: "", tooltipSuffix: "", disableHiddenCheck: !1, numberFormatter: !1, numberDigitGroupCount: 3, numberDigitGroupSep: ",", numberDecimalMark: ".", disableTooltips: !1, disableInteraction: !1}, line: {spotColor: "#f80", highlightSpotColor: "#5f5", highlightLineColor: "#f22", spotRadius: 1.5, minSpotColor: "#f80", maxSpotColor: "#f80", lineWidth: 1, normalRangeMin: c, normalRangeMax: c, normalRangeColor: "#ccc", drawNormalOnTop: !1, chartRangeMin: c, chartRangeMax: c, chartRangeMinX: c, chartRangeMaxX: c, tooltipFormat: new h('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{y}}{{suffix}}')}, bar: {barColor: "#3366cc", negBarColor: "#f44", stackedBarColor: ["#3366cc", "#dc3912", "#ff9900", "#109618", "#66aa00", "#dd4477", "#0099c6", "#990099"], zeroColor: c, nullColor: c, zeroAxis: !0, barWidth: 4, barSpacing: 1, chartRangeMax: c, chartRangeMin: c, chartRangeClip: !1, colorMap: c, tooltipFormat: new h('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{value}}{{suffix}}')}, tristate: {barWidth: 4, barSpacing: 1, posBarColor: "#6f6", negBarColor: "#f44", zeroBarColor: "#999", colorMap: {}, tooltipFormat: new h('<span style="color: {{color}}">&#9679;</span> {{value:map}}'), tooltipValueLookups: {map: {"-1": "Loss", 0: "Draw", 1: "Win"}}}, discrete: {lineHeight: "auto", thresholdColor: c, thresholdValue: 0, chartRangeMax: c, chartRangeMin: c, chartRangeClip: !1, tooltipFormat: new h("{{prefix}}{{value}}{{suffix}}")}, bullet: {targetColor: "#f33", targetWidth: 3, performanceColor: "#33f", rangeColors: ["#d3dafe", "#a8b6ff", "#7f94ff"], base: c, tooltipFormat: new h("{{fieldkey:fields}} - {{value}}"), tooltipValueLookups: {fields: {r: "Range", p: "Performance", t: "Target"}}}, pie: {offset: 0, sliceColors: ["#3366cc", "#dc3912", "#ff9900", "#109618", "#66aa00", "#dd4477", "#0099c6", "#990099"], borderWidth: 0, borderColor: "#000", tooltipFormat: new h('<span style="color: {{color}}">&#9679;</span> {{value}} ({{percent.1}}%)')}, box: {raw: !1, boxLineColor: "#000", boxFillColor: "#cdf", whiskerColor: "#000", outlierLineColor: "#333", outlierFillColor: "#fff", medianColor: "#f00", showOutliers: !0, outlierIQR: 1.5, spotRadius: 1.5, target: c, targetColor: "#4a2", chartRangeMax: c, chartRangeMin: c, tooltipFormat: new h("{{field:fields}}: {{value}}"), tooltipFormatFieldlistKey: "field", tooltipValueLookups: {fields: {lq: "Lower Quartile", med: "Median", uq: "Upper Quartile", lo: "Left Outlier", ro: "Right Outlier", lw: "Left Whisker", rw: "Right Whisker"}}}}
        }, E = '.jqstooltip { position: absolute;left: 0px;top: 0px;visibility: hidden;background: rgb(0, 0, 0) transparent;background-color: rgba(0,0,0,0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";color: white;font: 10px arial, san serif;text-align: left;white-space: nowrap;padding: 5px;border: 1px solid white;z-index: 10000;}.jqsfield { color: white;font: 10px arial, san serif;text-align: left;}', g = function () {
            var a, b;
            return a = function () {
                this.init.apply(this, arguments)
            }, arguments.length > 1 ? (arguments[0] ? (a.prototype = d.extend(new arguments[0], arguments[arguments.length - 1]), a._super = arguments[0].prototype) : a.prototype = arguments[arguments.length - 1], arguments.length > 2 && (b = Array.prototype.slice.call(arguments, 1, -1), b.unshift(a.prototype), d.extend.apply(d, b))) : a.prototype = arguments[0], a.prototype.cls = a, a
        }, d.SPFormatClass = h = g({fre: /\{\{([\w.]+?)(:(.+?))?\}\}/g, precre: /(\w+)\.(\d+)/, init: function (a, b) {
            this.format = a, this.fclass = b
        }, render: function (a, b, d) {
            var e = this, f = a, g, h, i, j, k;
            return this.format.replace(this.fre, function () {
                var a;
                return h = arguments[1], i = arguments[3], g = e.precre.exec(h), g ? (k = g[2], h = g[1]) : k = !1, j = f[h], j === c ? "" : i && b && b[i] ? (a = b[i], a.get ? b[i].get(j) || j : b[i][j] || j) : (n(j) && (d.get("numberFormatter") ? j = d.get("numberFormatter")(j) : j = s(j, k, d.get("numberDigitGroupCount"), d.get("numberDigitGroupSep"), d.get("numberDecimalMark"))), j)
            })
        }}), d.spformat = function (a, b) {
            return new h(a, b)
        }, i = function (a, b, c) {
            return a < b ? b : a > c ? c : a
        }, j = function (a, c) {
            var d;
            return c === 2 ? (d = b.floor(a.length / 2), a.length % 2 ? a[d] : (a[d - 1] + a[d]) / 2) : a.length % 2 ? (d = (a.length * c + c) / 4, d % 1 ? (a[b.floor(d)] + a[b.floor(d) - 1]) / 2 : a[d - 1]) : (d = (a.length * c + 2) / 4, d % 1 ? (a[b.floor(d)] + a[b.floor(d) - 1]) / 2 : a[d - 1])
        }, k = function (a) {
            var b;
            switch (a) {
                case"undefined":
                    a = c;
                    break;
                case"null":
                    a = null;
                    break;
                case"true":
                    a = !0;
                    break;
                case"false":
                    a = !1;
                    break;
                default:
                    b = parseFloat(a), a == b && (a = b)
            }
            return a
        }, l = function (a) {
            var b, c = [];
            for (b = a.length; b--;)c[b] = k(a[b]);
            return c
        }, m = function (a, b) {
            var c, d, e = [];
            for (c = 0, d = a.length; c < d; c++)a[c] !== b && e.push(a[c]);
            return e
        }, n = function (a) {
            return!isNaN(parseFloat(a)) && isFinite(a)
        }, s = function (a, b, c, e, f) {
            var g, h;
            a = (b === !1 ? parseFloat(a).toString() : a.toFixed(b)).split(""), g = (g = d.inArray(".", a)) < 0 ? a.length : g, g < a.length && (a[g] = f);
            for (h = g - c; h > 0; h -= c)a.splice(h, 0, e);
            return a.join("")
        }, o = function (a, b, c) {
            var d;
            for (d = b.length; d--;) {
                if (c && b[d] === null)continue;
                if (b[d] !== a)return!1
            }
            return!0
        }, p = function (a) {
            var b = 0, c;
            for (c = a.length; c--;)b += typeof a[c] == "number" ? a[c] : 0;
            return b
        }, r = function (a) {
            return d.isArray(a) ? a : [a]
        }, q = function (b) {
            var c;
            a.createStyleSheet ? a.createStyleSheet().cssText = b : (c = a.createElement("style"), c.type = "text/css", a.getElementsByTagName("head")[0].appendChild(c), c[typeof a.body.style.WebkitAppearance == "string" ? "innerText" : "innerHTML"] = b)
        }, d.fn.simpledraw = function (b, e, f, g) {
            var h, i;
            if (f && (h = this.data("_jqs_vcanvas")))return h;
            if (d.fn.sparkline.canvas === !1)return!1;
            if (d.fn.sparkline.canvas === c) {
                var j = a.createElement("canvas");
                if (!j.getContext || !j.getContext("2d")) {
                    if (!a.namespaces || !!a.namespaces.v)return d.fn.sparkline.canvas = !1, !1;
                    a.namespaces.add("v", "urn:schemas-microsoft-com:vml", "#default#VML"), d.fn.sparkline.canvas = function (a, b, c, d) {
                        return new J(a, b, c)
                    }
                } else d.fn.sparkline.canvas = function (a, b, c, d) {
                    return new I(a, b, c, d)
                }
            }
            return b === c && (b = d(this).innerWidth()), e === c && (e = d(this).innerHeight()), h = d.fn.sparkline.canvas(b, e, this, g), i = d(this).data("_jqs_mhandler"), i && i.registerCanvas(h), h
        }, d.fn.cleardraw = function () {
            var a = this.data("_jqs_vcanvas");
            a && a.reset()
        }, d.RangeMapClass = t = g({init: function (a) {
            var b, c, d = [];
            for (b in a)a.hasOwnProperty(b) && typeof b == "string" && b.indexOf(":") > -1 && (c = b.split(":"), c[0] = c[0].length === 0 ? -Infinity : parseFloat(c[0]), c[1] = c[1].length === 0 ? Infinity : parseFloat(c[1]), c[2] = a[b], d.push(c));
            this.map = a, this.rangelist = d || !1
        }, get: function (a) {
            var b = this.rangelist, d, e, f;
            if ((f = this.map[a]) !== c)return f;
            if (b)for (d = b.length; d--;) {
                e = b[d];
                if (e[0] <= a && e[1] >= a)return e[2]
            }
            return c
        }}), d.range_map = function (a) {
            return new t(a)
        }, u = g({init: function (a, b) {
            var c = d(a);
            this.$el = c, this.options = b, this.currentPageX = 0, this.currentPageY = 0, this.el = a, this.splist = [], this.tooltip = null, this.over = !1, this.displayTooltips = !b.get("disableTooltips"), this.highlightEnabled = !b.get("disableHighlight")
        }, registerSparkline: function (a) {
            this.splist.push(a), this.over && this.updateDisplay()
        }, registerCanvas: function (a) {
            var b = d(a.canvas);
            this.canvas = a, this.$canvas = b, b.mouseenter(d.proxy(this.mouseenter, this)), b.mouseleave(d.proxy(this.mouseleave, this)), b.click(d.proxy(this.mouseclick, this))
        }, reset: function (a) {
            this.splist = [], this.tooltip && a && (this.tooltip.remove(), this.tooltip = c)
        }, mouseclick: function (a) {
            var b = d.Event("sparklineClick");
            b.originalEvent = a, b.sparklines = this.splist, this.$el.trigger(b)
        }, mouseenter: function (b) {
            d(a.body).unbind("mousemove.jqs"), d(a.body).bind("mousemove.jqs", d.proxy(this.mousemove, this)), this.over = !0, this.currentPageX = b.pageX, this.currentPageY = b.pageY, this.currentEl = b.target, !this.tooltip && this.displayTooltips && (this.tooltip = new v(this.options), this.tooltip.updatePosition(b.pageX, b.pageY)), this.updateDisplay()
        }, mouseleave: function () {
            d(a.body).unbind("mousemove.jqs");
            var b = this.splist, c = b.length, e = !1, f, g;
            this.over = !1, this.currentEl = null, this.tooltip && (this.tooltip.remove(), this.tooltip = null);
            for (g = 0; g < c; g++)f = b[g], f.clearRegionHighlight() && (e = !0);
            e && this.canvas.render()
        }, mousemove: function (a) {
            this.currentPageX = a.pageX, this.currentPageY = a.pageY, this.currentEl = a.target, this.tooltip && this.tooltip.updatePosition(a.pageX, a.pageY), this.updateDisplay()
        }, updateDisplay: function () {
            var a = this.splist, b = a.length, c = !1, e = this.$canvas.offset(), f = this.currentPageX - e.left, g = this.currentPageY - e.top, h, i, j, k, l;
            if (!this.over)return;
            for (j = 0; j < b; j++)i = a[j], k = i.setRegionHighlight(this.currentEl, f, g), k && (c = !0);
            if (c) {
                l = d.Event("sparklineRegionChange"), l.sparklines = this.splist, this.$el.trigger(l);
                if (this.tooltip) {
                    h = "";
                    for (j = 0; j < b; j++)i = a[j], h += i.getCurrentRegionTooltip();
                    this.tooltip.setContent(h)
                }
                this.disableHighlight || this.canvas.render()
            }
            k === null && this.mouseleave()
        }}), v = g({sizeStyle: "position: static !important;display: block !important;visibility: hidden !important;float: left !important;", init: function (b) {
            var c = b.get("tooltipClassname", "jqstooltip"), e = this.sizeStyle, f;
            this.container = b.get("tooltipContainer") || a.body, this.tooltipOffsetX = b.get("tooltipOffsetX", 10), this.tooltipOffsetY = b.get("tooltipOffsetY", 12), d("#jqssizetip").remove(), d("#jqstooltip").remove(), this.sizetip = d("<div/>", {id: "jqssizetip", style: e, "class": c}), this.tooltip = d("<div/>", {id: "jqstooltip", "class": c}).appendTo(this.container), f = this.tooltip.offset(), this.offsetLeft = f.left, this.offsetTop = f.top, this.hidden = !0, d(window).unbind("resize.jqs scroll.jqs"), d(window).bind("resize.jqs scroll.jqs", d.proxy(this.updateWindowDims, this)), this.updateWindowDims()
        }, updateWindowDims: function () {
            this.scrollTop = d(window).scrollTop(), this.scrollLeft = d(window).scrollLeft(), this.scrollRight = this.scrollLeft + d(window).width(), this.updatePosition()
        }, getSize: function (a) {
            this.sizetip.html(a).appendTo(this.container), this.width = this.sizetip.width() + 1, this.height = this.sizetip.height(), this.sizetip.remove()
        }, setContent: function (a) {
            if (!a) {
                this.tooltip.css("visibility", "hidden"), this.hidden = !0;
                return
            }
            this.getSize(a), this.tooltip.html(a).css({width: this.width, height: this.height, visibility: "visible"}), this.hidden && (this.hidden = !1, this.updatePosition())
        }, updatePosition: function (a, b) {
            if (a === c) {
                if (this.mousex === c)return;
                a = this.mousex - this.offsetLeft, b = this.mousey - this.offsetTop
            } else this.mousex = a -= this.offsetLeft, this.mousey = b -= this.offsetTop;
            if (!this.height || !this.width || this.hidden)return;
            b -= this.height + this.tooltipOffsetY, a += this.tooltipOffsetX, b < this.scrollTop && (b = this.scrollTop), a < this.scrollLeft ? a = this.scrollLeft : a + this.width > this.scrollRight && (a = this.scrollRight - this.width), this.tooltip.css({left: a, top: b})
        }, remove: function () {
            this.tooltip.remove(), this.sizetip.remove(), this.sizetip = this.tooltip = c, d(window).unbind("resize.jqs scroll.jqs")
        }}), F = function () {
            q(E)
        }, d(F), K = [], d.fn.sparkline = function (b, e) {
            return this.each(function () {
                var f = new d.fn.sparkline.options(this, e), g = d(this), h, i;
                h = function () {
                    var e, h, i, j, k, l, m;
                    if (b === "html" || b === c) {
                        m = this.getAttribute(f.get("tagValuesAttribute"));
                        if (m === c || m === null)m = g.html();
                        e = m.replace(/(^\s*<!--)|(-->\s*$)|\s+/g, "").split(",")
                    } else e = b;
                    h = f.get("width") === "auto" ? e.length * f.get("defaultPixelsPerValue") : f.get("width");
                    if (f.get("height") === "auto") {
                        if (!f.get("composite") || !d.data(this, "_jqs_vcanvas"))j = a.createElement("span"), j.innerHTML = "a", g.html(j), i = d(j).innerHeight() || d(j).height(), d(j).remove(), j = null
                    } else i = f.get("height");
                    f.get("disableInteraction") ? k = !1 : (k = d.data(this, "_jqs_mhandler"), k ? f.get("composite") || k.reset() : (k = new u(this, f), d.data(this, "_jqs_mhandler", k)));
                    if (f.get("composite") && !d.data(this, "_jqs_vcanvas")) {
                        d.data(this, "_jqs_errnotify") || (alert("Attempted to attach a composite sparkline to an element with no existing sparkline"), d.data(this, "_jqs_errnotify", !0));
                        return
                    }
                    l = new (d.fn.sparkline[f.get("type")])(this, e, f, h, i), l.render(), k && k.registerSparkline(l)
                };
                if (d(this).html() && !f.get("disableHiddenCheck") && d(this).is(":hidden") || !d(this).parents("body").length) {
                    if (!f.get("composite") && d.data(this, "_jqs_pending"))for (i = K.length; i; i--)K[i - 1][0] == this && K.splice(i - 1, 1);
                    K.push([this, h]), d.data(this, "_jqs_pending", !0)
                } else h.call(this)
            })
        }, d.fn.sparkline.defaults = f(), d.sparkline_display_visible = function () {
            var a, b, c, e = [];
            for (b = 0, c = K.length; b < c; b++)a = K[b][0], d(a).is(":visible") && !d(a).parents().is(":hidden") ? (K[b][1].call(a), d.data(K[b][0], "_jqs_pending", !1), e.push(b)) : !d(a).closest("html").length && !d.data(a, "_jqs_pending") && (d.data(K[b][0], "_jqs_pending", !1), e.push(b));
            for (b = e.length; b; b--)K.splice(e[b - 1], 1)
        }, d.fn.sparkline.options = g({init: function (a, b) {
            var c, f, g, h;
            this.userOptions = b = b || {}, this.tag = a, this.tagValCache = {}, f = d.fn.sparkline.defaults, g = f.common, this.tagOptionsPrefix = b.enableTagOptions && (b.tagOptionsPrefix || g.tagOptionsPrefix), h = this.getTagSetting("type"), h === e ? c = f[b.type || g.type] : c = f[h], this.mergedOptions = d.extend({}, g, c, b)
        }, getTagSetting: function (a) {
            var b = this.tagOptionsPrefix, d, f, g, h;
            if (b === !1 || b === c)return e;
            if (this.tagValCache.hasOwnProperty(a))d = this.tagValCache.key; else {
                d = this.tag.getAttribute(b + a);
                if (d === c || d === null)d = e; else if (d.substr(0, 1) === "[") {
                    d = d.substr(1, d.length - 2).split(",");
                    for (f = d.length; f--;)d[f] = k(d[f].replace(/(^\s*)|(\s*$)/g, ""))
                } else if (d.substr(0, 1) === "{") {
                    g = d.substr(1, d.length - 2).split(","), d = {};
                    for (f = g.length; f--;)h = g[f].split(":", 2), d[h[0].replace(/(^\s*)|(\s*$)/g, "")] = k(h[1].replace(/(^\s*)|(\s*$)/g, ""))
                } else d = k(d);
                this.tagValCache.key = d
            }
            return d
        }, get: function (a, b) {
            var d = this.getTagSetting(a), f;
            return d !== e ? d : (f = this.mergedOptions[a]) === c ? b : f
        }}), d.fn.sparkline._base = g({disabled: !1, init: function (a, b, e, f, g) {
            this.el = a, this.$el = d(a), this.values = b, this.options = e, this.width = f, this.height = g, this.currentRegion = c
        }, initTarget: function () {
            var a = !this.options.get("disableInteraction");
            (this.target = this.$el.simpledraw(this.width, this.height, this.options.get("composite"), a)) ? (this.canvasWidth = this.target.pixelWidth, this.canvasHeight = this.target.pixelHeight) : this.disabled = !0
        }, render: function () {
            return this.disabled ? (this.el.innerHTML = "", !1) : !0
        }, getRegion: function (a, b) {
        }, setRegionHighlight: function (a, b, d) {
            var e = this.currentRegion, f = !this.options.get("disableHighlight"), g;
            return b > this.canvasWidth || d > this.canvasHeight || b < 0 || d < 0 ? null : (g = this.getRegion(a, b, d), e !== g ? (e !== c && f && this.removeHighlight(), this.currentRegion = g, g !== c && f && this.renderHighlight(), !0) : !1)
        }, clearRegionHighlight: function () {
            return this.currentRegion !== c ? (this.removeHighlight(), this.currentRegion = c, !0) : !1
        }, renderHighlight: function () {
            this.changeHighlight(!0)
        }, removeHighlight: function () {
            this.changeHighlight(!1)
        }, changeHighlight: function (a) {
        }, getCurrentRegionTooltip: function () {
            var a = this.options, b = "", e = [], f, g, i, j, k, l, m, n, o, p, q, r, s, t;
            if (this.currentRegion === c)return"";
            f = this.getCurrentRegionFields(), q = a.get("tooltipFormatter");
            if (q)return q(this, a, f);
            a.get("tooltipChartTitle") && (b += '<div class="jqs jqstitle">' + a.get("tooltipChartTitle") + "</div>\n"), g = this.options.get("tooltipFormat");
            if (!g)return"";
            d.isArray(g) || (g = [g]), d.isArray(f) || (f = [f]), m = this.options.get("tooltipFormatFieldlist"), n = this.options.get("tooltipFormatFieldlistKey");
            if (m && n) {
                o = [];
                for (l = f.length; l--;)p = f[l][n], (t = d.inArray(p, m)) != -1 && (o[t] = f[l]);
                f = o
            }
            i = g.length, s = f.length;
            for (l = 0; l < i; l++) {
                r = g[l], typeof r == "string" && (r = new h(r)), j = r.fclass || "jqsfield";
                for (t = 0; t < s; t++)if (!f[t].isNull || !a.get("tooltipSkipNull"))d.extend(f[t], {prefix: a.get("tooltipPrefix"), suffix: a.get("tooltipSuffix")}), k = r.render(f[t], a.get("tooltipValueLookups"), a), e.push('<div class="' + j + '">' + k + "</div>")
            }
            return e.length ? b + e.join("\n") : ""
        }, getCurrentRegionFields: function () {
        }, calcHighlightColor: function (a, c) {
            var d = c.get("highlightColor"), e = c.get("highlightLighten"), f, g, h, j;
            if (d)return d;
            if (e) {
                f = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(a) || /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(a);
                if (f) {
                    h = [], g = a.length === 4 ? 16 : 1;
                    for (j = 0; j < 3; j++)h[j] = i(b.round(parseInt(f[j + 1], 16) * g * e), 0, 255);
                    return"rgb(" + h.join(",") + ")"
                }
            }
            return a
        }}), w = {changeHighlight: function (a) {
            var b = this.currentRegion, c = this.target, e = this.regionShapes[b], f;
            e && (f = this.renderRegion(b, a), d.isArray(f) || d.isArray(e) ? (c.replaceWithShapes(e, f), this.regionShapes[b] = d.map(f, function (a) {
                return a.id
            })) : (c.replaceWithShape(e, f), this.regionShapes[b] = f.id))
        }, render: function () {
            var a = this.values, b = this.target, c = this.regionShapes, e, f, g, h;
            if (!this.cls._super.render.call(this))return;
            for (g = a.length; g--;) {
                e = this.renderRegion(g);
                if (e)if (d.isArray(e)) {
                    f = [];
                    for (h = e.length; h--;)e[h].append(), f.push(e[h].id);
                    c[g] = f
                } else e.append(), c[g] = e.id; else c[g] = null
            }
            b.render()
        }}, d.fn.sparkline.line = x = g(d.fn.sparkline._base, {type: "line", init: function (a, b, c, d, e) {
            x._super.init.call(this, a, b, c, d, e), this.vertices = [], this.regionMap = [], this.xvalues = [], this.yvalues = [], this.yminmax = [], this.hightlightSpotId = null, this.lastShapeId = null, this.initTarget()
        }, getRegion: function (a, b, d) {
            var e, f = this.regionMap;
            for (e = f.length; e--;)if (f[e] !== null && b >= f[e][0] && b <= f[e][1])return f[e][2];
            return c
        }, getCurrentRegionFields: function () {
            var a = this.currentRegion;
            return{isNull: this.yvalues[a] === null, x: this.xvalues[a], y: this.yvalues[a], color: this.options.get("lineColor"), fillColor: this.options.get("fillColor"), offset: a}
        }, renderHighlight: function () {
            var a = this.currentRegion, b = this.target, d = this.vertices[a], e = this.options, f = e.get("spotRadius"), g = e.get("highlightSpotColor"), h = e.get("highlightLineColor"), i, j;
            if (!d)return;
            f && g && (i = b.drawCircle(d[0], d[1], f, c, g), this.highlightSpotId = i.id, b.insertAfterShape(this.lastShapeId, i)), h && (j = b.drawLine(d[0], this.canvasTop, d[0], this.canvasTop + this.canvasHeight, h), this.highlightLineId = j.id, b.insertAfterShape(this.lastShapeId, j))
        }, removeHighlight: function () {
            var a = this.target;
            this.highlightSpotId && (a.removeShapeId(this.highlightSpotId), this.highlightSpotId = null), this.highlightLineId && (a.removeShapeId(this.highlightLineId), this.highlightLineId = null)
        }, scanValues: function () {
            var a = this.values, c = a.length, d = this.xvalues, e = this.yvalues, f = this.yminmax, g, h, i, j, k;
            for (g = 0; g < c; g++)h = a[g], i = typeof a[g] == "string", j = typeof a[g] == "object" && a[g]instanceof Array, k = i && a[g].split(":"), i && k.length === 2 ? (d.push(Number(k[0])), e.push(Number(k[1])), f.push(Number(k[1]))) : j ? (d.push(h[0]), e.push(h[1]), f.push(h[1])) : (d.push(g), a[g] === null || a[g] === "null" ? e.push(null) : (e.push(Number(h)), f.push(Number(h))));
            this.options.get("xvalues") && (d = this.options.get("xvalues")), this.maxy = this.maxyorg = b.max.apply(b, f), this.miny = this.minyorg = b.min.apply(b, f), this.maxx = b.max.apply(b, d), this.minx = b.min.apply(b, d), this.xvalues = d, this.yvalues = e, this.yminmax = f
        }, processRangeOptions: function () {
            var a = this.options, b = a.get("normalRangeMin"), d = a.get("normalRangeMax");
            b !== c && (b < this.miny && (this.miny = b), d > this.maxy && (this.maxy = d)), a.get("chartRangeMin") !== c && (a.get("chartRangeClip") || a.get("chartRangeMin") < this.miny) && (this.miny = a.get("chartRangeMin")), a.get("chartRangeMax") !== c && (a.get("chartRangeClip") || a.get("chartRangeMax") > this.maxy) && (this.maxy = a.get("chartRangeMax")), a.get("chartRangeMinX") !== c && (a.get("chartRangeClipX") || a.get("chartRangeMinX") < this.minx) && (this.minx = a.get("chartRangeMinX")), a.get("chartRangeMaxX") !== c && (a.get("chartRangeClipX") || a.get("chartRangeMaxX") > this.maxx) && (this.maxx = a.get("chartRangeMaxX"))
        }, drawNormalRange: function (a, d, e, f, g) {
            var h = this.options.get("normalRangeMin"), i = this.options.get("normalRangeMax"), j = d + b.round(e - e * ((i - this.miny) / g)), k = b.round(e * (i - h) / g);
            this.target.drawRect(a, j, f, k, c, this.options.get("normalRangeColor")).append()
        }, render: function () {
            var a = this.options, e = this.target, f = this.canvasWidth, g = this.canvasHeight, h = this.vertices, i = a.get("spotRadius"), j = this.regionMap, k, l, m, n, o, p, q, r, s, u, v, w, y, z, A, B, C, D, E, F, G, H, I, J, K;
            if (!x._super.render.call(this))return;
            this.scanValues(), this.processRangeOptions(), I = this.xvalues, J = this.yvalues;
            if (!this.yminmax.length || this.yvalues.length < 2)return;
            n = o = 0, k = this.maxx - this.minx === 0 ? 1 : this.maxx - this.minx, l = this.maxy - this.miny === 0 ? 1 : this.maxy - this.miny, m = this.yvalues.length - 1, i && (f < i * 4 || g < i * 4) && (i = 0);
            if (i) {
                G = a.get("highlightSpotColor") && !a.get("disableInteraction");
                if (G || a.get("minSpotColor") || a.get("spotColor") && J[m] === this.miny)g -= b.ceil(i);
                if (G || a.get("maxSpotColor") || a.get("spotColor") && J[m] === this.maxy)g -= b.ceil(i), n += b.ceil(i);
                if (G || (a.get("minSpotColor") || a.get("maxSpotColor")) && (J[0] === this.miny || J[0] === this.maxy))o += b.ceil(i), f -= b.ceil(i);
                if (G || a.get("spotColor") || a.get("minSpotColor") || a.get("maxSpotColor") && (J[m] === this.miny || J[m] === this.maxy))f -= b.ceil(i)
            }
            g--, a.get("normalRangeMin") !== c && !a.get("drawNormalOnTop") && this.drawNormalRange(o, n, g, f, l), q = [], r = [q], z = A = null, B = J.length;
            for (K = 0; K < B; K++)s = I[K], v = I[K + 1], u = J[K], w = o + b.round((s - this.minx) * (f / k)), y = K < B - 1 ? o + b.round((v - this.minx) * (f / k)) : f, A = w + (y - w) / 2, j[K] = [z || 0, A, K], z = A, u === null ? K && (J[K - 1] !== null && (q = [], r.push(q)), h.push(null)) : (u < this.miny && (u = this.miny), u > this.maxy && (u = this.maxy), q.length || q.push([w, n + g]), p = [w, n + b.round(g - g * ((u - this.miny) / l))], q.push(p), h.push(p));
            C = [], D = [], E = r.length;
            for (K = 0; K < E; K++)q = r[K], q.length && (a.get("fillColor") && (q.push([q[q.length - 1][0], n + g]), D.push(q.slice(0)), q.pop()), q.length > 2 && (q[0] = [q[0][0], q[1][1]]), C.push(q));
            E = D.length;
            for (K = 0; K < E; K++)e.drawShape(D[K], a.get("fillColor"), a.get("fillColor")).append();
            a.get("normalRangeMin") !== c && a.get("drawNormalOnTop") && this.drawNormalRange(o, n, g, f, l), E = C.length;
            for (K = 0; K < E; K++)e.drawShape(C[K], a.get("lineColor"), c, a.get("lineWidth")).append();
            if (i && a.get("valueSpots")) {
                F = a.get("valueSpots"), F.get === c && (F = new t(F));
                for (K = 0; K < B; K++)H = F.get(J[K]), H && e.drawCircle(o + b.round((I[K] - this.minx) * (f / k)), n + b.round(g - g * ((J[K] - this.miny) / l)), i, c, H).append()
            }
            i && a.get("spotColor") && J[m] !== null && e.drawCircle(o + b.round((I[I.length - 1] - this.minx) * (f / k)), n + b.round(g - g * ((J[m] - this.miny) / l)), i, c, a.get("spotColor")).append(), this.maxy !== this.minyorg && (i && a.get("minSpotColor") && (s = I[d.inArray(this.minyorg, J)], e.drawCircle(o + b.round((s - this.minx) * (f / k)), n + b.round(g - g * ((this.minyorg - this.miny) / l)), i, c, a.get("minSpotColor")).append()), i && a.get("maxSpotColor") && (s = I[d.inArray(this.maxyorg, J)], e.drawCircle(o + b.round((s - this.minx) * (f / k)), n + b.round(g - g * ((this.maxyorg - this.miny) / l)), i, c, a.get("maxSpotColor")).append())), this.lastShapeId = e.getLastShapeId(), this.canvasTop = n, e.render()
        }}), d.fn.sparkline.bar = y = g(d.fn.sparkline._base, w, {type: "bar", init: function (a, e, f, g, h) {
            var j = parseInt(f.get("barWidth"), 10), n = parseInt(f.get("barSpacing"), 10), o = f.get("chartRangeMin"), p = f.get("chartRangeMax"), q = f.get("chartRangeClip"), r = Infinity, s = -Infinity, u, v, w, x, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R;
            y._super.init.call(this, a, e, f, g, h);
            for (A = 0, B = e.length; A < B; A++) {
                O = e[A], u = typeof O == "string" && O.indexOf(":") > -1;
                if (u || d.isArray(O))J = !0, u && (O = e[A] = l(O.split(":"))), O = m(O, null), v = b.min.apply(b, O), w = b.max.apply(b, O), v < r && (r = v), w > s && (s = w)
            }
            this.stacked = J, this.regionShapes = {}, this.barWidth = j, this.barSpacing = n, this.totalBarWidth = j + n, this.width = g = e.length * j + (e.length - 1) * n, this.initTarget(), q && (H = o === c ? -Infinity : o, I = p === c ? Infinity : p), z = [], x = J ? [] : z;
            var S = [], T = [];
            for (A = 0, B = e.length; A < B; A++)if (J) {
                K = e[A], e[A] = N = [], S[A] = 0, x[A] = T[A] = 0;
                for (L = 0, M = K.length; L < M; L++)O = N[L] = q ? i(K[L], H, I) : K[L], O !== null && (O > 0 && (S[A] += O), r < 0 && s > 0 ? O < 0 ? T[A] += b.abs(O) : x[A] += O : x[A] += b.abs(O - (O < 0 ? s : r)), z.push(O))
            } else O = q ? i(e[A], H, I) : e[A], O = e[A] = k(O), O !== null && z.push(O);
            this.max = G = b.max.apply(b, z), this.min = F = b.min.apply(b, z), this.stackMax = s = J ? b.max.apply(b, S) : G, this.stackMin = r = J ? b.min.apply(b, z) : F, f.get("chartRangeMin") !== c && (f.get("chartRangeClip") || f.get("chartRangeMin") < F) && (F = f.get("chartRangeMin")), f.get("chartRangeMax") !== c && (f.get("chartRangeClip") || f.get("chartRangeMax") > G) && (G = f.get("chartRangeMax")), this.zeroAxis = D = f.get("zeroAxis", !0), F <= 0 && G >= 0 && D ? E = 0 : D == 0 ? E = F : F > 0 ? E = F : E = G, this.xaxisOffset = E, C = J ? b.max.apply(b, x) + b.max.apply(b, T) : G - F, this.canvasHeightEf = D && F < 0 ? this.canvasHeight - 2 : this.canvasHeight - 1, F < E ? (Q = J && G >= 0 ? s : G, P = (Q - E) / C * this.canvasHeight, P !== b.ceil(P) && (this.canvasHeightEf -= 2, P = b.ceil(P))) : P = this.canvasHeight, this.yoffset = P, d.isArray(f.get("colorMap")) ? (this.colorMapByIndex = f.get("colorMap"), this.colorMapByValue = null) : (this.colorMapByIndex = null, this.colorMapByValue = f.get("colorMap"), this.colorMapByValue && this.colorMapByValue.get === c && (this.colorMapByValue = new t(this.colorMapByValue))), this.range = C
        }, getRegion: function (a, d, e) {
            var f = b.floor(d / this.totalBarWidth);
            return f < 0 || f >= this.values.length ? c : f
        }, getCurrentRegionFields: function () {
            var a = this.currentRegion, b = r(this.values[a]), c = [], d, e;
            for (e = b.length; e--;)d = b[e], c.push({isNull: d === null, value: d, color: this.calcColor(e, d, a), offset: a});
            return c
        }, calcColor: function (a, b, e) {
            var f = this.colorMapByIndex, g = this.colorMapByValue, h = this.options, i, j;
            return this.stacked ? i = h.get("stackedBarColor") : i = b < 0 ? h.get("negBarColor") : h.get("barColor"), b === 0 && h.get("zeroColor") !== c && (i = h.get("zeroColor")), g && (j = g.get(b)) ? i = j : f && f.length > e && (i = f[e]), d.isArray(i) ? i[a % i.length] : i
        }, renderRegion: function (a, e) {
            var f = this.values[a], g = this.options, h = this.xaxisOffset, i = [], j = this.range, k = this.stacked, l = this.target, m = a * this.totalBarWidth, n = this.canvasHeightEf, p = this.yoffset, q, r, s, t, u, v, w, x, y, z;
            f = d.isArray(f) ? f : [f], w = f.length, x = f[0], t = o(null, f), z = o(h, f, !0);
            if (t)return g.get("nullColor") ? (s = e ? g.get("nullColor") : this.calcHighlightColor(g.get("nullColor"), g), q = p > 0 ? p - 1 : p, l.drawRect(m, q, this.barWidth - 1, 0, s, s)) : c;
            u = p;
            for (v = 0; v < w; v++) {
                x = f[v];
                if (k && x === h) {
                    if (!z || y)continue;
                    y = !0
                }
                j > 0 ? r = b.floor(n * (b.abs(x - h) / j)) + 1 : r = 1, x < h || x === h && p === 0 ? (q = u, u += r) : (q = p - r, p -= r), s = this.calcColor(v, x, a), e && (s = this.calcHighlightColor(s, g)), i.push(l.drawRect(m, q, this.barWidth - 1, r - 1, s, s))
            }
            return i.length === 1 ? i[0] : i
        }}), d.fn.sparkline.tristate = z = g(d.fn.sparkline._base, w, {type: "tristate", init: function (a, b, e, f, g) {
            var h = parseInt(e.get("barWidth"), 10), i = parseInt(e.get("barSpacing"), 10);
            z._super.init.call(this, a, b, e, f, g), this.regionShapes = {}, this.barWidth = h, this.barSpacing = i, this.totalBarWidth = h + i, this.values = d.map(b, Number), this.width = f = b.length * h + (b.length - 1) * i, d.isArray(e.get("colorMap")) ? (this.colorMapByIndex = e.get("colorMap"), this.colorMapByValue = null) : (this.colorMapByIndex = null, this.colorMapByValue = e.get("colorMap"), this.colorMapByValue && this.colorMapByValue.get === c && (this.colorMapByValue = new t(this.colorMapByValue))), this.initTarget()
        }, getRegion: function (a, c, d) {
            return b.floor(c / this.totalBarWidth)
        }, getCurrentRegionFields: function () {
            var a = this.currentRegion;
            return{isNull: this.values[a] === c, value: this.values[a], color: this.calcColor(this.values[a], a), offset: a}
        }, calcColor: function (a, b) {
            var c = this.values, d = this.options, e = this.colorMapByIndex, f = this.colorMapByValue, g, h;
            return f && (h = f.get(a)) ? g = h : e && e.length > b ? g = e[b] : c[b] < 0 ? g = d.get("negBarColor") : c[b] > 0 ? g = d.get("posBarColor") : g = d.get("zeroBarColor"), g
        }, renderRegion: function (a, c) {
            var d = this.values, e = this.options, f = this.target, g, h, i, j, k, l;
            g = f.pixelHeight, i = b.round(g / 2), j = a * this.totalBarWidth, d[a] < 0 ? (k = i, h = i - 1) : d[a] > 0 ? (k = 0, h = i - 1) : (k = i - 1, h = 2), l = this.calcColor(d[a], a);
            if (l === null)return;
            return c && (l = this.calcHighlightColor(l, e)), f.drawRect(j, k, this.barWidth - 1, h - 1, l, l)
        }}), d.fn.sparkline.discrete = A = g(d.fn.sparkline._base, w, {type: "discrete", init: function (a, e, f, g, h) {
            A._super.init.call(this, a, e, f, g, h), this.regionShapes = {}, this.values = e = d.map(e, Number), this.min = b.min.apply(b, e), this.max = b.max.apply(b, e), this.range = this.max - this.min, this.width = g = f.get("width") === "auto" ? e.length * 2 : this.width, this.interval = b.floor(g / e.length), this.itemWidth = g / e.length, f.get("chartRangeMin") !== c && (f.get("chartRangeClip") || f.get("chartRangeMin") < this.min) && (this.min = f.get("chartRangeMin")), f.get("chartRangeMax") !== c && (f.get("chartRangeClip") || f.get("chartRangeMax") > this.max) && (this.max = f.get("chartRangeMax")), this.initTarget(), this.target && (this.lineHeight = f.get("lineHeight") === "auto" ? b.round(this.canvasHeight * .3) : f.get("lineHeight"))
        }, getRegion: function (a, c, d) {
            return b.floor(c / this.itemWidth)
        }, getCurrentRegionFields: function () {
            var a = this.currentRegion;
            return{isNull: this.values[a] === c, value: this.values[a], offset: a}
        }, renderRegion: function (a, c) {
            var d = this.values, e = this.options, f = this.min, g = this.max, h = this.range, j = this.interval, k = this.target, l = this.canvasHeight, m = this.lineHeight, n = l - m, o, p, q, r;
            return p = i(d[a], f, g), r = a * j, o = b.round(n - n * ((p - f) / h)), q = e.get("thresholdColor") && p < e.get("thresholdValue") ? e.get("thresholdColor") : e.get("lineColor"), c && (q = this.calcHighlightColor(q, e)), k.drawLine(r, o, r, o + m, q)
        }}), d.fn.sparkline.bullet = B = g(d.fn.sparkline._base, {type: "bullet", init: function (a, d, e, f, g) {
            var h, i, j;
            B._super.init.call(this, a, d, e, f, g), this.values = d = l(d), j = d.slice(), j[0] = j[0] === null ? j[2] : j[0], j[1] = d[1] === null ? j[2] : j[1], h = b.min.apply(b, d), i = b.max.apply(b, d), e.get("base") === c ? h = h < 0 ? h : 0 : h = e.get("base"), this.min = h, this.max = i, this.range = i - h, this.shapes = {}, this.valueShapes = {}, this.regiondata = {}, this.width = f = e.get("width") === "auto" ? "4.0em" : f, this.target = this.$el.simpledraw(f, g, e.get("composite")), d.length || (this.disabled = !0), this.initTarget()
        }, getRegion: function (a, b, d) {
            var e = this.target.getShapeAt(a, b, d);
            return e !== c && this.shapes[e] !== c ? this.shapes[e] : c
        }, getCurrentRegionFields: function () {
            var a = this.currentRegion;
            return{fieldkey: a.substr(0, 1), value: this.values[a.substr(1)], region: a}
        }, changeHighlight: function (a) {
            var b = this.currentRegion, c = this.valueShapes[b], d;
            delete this.shapes[c];
            switch (b.substr(0, 1)) {
                case"r":
                    d = this.renderRange(b.substr(1), a);
                    break;
                case"p":
                    d = this.renderPerformance(a);
                    break;
                case"t":
                    d = this.renderTarget(a)
            }
            this.valueShapes[b] = d.id, this.shapes[d.id] = b, this.target.replaceWithShape(c, d)
        }, renderRange: function (a, c) {
            var d = this.values[a], e = b.round(this.canvasWidth * ((d - this.min) / this.range)), f = this.options.get("rangeColors")[a - 2];
            return c && (f = this.calcHighlightColor(f, this.options)), this.target.drawRect(0, 0, e - 1, this.canvasHeight - 1, f, f)
        }, renderPerformance: function (a) {
            var c = this.values[1], d = b.round(this.canvasWidth * ((c - this.min) / this.range)), e = this.options.get("performanceColor");
            return a && (e = this.calcHighlightColor(e, this.options)), this.target.drawRect(0, b.round(this.canvasHeight * .3), d - 1, b.round(this.canvasHeight * .4) - 1, e, e)
        }, renderTarget: function (a) {
            var c = this.values[0], d = b.round(this.canvasWidth * ((c - this.min) / this.range) - this.options.get("targetWidth") / 2), e = b.round(this.canvasHeight * .1), f = this.canvasHeight - e * 2, g = this.options.get("targetColor");
            return a && (g = this.calcHighlightColor(g, this.options)), this.target.drawRect(d, e, this.options.get("targetWidth") - 1, f - 1, g, g)
        }, render: function () {
            var a = this.values.length, b = this.target, c, d;
            if (!B._super.render.call(this))return;
            for (c = 2; c < a; c++)d = this.renderRange(c).append(), this.shapes[d.id] = "r" + c, this.valueShapes["r" + c] = d.id;
            this.values[1] !== null && (d = this.renderPerformance().append(), this.shapes[d.id] = "p1", this.valueShapes.p1 = d.id), this.values[0] !== null && (d = this.renderTarget().append(), this.shapes[d.id] = "t0", this.valueShapes.t0 = d.id), b.render()
        }}), d.fn.sparkline.pie = C = g(d.fn.sparkline._base, {type: "pie", init: function (a, c, e, f, g) {
            var h = 0, i;
            C._super.init.call(this, a, c, e, f, g), this.shapes = {}, this.valueShapes = {}, this.values = c = d.map(c, Number), e.get("width") === "auto" && (this.width = this.height);
            if (c.length > 0)for (i = c.length; i--;)h += c[i];
            this.total = h, this.initTarget(), this.radius = b.floor(b.min(this.canvasWidth, this.canvasHeight) / 2)
        }, getRegion: function (a, b, d) {
            var e = this.target.getShapeAt(a, b, d);
            return e !== c && this.shapes[e] !== c ? this.shapes[e] : c
        }, getCurrentRegionFields: function () {
            var a = this.currentRegion;
            return{isNull: this.values[a] === c, value: this.values[a], percent: this.values[a] / this.total * 100, color: this.options.get("sliceColors")[a % this.options.get("sliceColors").length], offset: a}
        }, changeHighlight: function (a) {
            var b = this.currentRegion, c = this.renderSlice(b, a), d = this.valueShapes[b];
            delete this.shapes[d], this.target.replaceWithShape(d, c), this.valueShapes[b] = c.id, this.shapes[c.id] = b
        }, renderSlice: function (a, d) {
            var e = this.target, f = this.options, g = this.radius, h = f.get("borderWidth"), i = f.get("offset"), j = 2 * b.PI, k = this.values, l = this.total, m = i ? 2 * b.PI * (i / 360) : 0, n, o, p, q, r;
            q = k.length;
            for (p = 0; p < q; p++) {
                n = m, o = m, l > 0 && (o = m + j * (k[p] / l));
                if (a === p)return r = f.get("sliceColors")[p % f.get("sliceColors").length], d && (r = this.calcHighlightColor(r, f)), e.drawPieSlice(g, g, g - h, n, o, c, r);
                m = o
            }
        }, render: function () {
            var a = this.target, d = this.values, e = this.options, f = this.radius, g = e.get("borderWidth"), h, i;
            if (!C._super.render.call(this))return;
            g && a.drawCircle(f, f, b.floor(f - g / 2), e.get("borderColor"), c, g).append();
            for (i = d.length; i--;)d[i] && (h = this.renderSlice(i).append(), this.valueShapes[i] = h.id, this.shapes[h.id] = i);
            a.render()
        }}), d.fn.sparkline.box = D = g(d.fn.sparkline._base, {type: "box", init: function (a, b, c, e, f) {
            D._super.init.call(this, a, b, c, e, f), this.values = d.map(b, Number), this.width = c.get("width") === "auto" ? "4.0em" : e, this.initTarget(), this.values.length || (this.disabled = 1)
        }, getRegion: function () {
            return 1
        }, getCurrentRegionFields: function () {
            var a = [
                {field: "lq", value: this.quartiles[0]},
                {field: "med", value: this.quartiles
                    [1]},
                {field: "uq", value: this.quartiles[2]}
            ];
            return this.loutlier !== c && a.push({field: "lo", value: this.loutlier}), this.routlier !== c && a.push({field: "ro", value: this.routlier}), this.lwhisker !== c && a.push({field: "lw", value: this.lwhisker}), this.rwhisker !== c && a.push({field: "rw", value: this.rwhisker}), a
        }, render: function () {
            var a = this.target, d = this.values, e = d.length, f = this.options, g = this.canvasWidth, h = this.canvasHeight, i = f.get("chartRangeMin") === c ? b.min.apply(b, d) : f.get("chartRangeMin"), k = f.get("chartRangeMax") === c ? b.max.apply(b, d) : f.get("chartRangeMax"), l = 0, m, n, o, p, q, r, s, t, u, v, w;
            if (!D._super.render.call(this))return;
            if (f.get("raw"))f.get("showOutliers") && d.length > 5 ? (n = d[0], m = d[1], p = d[2], q = d[3], r = d[4], s = d[5], t = d[6]) : (m = d[0], p = d[1], q = d[2], r = d[3], s = d[4]); else {
                d.sort(function (a, b) {
                    return a - b
                }), p = j(d, 1), q = j(d, 2), r = j(d, 3), o = r - p;
                if (f.get("showOutliers")) {
                    m = s = c;
                    for (u = 0; u < e; u++)m === c && d[u] > p - o * f.get("outlierIQR") && (m = d[u]), d[u] < r + o * f.get("outlierIQR") && (s = d[u]);
                    n = d[0], t = d[e - 1]
                } else m = d[0], s = d[e - 1]
            }
            this.quartiles = [p, q, r], this.lwhisker = m, this.rwhisker = s, this.loutlier = n, this.routlier = t, w = g / (k - i + 1), f.get("showOutliers") && (l = b.ceil(f.get("spotRadius")), g -= 2 * b.ceil(f.get("spotRadius")), w = g / (k - i + 1), n < m && a.drawCircle((n - i) * w + l, h / 2, f.get("spotRadius"), f.get("outlierLineColor"), f.get("outlierFillColor")).append(), t > s && a.drawCircle((t - i) * w + l, h / 2, f.get("spotRadius"), f.get("outlierLineColor"), f.get("outlierFillColor")).append()), a.drawRect(b.round((p - i) * w + l), b.round(h * .1), b.round((r - p) * w), b.round(h * .8), f.get("boxLineColor"), f.get("boxFillColor")).append(), a.drawLine(b.round((m - i) * w + l), b.round(h / 2), b.round((p - i) * w + l), b.round(h / 2), f.get("lineColor")).append(), a.drawLine(b.round((m - i) * w + l), b.round(h / 4), b.round((m - i) * w + l), b.round(h - h / 4), f.get("whiskerColor")).append(), a.drawLine(b.round((s - i) * w + l), b.round(h / 2), b.round((r - i) * w + l), b.round(h / 2), f.get("lineColor")).append(), a.drawLine(b.round((s - i) * w + l), b.round(h / 4), b.round((s - i) * w + l), b.round(h - h / 4), f.get("whiskerColor")).append(), a.drawLine(b.round((q - i) * w + l), b.round(h * .1), b.round((q - i) * w + l), b.round(h * .9), f.get("medianColor")).append(), f.get("target") && (v = b.ceil(f.get("spotRadius")), a.drawLine(b.round((f.get("target") - i) * w + l), b.round(h / 2 - v), b.round((f.get("target") - i) * w + l), b.round(h / 2 + v), f.get("targetColor")).append(), a.drawLine(b.round((f.get("target") - i) * w + l - v), b.round(h / 2), b.round((f.get("target") - i) * w + l + v), b.round(h / 2), f.get("targetColor")).append()), a.render()
        }}), G = g({init: function (a, b, c, d) {
            this.target = a, this.id = b, this.type = c, this.args = d
        }, append: function () {
            return this.target.appendShape(this), this
        }}), H = g({_pxregex: /(\d+)(px)?\s*$/i, init: function (a, b, c) {
            if (!a)return;
            this.width = a, this.height = b, this.target = c, this.lastShapeId = null, c[0] && (c = c[0]), d.data(c, "_jqs_vcanvas", this)
        }, drawLine: function (a, b, c, d, e, f) {
            return this.drawShape([
                [a, b],
                [c, d]
            ], e, f)
        }, drawShape: function (a, b, c, d) {
            return this._genShape("Shape", [a, b, c, d])
        }, drawCircle: function (a, b, c, d, e, f) {
            return this._genShape("Circle", [a, b, c, d, e, f])
        }, drawPieSlice: function (a, b, c, d, e, f, g) {
            return this._genShape("PieSlice", [a, b, c, d, e, f, g])
        }, drawRect: function (a, b, c, d, e, f) {
            return this._genShape("Rect", [a, b, c, d, e, f])
        }, getElement: function () {
            return this.canvas
        }, getLastShapeId: function () {
            return this.lastShapeId
        }, reset: function () {
            alert("reset not implemented")
        }, _insert: function (a, b) {
            d(b).html(a)
        }, _calculatePixelDims: function (a, b, c) {
            var e;
            e = this._pxregex.exec(b), e ? this.pixelHeight = e[1] : this.pixelHeight = d(c).height(), e = this._pxregex.exec(a), e ? this.pixelWidth = e[1] : this.pixelWidth = d(c).width()
        }, _genShape: function (a, b) {
            var c = L++;
            return b.unshift(c), new G(this, c, a, b)
        }, appendShape: function (a) {
            alert("appendShape not implemented")
        }, replaceWithShape: function (a, b) {
            alert("replaceWithShape not implemented")
        }, insertAfterShape: function (a, b) {
            alert("insertAfterShape not implemented")
        }, removeShapeId: function (a) {
            alert("removeShapeId not implemented")
        }, getShapeAt: function (a, b, c) {
            alert("getShapeAt not implemented")
        }, render: function () {
            alert("render not implemented")
        }}), I = g(H, {init: function (b, e, f, g) {
            I._super.init.call(this, b, e, f), this.canvas = a.createElement("canvas"), f[0] && (f = f[0]), d.data(f, "_jqs_vcanvas", this), d(this.canvas).css({display: "inline-block", width: b, height: e, verticalAlign: "top"}), this._insert(this.canvas, f), this._calculatePixelDims(b, e, this.canvas), this.canvas.width = this.pixelWidth, this.canvas.height = this.pixelHeight, this.interact = g, this.shapes = {}, this.shapeseq = [], this.currentTargetShapeId = c, d(this.canvas).css({width: this.pixelWidth, height: this.pixelHeight})
        }, _getContext: function (a, b, d) {
            var e = this.canvas.getContext("2d");
            return a !== c && (e.strokeStyle = a), e.lineWidth = d === c ? 1 : d, b !== c && (e.fillStyle = b), e
        }, reset: function () {
            var a = this._getContext();
            a.clearRect(0, 0, this.pixelWidth, this.pixelHeight), this.shapes = {}, this.shapeseq = [], this.currentTargetShapeId = c
        }, _drawShape: function (a, b, d, e, f) {
            var g = this._getContext(d, e, f), h, i;
            g.beginPath(), g.moveTo(b[0][0] + .5, b[0][1] + .5);
            for (h = 1, i = b.length; h < i; h++)g.lineTo(b[h][0] + .5, b[h][1] + .5);
            d !== c && g.stroke(), e !== c && g.fill(), this.targetX !== c && this.targetY !== c && g.isPointInPath(this.targetX, this.targetY) && (this.currentTargetShapeId = a)
        }, _drawCircle: function (a, d, e, f, g, h, i) {
            var j = this._getContext(g, h, i);
            j.beginPath(), j.arc(d, e, f, 0, 2 * b.PI, !1), this.targetX !== c && this.targetY !== c && j.isPointInPath(this.targetX, this.targetY) && (this.currentTargetShapeId = a), g !== c && j.stroke(), h !== c && j.fill()
        }, _drawPieSlice: function (a, b, d, e, f, g, h, i) {
            var j = this._getContext(h, i);
            j.beginPath(), j.moveTo(b, d), j.arc(b, d, e, f, g, !1), j.lineTo(b, d), j.closePath(), h !== c && j.stroke(), i && j.fill(), this.targetX !== c && this.targetY !== c && j.isPointInPath(this.targetX, this.targetY) && (this.currentTargetShapeId = a)
        }, _drawRect: function (a, b, c, d, e, f, g) {
            return this._drawShape(a, [
                [b, c],
                [b + d, c],
                [b + d, c + e],
                [b, c + e],
                [b, c]
            ], f, g)
        }, appendShape: function (a) {
            return this.shapes[a.id] = a, this.shapeseq.push(a.id), this.lastShapeId = a.id, a.id
        }, replaceWithShape: function (a, b) {
            var c = this.shapeseq, d;
            this.shapes[b.id] = b;
            for (d = c.length; d--;)c[d] == a && (c[d] = b.id);
            delete this.shapes[a]
        }, replaceWithShapes: function (a, b) {
            var c = this.shapeseq, d = {}, e, f, g;
            for (f = a.length; f--;)d[a[f]] = !0;
            for (f = c.length; f--;)e = c[f], d[e] && (c.splice(f, 1), delete this.shapes[e], g = f);
            for (f = b.length; f--;)c.splice(g, 0, b[f].id), this.shapes[b[f].id] = b[f]
        }, insertAfterShape: function (a, b) {
            var c = this.shapeseq, d;
            for (d = c.length; d--;)if (c[d] === a) {
                c.splice(d + 1, 0, b.id), this.shapes[b.id] = b;
                return
            }
        }, removeShapeId: function (a) {
            var b = this.shapeseq, c;
            for (c = b.length; c--;)if (b[c] === a) {
                b.splice(c, 1);
                break
            }
            delete this.shapes[a]
        }, getShapeAt: function (a, b, c) {
            return this.targetX = b, this.targetY = c, this.render(), this.currentTargetShapeId
        }, render: function () {
            var a = this.shapeseq, b = this.shapes, c = a.length, d = this._getContext(), e, f, g;
            d.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
            for (g = 0; g < c; g++)e = a[g], f = b[e], this["_draw" + f.type].apply(this, f.args);
            this.interact || (this.shapes = {}, this.shapeseq = [])
        }}), J = g(H, {init: function (b, c, e) {
            var f;
            J._super.init.call(this, b, c, e), e[0] && (e = e[0]), d.data(e, "_jqs_vcanvas", this), this.canvas = a.createElement("span"), d(this.canvas).css({display: "inline-block", position: "relative", overflow: "hidden", width: b, height: c, margin: "0px", padding: "0px", verticalAlign: "top"}), this._insert(this.canvas, e), this._calculatePixelDims(b, c, this.canvas), this.canvas.width = this.pixelWidth, this.canvas.height = this.pixelHeight, f = '<v:group coordorigin="0 0" coordsize="' + this.pixelWidth + " " + this.pixelHeight + '"' + ' style="position:absolute;top:0;left:0;width:' + this.pixelWidth + "px;height=" + this.pixelHeight + 'px;"></v:group>', this.canvas.insertAdjacentHTML("beforeEnd", f), this.group = d(this.canvas).children()[0], this.rendered = !1, this.prerender = ""
        }, _drawShape: function (a, b, d, e, f) {
            var g = [], h, i, j, k, l, m, n;
            for (n = 0, m = b.length; n < m; n++)g[n] = "" + b[n][0] + "," + b[n][1];
            return h = g.splice(0, 1), f = f === c ? 1 : f, i = d === c ? ' stroked="false" ' : ' strokeWeight="' + f + 'px" strokeColor="' + d + '" ', j = e === c ? ' filled="false"' : ' fillColor="' + e + '" filled="true" ', k = g[0] === g[g.length - 1] ? "x " : "", l = '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + " " + this.pixelHeight + '" ' + ' id="jqsshape' + a + '" ' + i + j + ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + "px;width:" + this.pixelWidth + 'px;padding:0px;margin:0px;" ' + ' path="m ' + h + " l " + g.join(", ") + " " + k + 'e">' + " </v:shape>", l
        }, _drawCircle: function (a, b, d, e, f, g, h) {
            var i, j, k;
            return b -= e, d -= e, i = f === c ? ' stroked="false" ' : ' strokeWeight="' + h + 'px" strokeColor="' + f + '" ', j = g === c ? ' filled="false"' : ' fillColor="' + g + '" filled="true" ', k = '<v:oval  id="jqsshape' + a + '" ' + i + j + ' style="position:absolute;top:' + d + "px; left:" + b + "px; width:" + e * 2 + "px; height:" + e * 2 + 'px"></v:oval>', k
        }, _drawPieSlice: function (a, d, e, f, g, h, i, j) {
            var k, l, m, n, o, p, q, r;
            if (g === h)return"";
            h - g === 2 * b.PI && (g = 0, h = 2 * b.PI), l = d + b.round(b.cos(g) * f), m = e + b.round(b.sin(g) * f), n = d + b.round(b.cos(h) * f), o = e + b.round(b.sin(h) * f);
            if (l === n && m === o) {
                if (h - g < b.PI)return"";
                l = n = d + f, m = o = e
            }
            return l === n && m === o && h - g < b.PI ? "" : (k = [d - f, e - f, d + f, e + f, l, m, n, o], p = i === c ? ' stroked="false" ' : ' strokeWeight="1px" strokeColor="' + i + '" ', q = j === c ? ' filled="false"' : ' fillColor="' + j + '" filled="true" ', r = '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + " " + this.pixelHeight + '" ' + ' id="jqsshape' + a + '" ' + p + q + ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + "px;width:" + this.pixelWidth + 'px;padding:0px;margin:0px;" ' + ' path="m ' + d + "," + e + " wa " + k.join(", ") + ' x e">' + " </v:shape>", r)
        }, _drawRect: function (a, b, c, d, e, f, g) {
            return this._drawShape(a, [
                [b, c],
                [b, c + e],
                [b + d, c + e],
                [b + d, c],
                [b, c]
            ], f, g)
        }, reset: function () {
            this.group.innerHTML = ""
        }, appendShape: function (a) {
            var b = this["_draw" + a.type].apply(this, a.args);
            return this.rendered ? this.group.insertAdjacentHTML("beforeEnd", b) : this.prerender += b, this.lastShapeId = a.id, a.id
        }, replaceWithShape: function (a, b) {
            var c = d("#jqsshape" + a), e = this["_draw" + b.type].apply(this, b.args);
            c[0].outerHTML = e
        }, replaceWithShapes: function (a, b) {
            var c = d("#jqsshape" + a[0]), e = "", f = b.length, g;
            for (g = 0; g < f; g++)e += this["_draw" + b[g].type].apply(this, b[g].args);
            c[0].outerHTML = e;
            for (g = 1; g < a.length; g++)d("#jqsshape" + a[g]).remove()
        }, insertAfterShape: function (a, b) {
            var c = d("#jqsshape" + a), e = this["_draw" + b.type].apply(this, b.args);
            c[0].insertAdjacentHTML("afterEnd", e)
        }, removeShapeId: function (a) {
            var b = d("#jqsshape" + a);
            this.group.removeChild(b[0])
        }, getShapeAt: function (a, b, c) {
            var d = a.id.substr(8);
            return d
        }, render: function () {
            this.rendered || (this.group.innerHTML = this.prerender, this.rendered = !0)
        }})
    })
})(document, Math);
// ------------------------------
// Sidebar Accordion Menu
// ------------------------------
var adminLeftSidebarCollapse = jQuery.cookie('admin_leftbar_collapse');
jQuery(function () {
    if (jQuery.cookie('admin_leftbar_collapse') === 'collapse-leftbar') {
        //jQuery('body').addClass('collapse-leftbar');
    } else {
        //jQuery('body').removeClass('collapse-leftbar');
    }

    jQuery('body').on('click', 'ul.acc-menu a', function () {
        var LIs = jQuery(this).closest('ul.acc-menu').children('li');
        jQuery(this).closest('li').addClass('clicked');
        jQuery.each(LIs, function (i) {
            if (jQuery(LIs[i]).hasClass('clicked')) {
                jQuery(LIs[i]).removeClass('clicked');
                return true;
            }
            if (adminLeftSidebarCollapse !== 'collapse-leftbar' || jQuery(this).parents('.acc-menu').length > 1) jQuery(LIs[i]).find('ul.acc-menu:visible').slideToggle();
            jQuery(LIs[i]).removeClass('open');
        });
        if (jQuery(this).siblings('ul.acc-menu:visible').length > 0)
            jQuery(this).closest('li').removeClass('open');
        else
            jQuery(this).closest('li').addClass('open');
        if (adminLeftSidebarCollapse !== 'collapse-leftbar' || jQuery(this).parents('.acc-menu').length > 1) jQuery(this).siblings('ul.acc-menu').slideToggle({
            duration: 200,
            progress: function () {
                checkpageheight();
                if (jQuery(this).closest('li').is(":last-child")) { //only scroll down if last-child
                    jQuery("#sidebar").animate({ scrollTop: jQuery("#sidebar").height()}, 0);
                }

            },
            complete: function () {
                jQuery("#sidebar").getNiceScroll().resize();
            }
        });
    });

    var targetAnchor;
    jQuery.each(jQuery('ul.acc-menu a'), function () {
        //console.log(this.href);
        if (this.href == window.location) {
            targetAnchor = this;
            return false;
        }
    });

    var parent = jQuery(targetAnchor).closest('li');
    while (true) {
        parent.addClass('active');
        parent.closest('ul.acc-menu').show().closest('li').addClass('open');
        parent = jQuery(parent).parents('li').eq(0);
        if (jQuery(parent).parents('ul.acc-menu').length <= 0) break;
    }

    var liHasUlChild = jQuery('li').filter(function () {
        return jQuery(this).find('ul.acc-menu').length;
    });
    jQuery(liHasUlChild).addClass('hasChild');

    if (adminLeftSidebarCollapse === 'collapse-leftbar') {
        jQuery('ul.acc-menu:first ul.acc-menu').css('display', 'none');
    }
    jQuery('ul.acc-menu:first > li').hover(function () {
        if (adminLeftSidebarCollapse === 'collapse-leftbar')
            jQuery(this).find('ul.acc-menu').css('display', 'block');
    }, function () {
        if (adminLeftSidebarCollapse === 'collapse-leftbar')
            jQuery(this).find('ul.acc-menu').css('display', 'none');
    });


    // Reads Cookie for Collapsible Leftbar 
    // if(jQuery.cookie('admin_leftbar_collapse') === 'collapse-leftbar')
    //     jQuery("body").addClass("collapse-leftbar");

    //Make only visible area scrollable
    jQuery("#widgetarea").css({"max-height": jQuery("body").height()});
    //Bind widgetarea to nicescroll
    jQuery("#widgetarea").niceScroll({horizrailenabled: false});

    // Toggle Buttons
    // ------------------------------

    //On click of left menu
    jQuery("a#leftmenu-trigger").click(function () {
        if ((window.innerWidth) < 768) {
            jQuery("body").toggleClass("show-leftbar");
        } else {
            jQuery("body").toggleClass("collapse-leftbar");

            //Sets Cookie for Toggle
            if (adminLeftSidebarCollapse === 'collapse-leftbar' ) {
                jQuery.cookie('admin_leftbar_collapse', '');
                jQuery('ul.acc-menu.open').css('display', 'block');

            } else {
                //jQuery('ul.acc-menu:first ul.acc-menu').hide();
                jQuery.each(jQuery('.acc-menu'), function () {
                    if (jQuery(this).css('display') == 'none')
                        jQuery(this).css('display', '');
                });

                jQuery('ul.acc-menu:first li.open').removeClass('open');
                jQuery('ul.acc-menu:first ul.acc-menu').css('display', 'none');
                jQuery.cookie('admin_leftbar_collapse', 'collapse-leftbar');
            }
            adminLeftSidebarCollapse = jQuery.cookie('admin_leftbar_collapse');
        }
        checkpageheight();
        leftbarScrollShow();
    });

    //set minimum height of page
//    dh = (jQuery(document).height() - 40);
//    jQuery("#page-content").css("min-height", dh + "px");

    // On click of right menu
    jQuery("a#rightmenu-trigger").click(function () {
        jQuery("body").toggleClass("show-rightbar");
        widgetheight();

        if (jQuery.cookie('admin_rightbar_show') === 'show-rightbar')
            jQuery.cookie('admin_rightbar_show', '');
        else
            jQuery.cookie('admin_rightbar_show', 'show-rightbar');
    });

});

// Recalculate widget area on a widget being shown
jQuery(".widget-body").on('shown.bs.collapse', function () {
    widgetheight();
});

// -------------------------------
// Sidebars Positionings
// -------------------------------

jQuery(window).scroll(function () {
    jQuery("#widgetarea").getNiceScroll().resize();
    jQuery(".chathistory").getNiceScroll().resize();
    //rightbarTopPos();
    leftbarTopPos();
});

jQuery(window).resize(function () {
    widgetheight();

    rightbarRightPos();
    jQuery("#sidebar").getNiceScroll().resize();
});
rightbarRightPos();


// -------------------------------
// Mobile Only - set sidebar as fixed position, slide
// -------------------------------

enquire.register("screen and (max-width: 767px)", {
    match: function () {
        // For less than 768px
        jQuery(function () {

            //Bind sidebar to nicescroll
            jQuery("#sidebar").niceScroll({horizrailenabled: false});
            leftbarScrollShow();

            //Click on body and hide leftbar
            jQuery("#wrap").click(function () {
                if (jQuery("body").hasClass("show-leftbar")) {
                    jQuery("body").removeClass("show-leftbar");
                    leftbarScrollShow();
                }
            });

            //Fix a bug
            jQuery('#sidebar ul.acc-menu').css('display', 'block');

            //open up leftbar
            jQuery("body").removeClass("show-leftbar");
            jQuery.removeCookie("admin_leftbar_collapse");

            jQuery("body").removeClass("collapse-leftbar");

        });

        console.log("match");
    },
    unmatch: function () {

        //Remove nicescroll to clear up some memory
        jQuery("#sidebar").niceScroll().remove();
        jQuery("#sidebar").css("overflow", "visible");

        console.log("unmatch");

        //hide leftbar
        jQuery("body").removeClass("show-leftbar");

    }
});

//Helper functions
//---------------

//Fixing the show of scroll rails even when sidebar is hidden
function leftbarScrollShow() {
    if (jQuery("body").hasClass("show-leftbar")) {
        jQuery("#sidebar").getNiceScroll().show();
    } else {
        jQuery("#sidebar").getNiceScroll().hide();
    }
    jQuery("#sidebar").getNiceScroll().resize();
}

//set Top positions for changing between static and fixed header
function leftbarTopPos() {
    var scr = jQuery('body.static-header').scrollTop();
    if (scr < 41) {
        jQuery('ul#sidebar').css('top', 40 - scr + 'px');
    } else {
        jQuery('ul#sidebar').css('top', 0);
    }
}

function rightbarTopPos() {
    var scr = jQuery('body.static-header').scrollTop();
    if (scr < 41) {
        jQuery('#page-rightbar').css('top', 40 - scr + 'px');
    } else {
        jQuery('#page-rightbar').css('top', 0);
    }
}

//Set Right position for fixed layouts
function rightbarRightPos() {
    if (jQuery('body').hasClass('fixed-layout')) {
        var jQuerypc = jQuery('#page-content');
        var ending_right = (jQuery(window).width() - (jQuerypc.offset().left + jQuerypc.outerWidth()));
        if (ending_right < 0) ending_right = 0;
        jQuery('#page-rightbar').css('right', ending_right);
    }
}

// Match page height with Sidebar Height
function checkpageheight() {
    sh = jQuery("#page-leftbar").height();
    ch = jQuery("#page-content").height();

    if (sh > ch) jQuery("#page-content").css("min-height", sh + "px");
}

// Recalculate widget area to area visible
function widgetheight() {
    jQuery("#widgetarea").css({"max-height": jQuery("body").height()});
    jQuery("#widgetarea").getNiceScroll().resize();
}

// -------------------------------
// Back to Top button
// -------------------------------

jQuery('#back-to-top').click(function () {
    jQuery('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
});

// -------------------------------
// Panel Collapses
// -------------------------------
jQuery('a.panel-collapse').click(function () {
    jQuery(this).children().toggleClass("fa-chevron-down fa-chevron-up");
    jQuery(this).closest(".panel-heading").next().slideToggle({duration: 200});
    jQuery(this).closest(".panel-heading").toggleClass('rounded-bottom');
    return false;
});

// -------------------------------
// Quick Start
// -------------------------------
jQuery('#headerbardropdown').click(function () {
    jQuery('#headerbar').css('top', 0);
    return false;
});

jQuery('#headerbardropdown').click(function (event) {
    jQuery('html').one('click', function () {
        jQuery('#headerbar').css('top', '-1000px');
    });

    event.stopPropagation();
});


// -------------------------------
// Keep search open on click
// -------------------------------
jQuery('#search>a').click(function () {
    jQuery('#search').toggleClass('keep-open');
    jQuery('#search>a i').toggleClass("opacity-control");
});

jQuery('#search').click(function (event) {
    jQuery('html').one('click', function () {
        jQuery('#search').removeClass('keep-open');
        jQuery('#search>a i').addClass("opacity-control");
    });

    event.stopPropagation();
});

//Presentational: set all panel-body with br0 if it has panel-footer
jQuery(".panel-footer").prev().css("border-radius", "0");
// -------------------------------
// Demos
// -------------------------------

function applyNiceScroll(){
    try {
        //Set nicescroll on notifications
        jQuery(".scrollthis").niceScroll({horizrailenabled: false});
        jQuery('.dropdown').on('shown.bs.dropdown', function () {
            jQuery(".scrollthis").getNiceScroll().resize();
            jQuery(".scrollthis").getNiceScroll().show();
        });
        jQuery('.dropdown').on('hide.bs.dropdown', function () {
            jQuery(".scrollthis").getNiceScroll().hide();
        });

        jQuery(window).scroll(function () {
            jQuery(".scrollthis").getNiceScroll().resize();
        });
    } catch (e) {
    }
}

jQuery(document).ready(
    function () {
        jQuery('.popovers').popover({container: 'body', trigger: 'hover', placement: 'top'}); //bootstrap's popover
        jQuery('.tooltips').tooltip(); //bootstrap's tooltip

        jQuery(".chathistory").niceScroll({horizrailenabled: false});  //chathistory scroll

        applyNiceScroll();
        prettyPrint(); //Apply Code Prettifier

        jQuery('.toggle').toggles({on: true});

        //EasyPieChart in rightbar

        try {
            jQuery('.easypiechart#serverload').easyPieChart({
                barColor: "#e73c3c",
                trackColor: '#edeef0',
                scaleColor: '#d2d3d6',
                scaleLength: 5,
                lineCap: 'round',
                lineWidth: 2,
                size: 90,
                onStep: function (from, to, percent) {
                    jQuery(this.el).find('.percent').text(Math.round(percent));
                }
            });

            jQuery('.easypiechart#ramusage').easyPieChart({
                barColor: "#f39c12",
                trackColor: '#edeef0',
                scaleColor: '#d2d3d6',
                scaleLength: 5,
                lineCap: 'round',
                lineWidth: 2,
                size: 90,
                onStep: function (from, to, percent) {
                    jQuery(this.el).find('.percent').text(Math.round(percent));
                }
            });
        }
        catch (error) {
        }


        jQuery("#currentbalance").sparkline([12700, 8573, 10145, 21077, 15380, 14399, 19158, 23911, 15401, 16793, 13115, 23315], {
            type: 'bar',
            barColor: '#62bc1f',
            height: '45',
            barWidth: 7});

    });


// -------------------------------
// Demo: Chatbar.
// -------------------------------

jQuery('.chatinput textarea').keypress(function (e) {
    if (e.which == 13) {

        var chatmsg = jQuery(".chatinput textarea").val();
        var oo = jQuery(".chathistory").html();

        var d = new Date();
        var n = d.toLocaleTimeString();


        if (!!jQuery(".chatinput textarea").val())
            jQuery(".chathistory").html(oo + "<div class='chatmsg'><p>" + chatmsg + "</p><span class='timestamp'>" + n + "</span></div>");


        jQuery(".chathistory").getNiceScroll().resize();
        jQuery(".chathistory").animate({ scrollTop: jQuery(document).height() }, 0);

        jQuery(this).val(''); // empty textarea

        return false;
    }
});


// Toggle buttons

jQuery("a#hidechatbtn").click(function () {
    jQuery("#widgetarea").toggle();
    jQuery("#chatarea").toggle();
});

jQuery("#chatbar li a").click(function () {
    jQuery("#widgetarea").toggle();
    jQuery("#chatarea").toggle();
});


// -------------------------------
// Show Theme Settings
// -------------------------------
jQuery('#slideitout').click(function () {
    jQuery('#demo-theme-settings').toggleClass('shown');
    return false;
});


// -------------------------------
// Demo: Theme Settings
// -------------------------------

// Demo Fixed Header

if (jQuery.cookie('fixed-header') === 'navbar-static-top') {
    jQuery('#fixedheader').toggles();
} else {
    jQuery('#fixedheader').toggles({on: true});
}

jQuery('.dropdown-menu').on('click', function (e) {
    if (jQuery(this).hasClass('dropdown-menu-form')) {
        e.stopPropagation();
    }
});


jQuery('#fixedheader').on('toggle', function (e, active) {
    jQuery('header').toggleClass('navbar-fixed-top navbar-static-top');
    jQuery('body').toggleClass('static-header');
    //rightbarTopPos();
    if (active) {
        jQuery.removeCookie('fixed-header');
    } else {
        jQuery.cookie('fixed-header', 'navbar-static-top');
    }
});

// Demo Color Variation
// Read the CSS files from data attributes

jQuery("#demo-color-variations a").click(function () {
    jQuery("head link#styleswitcher").attr("href", 'assets/demo/variations/' + jQuery(this).data("theme"));
    jQuery.cookie('theme', jQuery(this).data("theme"));
    return false;
});

jQuery("#demo-header-variations a").click(function () {
    jQuery("head link#headerswitcher").attr("href", 'assets/demo/variations/' + jQuery(this).data("headertheme"));
    jQuery.cookie('headertheme', jQuery(this).data("headertheme"));
    return false;
});

//Demo Background Pattern

jQuery(".demo-blocks").click(function () {
    jQuery('.fixed-layout').css('background', jQuery(this).css('background'));
    return false;
});

jQuery(".location-nested li a").click(function () {
    jQuery(this).next("ul").slideToggle();
    if (jQuery(this).children("i").hasClass("fa-caret-down")) {
        jQuery(this).children("i").removeClass("fa-caret-down");
        jQuery(this).children("i").addClass("fa-caret-right");
    } else if (jQuery(this).children("i").hasClass("fa-caret-right")) {
        jQuery(this).children("i").removeClass("fa-caret-right");
        jQuery(this).children("i").addClass("fa-caret-down");
    }
})
// JavaScript Document
$.noConflict();
jQuery(document).ready(function ($) {
    $("ul li:first-child").addClass("first")
    $("ul li:last-child").addClass("last");

    //Main Navigation Accordian
    $("nav#main > ul > li:gt(0) > a").click(function (e) {
        e.preventDefault();
        $(this).next().slideToggle();
        $(this).parent().toggleClass("active");
    })
});

//= require /js/layout/jquery.cookie.js
//= require /js/layout/jquery.nicescroll.min.js
//= require /js/codeprettifier/prettify.js
//= require /js/easypiechart/jquery.easypiechart.min.js
//= require /js/sparklines/jquery.sparklines.min.js
//= require /js/layout/application.js
//= require /js/layout/demo.js
//= require /js/layout/general.js
/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-iepp-mq-cssclasses-addtest-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-cookies-css_backgroundrepeat-css_backgroundsizecover-css_boxsizing-css_cubicbezierrange-css_displaytable-css_overflow_scrolling-css_pointerevents-css_userselect-custom_protocol_handler-dom_createElement_attrs-elem_details-elem_progress_meter-event_deviceorientation_motion-file_api-forms_placeholder-hyphens-img_webp-url_data_uri-webgl_extensions-window_framed-workers_sharedworkers-load
 */
;
window.Modernizr = function (a, b, c) {
    function H() {
        e.input = function (a) {
            for (var b = 0, c = a.length; b < c; b++)s[a[b]] = a[b]in l;
            return s
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), e.inputtypes = function (a) {
            for (var d = 0, e, f, h, i = a.length; d < i; d++)l.setAttribute("type", f = a[d]), e = l.type !== "text", e && (l.value = m, l.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && l.style.WebkitAppearance !== c ? (g.appendChild(l), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(l, null).WebkitAppearance !== "textfield" && l.offsetHeight !== 0, g.removeChild(l)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = l.checkValidity && l.checkValidity() === !1 : /^color$/.test(f) ? (g.appendChild(l), g.offsetWidth, e = l.value != m, g.removeChild(l)) : e = l.value != m)), r[a[d]] = !!e;
            return r
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    function F(a, b) {
        var c = a.charAt(0).toUpperCase() + a.substr(1), d = (a + " " + p.join(c + " ") + c).split(" ");
        return E(d, b)
    }

    function E(a, b) {
        for (var d in a)if (k[a[d]] !== c)return b == "pfx" ? a[d] : !0;
        return!1
    }

    function D(a, b) {
        return!!~("" + a).indexOf(b)
    }

    function C(a, b) {
        return typeof a === b
    }

    function B(a, b) {
        return A(o.join(a + ";") + (b || ""))
    }

    function A(a) {
        k.cssText = a
    }

    var d = "2.0.6", e = {}, f = !0, g = b.documentElement, h = b.head || b.getElementsByTagName("head")[0], i = "modernizr", j = b.createElement(i), k = j.style, l = b.createElement("input"), m = ":)", n = Object.prototype.toString, o = " -webkit- -moz- -o- -ms- -khtml- ".split(" "), p = "Webkit Moz O ms Khtml".split(" "), q = {}, r = {}, s = {}, t = [], u = function (a, c, d, e) {
        var f, h, j, k = b.createElement("div");
        if (parseInt(d, 10))while (d--)j = b.createElement("div"), j.id = e ? e[d] : i + (d + 1), k.appendChild(j);
        f = ["&shy;", "<style>", a, "</style>"].join(""), k.id = i, k.innerHTML += f, g.appendChild(k), h = c(k, a), k.parentNode.removeChild(k);
        return!!h
    }, v = function (b) {
        if (a.matchMedia)return matchMedia(b).matches;
        var c;
        u("@media " + b + " { #" + i + " { position: absolute; } }", function (b) {
            c = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle).position == "absolute"
        });
        return c
    }, w = function () {
        function d(d, e) {
            e = e || b.createElement(a[d] || "div"), d = "on" + d;
            var f = d in e;
            f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = C(e[d], "function"), C(e[d], c) || (e[d] = c), e.removeAttribute(d))), e = null;
            return f
        }

        var a = {select: "input", change: "input", submit: "form", reset: "form", error: "img", load: "img", abort: "img"};
        return d
    }(), x, y = {}.hasOwnProperty, z;
    !C(y, c) && !C(y.call, c) ? z = function (a, b) {
        return y.call(a, b)
    } : z = function (a, b) {
        return b in a && C(a.constructor.prototype[b], c)
    };
    var G = function (a, c) {
        var d = a.join(""), f = c.length;
        u(d, function (a, c) {
            var d = b.styleSheets[b.styleSheets.length - 1], g = d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "", h = a.childNodes, i = {};
            while (f--)i[h[f].id] = h[f];
            e.csstransforms3d = i.csstransforms3d.offsetLeft === 9, e.generatedcontent = i.generatedcontent.offsetHeight >= 1, e.fontface = /src/i.test(g) && g.indexOf(c.split(" ")[0]) === 0
        }, f, c)
    }(['@font-face {font-family:"font";src:url("https://")}', ["@media (", o.join("transform-3d),("), i, ")", "{#csstransforms3d{left:9px;position:absolute}}"].join(""), ['#generatedcontent:after{content:"', m, '";visibility:hidden}'].join("")], ["fontface", "csstransforms3d", "generatedcontent"]);
    q.flexbox = function () {
        function c(a, b, c, d) {
            a.style.cssText = o.join(b + ":" + c + ";") + (d || "")
        }

        function a(a, b, c, d) {
            b += ":", a.style.cssText = (b + o.join(c + ";" + b)).slice(0, -b.length) + (d || "")
        }

        var d = b.createElement("div"), e = b.createElement("div");
        a(d, "display", "box", "width:42px;padding:0;"), c(e, "box-flex", "1", "width:10px;"), d.appendChild(e), g.appendChild(d);
        var f = e.offsetWidth === 42;
        d.removeChild(e), g.removeChild(d);
        return f
    }, q.canvas = function () {
        var a = b.createElement("canvas");
        return!!a.getContext && !!a.getContext("2d")
    }, q.canvastext = function () {
        return!!e.canvas && !!C(b.createElement("canvas").getContext("2d").fillText, "function")
    }, q.postmessage = function () {
        return!!a.postMessage
    }, q.websqldatabase = function () {
        var b = !!a.openDatabase;
        return b
    }, q.indexedDB = function () {
        for (var b = -1, c = p.length; ++b < c;)if (a[p[b].toLowerCase() + "IndexedDB"])return!0;
        return!!a.indexedDB
    }, q.hashchange = function () {
        return w("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
    }, q.history = function () {
        return!!a.history && !!history.pushState
    }, q.draganddrop = function () {
        return w("dragstart") && w("drop")
    }, q.websockets = function () {
        for (var b = -1, c = p.length; ++b < c;)if (a[p[b] + "WebSocket"])return!0;
        return"WebSocket"in a
    }, q.rgba = function () {
        A("background-color:rgba(150,255,150,.5)");
        return D(k.backgroundColor, "rgba")
    }, q.hsla = function () {
        A("background-color:hsla(120,40%,100%,.5)");
        return D(k.backgroundColor, "rgba") || D(k.backgroundColor, "hsla")
    }, q.multiplebgs = function () {
        A("background:url(https://),url(https://),red url(https://)");
        return/(url\s*\(.*?){3}/.test(k.background)
    }, q.backgroundsize = function () {
        return F("backgroundSize")
    }, q.borderimage = function () {
        return F("borderImage")
    }, q.borderradius = function () {
        return F("borderRadius")
    }, q.boxshadow = function () {
        return F("boxShadow")
    }, q.textshadow = function () {
        return b.createElement("div").style.textShadow === ""
    }, q.opacity = function () {
        B("opacity:.55");
        return/^0.55$/.test(k.opacity)
    }, q.cssanimations = function () {
        return F("animationName")
    }, q.csscolumns = function () {
        return F("columnCount")
    }, q.cssgradients = function () {
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        A((a + o.join(b + a) + o.join(c + a)).slice(0, -a.length));
        return D(k.backgroundImage, "gradient")
    }, q.cssreflections = function () {
        return F("boxReflect")
    }, q.csstransforms = function () {
        return!!E(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    }, q.csstransforms3d = function () {
        var a = !!E(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]);
        a && "webkitPerspective"in g.style && (a = e.csstransforms3d);
        return a
    }, q.csstransitions = function () {
        return F("transitionProperty")
    }, q.fontface = function () {
        return e.fontface
    }, q.generatedcontent = function () {
        return e.generatedcontent
    }, q.video = function () {
        var a = b.createElement("video"), c = !1;
        try {
            if (c = !!a.canPlayType) {
                c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"');
                var d = 'video/mp4; codecs="avc1.42E01E';
                c.h264 = a.canPlayType(d + '"') || a.canPlayType(d + ', mp4a.40.2"'), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"')
            }
        } catch (e) {
        }
        return c
    }, q.audio = function () {
        var a = b.createElement("audio"), c = !1;
        try {
            if (c = !!a.canPlayType)c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"'), c.mp3 = a.canPlayType("audio/mpeg;"), c.wav = a.canPlayType('audio/wav; codecs="1"'), c.m4a = a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")
        } catch (d) {
        }
        return c
    }, q.localstorage = function () {
        try {
            return!!localStorage.getItem
        } catch (a) {
            return!1
        }
    }, q.sessionstorage = function () {
        try {
            return!!sessionStorage.getItem
        } catch (a) {
            return!1
        }
    }, q.webworkers = function () {
        return!!a.Worker
    }, q.applicationcache = function () {
        return!!a.applicationCache
    };
    for (var I in q)z(q, I) && (x = I.toLowerCase(), e[x] = q[I](), t.push((e[x] ? "" : "no-") + x));
    e.input || H(), e.addTest = function (a, b) {
        if (typeof a == "object")for (var d in a)z(a, d) && e.addTest(d, a[d]); else {
            a = a.toLowerCase();
            if (e[a] !== c)return;
            b = typeof b == "boolean" ? b : !!b(), g.className += " " + (b ? "" : "no-") + a, e[a] = b
        }
        return e
    }, A(""), j = l = null, a.attachEvent && function () {
        var a = b.createElement("div");
        a.innerHTML = "<elem></elem>";
        return a.childNodes.length !== 1
    }() && function (a, b) {
        function s(a) {
            var b = -1;
            while (++b < g)a.createElement(f[b])
        }

        a.iepp = a.iepp || {};
        var d = a.iepp, e = d.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", f = e.split("|"), g = f.length, h = new RegExp("(^|\\s)(" + e + ")", "gi"), i = new RegExp("<(/*)(" + e + ")", "gi"), j = /^\s*[\{\}]\s*$/, k = new RegExp("(^|[^\\n]*?\\s)(" + e + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"), l = b.createDocumentFragment(), m = b.documentElement, n = m.firstChild, o = b.createElement("body"), p = b.createElement("style"), q = /print|all/, r;
        d.getCSS = function (a, b) {
            if (a + "" === c)return"";
            var e = -1, f = a.length, g, h = [];
            while (++e < f) {
                g = a[e];
                if (g.disabled)continue;
                b = g.media || b, q.test(b) && h.push(d.getCSS(g.imports, b), g.cssText), b = "all"
            }
            return h.join("")
        }, d.parseCSS = function (a) {
            var b = [], c;
            while ((c = k.exec(a)) != null)b.push(((j.exec(c[1]) ? "\n" : c[1]) + c[2] + c[3]).replace(h, "$1.iepp_$2") + c[4]);
            return b.join("\n")
        }, d.writeHTML = function () {
            var a = -1;
            r = r || b.body;
            while (++a < g) {
                var c = b.getElementsByTagName(f[a]), d = c.length, e = -1;
                while (++e < d)c[e].className.indexOf("iepp_") < 0 && (c[e].className += " iepp_" + f[a])
            }
            l.appendChild(r), m.appendChild(o), o.className = r.className, o.id = r.id, o.innerHTML = r.innerHTML.replace(i, "<$1font")
        }, d._beforePrint = function () {
            p.styleSheet.cssText = d.parseCSS(d.getCSS(b.styleSheets, "all")), d.writeHTML()
        }, d.restoreHTML = function () {
            o.innerHTML = "", m.removeChild(o), m.appendChild(r)
        }, d._afterPrint = function () {
            d.restoreHTML(), p.styleSheet.cssText = ""
        }, s(b), s(l);
        d.disablePP || (n.insertBefore(p, n.firstChild), p.media = "print", p.className = "iepp-printshim", a.attachEvent("onbeforeprint", d._beforePrint), a.attachEvent("onafterprint", d._afterPrint))
    }(a, b), e._version = d, e._prefixes = o, e._domPrefixes = p, e.mq = v, e.hasEvent = w, e.testProp = function (a) {
        return E([a])
    }, e.testAllProps = F, e.testStyles = u, g.className = g.className.replace(/\bno-js\b/, "") + (f ? " js " + t.join(" ") : "");
    return e
}(this, this.document), function (a, b, c) {
    function k(a) {
        return!a || a == "loaded" || a == "complete"
    }

    function j() {
        var a = 1, b = -1;
        while (p.length - ++b)if (p[b].s && !(a = p[b].r))break;
        a && g()
    }

    function i(a) {
        var c = b.createElement("script"), d;
        c.src = a.s, c.onreadystatechange = c.onload = function () {
            !d && k(c.readyState) && (d = 1, j(), c.onload = c.onreadystatechange = null)
        }, m(function () {
            d || (d = 1, j())
        }, H.errorTimeout), a.e ? c.onload() : n.parentNode.insertBefore(c, n)
    }

    function h(a) {
        var c = b.createElement("link"), d;
        c.href = a.s, c.rel = "stylesheet", c.type = "text/css";
        if (!a.e && (w || r)) {
            var e = function (a) {
                m(function () {
                    if (!d)try {
                        a.sheet.cssRules.length ? (d = 1, j()) : e(a)
                    } catch (b) {
                        b.code == 1e3 || b.message == "security" || b.message == "denied" ? (d = 1, m(function () {
                            j()
                        }, 0)) : e(a)
                    }
                }, 0)
            };
            e(c)
        } else c.onload = function () {
            d || (d = 1, m(function () {
                j()
            }, 0))
        }, a.e && c.onload();
        m(function () {
            d || (d = 1, j())
        }, H.errorTimeout), !a.e && n.parentNode.insertBefore(c, n)
    }

    function g() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function () {
            a.t == "c" ? h(a) : i(a)
        }, 0) : (a(), j()) : q = 0
    }

    function f(a, c, d, e, f, h) {
        function i() {
            !o && k(l.readyState) && (r.r = o = 1, !q && j(), l.onload = l.onreadystatechange = null, m(function () {
                u.removeChild(l)
            }, 0))
        }

        var l = b.createElement(a), o = 0, r = {t: d, s: c, e: h};
        l.src = l.data = c, !s && (l.style.display = "none"), l.width = l.height = "0", a != "object" && (l.type = d), l.onload = l.onreadystatechange = i, a == "img" ? l.onerror = i : a == "script" && (l.onerror = function () {
            r.e = r.r = 1, g()
        }), p.splice(e, 0, r), u.insertBefore(l, s ? null : n), m(function () {
            o || (u.removeChild(l), r.r = r.e = o = 1, j())
        }, H.errorTimeout)
    }

    function e(a, b, c) {
        var d = b == "c" ? z : y;
        q = 0, b = b || "j", C(a) ? f(d, a, b, this.i++, l, c) : (p.splice(this.i++, 0, a), p.length == 1 && g());
        return this
    }

    function d() {
        var a = H;
        a.loader = {load: e, i: 0};
        return a
    }

    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance"in l.style, s = r && !!b.createRange().compareNode, t = r && !s, u = s ? l : n.parentNode, v = a.opera && o.call(a.opera) == "[object Opera]", w = "webkitAppearance"in l.style, x = w && "async"in b.createElement("script"), y = r ? "object" : v || x ? "img" : "script", z = w ? "img" : y, A = Array.isArray || function (a) {
        return o.call(a) == "[object Array]"
    }, B = function (a) {
        return Object(a) === a
    }, C = function (a) {
        return typeof a == "string"
    }, D = function (a) {
        return o.call(a) == "[object Function]"
    }, E = [], F = {}, G, H;
    H = function (a) {
        function f(a) {
            var b = a.split("!"), c = E.length, d = b.pop(), e = b.length, f = {url: d, origUrl: d, prefixes: b}, g, h;
            for (h = 0; h < e; h++)g = F[b[h]], g && (f = g(f));
            for (h = 0; h < c; h++)f = E[h](f);
            return f
        }

        function e(a, b, e, g, h) {
            var i = f(a), j = i.autoCallback;
            if (!i.bypass) {
                b && (b = D(b) ? b : b[a] || b[g] || b[a.split("/").pop().split("?")[0]]);
                if (i.instead)return i.instead(a, b, e, g, h);
                e.load(i.url, i.forceCSS || !i.forceJS && /css$/.test(i.url) ? "c" : c, i.noexec), (D(b) || D(j)) && e.load(function () {
                    d(), b && b(i.origUrl, h, g), j && j(i.origUrl, h, g)
                })
            }
        }

        function b(a, b) {
            function c(a) {
                if (C(a))e(a, h, b, 0, d); else if (B(a))for (i in a)a.hasOwnProperty(i) && e(a[i], h, b, i, d)
            }

            var d = !!a.test, f = d ? a.yep : a.nope, g = a.load || a.both, h = a.callback, i;
            c(f), c(g), a.complete && b.load(a.complete)
        }

        var g, h, i = this.yepnope.loader;
        if (C(a))e(a, 0, i, 0); else if (A(a))for (g = 0; g < a.length; g++)h = a[g], C(h) ? e(h, 0, i, 0) : A(h) ? H(h) : B(h) && b(h, i); else B(a) && b(a, i)
    }, H.addPrefix = function (a, b) {
        F[a] = b
    }, H.addFilter = function (a) {
        E.push(a)
    }, H.errorTimeout = 1e4, b.readyState == null && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", G = function () {
        b.removeEventListener("DOMContentLoaded", G, 0), b.readyState = "complete"
    }, 0)), a.yepnope = d()
}(this, this.document), Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0))
}, Modernizr.testStyles(" #modernizr { background-size: cover; } ", function (a, b) {
    var c = (window.getComputedStyle ? getComputedStyle(a, null) : a.currentStyle)["background-size"] == "cover";
    Modernizr.addTest("bgsizecover", c)
}), function () {
    function a(a) {
        return window.getComputedStyle ? getComputedStyle(a, null).getPropertyValue("background") : a.currentStyle.background
    }

    Modernizr.testStyles(" #modernizr { background-repeat: round; } ", function (b, c) {
        Modernizr.addTest("bgrepeatround", a(b) == "round")
    }), Modernizr.testStyles(" #modernizr { background-repeat: space; } ", function (b, c) {
        Modernizr.addTest("bgrepeatspace", a(b) == "space")
    })
}(), function () {
    function c(b) {
        a(b, "", -1)
    }

    function b(a) {
        var b = a + "=", c = document.cookie.split(";");
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            while (e.charAt(0) == " ")e = e.substring(1, e.length);
            if (e.indexOf(b) == 0)return e.substring(b.length, e.length)
        }
        return null
    }

    function a(a, b) {
        document.cookie = a + "=" + b + "; path=/"
    }

    var d = "" + Math.round(Math.random() * 1e8);
    a("Modernizr", d), Modernizr.cookies = b("Modernizr") == d, c("Modernizr")
}(), Modernizr.addTest("cubicbezierrange", function () {
    el = document.createElement("div"), el.style.cssText = Modernizr._prefixes.join("transition-timing-function:cubic-bezier(1,0,0,1.1); ");
    return el.style.length
}), Modernizr.addTest("display-table", function () {
    var a = window.document, b = a.documentElement, c = a.createElement("div"), d = a.createElement("div"), e = a.createElement("div"), f;
    c.style.cssText = "display: table", d.style.cssText = e.style.cssText = "display: table-cell; padding: 10px", c.appendChild(d), c.appendChild(e), b.insertBefore(c, b.firstChild), f = d.offsetLeft < e.offsetLeft, b.removeChild(c);
    return f
}), Modernizr.addTest("overflowscrolling", function () {
    return Modernizr.testAllProps("overflowScrolling")
}), Modernizr.addTest("boxsizing", function () {
    return Modernizr.testAllProps("boxSizing")
}), Modernizr.addTest("details", function () {
    var a = document, b = a.createElement("details"), c, d, e;
    if (!("open"in b))return!1;
    d = a.body || function () {
        var b = a.documentElement;
        c = !0;
        return b.insertBefore(a.createElement("body"), b.firstElementChild || b.firstChild)
    }(), b.innerHTML = "<summary>a</summary>b", b.style.display = "block", d.appendChild(b), e = b.offsetHeight, b.open = !0, e = e != b.offsetHeight, d.removeChild(b), c && d.parentNode.removeChild(d);
    return e
}), Modernizr.addTest("customprotocolhandler", function () {
    return!!navigator.registerProtocolHandler
}), Modernizr.addTest("userselect", function () {
    return Modernizr.testAllProps("user-select")
}), Modernizr.addTest("createelement-attrs", function () {
    try {
        return document.createElement("<input name='test' />").getAttribute("name") == "test"
    } catch (a) {
        return!1
    }
}), Modernizr.addTest("progressbar", function () {
    return document.createElement("progress").max != undefined
}), Modernizr.addTest("meter", function () {
    return document.createElement("meter").max != undefined
}), Modernizr.addTest("file", function () {
    return!!(window.File && window.FileList && window.FileReader)
}), Modernizr.addTest("devicemotion", "DeviceMotionEvent"in window), Modernizr.addTest("deviceorientation", "DeviceOrientationEvent"in window), Modernizr.addTest("pointerevents", function () {
    var a = document.createElement("x"), b = document.documentElement, c = window.getComputedStyle, d;
    if (!("pointerEvents"in a.style))return!1;
    a.style.pointerEvents = "auto", a.style.pointerEvents = "x", b.appendChild(a), d = c && c(a, "").pointerEvents === "auto", b.removeChild(a);
    return!!d
}), function () {
    function c() {
        try {
            var a = document.createElement("div"), b = document.createElement("span"), c = a.style, d = 0, e = 0, f = !1, g = !1, h = !1;
            document.body.appendChild(a), a.appendChild(b), b.innerHTML = "Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.", c.cssText = "position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;", d = b.offsetHeight, e = b.offsetWidth, c.cssText = "position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;-moz-hyphens:auto;-webkit-hyphens:auto;-o-hyphens:auto;-ms-hyphens:auto;hyphens:auto;", f = b.offsetHeight != d || b.offsetWidth != e, a.removeChild(b), document.body.removeChild(a);
            return f
        } catch (i) {
            return!1
        }
    }

    function b(a) {
        try {
            var b = document.createElement("input"), c = document.createElement("div"), d = "lebowski", e = !1, f;
            document.body.appendChild(b), document.body.appendChild(c), c.innerHTML = d + a + d, b.setSelectionRange ? (b.focus(), b.setSelectionRange(0, 0)) : b.createTextRange && (f = b.createTextRange(), f.collapse(!0), f.moveEnd("character", 0), f.moveStart("character", 0), f.select());
            if (window.find)e = window.find(d + d); else try {
                f = self.document.body.createTextRange(), e = f.findText(d + d)
            } catch (g) {
                e = !1
            }
            document.body.removeChild(c), document.body.removeChild(b);
            return e
        } catch (g) {
            return!1
        }
    }

    function a(a, b) {
        try {
            var c = document.createElement("div"), d = document.createElement("span"), e = c.style, f = 0, g = !1, h = !1, i = !1;
            document.body.appendChild(c), c.appendChild(d), e.cssText = "position:absolute;top:0;left:0;overflow:visible;width:1.25em;", d.innerHTML = "mm", f = d.offsetHeight, d.innerHTML = "m" + a + "m", h = d.offsetHeight > f, b ? (d.innerHTML = "m<br />m", f = d.offsetWidth, d.innerHTML = "m" + a + "m", i = d.offsetWidth > f) : i = !0, h === !0 && i === !0 && (g = !0), c.removeChild(d), document.body.removeChild(c);
            return g
        } catch (j) {
            return!1
        }
    }

    Modernizr.addTest("csshyphens", function () {
        return Modernizr.testAllProps("hyphens")
    }), Modernizr.addTest("workingcsshyphens", function () {
        try {
            return c()
        } catch (a) {
            return!1
        }
    }), Modernizr.addTest("softhyphens", function () {
        try {
            return a("&#173;", !0) && a("&#8203;", !1)
        } catch (b) {
            return!1
        }
    }), Modernizr.addTest("softhyphensfind", function () {
        try {
            return b("&#173;") && b("&#8203;")
        } catch (a) {
            return!1
        }
    })
}(), function () {
    var a = new Image;
    a.onerror = function () {
        Modernizr.addTest("webp", !1)
    }, a.onload = function () {
        Modernizr.addTest("webp", function () {
            return a.width == 4
        })
    }, a.src = "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA=="
}(), function () {
    var a = new Image;
    a.onerror = function () {
        Modernizr.addTest("datauri", function () {
            return!1
        })
    }, a.onload = function () {
        Modernizr.addTest("datauri", function () {
            return a.width == 1 && a.height == 1
        })
    }, a.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
}(), Modernizr.addTest("sharedworkers", function () {
    return!!window.SharedWorker
}), function () {
    var a = Modernizr.input.placeholder = "placeholder"in document.createElement("input");
    a && ((Modernizr.textarea || (Modernizr.textarea = {})).placeholder = "placeholder"in document.createElement("textarea"))
}(), function () {
    if (!!Modernizr.webgl) {
        var a, b, c;
        try {
            a = document.createElement("canvas"), b = a.getContext("webgl") || a.getContext("experimental-webgl"), c = b.getSupportedExtensions()
        } catch (d) {
            return
        }
        Modernizr.webgl = new Boolean(!0);
        for (var e = -1, f = c.length; ++e < f;)Modernizr.webgl[c[e]] = !0;
        a = undefined
    }
}(), Modernizr.addTest("framed", function () {
    return window.location != top.location
});
//= require /js/layout/modernizr.custom.82896.js

/* 
Title:      Toggle Switch
URL:        http://github.com/jamiebicknell/Toggle-Switch
Author:     Jamie Bicknell
Twitter:    @jamiebicknell
Thanks:     @steve228uk for prop/var mods and plugin suggestion
*/

(function ($) {
    'use strict';
    $.fn.toggleSwitch = function (options) {
        var settings = $.extend({
            onClick: function () { return true; },
            onChangeOn: function () { return true; },
            onChangeOff: function () { return true; }
        }, options);
        $(this).each(function () {
            var obj = $(this), status = obj.is(':checked') ? '' : ' off';
            if (!obj.parent('div.switch').length) {
                obj.wrap('<div class="switch"></div>');
                obj.parent('div.switch').prepend('<span class="switched' + status + '" />').prepend('<div class="overlay" />');
            }
            obj.parent('div.switch').add($('label[for=' + obj.prop('id') + ']')).click(function (e) {
                e.preventDefault();
                if (!obj.prop('disabled')) {
                    var value, check;
                    settings.onClick.call(obj);
                    if ($(this).is('label')) {
                        value = $('#' + $(this).prop('for')).prev('span.switched');
                        check = $('#' + $(this).prop('for'));
                    } else {
                        value = $(this).children('span.switched');
                        check = $(this).children('input[type=checkbox]');
                    }
                    if (value.is('.off')) {
                        value.stop().animate({left: 0}, 150, 'linear').removeClass('off');
                        check.prop('checked', 'checked');
                        settings.onChangeOn.call(obj);
                        obj.change();
                    } else {
                        value.stop().animate({left: -32}, 150, 'linear').addClass('off');
                        check.prop('checked', '');
                        settings.onChangeOff.call(obj);
                        obj.change();
                    }
                }
            });
        });
    };
}(jQuery));
//= require /js/common/toggle-switch/jquery.toggleswitch.js

// colResizable 1.5 - a jQuery plugin by Alvaro Prieto Lauroba http://www.bacubacu.com/colresizable/
(function($){var d=$(document),h=$("head"),drag=null,tables=[],count=0,ID="id",PX="px",SIGNATURE="JColResizer",FLEX="JCLRFlex",I=parseInt,M=Math,ie=navigator.userAgent.indexOf('Trident/4.0')>0,S;try{S=sessionStorage}catch(e){};h.append("<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer td, .JColResizer th{overflow:hidden;}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: e-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;}</style>");var init=function(tb,options){var t=$(tb);t.opt=options;if(t.opt.disable)return destroy(t);var id=t.id=t.attr(ID)||SIGNATURE+ count++;t.p=t.opt.postbackSafe;if(!t.is("table")||tables[id]&&!t.opt.partialRefresh)return;t.addClass(SIGNATURE).attr(ID,id).before('<div class="JCLRgrips"/>');t.g=[];t.c=[];t.w=t.width();t.gc=t.prev();t.f=t.opt.fixed;if(options.marginLeft)t.gc.css("marginLeft",options.marginLeft);if(options.marginRight)t.gc.css("marginRight",options.marginRight);t.cs=I(ie?tb.cellSpacing||tb.currentStyle.borderSpacing:t.css('border-spacing'))||2;t.b=I(ie?tb.border||tb.currentStyle.borderLeftWidth:t.css('border-left-width'))||1;tables[id]=t;createGrips(t)},destroy=function(t){var id=t.attr(ID),t=tables[id];if(!t||!t.is("table"))return;t.removeClass(SIGNATURE+" "+FLEX).gc.remove();delete tables[id]},createGrips=function(t){var th=t.find(">thead>tr>th,>thead>tr>td");if(!th.length)th=t.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td");th=th.filter(":visible");t.cg=t.find("col");t.ln=th.length;if(t.p&&S&&S[t.id])memento(t,th);th.each(function(i){var c=$(this),g=$(t.gc.append('<div class="JCLRgrip"></div>')[0].lastChild);g.append(t.opt.gripInnerHtml).append('<div class="'+SIGNATURE+'"></div>');if(i==t.ln-1){g.addClass("JCLRLastGrip");if(t.f)g.html("")};g.bind('touchstart mousedown',onGripMouseDown);g.t=t;g.i=i;g.c=c;c.w=c.width();t.g.push(g);t.c.push(c);c.width(c.w).removeAttr("width");g.data(SIGNATURE,{i:i,t:t.attr(ID),last:i==t.ln-1})});t.cg.removeAttr("width");syncGrips(t);t.find('td, th').not(th).not('table th, table td').each(function(){$(this).removeAttr('width')});if(!t.f)t.removeAttr('width').addClass(FLEX)},memento=function(t,th){var w,m=0,i=0,aux=[],tw;if(th){t.cg.removeAttr("width");if(t.opt.flush){S[t.id]="";return};w=S[t.id].split(";");tw=w[t.ln+1];if(!t.f&&tw)t.width(tw);for(;i<t.ln;i++){aux.push(100*w[i]/w[t.ln]+"%");th.eq(i).css("width",aux[i])};for(i=0;i<t.ln;i++)t.cg.eq(i).css("width",aux[i])}else{S[t.id]="";for(;i<t.c.length;i++){w=t.c[i].width();S[t.id]+=w+";";m+=w};S[t.id]+=m;if(!t.f)S[t.id]+=";"+t.width()}},syncGrips=function(t){t.gc.width(t.w);for(var i=0;i<t.ln;i++){var c=t.c[i];t.g[i].css({left:c.offset().left-t.offset().left+c.outerWidth(false)+t.cs/2+PX,height:t.opt.headerOnly?t.c[0].outerHeight(false):t.outerHeight(false)})}},syncCols=function(t,i,isOver){var inc=drag.x-drag.l,c=t.c[i],c2=t.c[i+1],w=c.w+inc,w2=c2.w-inc;c.width(w+PX);t.cg.eq(i).width(w+PX);if(t.f){c2.width(w2+PX);t.cg.eq(i+1).width(w2+PX)};if(isOver){c.w=w;c2.w=t.f?w2:c2.w}},applyBounds=function(t){var w=$.map(t.c,function(c){return c.width()});t.width(t.width()).removeClass(FLEX);$.each(t.c,function(i,c){c.width(w[i]).w=w[i]});t.addClass(FLEX)},onGripDrag=function(e){if(!drag)return;var t=drag.t,oe=e.originalEvent.touches,ox=oe?oe[0].pageX:e.pageX,x=ox-drag.ox+drag.l,mw=t.opt.minWidth,i=drag.i,l=t.cs*1.5+mw+t.b,last=i==t.ln-1,min=i?t.g[i-1].position().left+t.cs+mw:l,max=t.f?i==t.ln-1?t.w-l:t.g[i+1].position().left-t.cs-mw:Infinity;x=M.max(min,M.min(max,x));drag.x=x;drag.css("left",x+PX);if(last){var c=t.c[drag.i];drag.w=c.w+x-drag.l};if(t.opt.liveDrag){if(last){c.width(drag.w);t.w=t.width()}else syncCols(t,i);syncGrips(t);var cb=t.opt.onDrag;if(cb){e.currentTarget=t[0];cb(e)}};return false},onGripDragOver=function(e){d.unbind('touchend.'+SIGNATURE+' mouseup.'+SIGNATURE).unbind('touchmove.'+SIGNATURE+' mousemove.'+SIGNATURE);$("head :last-child").remove();if(!drag)return;drag.removeClass(drag.t.opt.draggingClass);var t=drag.t,cb=t.opt.onResize,i=drag.i,last=i==t.ln-1,c=t.g[i].c;if(last){c.width(drag.w);c.w=drag.w}else syncCols(t,i,true);if(!t.f)applyBounds(t);syncGrips(t);if(cb){e.currentTarget=t[0];cb(e)};if(t.p&&S)memento(t);drag=null},onGripMouseDown=function(e){var o=$(this).data(SIGNATURE),t=tables[o.t],g=t.g[o.i],oe=e.originalEvent.touches;g.ox=oe?oe[0].pageX:e.pageX;g.l=g.position().left;d.bind('touchmove.'+SIGNATURE+' mousemove.'+SIGNATURE,onGripDrag).bind('touchend.'+SIGNATURE+' mouseup.'+SIGNATURE,onGripDragOver);h.append("<style type='text/css'>*{cursor:"+t.opt.dragCursor+"!important}</style>");g.addClass(t.opt.draggingClass);drag=g;if(t.c[o.i].l)for(var i=0,c;i<t.ln;i++){c=t.c[i];c.l=false;c.w=c.width()};return false},onResize=function(){for(t in tables){var t=tables[t],i,mw=0;t.removeClass(SIGNATURE);if(t.f&&t.w!=t.width()){t.w=t.width();for(i=0;i<t.ln;i++)mw+=t.c[i].w;for(i=0;i<t.ln;i++)t.c[i].css("width",M.round(1e3*t.c[i].w/mw)/10+"%").l=true};syncGrips(t.addClass(SIGNATURE))}};$(window).bind('resize.'+SIGNATURE,onResize);$.fn.extend({colResizable:function(options){var defaults={draggingClass:'JCLRgripDrag',gripInnerHtml:'',liveDrag:false,fixed:true,minWidth:15,headerOnly:false,hoverCursor:"e-resize",dragCursor:"e-resize",postbackSafe:false,flush:false,marginLeft:null,marginRight:null,disable:false,partialRefresh:false,onDrag:null,onResize:null},options=$.extend(defaults,options);return this.each(function(){init(this,options)})}})})(jQuery)
//= require /js/common/colresizeable/colResizable-1.5.min.js
var MAX_TTL = 2147483647;
var MAX_LEVEL = 65535;

var isCommand = 1;
var isKey = 2;
var isControlKey = 3;
var VALID_FQDN_LENGTH = 254;
var SLASH_REPLACE_REGEX = /^((([^\/][^\.]*[^\/])|([^\/]))\.)*([^\/]+)$/;
var MIN_ALLOWED_PASSWORD_LENGTH = 5;
var ENTER_KEY = 13;
function isEnterKey(e) {
    if (e) {
        var charcode = e.keyCode || e.which;
        return charcode === ENTER_KEY;
    }
    return false;
}

function isCommandKeys(e) {

    var charcode = e.keyCode || e.which;

    if (e.shiftKey) {
        if (charcode == 37 || charcode === 16 || charcode == 35 || charcode == 36) {
            return isCommand;
        }
    } else if (charcode === 27
        || charcode === 8
        || charcode === 9
        || charcode === 20
        || charcode === 16
        || charcode === 17
        || charcode === 91
        || charcode === ENTER_KEY
        || charcode === 92
        || charcode === 18
        || charcode === 45
        || charcode === 46
        || charcode === 35
        || charcode === 36
        || charcode === 37
        || charcode === 38
        || charcode === 39
        || charcode === 40) {
        return isCommand;
    } else if (e.ctrlKey) {
        return isControlKey;
    }

    return isKey;
}

function getCharCode(e) {
    var charcode = e.keyCode || e.which;
    var chr = "";

    if (e.shiftKey) {
        var characterMap = [];
        characterMap[192] = "~";
        characterMap[49] = "!";
        characterMap[50] = "@";
        characterMap[51] = "#";
        characterMap[52] = "$";
        characterMap[53] = "%";
        characterMap[54] = "^";
        characterMap[55] = "&";
        characterMap[56] = "*";
        characterMap[57] = "(";
        characterMap[48] = ")";
        characterMap[109] = "_";
        characterMap[107] = "+";
        characterMap[219] = "{";
        characterMap[221] = "}";
        characterMap[220] = "|";
        characterMap[59] = ":";
        characterMap[222] = "\"";
        characterMap[188] = "<";
        characterMap[186] = ":";
        characterMap[190] = ">";
        characterMap[191] = "?";
        characterMap[32] = " ";
        characterMap[187] = "+";
        characterMap[189] = "_";

        if (charcode >= 65 && charcode <= 90) {
            chr = String.fromCharCode(charcode);
        } else {
            chr = characterMap[charcode];
        }
    } else if (e.ctrlKey) {
        return charcode;
    } else {
        if (charcode >= 96 && charcode <= 105) {
            charcode = charcode - 48;
            chr = String.fromCharCode(charcode);
        } else if ((charcode >= 186 && charcode <= 192) || (charcode >= 219 && charcode <= 222)) {
            var characterMap = [];
            characterMap[186] = ";";
            characterMap[187] = "=";
            characterMap[188] = ",";
            characterMap[189] = "-";
            characterMap[190] = ".";
            characterMap[191] = "/";
            characterMap[192] = "`";
            characterMap[219] = "[";
            characterMap[220] = "\\";
            characterMap[221] = "]";
            characterMap[222] = "'";
            chr = characterMap[charcode];
        } else {
            chr = String.fromCharCode(charcode);
        }
    }

    return chr;
}


function isvalidFQDN(strVal) {
    if (strVal.length > 256) {
        return false;
    }
    var strRegex = /^([a-zA-Z0-9-_]{1,63}\.)*$/;
    if (strVal.substr(-1) != ".") {
        strVal += ".";
    }
    if (!strRegex.test(strVal)) {
        return false;
    }
    return true;
}

function isvalidEmail(strVal) {
    if (strVal.length > 256) {
        return false;
    }
    var fqdnRegex = /^([a-zA-Z0-9-_]{1,63}\.){2,}$/;
    var emailRegex = /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,}\.)$/;
    if (strVal.substr(-1) != ".") {
        strVal += ".";
    }
    if (!fqdnRegex.test(strVal) && !emailRegex.test(strVal)) {
        return false;
    }
    return true;

}

function checkTTLValue(ttl) {
    ttl = jQuery.trim(ttl);

    //islength is more then 10 digit
    if (ttl.length > 10) {
        return false;
    }

    // is all are digit
    var intRegex = /^\d+$/;
    if (!intRegex.test(ttl)) {
        return false;
    }

    //is all is less than 2147483647
    var num = parseInt(ttl, 10);

    if (num > MAX_TTL) {
        return false;
    }

    return true;
}

function isvalidTTL(tableId) {
    var ttl = jQuery(tableId + " input[field='ttl']").val();
    return checkTTLValue(ttl);
}

function checkLevelValue(level) {
    level = jQuery.trim(level);

    //islength is more then 10 digit
    if (level.length > 10) {
        return false;
    }

    // is all are digit
    var intRegex = /^\d+$/;
    if (!intRegex.test(level)) {
        return false;
    }

    //is all is less than 2147483647
    var num = parseInt(level, 10);

    if (num > MAX_LEVEL) {
        return false;
    }

    return true;
}

function isvalidNumeric(checkField, minValue, maxValue) {
    var checkValue = checkField.val();
    checkValue = jQuery.trim(checkValue);

    //islength is more then 10 digit
    if (checkValue.length > 10) {
        return false;
    }

    // is all are digit
    var intRegex = /^\d+$/;
    if (!intRegex.test(checkValue)) {
        return false;
    }

    var num = parseInt(checkValue, 10);

    if (num > maxValue) {
        return false;
    }
    var checkMinValue = parseInt(minValue, 10);
    if (num < checkMinValue) {
        return false;
    }

    return true;
}

function isValidIPv6(ip) {
    var ipToCheck = ip.toUpperCase();

    var re = new RegExp(/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/);

    var match = ipToCheck.match(re);

    if (!match) {
        if ((ip[0] == ':') && (ip[1] == ':')) {
            return isValidIPv4(ip.substring(2, ip.length));
        }
        return false;
    } else {
        return true;
    }
}


function isValidIPv6WithMask(ip) {

    if (ip.indexOf('/') > 0) {
        var ipWithMask = ip.split("/");

        var match = (ipWithMask.length == 2);

        if (!match) {
            return match;
        }

        var mask = parseInt(ipWithMask[1]);

        match = isValidIPv6(ipWithMask[0]);

        if (match && (mask >= 0 && mask <= 128 && mask != "NaN")) {
            return match;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isValidIPv4(ip) {

    var blocks = ip.split(".");

    if(blocks.length === 4) {
        return blocks.every(function(block) {
            return !isNaN(block) && parseInt(block,10) >=0 && parseInt(block,10) <= 255;
        });
    }

    return false;
}

function isValidEmail(email) {

    var re = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);

    var match = email.match(re);
    if (match) {
        return true;
    }

    return false;
}

function isValidHostCharacters(hostValue) {
    var re = new RegExp(/^[0-9A-Za-z_\\.\\-]*$/);

    var match = hostValue.match(re);
    if (match) {
        return true;
    }

    return false;
}

function isValidDotEndedDomainName(dn) {
    if (!isValidDomainEnd(dn)) {
        return false
    }
    if (dn && dn.length > 0) {
        if (dn.length > VALID_FQDN_LENGTH) {
            return false;
        }

        if ((dn.match(new RegExp("\\.", "g")) || []).length < 2) {
            return false;
        }
        if ((dn.match(/(_\.)/g)) || (dn.match(/\._/g)) || (dn.match(/_$/g)) || (dn.match(/^_/g))) {
            return false;
        }

        if (dn.match(SLASH_REPLACE_REGEX)) {
            dn = dn.replace(/\//g, 'a');
            var regex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}\.(([a-zA-Z0-9-_]{1,63}\.)*)/);
            var match = dn.match(regex);
            if (match) {
                return true;
            }
        }
    }
    return false;
}

function _isValidDomainName(dn) {
    if (dn.length > 0) {
        if (dn.length > 256) {
            return false;
        }

        dn = dn.replace(/\//g, 'a');
        var regex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}/);
        var match = dn.match(regex);
        if (match) {
            return true;
        }
    }
    return false;
}

function isValidDomainName(dn) {
    return isValidDotEndedDomainName(dn + ".")
}

function isValidHost(hostname) {

    return isValidHostCharacters(hostname);
}

function isValidDomainEnd(label) {
    var re = new RegExp(/.*\.[a-zA-Z0-9]{2,}\.$/);

    var match = label.match(re);

    if (match) {
        return true;
    }

    return false;

}

function ipv4FieldValidation(e, field) {


    if (field.value.length > 0) {

        if (!isValidIPv4(field.value)) {
            jQuery(field).addClass("text-color-red");
        } else {
            jQuery(field).removeClass("text-color-red");
        }

    } else {
        jQuery(field).removeClass("text-color-red");
    }

    return true;
}

function ipv6FieldValidation(e, field) {

    if (field.value.length > 0) {

        if (!isValidIPv6(field.value)) {
            jQuery(field).addClass("text-color-red");
        } else {
            jQuery(field).removeClass("text-color-red");
        }
    } else {
        jQuery(field).removeClass("text-color-red");
    }


    return true;
}

function hostFieldValidation(e, field) {
    var key = 0;
    if (field.value.length > 0) {

        if (field.value.length > 0) {
            if (!isValidHost(field.value)) {
                jQuery(field).addClass("text-color-red");
            } else {
                if ((field.value[0] != '.')) {

                    jQuery(field).removeClass("text-color-red");

                } else {
                    jQuery(field).addClass("text-color-red");
                }
            }
        } else {
            jQuery(field).removeClass("text-color-red");
        }

    } else {
        if (field.value.length > 0) {
            if (!isValidHost(field.value)) {
                jQuery(field).addClass("text-color-red");
            } else {
                jQuery(field).removeClass("text-color-red");
            }
        } else {
            jQuery(field).removeClass("text-color-red");
        }
    }
    return true;
}

function emailFieldValidation(e, field) {

    if (field.value.length > 0) {

        var keystatus = isCommandKeys(e);
        if (keystatus == isKey) {

            var chr = getCharCode(e);

            if (chr.match(/[^0-9A-Za-z\.\-_@]/)) {
                field.value = field.value.replace(/[^0-9A-Za-z\.\-_@]/g, '');
                e.preventDefault();
                if (field.value.length > 0) {
                    if (!isValidEmail(field.value)) {
                        jQuery(field).addClass("text-color-red");
                    } else {
                        jQuery(field).removeClass("text-color-red");
                    }
                } else {
                    jQuery(field).removeClass("text-color-red");
                }
                return false;
            }
        } else {
            if (keystatus == isControlKey) {

            }
        }

        if (field.value.length > 0) {
            if (!isValidEmail(field.value)) {
                jQuery(field).addClass("text-color-red");
            } else {
                jQuery(field).removeClass("text-color-red");
            }
        } else {
            jQuery(field).removeClass("text-color-red");
        }
    } else {
        jQuery(field).removeClass("text-color-red");
    }
    return true;
}

/*
 e = event
 field = bind field
 inputRegex = "[^0-9.]" only numeric
 fieldRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$" for email address

 */
function customRegexValidation(e, field, inputRegex, fieldRegex) {

    var fre = new RegExp(fieldRegex);

    if (field.value.length > 0) {
        if (!field.value.match(fre)) {
            jQuery(field).addClass("text-color-red");
        } else {
            jQuery(field).removeClass("text-color-red");
        }
    } else {
        jQuery(field).removeClass("text-color-red");
    }

    return true;
}

/*
 e = event
 field = bind field
 inputRegex = "[^0-9.]" only numeric

 */
function customRegexValidationOnlyField(e, field, inputRegex) {

    if (field.value.length > 0) {

        var keystatus = isCommandKeys(e);
        if (keystatus == isKey) {

            var chr = getCharCode(e);

            if (chr.match(inputRegex)) {

                var re = new RegExp(inputRegex, 'g');
                field.value = field.value.replace(re, '');

                e.preventDefault();

                return false;
            }
        } else {
            if (keystatus == isControlKey) {

            }
        }
    }

    return true;
}

function checkTextValidation() {
    if (jQuery(".notnullfield").val().length > 0) {
        enableSubmitSaveButton();
    } else {
        disableSubmitSaveButton();
    }
}

function disableSubmitSaveButton() {
    jQuery(".btn.save").attr("disabled", "disabled");
}

function enableSubmitSaveButton() {
    jQuery(".btn.save").removeAttr("disabled");
}

function anameWarningMessages(e, field){
    if (field.value.length > 0) {
        if (field.value.match(/^[^a-zA-Z]+$/g)) {
            jQuery('#aname-fqdn.warningMessageLabel').addClass('hidden');
            jQuery('#aname-ip.warningMessageLabel').removeClass('hidden');
        } else {
            jQuery('#aname-fqdn.warningMessageLabel').removeClass('hidden');
            jQuery('#aname-ip.warningMessageLabel').addClass('hidden');
        }
    }
}

function registerAllFieldEvents() {

    /* IPv4 */
    jQuery('.inp.ipv4').on("keyup", function (e) {
        return ipv4FieldValidation(e, this);
    });

    /* IPv6 */
    jQuery('.inp.ipv6').on("keyup", function (e) {
        return ipv6FieldValidation(e, this);
    });

    /* Host */
    jQuery('.inp.host').on("keyup", function (e) {
        return hostFieldValidation(e, this);
    });

    /* IPv4 */
    jQuery('.inp.ipv4net').on("keyup", function (e) {
        return customRegexValidation(e, this, "[^0-9\\./]", "(\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b)/[0-9]{1,2}");
    });

    /* IPv6 */
    jQuery('.inp.ipv6net').on("keyup", function (e) {
        return customRegexValidation(e, this, "[^0-9A-Fa-f:/\\.]", "^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))/[0-9]{1,3}");
    });

    /* Floating Point */
    jQuery('.inp.floatingpoint').on("keyup", function (e) {
        return customRegexValidation(e, this, "[^0-9\\.]", "^[0-9]+[.][0-9]+$");
    });

    /* Floating Point */
    jQuery(".notnullfield").on("change keyup", checkTextValidation);
    disableSubmitSaveButton();

    /* IPv4 only feild */
    jQuery('.inp.ipv4fieldonly').on("keyup", function (e) {
        return customRegexValidationOnlyField(e, this, "[^0-9\\.]");
    });

    /* IPv6 only feild */
    jQuery('.inp.ipv6fieldonly').on("keyup", function (e) {
        return customRegexValidationOnlyField(e, this, "[^0-9A-Fa-f:]");
    });

    /* IPv6 */
    jQuery('.inp.hostfieldonly').on("keyup", function (e) {
        return customRegexValidationOnlyField(e, this, "[^0-9A-Za-z\\.\\-]");
    });

    /* Aname */
    jQuery('.inp.aname').on("keyup", function (e) {
        return anameWarningMessages(e, this);
    });

}

function matchPassword(password,cPassword){
    if (password.val() != cPassword.val()) {
        password.val("");
        cPassword.val("");
        password.focus();
        return getErrorObject(MESSAGES.ACCOUNT.PASSWORD_CONFIRM_NOT_MATCH);
    }
}
function validatePasswordLength(passwordEle){
    var password = jQuery(passwordEle).val();
    if(!(password && password.length >= MIN_ALLOWED_PASSWORD_LENGTH)) {
        return getErrorObject(MESSAGES.ACCOUNT.PASSWORD_TOO_SHORT);
    }
}

function validAlphaNumericValidation(str) {
    var reg = /.*[!"#\$%&'\(\)\*\+,\\:;<>=\?\[\]\/\^`~\{\}\|\s@].*/i;
    return (!reg.test(str));
}

function validEmailAddressCharacters(email) {
    var commonReg = /.*[!"#\$%&'\(\)\*,\\:;<>=\?\[\]\/\^`~\{\}\|\s].*/i;
    return (!commonReg.test(email));
}
//= require jquery.js
//= require jquery-ui.js
//= require bootstrap.js
//= require general.js
//= require modernizer.js
//= require toggle-switch.js
//= require colresizable.js
//= require /js/common/validation.js
var REQUEST = {
    METHODS: {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE"
    },
    DATA_TYPE: {
        JSON: "json",
        XML: "xml",
        HTML: "html"
    },
    CONTENT_TYPE: {
        JSON: "application/json",
        XML: "application/xml",
        HTML: "text/html"
    }
};

var RECORD = {
    NOTE: {
        MAX_LENGTH: 512
    },
    TTL: {
        NAME: "ttl"
    },
    IPV4: {
        BITS: "32"
    },
    IPV6: {
        BITS: "128"
    }
};

var BUTTONS = {
    APPLY: "Apply",
    SAVE: "Save",
    UPDATE:"Save Changes",
    SAVE_AND_CONTINUE: "Save And Continue",
    SAVE_AND_CLOSE: "Save And Close",
    CONTINUE: "Continue",
    CLOSE: "Close",
    CONFIRM_APPLY: "Confirm Apply",
    CONFIRM: "Confirm",
    OK: "OK",
    CONTINUE_OTHERS: "Continue With Others",
    ACCEPT: "Accept"
};

var POPOVER_ATTRIBUTES = {
    PLACEMENT: "bottom",
    RELATION: "popover",
    TRIGGER: "hover"
};

var SELECTORS = {
    ERROR: "ul.errors",
    MESSAGE: ".success-message",
    MODAL: ".modal",
    MODAL_ERROR: ".modal ul.errors",
    MODAL_MESSAGE: ".modal .success-message",
    CONFIRM_DELETE_TEXT: "DELETE"
};

var MONITORING = {
    STATUS: {
        NEW: "NEW",
        CONFIRMED_UP: "UP",
        CONFIRMED_DOWN: "DOWN",
        NOT_AVAILABLE: "N/A"
    },
    CHECK: {
        NONE: "None",
        NOT_AVAILABLE: "Not available"
    }
};

var FAILOVER = {
    TYPE: {
        STANDARD: 1,
        SINGLE_FAILURE: 2,
        ALWAYS_FORWARD: 3
    },
    DISABLED_BY: {
        USER: 1,
        MONITORING: 2
    },
    DISABLE_KEY: {
        USER: 'disabled',
        MONITORING: 'disabledByMonitoring'
    }
};

var ENDPOINTS = {
    POOLS: {
        UNCOMMITTED_CHANGES: "/pool{0}/{1}/uncommittedchanges"
    },
    COMPARISON: "{0}/comparison"
};

var PERMISSIONS = {
    PERMISSION: {
        NO_ACCESS: "NO_ACCESS",
        READ_ONLY: "VIEW",
        FULL_ACCESS: "ALL"
    }
};

var NOTIFICATION_PROPERTIES = {
    ACTION_TYPE: {
        NAME: "action_type",
        REVIEW: "review"
    }
};

var PARENT_NAME = {
    DOMAIN: "domain",
    TEMPLATE: "template",
    POOL_A: 'poolA',
    POOL_AAAA: 'poolAaaa',
    POOL_CNAME: 'poolCname'
};

var SEARCH_FIELDS = {
    DOMAIN_NAME :"domain name"
};

var DOMAIN_STATUS = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    EXPIRED: 'EXPIRED'
};

var ACCOUNT_STATUS = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    EXPIRED: 'EXPIRED'
};

var DNS_TYPE = {
    A:{ID:1,NAME:'A'},
    AAAA:{ID:28,NAME:'AAAA'},
    CNAME:{ID:5,NAME:'CNAME'},
    NS:{ID:2,NAME:'NS'},
    MX:{ID:15,NAME:'MX'}
};
var TAG = {
    MAX_LIMIT: 4
};

var QUERY_REPORT = {
    DATE_FORMAT: 'yy-mm-dd',
    DASHBOARD_DATE_FORMAT: '%d',
    DASHBOARD_GRAPH_CONTAINER:'#dnsQueryActivityChart',
    DATEPICKER_MIN_DATE: '-60',
    DATEPICKER_MAX_DATE: '0',
    DATEPICKER_NUMBER_MONTH: 2,
    DAY_MILLISECONDS: 86400000,
    QUERIES_PERDAY_GRID:'#qr-table-queriesperday',
    QUERIES_PERDOMAIN_GRID: '#qr-table-queriesperdomain',
    QUERIES_PERDOMAIN_HEADING: 'Queries Per Domain',
    QUERIES_PERDAY_HEADING: 'Queries Per Day',
    QUERY_SORT_TYPE:{
        'All': 'all',
        'standard':'standard',
        'ip filter': 'geo_filter',
        'geo proximity': 'geo_proximity',
    },
    QUERIES_GRID_LIMIT:5,
    GRAPH_CONFIG:{
        SPLINE_GRAPH_TYPE: 'area-spline',
        SPLINE_X_AXIS_LABEL: 'DAYS OF MONTH',
        SPLINE_X_AXIS_POSITION:'outer-center',
        SPLINE_Y_AXIS_POSITION: 'outer-middle',
        SPLINE_Y_AXIS_LABEL: 'DNS QUERIES',
        SPLINE_RIGHT_PADDING: 24,
        SPLINE_POINT_RADIUS: 4,
        SPLINE_X_AXIS_TYPE:'timeseries',
        SPLINE_CHART_CONTAINER:'#querychart',
        PIE_CHART_COLOR_PATTERN: ['#92CDDF', '#BEA2DC', '#EF8380'],
        PIE_CHART_TYPE: 'pie',
        SPLINE_DATE_FORMAT_QUERYPAGE: '%Y-%m-%d',
        PIE_CHART_CONTAINER: '#pie-query-chart',
    },
    QUERY_DETAILS_LABELS:'Standard  <br />GEO Proximity <br />IP Filter <br /><strong>Total</strong><br/>',
    LINE_BREAK:'<br/>',
    GRID_NO_DATA: 'No Query data available',
    GRID_NEXT:'&gt',
    GRID_PREVIOUS: '&lt'
};

var IMPORT_RECORD = {
    TYPE : {
        TEMPLATE : 1,
        DOMAIN : 2,
        JSON : 3,
        ZONE_FILE : 4,
        ZONE_TRANSFER_IN : 5
    }
};
var MESSAGES = {
    DEFAULT: {
        ENTER_VALID: "Please enter a valid {0}",
        CONFIRM_DELETE: "Are you sure you want to delete?",
        CONFIRM_DELETE_OBJECT: "Are you sure you want to delete the {0}?",
        CONFIRM_REGENERATE_API: "Are you sure you want to regenerate API Credentials?",
        ADD: "Add",
        EDIT: "Edit",
        DELETE: "Delete",
        CANCEL: "Cancel",
        CREATE: "Create",
        ASSIGN_PERMISSION: "Assign Permissions",
        NAME: "Name",
        EMAIL_NOT_VALID: "Email address is not valid",
        MIN_MAX_RANGE: "{0} must be in between {1} and {2}",
        EXISTS: "{0} already exists",
        SELECT_OBJECT: "Select a {0}",
        EDIT_PERMISSION: "There are currently uncommitted changes for this {0}. Are you sure, you want to edit this {0} and continue with the uncommitted changes?",
        CONFIRM_RESTORE_VERSION: "Restoring to a previous version of a {0} will cause immediate and live changes to your {0}. All uncommitted changes to your {0} will be lost. Are you sure you want to continue?",
        SELECT_VALUE_REQUIRED: "Please select a {0}",
        TEXT_VALUE_REQUIRED: "Please provide the {0}",
        TYPE_ERROR: "{0} is not {1}",
        CONFIRM_REMOVE: "{0} will be removed. Do you want to proceed?",
        NOT_FOUND:"Resource not found"
    },
    NOTIFICATIONS: {
        NOTIFICATIONS_COUNT: "You have {0} new notification(s)",
        MARK_ALL_SEEN: "Mark all Seen",
        CONFIRM_MARK_ALL: "Are you sure to Mark All Notifications seen?"
    },
    ACCOUNT: {
        PASSWORD_CONFIRM_NOT_MATCH: "Password and Confirm Password does not match",
        ACCOUNT_AND_USER_UPDATE: "Account and User information updated successfully",
        PASSWORD_TOO_SHORT: "Password should contain atleast 5 characters",
        INVALID_EMAIL_ADDRESS: "E-mail is not valid '{0}'",
        INVALID_CHARACTERS: "{0} is not valid '{1}'"
    },
    DOMAIN: {
        MODAL_TITLE_NEW: "ADD NEW DOMAIN",
        MODAL_TITLE_APPLY_TEMPLATE: "Apply Template",
        MODAL_TITLE_APPLY_VANITY: "Apply Vanity Nameserver",
        MODAL_TITLE_TEMPLATE_RECORD: "Change Template Record",
        MODAL_TITLE_CONFIRM_APPLY_TEMPLATE: "Confirm Apply Template",
        MODAL_TITLE_CONFIRM_COMMIT_TEMPLATE: "Confirm Template Commit",
        MODAL_TITLE_SOA_RECORD: "{0} SOA Record",
        MODAL_TITLE_SERVICES: "3rd Party Services",
        TEMPLATE_APPLY_CONFLICT_RECORDS_ERROR: "Template cannot be applied due to conflicting records in Domain",
        INVALID_DOMAINS: "Invalid Domain(s): {0}",
        IMPORT_NOT_FOUND: "Please provide a {0} to import records into the domain(s)",
        SELECT_DOMAIN: "Please select a domain",
        SELECT_TWO_DOMAINS: "Please select two or more domains",
        UPLOADING: "Uploading...",
        INVALID_NUMBER_DOMAINS: "Invalid number of domains",
        TEMPLATE_APPLY_UNCOMMITTED_CHANGES_ERROR: "Template cannot be applied to domain with uncommitted changes",
        TEMPLATE_UNAPPLY_UNCOMMITTED_CHANGES_ERROR: "Template cannot be unapplied from domain with uncommitted changes",
        GO_TEMPLATE: "Go To Template",
        DELETE_RECORD_NOT_EDIT: "Deleted record cannot be edited",
        SELECT_RECORD: "Please select one record",
        CONFIRM_DELETE_ALL_RECORDS: "Are you sure, you want to delete all records?",
        CONFIRM_DELETE_ALL_RECORDS_UNCOMMITTED: "Currently there are pending uncommitted changes which will not be deleted. You may first commit or rollback the uncommitted changes and then use this option. Are you sure you want to leave uncommitted changes and delete other records?",
        DEFAULT_RECORDS_SPECIFIC_GTD: "Default records cannot be deleted or edited from specific GTD Region",
        REFRESH_PAGE: "Please refresh the page to view the latest configuration",
        CONFIRM_ROLLBACK: "Are you sure, you want to Rollback your changes?",
        CONFIRM_APPLY_TEMPLATE: "Are you sure you want to apply template?",
        FILE_UPLOAD_ERROR: "Cannot add file \"{0}\". {1}",
        CONFIRM_DISABLE_GTD: "By disabling GTD, any uncommitted records which you may have in specific regions will be lost. Press \"OK\" to continue.",
        CANNOT_DELETE: "Following domains can not be deleted:",
        CONTINUE_DELETE_OTHER_DOMAINS: "To continue and delete the other selected domain(s), press 'Delete' button",
        DNS_PROVIDERS: "Secondary DNS Providers",
        MODAL_TITLE_DNSSEC_SETTING: "DNSSEC Setting",
        MODAL_WARNING_DNSSEC_SETTING: "Certain features will not be available on domain, while DNSSEC is enabled.",
        MODAL_TITLE_APPLY_TAGS_TO_DOMAIN: "Apply tags to domain",
        SELECT_DOMAIN_FOR_APPLY_TAG: "To assign a tag please select a domain first",
        MODAL_DELETE_DOMAIN:"Delete Domain",
        AXFR_IMPORT_RECORD_CONFIRM:"Your uncommitted changes will be lost because Nameserver (AXFR) import. Are you sure, you want to import?"
    },
    RECORD: {
        TTL_LIMITS_MESSAGE: "TTL must be in between 0 and 2147483647",
        EMPTY_POOLS: "Please select values for Pool(s)",
        REQUIRED_FIELDS: "Please provide values for the required fields",
        EMPTY_NAME: "{0} Record Name cannot be empty",
        LEVEL_LIMITS_MESSAGE: "Level must be in between 0 and 65535",
        NO_CHANGES: "No changes to save",
        NOT_VALID_FQDN: "{0} is not a valid FQDN",
        NOT_VALID_URL: "\"{0}\" is not a valid url",
        NOT_VALID_ANAME_VALUE: "\"{0}\" is not a valid FQDN OR Host",
        POOL_UNCOMMITTED_STATE: "This pool has pending changes"
    },
    GEO_FILTER: {
        MODAL_TITLE: "{0} IP Filter",
        IPV4_NOT_VALID: "{0} is not a valid IPv4/netmask",
        IPV6_NOT_VALID: "{0} is not a valid IPv6/netmask",
        EMPTY_RECORD: "Please provide a geographic location or an IPv4 / IPv6 address",
        SELECT_GEO_FILTER: "Please select an ip filter"
    },
    GEO_PROXIMITY: {
        MODAL_TITLE: "{0} Geo Proximity",
        LATITUDE_LIMITS_MESSAGE: "Latitude value must be in between -90 and +90",
        LONGITUDE_LIMITS_MESSAGE: "Longitude value must be in between -180 and +180",
        SELECT_PROXIMITY: "Please select proximity",
    },
    BULK_SELECT: {
        OLD_VALUE_EMPTY: "{0} old value must not be empty",
        NEW_VALUE_EMPTY: "{0} new value must not be empty",
        OLD_AND_NEW_SAME: "{0} new value and old value are same",
        CNAME_VALUE_EMPTY: "cname record's {0} value must not be empty"
    },
    ACCOUNT_TRANSFER: {
        CONFIRM_ACCEPT: "Are you sure to accept this transfer?",
        OTHER_TRANSFERS_MESSAGE:" Following items will be created, if you accept this transfer request. You can rename these if required.",
        OTHER_TRANSFERS_TITLE:"Domain Transfer",
        CONFIRM_CANCEL: "Are you sure to cancel this transfer?",
        CONFIRM_REJECT: "Are you sure to reject this transfer?",
        DOMAINS_SELECTED: "{0} Domain(s) Selected"
    },
    VANITYNAMESERVER: {
        MODAL_TITLE: "{0} Vanity Nameserver",
        DELETE_USED: "Following Vanity Nameserver are being used by some domains, therefore cannot be deleted"
    },
    PROXIMITY: {
        REGION_STATE_PROVINCE: "Region/State/Province",
        CITY_LOCATION: "City/Location"
    },
    POOL: {
        POOL_TITLE: "pool",
        APPLIED_OBJECTS_MODAL_TITLE: "Applied to"
    },
    TEMPLATE: {
        SELECT_TEMPLATE: "Please select a template",
        CONTINUE_APPLY_OTHER_DOMAINS: "To apply template on the other selected domain(s), press 'Continue' button",
        CONTINUE_UNAPPLY_ABOVE_DOMAINS: "To continue commit and unapply template from the above domain(s), press 'Continue' button"
    },
    USER:{
        MODAL_TITLE: "{0} User"
    },
    ROUTE53:{
        ERROR_MESSAGES:{
            ACCESS_KEY: "Please provide the Access Key for Amazon Route 53",
            SECRET_KEY: "Please provide the Secret Key for Amazon Route 53"
        }
    },
    DNSME:{
        ERROR_MESSAGES:{
            API_KEY: "Please provide the API Key for DNS Made Easy",
            SECRET_KEY: "Please provide the Secret Key for DNS Made Easy"
        }
    },
    CONTACT_LIST:{
        MODAL_BUTTON_TEXT_DELETE_EMAILS: 'Remove Emails From List',
        MODAL_BUTTON_TEXT_RESEND_CONFIRMATION: 'Resend Confirmation Email',
        MODAL_TITLE_EDIT: "View / Edit Contact List",
        MODAL_TITLE_ADD: "Add Contact List",
        ERRORS: {
            FILE_SIZE_EXCEED: "File size should not be more than {0} KBs",
            FILE_TYPE_NOT_SUPPORTED: "File type not valid"
        }
    },

    MANAGE_TAG_LIST:{
        MODAL_TITLE_ADD: "Add Tag",
        MODAL_TITLE_EDIT: "View / Edit Tag"
    },

    REALTIME_STATS:{
        ALERT_TEMPORARILY_DOWN: 'Realtime Stats is currently undergoing maintenance. We\'ll be back shortly.'
    }
};

String.prototype.format = function (params) {
    var message = this;
    if (params) {
        if ((typeof(params) != "object") && (!jQuery.isArray(params))) {
            params = [params];
        }
        if (jQuery.isArray(params) || !jQuery.isEmptyObject(params)) {
            jQuery.each(params, function (key, value) {
                var pattern = new RegExp("\\{" + key + "\\}", 'g');
                message = message.replace(pattern, value);
            });
        }
    }
    return message;
};

var baseURL;
var showLoaderOnSend = false;
var hideLoaderOnComplete = false;
var scrollOnTop = true;
var contextPath;
var moveToTopAfterAjax = true;
var notificationsURL;
var ticketSubmissionURI;

jQuery(document).ajaxSend(function (event, request, settings) {
    if (showLoaderOnSend) {
        showPageLoader();
    }
});

jQuery(document).ajaxComplete(function () {
    if (hideLoaderOnComplete) {
        hidePageLoader();
    }
    if (moveToTopAfterAjax) {
        moveToTop();
    } else {
        moveToTopAfterAjax = true;
    }
});

function moveToTop() {
    if (scrollOnTop) {
        jQuery(document).scrollTop(0);
    }
}

function modalMoveToTop() {
    if (moveToTopAfterAjax) {
        jQuery(".modal").scrollTop(0);
    }
}

function showLoaderOnAjaxSend(val) {
    showLoaderOnSend = val;
}

function hideLoaderOnAjaxComplete(val) {
    hideLoaderOnComplete = val;
}

function showPageLoader() {
    jQuery(".page-loader").show();
}

function hidePageLoader() {
    jQuery(".page-loader").hide();
}

function listNotifications() {
    if (jQuery("#notif-url").val()) {
        var url = jQuery("#notif-url").val() + "?status=1";
        var selector = jQuery("li[item='notifications']");
        return jQuery.ajax({type: 'GET', url: url, selector: selector}).done(function (data, textStatus) {
            jQuery(selector).html(data);
            applyNiceScroll();
            addDefaultNotifcation();
            notificationsURL = jQuery("#notifications").val();
            jQuery("#notifications").remove();
            ajaxRequestOld({url: notificationsURL, method: 'GET'});
        });
    }
}

function resetMenu() {
    var height = jQuery("#header").height() + "px";
    jQuery("body").css("padding-top", height);
    jQuery("#sidebar,#page-rightbar").css("top", height);
}

jQuery(window).resize(function () {
    resetMenu();
});
jQuery(document).ready(function () {
    ticketSubmissionURI = createLink('/ticket');
    resetMenu();
    baseURL = document.getElementById("baseURL") ? document.getElementById("baseURL").value : "/";
    listNotifications();
    //call ajax links on page load
    jQuery("div#pageLoadAjax a").click();
    moveToTop();
    contextPath = jQuery("#contextPath").val();
    jQuery("#contextPath").remove();
    jQuery('#switch-user-dropdown').click(function (e) {
        e.stopPropagation(); //This will prevent the event from bubbling up and close the dropdown when you type/click on text boxes.
    });
    jQuery("#switch-user-btnOk").on('click', function (e) {
        switchAccount();
        e.stopPropagation();
    });
    jQuery('#switch-user-dropdown').closest(".btn-group").on('show.bs.dropdown', function () {
        clearMessages();
    });
    jQuery('#submitTicketButton').on('click', showIssueTicket);
    jQuery("#global-search").on('keyup', function (evt) {
        if (isEnterKey(evt) && jQuery.trim(this.value)) {
            var obj = {search: new Search().buildSimpleObject('name', 'contains', this.value)};
            var url = jQuery("#global-search-url").val();
            url += (url.indexOf("?") > -1 ? "&" : "?") + jQuery.param(obj);
            window.location.href = url;
        }
    });
    jQuery("table").colResizable({liveDrag:true, minWidth:30});
});

jQuery(window).on('beforeunload', function(){
    showPageLoader();
});

function showIssueTicket() {
    showLoaderOnAjaxSend(true);
    ajaxRequestOld({
        url: ticketSubmissionURI,
        type: 'GET'
    }).done(function (template) {
        hideLoaderOnAjaxComplete(true);
        createIssueTicket(template);
    });

}

function createIssueTicket(data) {
    showLoaderOnAjaxSend(true);
    hideLoaderOnAjaxComplete(true);
    var box = bootbox.dialog({
        message: data,
        title: 'Submit a Ticket',
        onEscape: function () {
        },
        buttons: {
            save: {
                label: "Submit",
                className: "btn-solidblue pull-left",
                callback: function () {
                    var obj = {
                        subject: jQuery('.bootbox.modal').find('#ticketSubject').val(),
                        description: jQuery('.bootbox.modal').find('#ticketDescription').val(),
                        pageURL: window.location.href
                    };
                    ajaxRequest({
                        url: ticketSubmissionURI,
                        type: REQUEST.METHODS.PUT,
                        dataType: REQUEST.DATA_TYPE.JSON,
                        contentType: REQUEST.CONTENT_TYPE.JSON,
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        clearErrors();
                        bootbox.hideAll();
                        Dialog.success("<br>" + jQuery('.bootbox.modal').find('#ticket-success').html() + "<br><div class='text-center'><b>" + data.success + "</b></div>");
                        jQuery('.bootbox.modal').find('.modal-dialog').addClass('sidebar');

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        if (hasErrors(jqXHR.responseJSON)) {
                            showErrors(jqXHR.responseJSON.errors, jQuery('.bootbox.modal').find('.errors'));
                        }
                    });
                    return false;
                }
            },
            cancel: {
                label: "Close",
                className: "btn-cancel",
                callback: function () {

                }
            }
        }
    });
    box.find('.modal-dialog').addClass('sidebar');
    clearErrors();
    box.find('.success-message:not(.sticky)').hide();
    box.find('.btn-cancel').removeClass('btn');
    box.find('.modal-footer').find('.btn-solidblue').empty().append('<i class="fa fa-tag"></i>&nbsp;&nbsp;Submit');
}

function ajaxRequestOld(map) {
    var errSelector = map.errSelector;
    var deferred;
    var statusCodes = {
        statusCode: {
            302: function (data, status, response) {
                window.location.reload(true);
            },
            401: function (data, status, response) {
                window.location.reload(true);
            },
            403: function (data, status, response) {
                if (data.responseText && data.responseText.isJSON()) {
                    if (JSON.parse(data.responseText).errors) {
                        showErrors(JSON.parse(data.responseText).errors, errSelector);
                        hidePageLoader();
                    } else {
                        window.location.reload(true);
                    }
                } else {
                    window.location.reload(true);
                }
            },
            404: function (data, status, response) {
                hidePageLoader();
                var errors = null;
                try {
                    errors = JSON.parse(data.responseText).errors;
                } catch (e) {}
                errors=errors?errors:[getErrorObject(MESSAGES.DEFAULT.NOT_FOUND)];
                if(jQuery('.errors').length > 0){
                    showErrors(errors);
                } else {
                    Dialog.alert(errors[0].message);
                }
            },
            500: function (data, status, response) {
                if (data.responseText && data.responseText.isJSON()) {
                    if (JSON.parse(data.responseText).errors) {
                        if (errSelector) {
                            showErrors(JSON.parse(data.responseText).errors, errSelector);
                        } else {
                            showErrors(JSON.parse(data.responseText).errors);
                        }
                    }
                } else {
                    Dialog.error("There was an error while processing your request");
                }
            },
            200: function (data, status, response) {
                modalMoveToTop();
                if (deferred) {
                    deferred.resolve(data, status, response);
                }
            },
            400: function (jqXHR, status, errorThrown) {
                if (deferred) {
                    if (map.registerFailHandler) {
                        deferred.reject(jqXHR, status, errorThrown);
                    } else {
                        var rsp = jqXHR.responseJSON ? jqXHR.responseJSON : jqXHR.responseText;
                        deferred.resolve(rsp, status, errorThrown);
                    }
                }
            }
        }
    };
    var map = jQuery.extend(true, statusCodes, map);
    deferred = jQuery.Deferred(function (defer) {
        jQuery.ajax(map)
    });
    return deferred.promise();

}
function ajaxRequest(map) {
    var errSelector = map.errSelector;
    var statusCodes = {
        statusCode: {
            302: function (data, status, response) {
                window.location.reload(true);
            },
            401: function (data, status, response) {
                window.location.reload(true);
            },
            403: function (data, status, response) {
                if (data.responseText && data.responseText.isJSON()) {
                    if (JSON.parse(data.responseText).errors) {
                        showErrors(JSON.parse(data.responseText).errors, errSelector);
                        hidePageLoader();
                    } else {
                        window.location.reload(true);
                    }
                } else {
                    window.location.reload(true);
                }
            },
            404: function (data, status, response) {
                hidePageLoader();
                Dialog.alert("Page not found");
            },
            500: function (data, status, response) {
                if (data.responseText && data.responseText.isJSON()) {
                    if (JSON.parse(data.responseText).errors) {
                        showErrors(JSON.parse(data.responseText).errors);
                    }
                } else {
                    Dialog.error("There was an error while processing your request");
                }
            },
            200: function (data, status, response) {
                modalMoveToTop();
            }
        }
    };
    var map = jQuery.extend(true, statusCodes, map);
    return jQuery.ajax(map);
}

function moveUp(element) {
    if (element) {
        element = jQuery(element);
        if (element.prev()) {
            element.insertBefore(element.prev());
        }
    }
}

function moveDown(element) {
    if (element) {
        element = jQuery(element);
        if (element.next()) {
            element.insertAfter(element.next());
        }
    }
}

function onItemCountChange(url, count) {
    url=createLink(url);
    url += (url.indexOf('?') > -1 ? '&' : '?') + "offset=0&max=" + count;
    window.location = url;
}

function listRecordWithVariableCount(listId, recType, count) {
    var selector = "#" + jQuery('.tab-pane.active .' + listId).closest('.gtdRegion').attr('id');
    var cookieProps = {};
    if(jQuery("#recordPaginationSize").val() == count){
        cookieProps['maxAge'] = 0;
    }
    Cookie.setOnContextPath(getRecordCookiePrefix(recType) + "max", count,cookieProps);
    showPageLoader();
    var prevhideLoaderState = hideLoaderOnComplete;
    hideLoaderOnAjaxComplete(false);
    jQuery.when(
        listRecords(recType, selector),
        getUserChanges()
    ).done(function (loadARecordAjax, getUserChangesAjax) {
            applyUserChanges();
            hidePageLoader();
            hideLoaderOnAjaxComplete(prevhideLoaderState);
        });
}

function getRecordCookiePrefix(recType) {
    if (recType) {
        return "record_" + recType.toLowerCase() + "_";
    }
    return "";
}

var Cookie = {
    get: function (key) {
        return jQuery.cookie(key);
    },
    setOnContextPath: function (key, value, data) {
        var map = {path: baseURL};
        map = jQuery.extend({}, map, data ? data : {});
        jQuery.cookie(key, value, map);
    },
    set: function (key, value, data) {
        jQuery.cookie(key, value, data);
    },
    remove: function (key) {
        jQuery.removeCookie(key);
    }
};

var typeCastMap = {
    'integer': function (value, args) {
        var newVal;
        if (!args) {
            newVal = parseInt(value);
        } else {
            newVal = parseInt(value, args, ele)
        }
        if (newVal != NaN) {
            return newVal;
        } else {
            return value;
        }
    },
    'boolean': function (value, args, ele) {
        var eleType = jQuery(ele).attr('type');
        if (!eleType) {
            eleType = 'text';
        }
        if ('checkbox' == eleType) {
            return !!jQuery(ele).is(':checked');
        } else if (value === 1 || value === true || 'on' == value.toLowerCase() || 'true' == value.toLowerCase()) {
            return true;
        }

        return false;
    }
};

function typeCastValueTo(value, toType, ele, args) {
    return typeCastMap[toType.toLowerCase()](value, args, ele);
}

jQuery.fn.serializeObject = function () {
    var o = {};
    var formElements = jQuery(this).find('input,textarea,select');
    jQuery(formElements).each(function () {

        var val = jQuery(this).val();
        var dataType = jQuery(this).attr('data-type');
        var eleType = jQuery(this).attr('type');
        if (!eleType) {
            eleType = 'text';
        }
        if (dataType) {
            dataType = dataType.toLowerCase();
            val = typeCastValueTo(val, dataType, jQuery(this));
        }
        if ('checkbox' != eleType.toLowerCase() || 'boolean' == dataType) {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(val);
            } else {
                o[this.name] = val;
            }
        }
    });
    return o;
};

function switchAccount() {
    var select = jQuery("select#switch-user-option");
    var data = jQuery("input#switch-user-data");
    var asAdmin = jQuery("#switch-user-asAdmin:checkbox").is(":checked");
    if (!select.val()) {
        showErrors([
            {message: "Please select an option"}
        ], '#switch-user-error');
        return false;
    }
    if (accountSwitchOptions[select.val()].validate()) {
        var obj = {};
        obj.option = select.val();
        obj.data = jQuery.trim(data.val());
        obj.asAdmin = asAdmin;
        jQuery("#switch-user-btnOk").prop("disabled", true);
        ajaxRequestOld({
            url: jQuery("#switch-user-url").val(),
            data: JSON.stringify(obj),
            dataType: REQUEST.DATA_TYPE.JSON,
            contentType: REQUEST.CONTENT_TYPE.JSON,
            method: REQUEST.METHODS.PUT,
            statusCode: {
                401: function () {
                    showErrors([
                        {message: "You are not authorized for this operation"}
                    ], '#switch-user-error');
                    jQuery("#switch-user-btnOk").prop("disabled", false);
                },
                500: function (data, status, response) {
                    if (data.responseText && data.responseText.isJSON()) {
                        if (JSON.parse(data.responseText).errors) {
                            showErrors(JSON.parse(data.responseText).errors, "#switch-user-error");
                        }
                    }
                    jQuery("#switch-user-btnOk").prop("disabled", false);
                }
            },
            errSelector: "#switch-user-error"
        }).done(function (data) {
            if (data) {
                if (data.success) {
                    window.location.href = baseURL;
                } else if (data.errors) {
                    showErrors(data.errors, '#switch-user-error');
                }
            }
            jQuery("#switch-user-btnOk").prop("disabled", false);
        });
    }
}

function showModalErrors(errors) {
    var errorString = "";
    if (errors) {
        for (var i = 0; i < errors.length; i++) {
            errorString = errorString + htmlEncode(errors[i].message) + '<br/>';
        }
    }
    Dialog.error(errorString, {allowHtml:true});
}

function createAndShowErrors(errors, element) {
    createErrorElement(element);
    showErrors(errors, element.find('.errors'));
}

function createErrorElement(element) {
    var errorElement = "<ul class='errors active' role='alert'></ul>";
    jQuery(element).append(errorElement);
}

function showErrors(errors, element) {
    clearErrors();
    addErrors(errors, element);
    if (errors) {
        modalMoveToTop();
    }
}

function getErrorElement(selector) {
    if (typeof selector == "string") {
        selector = jQuery.trim(selector);
        return jQuery(selector);
    } else if (typeof selector == "undefined") {
        return jQuery("ul.errors");
    }
    return selector;
}

function addErrors(errors, element) {
    if (errors) {
        var ul = getErrorElement(element);
        for (var i = 0; i < errors.length; i++) {
            var li = jQuery("<li>");
            var message = htmlEncode(errors[i].message);
            message = message.replace(/&amp;/g,"&");
            li.html(message);
            li.appendTo(ul);
        }
        ul.addClass("active");
    }
}

function clearErrors() {
    jQuery(".errors").each(function () {
        var error = jQuery(this);
        error.empty();
        error.removeClass('active');
        error.removeAttr('style');
    });
}

function clearSuccessMessages() {
    jQuery(".success-message:not(.sticky)").each(function () {
        var message = jQuery(this);
        message.empty();
        message.removeClass("active");
        message.removeAttr('style');
    });
}

function clearMessages() {
    clearErrors();
    clearSuccessMessages();
}

var accountSwitchOptions = {
    1: {
        validate: function () {
            var data = jQuery("input#switch-user-data");
            if (!data.val() || !jQuery.trim(data.val())) {
                showErrors([
                    {message: MESSAGES.DEFAULT.TEXT_VALUE_REQUIRED.format(['username'])}
                ], '#switch-user-error');
                return false;
            }
            return true;
        }
    },
    2: {
        validate: function () {
            var data = jQuery("input#switch-user-data");
            if (!data.val() || !jQuery.trim(data.val())) {
                showErrors([
                    {message: MESSAGES.DEFAULT.TEXT_VALUE_REQUIRED.format(['account id'])}
                ], '#switch-user-error');
                return false;
            } else if (isNaN(data.val())) {
                showErrors([
                    {message: MESSAGES.DEFAULT.TYPE_ERROR.format(['Account ID', 'an integer'])}
                ], '#switch-user-error');
            }
            return true;
        }
    },
    3: {
        validate: function () {
            var data = jQuery("input#switch-user-data");
            if (!data.val() || !jQuery.trim(data.val())) {
                showErrors([
                    {message: MESSAGES.DEFAULT.TEXT_VALUE_REQUIRED.format(['email address'])}
                ], '#switch-user-error');
                return false;
            }
            return true;
        }
    },
    4: {
        validate: function () {
            var data = jQuery("input#switch-user-data");
            if (!data.val() || !jQuery.trim(data.val())) {
                showErrors([
                    {message: MESSAGES.DEFAULT.TEXT_VALUE_REQUIRED.format(['domain name'])}
                ], '#switch-user-error');
                return false;
            }
            return true;
        }
    }
};


function applyBootstrapSwitch(elem) {
    //elem.bootstrapSwitch();
    elem.toggleSwitch();
    elem.addClass('toggle-switch');
    elem.removeClass('my-switch');
    jQuery('.has-switch').addClass('switch-mini');
}

function showFormErrors(form, errorMap) {
    var errorsContainer = jQuery(form).find("ul.errors");
    if (!jQuery.isEmptyObject(errorMap)) {
        errorsContainer.children().remove();
        for (var key in errorMap) {
            errorsContainer.append('<li>' + errorMap[key] + "</li>");
        }
        errorsContainer.addClass("active");
    } else {
        errorsContainer.removeClass("active");
    }
}

function initializeToolTip() {
    jQuery("i.fa-pencil,i.fa-arrow-down,i.fa-arrow-up, i.fa-trash-o").popover();
}

function showSuccessMessage(message, element) {
    if (message) {
        var div = element;
        if (typeof element == "string") {
            element = jQuery.trim(element);
            div = jQuery(element);
        } else if (typeof element == "undefined") {
            div = jQuery(".success-message");
        }
        clearSuccessMessages();
        message = htmlEncode(message);
        message = message.replace(/&amp;/g,"&");
        div.html(message);
        div.addClass("active");
        modalMoveToTop();
    }
}

String.prototype.isJSON = function () {
    try {
        JSON.parse(this);
        return true;
    } catch (e) {
    }
    return false;
};

function uncommittedWarning() {
    if (jQuery('.uncommitted-changes-found').size()) {
        jQuery(".fa.fa-exclamation-triangle").removeClass("hidden");
        jQuery(".viewall-uncommitted").removeAttr("disabled");
    }

    if (jQuery.isNumeric(jQuery("#totalChanges").val())) {
        jQuery("#uncommittedCount").text(jQuery("#totalChanges").val());
    }
}

function canEditConfInner(userChangesId, domainUrl, canEdit, title) {
    var returnVal = true;
    if (canEdit == String(false)) {
        if (!userChangesId) {
            Dialog.alert(MESSAGES.DOMAIN.REFRESH_PAGE);
            returnVal = false;
        } else {
            Dialog.confirm(MESSAGES.DEFAULT.EDIT_PERMISSION.format([title]), function (result) {
                if (result) {
                    clearMessages();
                    ajaxRequestOld({
                        url: domainUrl + "/uncommittedchanges/" + userChangesId,
                        dataType: REQUEST.DATA_TYPE.JSON,
                        method: REQUEST.METHODS.PUT
                    })
                        .done(function (data) {
                            if (data && data.success) {
                                jQuery(document).data("canEdit", "true");
                            }
                            window.location.reload(true);
                        });
                }
            });
        }
        returnVal = false;
    }
    return returnVal;
}
function canEditConf(userChangesId, domainUrl, title) {
    var returnVal = true;
    return canEditConfInner(userChangesId, domainUrl, jQuery(document).data("canEdit"), title);
}

function setDeletePopover(element) {
    setPopover(element, MESSAGES.DEFAULT.DELETE);
}

function setCancelPopover(element) {
    setPopover(element, MESSAGES.DEFAULT.CANCEL);
}

function setPopover(element, text) {
    var ele = jQuery(element);
    ele.attr("data-content", text);
    ele.attr("rel", POPOVER_ATTRIBUTES.RELATION);
    ele.attr("data-placement", POPOVER_ATTRIBUTES.PLACEMENT);
    ele.attr("data-trigger", POPOVER_ATTRIBUTES.TRIGGER);
    ele.popover();
}

function hasSuccess(data) {
    return data && data.success;
}

function hasErrors(data) {
    return data && data.errors;
}

function togglePanelImages(element) {
    element = (element)?element:jQuery(".panel-collapse");
    element.each(function () {
        jQuery(this).on('shown.bs.collapse', function () {
            var id = this.id;
            var link = jQuery(this).closest(".panel-group").find("a[href=#" + id + "]");
            link.find("i.fa").addClass("hidden");
            link.find("i.fa:eq(1)").removeClass("hidden");
        });
        jQuery(this).on('hidden.bs.collapse', function () {
            var id = this.id;
            var link = jQuery(this).closest(".panel-group").find("a[href=#" + id + "]");
            link.find("i.fa").addClass("hidden");
            link.find("i.fa:eq(0)").removeClass("hidden");
        });
    });
}

function focusModalField(element, box) {
    if(!box) box = jQuery(".modal");
    box.on("shown.bs.modal", function () {
        box.find(element).focus();
    });
}

Boolean.parse = function (str) {
    switch (str.toLowerCase()) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            throw new Error("Boolean.parse: Cannot convert string to boolean.");
    }
};

function getNameArray(value) {
    var arr = new Array();
    value = value.split(/[\n,;\s]/);

    if (!(value instanceof Array)) {
        arr[0] = value;
        value = arr;
    } else {
        var i = 0;
        var index = 0;
        for (i = 0; i < value.length; ++i) {
            value[i] = jQuery.trim(value[i]);
            if (value[i].length > 0) {
                arr[index++] = value[i];
            }
        }
        value = arr;
    }

    return value;
}

function getErrorList(text) {
    return [getErrorObject(text)];
}

function getErrorObject(text) {
    return {message: text};
}

function addErrorInList(obj, text) {
    obj.push(getErrorObject(text));
}

var IncompleteRequestHandler = {
    types: {
        confirmation: function (incompleteRequest, onComplete) {
            Dialog.confirm(incompleteRequest.message, function (result) {
                if (result) {
                    var uri = incompleteRequest.uri;
                    var method = incompleteRequest.method;
                    var obj = incompleteRequest.currentRequestParams;
                    for (var key in incompleteRequest.missingFields) {
                        obj[key] = incompleteRequest.missingFields[key];
                    }
                    ajaxRequestOld({
                        url: uri,
                        method: method,
                        dataType: REQUEST.DATA_TYPE.JSON,
                        contentType: REQUEST.CONTENT_TYPE.JSON,
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        onComplete(data)
                    });
                }
            });
        }
    },
    handle: function (incompleteRequest, onComplete) {
        if (this.types[incompleteRequest.type] && typeof this.types[incompleteRequest.type] == "function") {
            this.types[incompleteRequest.type](incompleteRequest, onComplete);
        }
    }
};

function getBaseURL() {
    return jQuery("#baseURL").val();
}

function createLink(urlPostFix) {
    var url = urlPostFix.replace(/^\//, '');
    return getBaseURL() + url;
}

function htmlEncode(str) {
    if (str) {
        return jQuery("<div>").text(str).html();
    }
    return "";
}

function parseCheckBox(selector) {
    var checkBox = jQuery(selector).prop("checked");
    return (checkBox === true);
}

function convertHostToFqdn(host, domainName) {
    host = (host) ? host.trim() : '';
    if (!host) {
        host = domainName + '.';
    } else if (!host.match(/^.*\.$/)) {
        host = host + '.' + domainName + '.';
    }
    return host;
}

function getModalElement(selector) {
    return jQuery(SELECTORS.MODAL).find(selector);
}

function matchSimpleArrayWithoutOrder(array1, array2) {
    if(array1.length != array2.length) return false;
    var table = {};
    for(var i1 in array1) {
        table[array1[i1]] = true;
    }

    for(var i2 in array2) {
        if(!table[array2[i2]]) {
            return false;
        }
    }
    return true;
}

function toggleCollapsibleIcon(){

    jQuery('.toggle-class-right-down').on('click', function () {
        var element = jQuery(this).find("i");
        if (typeof element == 'undefined')
            return;

        if (element.hasClass('fa-plus-square')) {
            element.removeClass('fa-plus-square').addClass('fa-minus-square');
        } else {
            element.removeClass('fa-minus-square').addClass('fa-plus-square');
        }
    });
}
function callbackOnclickOutsideContainer(e){
    var container = jQuery(e.data.selector);
    if(container.length > 0){
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            e.data.callback();
        }
    }
}

function deleteConfirmFormValidation(callback){

    var confirmation_textbox = jQuery('.bootbox.modal').find('input[id=deleteConfirmationText]');
    var deleteConfirmationText = confirmation_textbox.val();
    if(deleteConfirmationText == SELECTORS.CONFIRM_DELETE_TEXT){
        confirmation_textbox.parent().removeClass('has-error');
        callback();
        return true;
    }
    else{
        confirmation_textbox.parent().addClass('has-error');
    }
    return false;
}

function deleteConfirmDialog(title, body, callback,validation) {
    if(!(typeof validation === 'function')) {
        validation = deleteConfirmFormValidation;
    }
    var box = bootbox.dialog({
        message: body,
        animate: true,
        onEscape: function () {
        },
        title: title,
        buttons: {
            success: {
                label: "Delete",
                className: "pull-left btn-danger btn-delete-dialog",
                callback: function(){
                    return validation(callback);
                }
            },
            main: {
                label: BUTTONS.CLOSE,
                className: "btn-cancel"
            }
        }
    });
    box.find('.confirm-delete-text').text(SELECTORS.CONFIRM_DELETE_TEXT);
    box.on("shown.bs.modal", function () {
        box.find('.btn-cancel').removeClass('btn');
        box.find('#deleteConfirmationText').focus();
    });
}
function setFocus(inputList) {
    jQuery.each(inputList, function (ind, elem) {
        if (!jQuery(elem).val()) {
            jQuery(elem).focus();
            return false;
        }
    });
}
/*
 *
 * Copyright (c) 2006-2011 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * Version 1.3
 * Demo: http://www.texotela.co.uk/code/jquery/numeric/
 *
 */
(function ($) {
    /*
     * Allows only valid characters to be entered into input boxes.
     * Note: fixes value when pasting via Ctrl+V, but not when using the mouse to paste
     *      side-effect: Ctrl+A does not work, though you can still use the mouse to select (or double-click to select all)
     *
     * @name     numeric
     * @param    config      { decimal : "." , negative : true }
     * @param    callback     A function that runs if the number is not valid (fires onblur)
     * @author   Sam Collett (http://www.texotela.co.uk)
     * @example  $(".numeric").numeric();
     * @example  $(".numeric").numeric(","); // use , as separater
     * @example  $(".numeric").numeric({ decimal : "," }); // use , as separator
     * @example  $(".numeric").numeric({ negative : false }); // do not allow negative values
     * @example  $(".numeric").numeric(null, callback); // use default values, pass on the 'callback' function
     *
     */
    $.fn.numeric = function (config, callback) {
        if (typeof config === 'boolean') {
            config = { decimal: config };
        }
        config = config || {};
        // if config.negative undefined, set to true (default is to allow negative numbers)
        if (typeof config.negative == "undefined") config.negative = true;
        // set decimal point
        var decimal = (config.decimal === false) ? "" : config.decimal || ".";
        // allow negatives
        var negative = (config.negative === true) ? true : false;
        // callback function
        var callback = typeof callback == "function" ? callback : function () {
        };
        // set data and methods
        return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur);
    }

    $.fn.numeric.keypress = function (e) {
        // get decimal character and determine if negatives are allowed
        var decimal = $.data(this, "numeric.decimal");
        var negative = $.data(this, "numeric.negative");
        // get the key that was pressed
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        // allow enter/return key (only when in an input box)
        if (key == 13 && this.nodeName.toLowerCase() == "input") {
            return true;
        }
        else if (key == 13) {
            return false;
        }
        var allow = false;
        // allow Ctrl+A
        if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) return true;
        // allow Ctrl+X (cut)
        if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) return true;
        // allow Ctrl+C (copy)
        if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) return true;
        // allow Ctrl+Z (undo)
        if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) return true;
        // allow or deny Ctrl+V (paste), Shift+Ins
        if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86) /* opera */
            || (e.shiftKey && key == 45)) return true;
        // if a number was not pressed
        if (key < 48 || key > 57) {
            /* '-' only allowed at start and if negative numbers allowed */
            if (this.value.indexOf("-") != 0 && negative && key == 45 && (this.value.length == 0 || ($.fn.getSelectionStart(this)) == 0)) return true;
            /* only one decimal separator allowed */
            if (decimal && key == decimal.charCodeAt(0) && this.value.indexOf(decimal) != -1) {
                allow = false;
            }
            // check for other keys that have special purposes
            if (
                key != 8 /* backspace */ &&
                    key != 9 /* tab */ &&
                    key != 13 /* enter */ &&
                    key != 35 /* end */ &&
                    key != 36 /* home */ &&
                    key != 37 /* left */ &&
                    key != 39 /* right */ &&
                    key != 46 /* del */
                ) {
                allow = false;
            }
            else {
                // for detecting special keys (listed above)
                // IE does not support 'charCode' and ignores them in keypress anyway
                if (typeof e.charCode != "undefined") {
                    // special keys have 'keyCode' and 'which' the same (e.g. backspace)
                    if (e.keyCode == e.which && e.which != 0) {
                        allow = true;
                        // . and delete share the same code, don't allow . (will be set to true later if it is the decimal point)
                        if (e.which == 46) allow = false;
                    }
                    // or keyCode != 0 and 'charCode'/'which' = 0
                    else if (e.keyCode != 0 && e.charCode == 0 && e.which == 0) {
                        allow = true;
                    }
                }
            }
            // if key pressed is the decimal and it is not already in the field
            if (decimal && key == decimal.charCodeAt(0)) {
                if (this.value.indexOf(decimal) == -1) {
                    allow = true;
                }
                else {
                    allow = false;
                }
            }
        }
        else {
            allow = true;
        }
        return allow;
    }

    $.fn.numeric.keyup = function (e) {
        var val = this.value;
        if (val.length > 0) {
            // get carat (cursor) position
            var carat = $.fn.getSelectionStart(this);
            // get decimal character and determine if negatives are allowed
            var decimal = $.data(this, "numeric.decimal");
            var negative = $.data(this, "numeric.negative");

            // prepend a 0 if necessary
            if (decimal != "") {
                // find decimal point
                var dot = val.indexOf(decimal);
                // if dot at start, add 0 before
                if (dot == 0) {
                    this.value = "0" + val;
                }
                // if dot at position 1, check if there is a - symbol before it
                if (dot == 1 && val.charAt(0) == "-") {
                    this.value = "-0" + val.substring(1);
                }
                val = this.value;
            }

            // if pasted in, only allow the following characters
            var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '-', decimal];
            // get length of the value (to loop through)
            var length = val.length;
            // loop backwards (to prevent going out of bounds)
            for (var i = length - 1; i >= 0; i--) {
                var ch = val.charAt(i);
                // remove '-' if it is in the wrong place
                if (i != 0 && ch == "-") {
                    val = val.substring(0, i) + val.substring(i + 1);
                }
                // remove character if it is at the start, a '-' and negatives aren't allowed
                else if (i == 0 && !negative && ch == "-") {
                    val = val.substring(1);
                }
                var validChar = false;
                // loop through validChars
                for (var j = 0; j < validChars.length; j++) {
                    // if it is valid, break out the loop
                    if (ch == validChars[j]) {
                        validChar = true;
                        break;
                    }
                }
                // if not a valid character, or a space, remove
                if (!validChar || ch == " ") {
                    val = val.substring(0, i) + val.substring(i + 1);
                }
            }
            // remove extra decimal characters
            var firstDecimal = val.indexOf(decimal);
            if (firstDecimal > 0) {
                for (var i = length - 1; i > firstDecimal; i--) {
                    var ch = val.charAt(i);
                    // remove decimal character
                    if (ch == decimal) {
                        val = val.substring(0, i) + val.substring(i + 1);
                    }
                }
            }
            // set the value and prevent the cursor moving to the end
            this.value = val;
            $.fn.setSelection(this, carat);
        }
    }

    $.fn.numeric.blur = function () {
        var decimal = $.data(this, "numeric.decimal");
        var callback = $.data(this, "numeric.callback");
        var val = this.value;
        if (val != "") {
            var re = new RegExp("^\\d+$|\\d*" + decimal + "\\d+");
            if (!re.exec(val)) {
                callback.apply(this);
            }
        }
    }

    $.fn.removeNumeric = function () {
        return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).unbind("keypress", $.fn.numeric.keypress).unbind("blur", $.fn.numeric.blur);
    }

// Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
    $.fn.getSelectionStart = function (o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', o.value.length);
            if (r.text == '') return o.value.length;
            return o.value.lastIndexOf(r.text);
        } else return o.selectionStart;
    }

// set the selection, o is the object (input), p is the position ([start, end] or just start)
    $.fn.setSelection = function (o, p) {
        // if p is number, start and end are the same
        if (typeof p == "number") p = [p, p];
        // only set if p is an array of length 2
        if (p && p.constructor == Array && p.length == 2) {
            if (o.createTextRange) {
                var r = o.createTextRange();
                r.collapse(true);
                r.moveStart('character', p[0]);
                r.moveEnd('character', p[1]);
                r.select();
            }
            else if (o.setSelectionRange) {
                o.focus();
                o.setSelectionRange(p[0], p[1]);
            }
        }
    }

})(jQuery);
/**
 * bootbox.js v4.1.0
 *
 * http://bootboxjs.com/license.txt
 */
window.bootbox = window.bootbox || function a(b, c) {
    "use strict";
    function d(a) {
        var b = r[p.locale];
        return b ? b[a] : r.en[a]
    }

    function e(a, c, d) {
        a.preventDefault();
        var e = b.isFunction(d) && d(a) === !1;
        e || c.modal("hide")
    }

    function f(a) {
        var b, c = 0;
        for (b in a)c++;
        return c
    }

    function g(a, c) {
        var d = 0;
        b.each(a, function (a, b) {
            c(a, b, d++)
        })
    }

    function h(a) {
        var c, d;
        if ("object" != typeof a)throw new Error("Please supply an object of options");
        if (!a.message)throw new Error("Please specify a message");
        return a = b.extend({}, p, a), a.buttons || (a.buttons = {}), a.backdrop = a.backdrop ? "static" : !1, c = a.buttons, d = f(c), g(c, function (a, e, f) {
            if (b.isFunction(e) && (e = c[a] = {callback: e}), "object" !== b.type(e))throw new Error("button with key " + a + " must be an object");
            e.label || (e.label = a), e.className || (e.className = 2 >= d && f === d - 1 ? "btn-primary" : "btn-default")
        }), a
    }

    function i(a, b) {
        var c = a.length, d = {};
        if (1 > c || c > 2)throw new Error("Invalid argument length");
        return 2 === c || "string" == typeof a[0] ? (d[b[0]] = a[0], d[b[1]] = a[1]) : d = a[0], d
    }

    function j(a, c, d) {
        return b.extend(!0, {}, a, i(c, d))
    }

    function k(a, b, c, d) {
        var e = {className: "bootbox-" + a, buttons: l.apply(null, b)};
        return m(j(e, d, c), b)
    }

    function l() {
        for (var a = {}, b = 0, c = arguments.length; c > b; b++) {
            var e = arguments[b], f = e.toLowerCase(), g = e.toUpperCase();
            a[f] = {label: d(g)}
        }
        return a
    }

    function m(a, b) {
        var d = {};
        return g(b, function (a, b) {
            d[b] = !0
        }), g(a.buttons, function (a) {
            if (d[a] === c)throw new Error("button key " + a + " is not allowed (options are " + b.join("\n") + ")")
        }), a
    }

    var n = {dialog: "<div class='bootbox modal' tabindex='-1' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>", header: "<div class='modal-header'><h4 class='modal-title'></h4></div>", footer: "<div class='modal-footer'></div>", closeButton: "<button type='button' class='bootbox-close-button close'><i class='fa fa-times'></i></button>", form: "<form class='bootbox-form'></form>", inputs: {text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />", email: "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />", select: "<select class='bootbox-input bootbox-input-select form-control'></select>", checkbox: "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>"}}, o = b("body"), p = {locale: "en", backdrop: !0, animate: !0, className: null, closeButton: !0, show: !0}, q = {};
    q.alert = function () {
        var a;
        if (a = k("alert", ["ok"], ["message", "callback"], arguments), a.callback && !b.isFunction(a.callback))throw new Error("alert requires callback property to be a function when provided");
        return a.buttons.ok.callback = a.onEscape = function () {
            return b.isFunction(a.callback) ? a.callback() : !0
        }, q.dialog(a)
    }, q.confirm = function () {
        var a;
        if (a = k("confirm", ["cancel", "confirm"], ["message", "callback"], arguments), a.buttons.cancel.callback = a.onEscape = function () {
            return a.callback(!1)
        }, a.buttons.confirm.callback = function () {
            return a.callback(!0)
        }, !b.isFunction(a.callback))throw new Error("confirm requires a callback");
        return q.dialog(a)
    }, q.prompt = function () {
        var a, d, e, f, h, i, k;
        if (f = b(n.form), d = {className: "bootbox-prompt", buttons: l("cancel", "confirm"), value: "", inputType: "text"}, a = m(j(d, arguments, ["title", "callback"]), ["cancel", "confirm"]), i = a.show === c ? !0 : a.show, a.message = f, a.buttons.cancel.callback = a.onEscape = function () {
            return a.callback(null)
        }, a.buttons.confirm.callback = function () {
            var c;
            switch (a.inputType) {
                case"text":
                case"email":
                case"select":
                    c = h.val();
                    break;
                case"checkbox":
                    var d = h.find("input:checked");
                    c = [], g(d, function (a, d) {
                        c.push(b(d).val())
                    })
            }
            return a.callback(c)
        }, a.show = !1, !a.title)throw new Error("prompt requires a title");
        if (!b.isFunction(a.callback))throw new Error("prompt requires a callback");
        if (!n.inputs[a.inputType])throw new Error("invalid prompt type");
        switch (h = b(n.inputs[a.inputType]), a.inputType) {
            case"text":
            case"email":
                h.val(a.value);
                break;
            case"select":
                var o = {};
                if (k = a.inputOptions || [], !k.length)throw new Error("prompt with select requires options");
                g(k, function (a, d) {
                    var e = h;
                    if (d.value === c || d.text === c)throw new Error("given options in wrong format");
                    d.group && (o[d.group] || (o[d.group] = b("<optgroup/>").attr("label", d.group)), e = o[d.group]), e.append("<option value='" + d.value + "'>" + d.text + "</option>")
                }), g(o, function (a, b) {
                    h.append(b)
                }), h.val(a.value);
                break;
            case"checkbox":
                var p = b.isArray(a.value) ? a.value : [a.value];
                if (k = a.inputOptions || [], !k.length)throw new Error("prompt with checkbox requires options");
                if (!k[0].value || !k[0].text)throw new Error("given options in wrong format");
                h = b("<div/>"), g(k, function (c, d) {
                    var e = b(n.inputs[a.inputType]);
                    e.find("input").attr("value", d.value), e.find("label").append(d.text), g(p, function (a, b) {
                        b === d.value && e.find("input").prop("checked", !0)
                    }), h.append(e)
                })
        }
        return a.placeholder && h.attr("placeholder", a.placeholder), f.append(h), f.on("submit", function (a) {
            a.preventDefault(), e.find(".btn-primary").click()
        }), e = q.dialog(a), e.off("shown.bs.modal"), e.on("shown.bs.modal", function () {
            h.focus()
        }), i === !0 && e.modal("show"), e
    }, q.dialog = function (a) {
        a = h(a);
        var c = b(n.dialog), d = c.find(".modal-body"), f = a.buttons, i = "", j = {onEscape: a.onEscape};
        if (g(f, function (a, b) {
            i += "<button data-bb-handler='" + a + "' type='button' class='btn " + b.className + "'>" + b.label + "</button>", j[a] = b.callback
        }), d.find(".bootbox-body").html(a.message), a.animate === !0 && c.addClass("fade"), a.className && c.addClass(a.className), a.title && d.before(n.header), a.closeButton) {
            var k = b(n.closeButton);
            a.title ? c.find(".modal-header").prepend(k) : k.css("margin-top", "-10px").prependTo(d)
        }
        return a.title && c.find(".modal-title").html(a.title), i.length && (d.after(n.footer), c.find(".modal-footer").html(i)), c.on("hidden.bs.modal", function (a) {
            a.target === this && c.remove()
        }), c.on("shown.bs.modal", function () {
            c.find(".btn-primary:first").focus()
        }), c.on("escape.close.bb", function (a) {
            j.onEscape && e(a, c, j.onEscape)
        }), c.on("click", ".modal-footer button", function (a) {
            var d = b(this).data("bb-handler");
            e(a, c, j[d])
        }), c.on("click", ".bootbox-close-button", function (a) {
            e(a, c, j.onEscape)
        }), c.on("keyup", function (a) {
            27 === a.which && c.trigger("escape.close.bb")
        }), o.append(c), c.modal({backdrop: a.backdrop, keyboard: !1, show: !1}), a.show && c.modal("show"), c
    }, q.setDefaults = function () {
        var a = {};
        2 === arguments.length ? a[arguments[0]] = arguments[1] : a = arguments[0], b.extend(p, a)
    }, q.hideAll = function () {
        b(".bootbox").modal("hide")
    };
    var r = {br: {OK: "OK", CANCEL: "Cancelar", CONFIRM: "Sim"}, da: {OK: "OK", CANCEL: "Annuller", CONFIRM: "Accepter"}, de: {OK: "OK", CANCEL: "Abbrechen", CONFIRM: "Akzeptieren"}, en: {OK: "OK", CANCEL: "Cancel", CONFIRM: "OK"}, es: {OK: "OK", CANCEL: "Cancelar", CONFIRM: "Aceptar"}, fi: {OK: "OK", CANCEL: "Peruuta", CONFIRM: "OK"}, fr: {OK: "OK", CANCEL: "Annuler", CONFIRM: "D'accord"}, it: {OK: "OK", CANCEL: "Annulla", CONFIRM: "Conferma"}, nl: {OK: "OK", CANCEL: "Annuleren", CONFIRM: "Accepteren"}, no: {OK: "OK", CANCEL: "Avbryt", CONFIRM: "OK"}, pl: {OK: "OK", CANCEL: "Anuluj", CONFIRM: "Potwierdź"}, ru: {OK: "OK", CANCEL: "Отмена", CONFIRM: "Применить"}, zh_CN: {OK: "OK", CANCEL: "取消", CONFIRM: "确认"}, zh_TW: {OK: "OK", CANCEL: "取消", CONFIRM: "確認"}};
    return q.init = function (c) {
        window.bootbox = a(c || b)
    }, q
}(window.jQuery);
var Dialog = {
    confirm: function (message,onOk,onCancel){
        var box = bootbox.dialog({
            message: message,
            title: "Confirm",
            onEscape:function(){
                if(onCancel){
                    onCancel();
                }
            },
            buttons: {
                danger: {
                    label: BUTTONS.CLOSE,
                    className: "btn-primary btn-cancel",
                    callback: function() {
                        if(onCancel){
                            onCancel();
                        }
                    }
                },
                main: {
                    label: BUTTONS.OK,
                    className: "btn-solidblue pull-left",
                    callback: function() {
                        if(onOk){
                            onOk(true);
                        }
                    }
                }
            }
        });
        box.find('.modal-title').addClass('modal-warning-title');
        box.find('.modal-footer .btn-cancel').removeClass('btn');
    },
    error : function(message,args){
        args = args?args:{};
        if(args.allowHtml !== true) {
            message = htmlEncode(message);
        }
        var box = bootbox.dialog({
            message: message,
            title: 'Error',
            onEscape:function(){},
            buttons: {
                success: {
                    label: BUTTONS.OK,
                    className: "btn-primary btn-solidblue pull-left",
                    callback: function() {
                        if(args.onOk){
                            args.onOk();
                        }
                    }
                }
            }
        });
        // Set error class on top(recent) modal
        box.find('.modal-title').addClass('modal-error-title');
    },
    success: function(message,onOk){
        var box = bootbox.dialog({
            message: message,
            title: 'Success',
            onEscape:function(){},
            buttons: {
                success: {
                    label: BUTTONS.OK,
                    className: "btn-solidblue pull-left",
                    callback: function() {
                        if(onOk){
                            onOk();
                        }
                    }
                }
            }
        });
        box.find('.modal-title');
    },
    alert : function(message,onOk){
        var box = bootbox.dialog({
            message: message,
            title: 'Alert',
            onEscape:function(){},
            buttons: {
                success: {
                    label: BUTTONS.OK,
                    className: "btn-primary btn-solidblue pull-left",
                    callback: function() {
                        if(onOk){
                            onOk();
                        }
                    }
                }
            }
        });

        // Set error class on top(recent) modal
        box.find('.modal-title').addClass('modal-error-title');
    },
    info : function(message,onOk,title){
        title = title ? title : "Information";
        bootbox.dialog({
            message: message,
            title: title,
            onEscape:function(){},
            buttons: {
                success: {
                    label: BUTTONS.OK,
                    className: "btn-solidblue pull-left",
                    callback: function() {
                        if(onOk){
                            onOk();
                        }
                    }
                }
            }
        });
    }
};


jQuery(document).ready(function () {
    jQuery('[data-toggle=offcanvas]').click(function () {
        jQuery('.row-offcanvas').toggleClass('active');
    });
});

/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.5.1
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011-2016 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/


(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
      return this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, data_content, shown_results, _i, _len, _ref;
      content = '';
      shown_results = 0;
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        data_content = '';
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== '') {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.search_text;
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      zregex = new RegExp(escapedSearchText, 'i');
      regex = this.get_search_regex(escapedSearchText);
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          option.search_text = option.group ? option.label : option.html;
          if (!(option.group && !this.group_search)) {
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_anchor;
      regex_anchor = this.search_contains ? "" : "^";
      return new RegExp(regex_anchor + escaped_search_string, 'i');
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
        case 18:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      var _this = this;
      return setTimeout((function() {
        return _this.results_search();
      }), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      if (/IEMobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Windows Phone/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/BlackBerry/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/BB10/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy') {
          if (chosen instanceof Chosen) {
            chosen.destroy();
          }
          return;
        }
        if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('touchstart.chosen', function(evt) {
        _this.container_mousedown(evt);
        return evt.preventDefault();
      });
      this.container.bind('touchend.chosen', function(evt) {
        _this.container_mouseup(evt);
        return evt.preventDefault();
      });
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.form_field_jq.bind("chosen:close.chosen", function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      this.search_field.bind('cut.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      this.search_field.bind('paste.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          "style": 'color: rgb(102, 102, 102)',
          'data-option-array-index': item.array_index,
          'html' :'<i class="fa fa-times"></i>'
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target).parent());
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.show_search_field_default();
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      return $('<div/>').text($.trim(this.search_field.val())).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);

//= require common.js
//= require /js/layout/constants.js
//= require /js/layout/messages.js
//= require /js/layout/main.js
//= require /js/common/jquery/jquery.numeric.js
//= require /js/common/bootbox.min.js
//= require /js/layout/dialog.js
//= require /js/layout/offcanvas.js
//= require /js/layout/chosen.jquery.js
