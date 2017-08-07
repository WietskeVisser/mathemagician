"use strict";

var getUrlParameter = function(parameterKey) {
	var parameters = decodeURIComponent(window.location.search.substring(1)).split('&');
	for (var i = 0; i < parameters.length; i++) {
		var parameterKeyValue = parameters[i].split('=');
		if (parameterKeyValue[0] === parameterKey) {
			return parameterKeyValue[1];
		}
	}
	return null;
};

var getCourseByPageId = function(courses, pageId) {
	if (pageId) {
		for (var i = 0; i < courses.length; i++) {
			var course = courses[i];
			if (pageId === course.pageId) {
				return course;
			}
		}
	}
	return null;
};

var ViewModel = function(data) {
	var self = this;
	self.courses = data.courses;
	self.pageId = getUrlParameter('page');
	self.selectedCourse = getCourseByPageId(self.courses, self.pageId);
	self.searchQuery = ko.observable(null);
	self.submittedSearchQuery = ko.observable(null);
	self.searched = ko.observable(false);
	self.searchResults = ko.observableArray([]);
	self.nextPageToken = ko.observable(null);
	self.previousPageToken = ko.observable(null);
	self.searchFailed = ko.observable(false);
	self.invalidSearchQuery = ko.computed(function() {
		return !self.searchQuery() || !self.searchQuery().trim();
	});
	self.doSearch = function(urlExtension) {
		$.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyAPXWUiss6_gZDIEkxTaibPNLs_16Eqdf4&channelId=UCEjpRpZSjy6mkwKqzeTeVrQ&type=video&part=snippet&fields=nextPageToken,prevPageToken,pageInfo,items(id/videoId,snippet/title)&maxResults=10&q=' + encodeURIComponent(self.submittedSearchQuery()) + urlExtension)
			.done(function(response) {
				self.searchFailed(false);
				self.searchResults(response.items);
				self.nextPageToken(response.nextPageToken);
				self.previousPageToken(response.prevPageToken);
			})
			.fail(function(response) {
				self.searchFailed(true);
				self.searchResults([]);
				self.nextPageToken(null);
				self.previousPageToken(null);
			})
			.always(function(response) {
				self.searched(true);
			});
	};
	self.search = function() {
		if (self.invalidSearchQuery()) {
			return;
		}
		var query = self.searchQuery().trim();
		self.submittedSearchQuery(query);
		self.doSearch('');
	};
	self.previousPage = function() {
		if (self.previousPageToken()) {
			self.doSearch('&pageToken=' + self.previousPageToken());
		}
	};
	self.nextPage = function() {
		if (self.nextPageToken()) {
			self.doSearch('&pageToken=' + self.nextPageToken());
		}
	};
};

document.addEventListener('DOMContentLoaded', function() {
	ko.applyBindings(new ViewModel(window.data));
	$('.ui.accordion').accordion();
});
