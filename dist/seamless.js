(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"), require("waypoints"));
	else if(typeof define === 'function' && define.amd)
		define("Seamless", ["jQuery", "waypoints"], factory);
	else if(typeof exports === 'object')
		exports["Seamless"] = factory(require("jQuery"), require("waypoints"));
	else
		root["Seamless"] = factory(root["jQuery"], root["waypoints"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE_jquery__, __WEBPACK_EXTERNAL_MODULE_waypoints__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/seamless.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/seamless.js":
/*!*************************!*\
  !*** ./src/seamless.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _this2 = this;

var $ = __webpack_require__(/*! jquery */ "jquery");

var Waypoint = __webpack_require__(/*! waypoints */ "waypoints");
/**
 * Seamless.
 *
 * @constructor
 *
 * @param {Object} config
 */


function Seamless(config) {
  this.config = $.extend(true, {}, this.defaults, config);
  this.cycle = 0;
  this.items = [];
  this.$container = $(this.config.containerSelector);
  this.template = this.config.compileTemplate(this.config.template);
}
/**
 * Default configuration.
 *
 * @type {Object}
 */


Seamless.prototype.defaults = {
  containerSelector: '.container',
  itemSelector: '.item',
  triggerSelector: '.item:last',
  triggerOffset: 'bottom-in-view',
  loadingClass: 'is-loading',
  template: '',
  compileTemplate: function compileTemplate(html) {
    return html;
  },
  renderTemplate: function renderTemplate(template, data) {},
  onAppend: function onAppend($element) {},
  request: {
    paged: false,
    offsetParam: 'offset',
    offset: 0,
    limitParam: 'limit',
    limit: 10
  },
  filterResponse: function filterResponse(response) {
    return response;
  },
  dripFeed: false,
  prefetch: false,
  appendOnPrefetch: false,
  trackItemTransitions: true,
  itemTransitionOffset: '50%',
  onItemTransition: function onItemTransition(current, next, direction) {}
};
/**
 * Initialize.
 */

Seamless.prototype.init = function () {
  // If item tracking is selected, bind tracking to any existing items.
  if (_this2.config.trackItemTransitions) {
    _this2.trackItemTransitions($(_this2.config.itemSelector));
  } // If prefetch and append is selected, load the first items and return
  // to avoid adding extraneous Waypoints. loadItems() will make sure
  // they're added anyway.


  if (_this2.config.prefetch && _this2.config.appendOnPrefetch) {
    _this2.loadItems();

    return;
  } // If prefetch is selected, preload some items into the items cache.


  if (_this2.config.prefetch) {
    _this2.getItems();
  } // Start tracking when new items should be loaded.


  _this2.trackLoadNewItems();
};
/**
 * Bind a Waypoint to all elements that match the trigger selector.
 * That allows the script to load new items when the triggerOffset is
 * satisfied by the trigger element (usually when the trigger element gets
 * in view).
 */


Seamless.prototype.trackLoadNewItems = function () {
  var _this = _this2;
  new Waypoint({
    element: _this2.config.triggerSelector,
    group: 'load_items',
    handler: function handler() {
      // This Waypoint's job is done and it must be deleted before
      // loadItems() is called. That prevents loadItems() from being
      // fired multiple times as new items are appended to the
      // container and the trigger element gets in view.
      _this2.destroy();

      _this.loadItems();
    },
    offset: _this2.config.triggerOffset
  });
};
/**
 * Track when individual items get into and out of view as the user scrolls.
 *
 * The onItemTransition callback allows us to attach transition-related
 * functionality, like updating the window location and title, sending
 * analytics events, updating sharing buttons etc.
 *
 * @param $item
 */


Seamless.prototype.trackItemTransitions = function ($item) {
  var _this = _this2;
  new Waypoint({
    element: $item.get(0),
    group: 'item_transitions',
    handler: function handler(direction) {
      var from = direction === 'down' ? _this2.previous() : _this2;
      var to = direction === 'down' ? _this2 : _this2.previous();
      var fromElement = from ? from.element : null;
      var toElement = to ? to.element : null;

      _this.config.onItemTransition(fromElement, toElement, direction);
    },
    offset: _this2.config.itemTransitionOffset
  });
};
/**
 * This is the core of the infinite-loading mechanism:
 * It gets a list of items and passes them for appendage to the container.
 *
 * Once that's done, it makes sure that new Waypoints are created so that
 * this process can be repeated when they are triggered.
 */


Seamless.prototype.loadItems = function () {
  console.log('loading..');
  var _this = _this2;

  _this2.$container.addClass(_this2.config.loadingClass);

  _this2.getItems(function (items) {
    if (items.length > 0) {
      _this.append(items);

      _this.trackLoadNewItems();
    }

    _this.$container.removeClass(_this.config.loadingClass);

    _this.cycle++;
  });
};
/**
 * Resolve the items that must be loaded/appended during this cycle and
 * then execute a callback (optional).
 *
 * If no items are found in the items cache, remoteGet() is called to fetch
 * some.
 *
 * If items do exist in the items cache and drip-feed is selected, then a
 * single item is included in the returned list (the one that corresponds to
 * the current cycle).
 *
 * If items do exist and drip-feeding is not selected, then they are all
 * included in the returned list and the cache is cleared to trigger a new
 * remote request the next time items are requested.
 *
 * @param {Function} onResolveCallback
 * @returns {Array}
 */


Seamless.prototype.getItems = function (onResolveCallback) {
  console.log('getting...');
  var _this = _this2;

  var resolveCycleItems = function resolveCycleItems(callback) {
    var items;
    callback = callback || $.noop; // If we're drip-feeding, get the right item for the current cycle.

    if (_this.config.dripFeed) {
      console.log('drip feeding...');
      items = _this.items.length > _this.cycle ? [_this.items[_this.cycle]] : [];
    } // Not drip-feeding? Get them all and clear the cache.
    else {
        console.log('clearing');
        items = _this.items;
        _this.items = [];
      }

    callback(items);
  }; // If no items exist, let's fetch some and then resolve the cycle items.


  if (_this2.items.length === 0) {
    _this2.remoteGet(function () {
      resolveCycleItems(onResolveCallback);
    });
  } // Items already cached? Just resolve the cycle items.
  else {
      resolveCycleItems(onResolveCallback);
    }
};
/**
 * Perform an asynchronous request to fill the items cache with a batch of
 * items.
 *
 * If the response is successful, it is passed through a filter that allows
 * us to modify its contents in order to extract and return an actual array
 * of data that represent the items that will be appended to the container.
 *
 * When the process is completed, an optional provided callback can be
 * executed.
 *
 * @param {Function} callback
 * @returns {Array}
 */


Seamless.prototype.remoteGet = function (callback) {
  console.log('remote getting...');
  var _this = _this2;
  var items = [];
  var filter = _this2.config.filterResponse;
  var request = $.extend(true, {}, _this2.config.request);
  callback = callback || $.noop; // Enforce pagination settings.

  if (_this2.config.request.paged) {
    request.data = request.data || {};
    request.data[_this2.config.request.offsetParam] = _this2.cycle * _this2.config.request.limit + _this2.config.request.offset;
    request.data[_this2.config.request.limitParam] = _this2.config.request.limit;
  } // Enforce the success callback to extract items data from the response.


  request.success = function (response) {
    items = filter(response);
  }; // Enforce the complete callback to fill the items cache and execute a
  // given callback;


  request.complete = [];
  request.complete.push(function () {
    _this.items = items;
  });
  request.complete.push(callback); // Perform the actual request.

  $.ajax(request);
};
/**
 * Append a list of items to the container.
 *
 * At this point, the data have been resolved and they are fed to the
 * rendering callback, one at a time.
 * Each render result is then appended to the container.
 *
 * @param {Array} items
 */


Seamless.prototype.append = function (items) {
  console.log('appending...');

  if (items.length > 0) {
    for (var i = 0; i < items.length; i++) {
      var $element = $(_this2.config.renderTemplate(_this2.template, items[i]));

      _this2.$container.append($element);

      _this2.config.onAppend($element);

      if (_this2.config.trackItemTransitions) {
        _this2.trackItemTransitions($element);
      }
    }
  }
};
/**
 * Provide Seamless.
 *
 * @type {Seamless}
 */


module.exports = Seamless;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ }),

/***/ "waypoints":
/*!****************************!*\
  !*** external "waypoints" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_waypoints__;

/***/ })

/******/ });
});
//# sourceMappingURL=seamless.js.map