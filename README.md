#Introductions

Seamless is an infinite loading script based on the excellent [Waypoints](https://github.com/imakewebthings/waypoints) library. 

It is simple, sensible, completely customizable and your mom will approve!

##Installation

Seamless requires [jQuery](http://jquery.com/download/) and [Waypoints](https://github.com/imakewebthings/waypoints).

As soon you've got those down, you can manually grab the [latest release](https://github.com/giant-robot/seamless/releases/latest) or install using bower:

`bower install giant-seamless`

You can then include `dist/seamless.min.js` and start cracking.


##Usage
You start by creating instances of the globally exposed class `Seamless`:

```js
var infiniteScroller = new Seamless(options);
```

and "initialize" these instances when you fancy:

```js
infiniteScroller.init();
```

###Options

When you're creating a new instance, you can define its options in the form of a JavaScript object.

**containerSelector** `String` `default: '.container'`

Α selector that matches the container(s) for the items that will be infinite-loaded.

**itemSelector** `String` `default: '.item'`

Α selector that matches each infinite-loaded item.

**triggerSelector** `String` `default: '.item:last'`

A selector that matches the trigger element (ie, the element whose position is tracked in order to trigger the loading mechanism).

**triggerOffset** `String` `default: 'bottom-in-view'`

The trigger element's offset at which the loading mechanism is invoked. This is passed directly to Waypoints, so take a look at the [Waypoints offset documentation](http://imakewebthings.com/waypoints/api/offset-option/) for possible values.

**loadingClass** `String` `default: 'is-loading'`

A class that will be added to the items container while Seamless is loading new items.

**request** `Object`

A configuration object for the AJAX request that will be issued to fetch items. It accepts all of the settings available to [jQuery.ajax()](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings), plus a few of our own that can be used to control pagination:

```js
{
	paged: false,          // Should each request get a page of results?
	offsetParam: 'offset', // Name of the offset parameter.
	offset: 0,             // Initial offset value.
	limitParam: 'limit',   // Name of the limit parameter.
	limit: 10              // Number of items returned with each request.
}
```

By default `request.paged` is set to `false`, so Seamless will not send any pagination parameters. 

If you set it to `true`, the pagination parameters will be sent with every request and the value of the `offset` parameter will be increased by the value of `request.limit` each time a new request is issued.

In case you're wondering, this is where you define the URL to fetch items from.

**filterResponse** `Function`

A callback that is fired right after the server responds to the AJAX request, giving you the opportunity to filter/manipulate the response as needed.

Here is the default, which returns the response intact:

```js
filterResponse: function(response) {
    return response;
}
```

**template** `String` `default: ''`

The template to use for each of the loaded items. Usually that's a string containing template markup with placeholders and whatnot.

**compileTemplate** `Function`

A callback that allows you to compile the template before actually rendering it. It is fired once, the first time an item is loaded.

The default simply returns the template string:

```js
compileTemplate: function(template) {
    return template;
}
```

And this is how you would complile an Underscore.js template:

```js
compileTemplate: function(template) {
    return _.template(template);
}
```

(That's *a lot* of templates, right?)

**renderTemplate** `Function` `default: $.noop()`

A callback used to render the template for an item. It is passed two parameters:

* The compiled template, as returned by the `compileTemplate` callback.
* The data to render the template with, as returned by the `filterResponse` callback.

For example, this is how you would render an Underscore.js template:

```js
renderTemplate: function(template, data) {
    return template(data);
}
```

**onAppend** `Function` `default: $.noop()`

A callback to execute right after an item is appended to the container. `this` is the Seamless instance. A jQuery object for the appended element is passed as a parameter to the callback.

For example, this is how you would set your browser on fire:

```js
onAppend: function($element) {
	$element.hide();
}
```

**dripFeed** `Boolean` `default: false`

If the issued request returns more than one items, the `dripFeed` setting allows you to control if they will be appended one-by-one or all-at-once.

This allows you to get multiple items with one request and still show them one at a time.

**prefetch** `Boolean` `default: false`

Whether to issue a request to load items as soon as the Seamless instance is initialized. 

Rememeber: this will fetch the items from the server but *will not* append them. If you'd like that to happen, read on.

**appendOnPrefetch** `Boolean` `default: false`

Essentially appends prefetched items as soon as they are received. The `dripFeed` setting is honoured here so, if it is set to `true`, a single item will be appended.

**trackItemTransitions** `Boolean` `default: true`

Whether to track which items come into/outof view while scrolling. This is very useful if you want to manipulate the browser history, for example.

**onItemTransition** `Function`

A callback to execute when an item transition occurs. `this` is the seamless instance. The callback is passed 3 parameters (in that exact order):

* The DOM element of the item that was in view before the transition occured.
* The DOM element of the item that came into view when the transition occured.
* The scrolling direction that caused the transition (`up`|`down`).

Here is an (oversimplified) example of how you'd use `onItemTransition` to update the browser's history each time a user scrolls between items:

```js
{
	trackItemTransitions: true,
	onItemTransition: function(from, to, direction) {
		// Let's just assume that every item's DOM element 
		// has the item's title and url attached to its data.
		history.pushState('', ' ', to.dataset.url);
		document.title = to.dataset.title;
	}
}
```

**itemTransitionOffset** `String` `default: '50%'`

The offset at which the transition callback is triggered. Again, take a look at the [Waypoints offset documentation](http://imakewebthings.com/waypoints/api/offset-option/) for possible values.



###Methods

**init()**  
When an instance is created, it is in stand-by mode; no bindings to DOM elements or events are actually made (ie, no side-effects).

In order for the magic to happen, you have to explicitly "initialize" it, by calling `init()` on your Seamless instance of choice.

##Examples

If you haven't gotten the picture already, here is an example to get you started.

**Page markup**

```html
<div class="posts">
	<br class="trigger">
</div>

<!-- This is an Underscore.js template. -->
<script type="text/html" id="template">
	<article class="post" data-title="<%= title %>">
		<h2><%= title %></h2>
		<%= body %>
	</article>
</script>
```

**Server response**

```json
{
	status: 'success',
	items: [
		{
			title: '',
			body:  '...',
			url:   'http://example.com/'
		},
		{
			title: '',
			body:  '...',
			url:   'http://example.com/'
		},
		{
			title: '',
			body:  '...',
			url:   'http://example.com/'
		}
	]
}
```

**Seamless**

```js
var infiniteScroller = new Seamless({
	containerSelector: '.posts',
	itemSelector:      '.post',
	triggerSelector:   '.trigger',
	triggerOffset:     '100%',
	request: {
		url: '//url.to/server'
	},
	filterResponse: function(response) {
		return response.items;
	},
	// Underscore.js templates used.
	template: $('#template').text(),
	compileTemplate: function(str) {
		return _.template(str);
	},
	renderTemplate: function(template, data) {
		return template(data);
	},
	// Change the title on the browser tab each time a transition is made.
	trackItemTransitions: true,
	onItemTransition: function(fromElement, toElement, direction) {
		if (toElement)
		{
			document.title = to.dataset.title;
		}
	}
});

infiniteScroller.init();
```