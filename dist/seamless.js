!function($) {
    "use strict";
    function Seamless(config) {
        this.config = $.extend(!0, {}, this.defaults, config), this.cycle = 0, this.items = [], 
        this.$container = $(this.config.containerSelector), this.template = this.config.compileTemplate(this.config.template);
    }
    return "undefined" == typeof $ && "console" in window ? window.console.info("Seamless needs jQuery.") : "undefined" == typeof $.fn.waypoint && "console" in window ? window.console.info("Seamless needs jQuery.Waypoints.") : (Seamless.prototype.defaults = {
        containerSelector: ".container",
        itemSelector: ".item",
        triggerSelector: ".item:last",
        triggerOffset: "bottom-in-view",
        loadingClass: "is-loading",
        template: "",
        compileTemplate: function(html) {
            return html;
        },
        renderTemplate: function(template, data) {},
        onAppend: function($element) {},
        onComplete: function(cycle, $elements) {},
        request: {
            paged: !1,
            offsetParam: "offset",
            offset: 0,
            limitParam: "limit",
            limit: 10
        },
        filterResponse: function(response) {
            return response;
        },
        dripFeed: !1,
        prefetch: !1,
        appendOnPrefetch: !1,
        trackItemTransitions: !0,
        itemTransitionOffset: "50%",
        onItemTransition: function(current, next, direction) {}
    }, Seamless.prototype.init = function() {
        return this.config.trackItemTransitions && this.trackItemTransitions($(this.config.itemSelector)), 
        this.config.prefetch && this.config.appendOnPrefetch ? void this.loadItems() : (this.config.prefetch && this.getItems(), 
        void this.trackLoadNewItems());
    }, Seamless.prototype.trackLoadNewItems = function() {
        var _this = this;
        $(this.config.triggerSelector).waypoint({
            group: "load_items",
            handler: function() {
                this.destroy(), _this.loadItems();
            },
            offset: this.config.triggerOffset
        });
    }, Seamless.prototype.trackItemTransitions = function($item) {
        var _this = this;
        $item.filter(this.config.itemSelector).waypoint({
            group: "item_transitions",
            handler: function(direction) {
                var from = "down" === direction ? this.previous() : this, to = "down" === direction ? this : this.previous(), fromElement = from ? from.element : null, toElement = to ? to.element : null;
                _this.config.onItemTransition(fromElement, toElement, direction);
            },
            offset: this.config.itemTransitionOffset
        });
    }, Seamless.prototype.loadItems = function() {
        var _this = this;
        this.$container.addClass(this.config.loadingClass), this.getItems(function(items) {
            var elements = [];
            items.length > 0 && (elements = _this.append(items), _this.trackLoadNewItems()), 
            _this.config.onComplete(_this.cycle, $(elements)), _this.$container.removeClass(_this.config.loadingClass), 
            _this.cycle++;
        });
    }, Seamless.prototype.getItems = function(onResolveCallback) {
        function resolveCycleItems(callback) {
            var items;
            callback = callback || $.noop, _this.config.dripFeed ? items = _this.items.length > _this.cycle ? [ _this.items[_this.cycle] ] : [] : (items = _this.items, 
            _this.items = []), callback(items);
        }
        var _this = this;
        0 === this.items.length ? this.remoteGet(function() {
            resolveCycleItems(onResolveCallback);
        }) : resolveCycleItems(onResolveCallback);
    }, Seamless.prototype.remoteGet = function(callback) {
        var _this = this, items = [], filter = this.config.filterResponse, request = $.extend(!0, {}, this.config.request);
        callback = callback || $.noop, this.config.request.paged && (request.data = request.data || {}, 
        request.data[this.config.request.offsetParam] = this.cycle * this.config.request.limit + this.config.request.offset, 
        request.data[this.config.request.limitParam] = this.config.request.limit), request.success = function(response) {
            items = filter(response);
        }, request.complete = [], request.complete.push(function() {
            _this.items = items;
        }), request.complete.push(callback), $.ajax(request);
    }, Seamless.prototype.append = function(items) {
        var elements = [];
        if (items.length > 0) for (var i = 0; i < items.length; i++) {
            var $element = $(this.config.renderTemplate(this.template, items[i]));
            this.$container.append($element), this.config.onAppend($element), this.config.trackItemTransitions && this.trackItemTransitions($element), 
            elements.push($element);
        }
        return elements;
    }, void (window.Seamless = Seamless));
}(jQuery);