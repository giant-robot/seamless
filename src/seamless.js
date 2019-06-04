'use strict';
const $ = require('jquery');
const Waypoint = require('waypoints/src/waypoint');


/**
 * Seamless.
 *
 * @constructor
 *
 * @param {Object} config
 */
function Seamless(config) {

    if (!checkForDependencies()) {
        return;
    }
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
    compileTemplate: function (html) {
        return html;
    },
    renderTemplate: function (template, data) {
    },
    onAppend: function ($element) {
    },
    request: {
        paged: false,
        offsetParam: 'offset',
        offset: 0,
        limitParam: 'limit',
        limit: 10
    },
    filterResponse: function (response) {
        return response;
    },
    dripFeed: false,
    prefetch: false,
    appendOnPrefetch: false,
    trackItemTransitions: true,
    itemTransitionOffset: '50%',
    onItemTransition: function (current, next, direction) {
    }
};

/**
 * Initialize.
 */
Seamless.prototype.init = function () {

    // If item tracking is selected, bind tracking to any existing items.
    if (this.config.trackItemTransitions) {
        this.trackItemTransitions($(this.config.itemSelector));
    }

    // If prefetch and append is selected, load the first items and return
    // to avoid adding extraneous Waypoints. loadItems() will make sure
    // they're added anyway.
    if (this.config.prefetch && this.config.appendOnPrefetch) {
        this.loadItems();
        return;
    }

    // If prefetch is selected, preload some items into the items cache.
    if (this.config.prefetch) {
        this.getItems();
    }

    // Start tracking when new items should be loaded.
    this.trackLoadNewItems();
};

/**
 * Bind a Waypoint to all elements that match the trigger selector.
 * That allows the script to load new items when the triggerOffset is
 * satisfied by the trigger element (usually when the trigger element gets
 * in view).
 */
Seamless.prototype.trackLoadNewItems = function () {

    var _this = this;
    new Waypoint({
        element: document.querySelector(this.config.triggerSelector),
        group: 'load_items',
        handler: function () {
            // This Waypoint's job is done and it must be deleted before
            // loadItems() is called. That prevents loadItems() from being
            // fired multiple times as new items are appended to the
            // container and the trigger element gets in view.
            this.destroy();
            _this.loadItems();
        },
        offset: this.config.triggerOffset
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

    var _this = this;


    new Waypoint({
        element: $item.get(0),
        group: 'item_transitions',
        handler: function (direction) {
            var from = (direction === 'down') ? this.previous() : this;
            var to = (direction === 'down') ? this : this.previous();
            var fromElement = from ? from.element : null;
            var toElement = to ? to.element : null;
            _this.config.onItemTransition(fromElement, toElement, direction);
        },
        offset: this.config.itemTransitionOffset
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

    var _this = this;
    this.$container.addClass(this.config.loadingClass);

    this.getItems(function (items) {

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

    var _this = this;

    function resolveCycleItems(callback) {
        var items;
        callback = callback || $.noop;

        // If we're drip-feeding, get the right item for the current cycle.
        if (_this.config.dripFeed) {
            console.log('drip feeding...');
            items = (_this.items.length > _this.cycle) ? [_this.items[_this.cycle]] : [];
        }
        // Not drip-feeding? Get them all and clear the cache.
        else {
            console.log('clearing');
            items = _this.items;
            _this.items = [];
        }

        callback(items);
    }

    // If no items exist, let's fetch some and then resolve the cycle items.
    if (this.items.length === 0) {
        this.remoteGet(function () {
            resolveCycleItems(onResolveCallback);
        });
    }
    // Items already cached? Just resolve the cycle items.
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

    var _this = this;
    var items = [];
    var filter = this.config.filterResponse;
    var request = $.extend(true, {}, this.config.request);
    callback = callback || $.noop;

    // Enforce pagination settings.
    if (this.config.request.paged) {
        request.data = request.data || {};
        request.data[this.config.request.offsetParam] = (this.cycle * this.config.request.limit) + this.config.request.offset;
        request.data[this.config.request.limitParam] = this.config.request.limit;
    }

    // Enforce the success callback to extract items data from the response.
    request.success = function (response) {
        items = filter(response);
    };

    // Enforce the complete callback to fill the items cache and execute a
    // given callback;
    request.complete = [];
    request.complete.push(function () {
        _this.items = items;
    });
    request.complete.push(callback);

    // Perform the actual request.
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
            var $element = $(this.config.renderTemplate(this.template, items[i]));
            this.$container.append($element);
            this.config.onAppend($element);

            if (this.config.trackItemTransitions) {
                this.trackItemTransitions($element);
            }
        }
    }
};

const checkForDependencies = function() {
    /**
     * Let's check for dependencies!
     */

    if (typeof $ === 'undefined' && 'console' in window) {
        window.console.info('Seamless needs jQuery.');
        return false;
    }

    if (typeof Waypoint === 'undefined' && 'console' in window) {
        window.console.info('Seamless needs Waypoints.');
        return false;
    }
    return true;
};

/**
 * Register Seamless globally.
 *
 * @type {Seamless}
 */

module.exports = Seamless;


