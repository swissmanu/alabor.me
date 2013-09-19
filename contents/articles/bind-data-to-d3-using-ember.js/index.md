---
title: Bind Data to D3 using Ember.js
author: manuel-alabor
date: 2012-09-13 10:09
template: article.jade
---

When I started with [Ember.js](http://emberjs.com/) lately I fell in love with its data binding quickly. Tinkering with some ideas here and there I wanted to display numerical values within a line chart. After a short research I decided to use the mighty [D3 (Data Driven Documents)](http://d3js.org/) library for creating an [SVG](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics)-based chart.

<span class="more"></span>

Merging two different programming frameworks is usually not the easiest task. Thankfully *Ember.js* provides a relatively easy API for doing such things and with [ember-visualizations](https://github.com/cmeiklejohn/ember-visualizations) by Christopher Meiklejohn there is already a good example how to integrate *D3* into it.

Unfortunately this solution has one big drawback: If data in the models changes, *ember-visualizations* replaces the already rendered chart completely instead of only updating its underlying data.
Further is this behavior a game breaker if you want to animate the changes inside your chart.

### Another Approach
My solution is obviously simple: When observing the change of a model, I don't remove the complete chart anymore. Instead I just take the newest data, inject it with the ``.data()`` method and update all necessary chart components:

```javascript
function updateChart() {
	var content = this.get('content');
	var chart = this.get('chart');
	var line = this.get('line');

	chart.selectAll('path.line')
		.data(content)  // inject
		.transition()
		.duration(500)
		.ease('sin')
		.attr('d', line(content));  // update line
}.observes('content.@each.value')
```

### Test Drive
You find a sample implementation in the following *jsFiddle*. Go straight to *Result* and click *Generate new Values* to see the smooth animated changes in the chart.
Feel free to play with the parameters or contribute to my raw implementation.

<iframe class="jsfiddle" style="border: 1px solid #EEE; width: 100%; height: 405px" src="http://jsfiddle.net/2UPLp/16/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>