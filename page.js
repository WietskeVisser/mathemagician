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
		return _.find(courses(), function(course) {
			return pageId === course.id;
		});
	}
	return null;
};

var playlistItemsAndVideoItemsToVideos = function(playlistItems, videoItems) {
	var durationMap = new Map();
	for (var i = 0; i < videoItems.length; i++) {
		durationMap.set(videoItems[i].id, moment.duration(videoItems[i].contentDetails.duration));
	}
	return _.map(playlistItems, function(playlistItem) {
		var id = playlistItem.snippet.resourceId.videoId;
		var duration = durationMap.get(id);
		return {
			id: id,
			title: playlistItem.snippet.title,
			duration: duration ? duration.minutes() + ':' + ('0' + duration.seconds()).slice(-2) : null
		};
	});
};

var playlistItemsToVideos = function(playlistItems) {
	return _.map(playlistItems, function(playlistItem) {
		return {
			id: playlistItem.snippet.resourceId.videoId,
			title: playlistItem.snippet.title
		};
	});
};

var searchResultsToVideos = function(searchResults) {
	return _.map(searchResults, function(searchResult) {
		return {
			id: searchResult.id.videoId,
			title: searchResult.snippet.title
		};
	});
};

var PlaylistViewModel = function(playlistData) {
	var self = this;
	self.id = playlistData.id;
	self.name = playlistData.name;
	self.videos = ko.observableArray([]);
	self.loaded = ko.observable(false);
	self.loadingFailed = ko.observable(false);
};

var CourseViewModel = function(courseData) {
	var self = this;
	self.id = courseData.id;
	self.name = courseData.name;
	self.intro = courseData.intro;
	var playlistModels = _.map(courseData.playlists, function(playlist) {
		return new PlaylistViewModel(playlist);
	});
	self.playlists = ko.observableArray(playlistModels);
};

var ViewModel = function(data) {
	var self = this;
	var courseModels = _.map(data.courses, function(course) {
		return new CourseViewModel(course);
	});
	self.courses = ko.observableArray(courseModels);
	self.pageId = getUrlParameter('page');
	self.selectedCourse = getCourseByPageId(self.courses, self.pageId);
	self.selectedVideo = ko.observable({id: null, title: null});
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
	self.loadPlaylistItems = function(playlist) {
		if (playlist.loaded() && !playlist.loadingFailed()) {
			return;
		}
		$.get('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyAPXWUiss6_gZDIEkxTaibPNLs_16Eqdf4&part=snippet&fields=items/snippet(title,resourceId/videoId)&maxResults=50&playlistId=' + playlist.id)
			.done(function(playlistItemsResponse) {
				var videoIds = _.map(playlistItemsResponse.items, function(playlistItem) { return playlistItem.snippet.resourceId.videoId; }).join();
				$.get('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAPXWUiss6_gZDIEkxTaibPNLs_16Eqdf4&part=contentDetails,snippet&fields=items(id,contentDetails/duration)&id=' + videoIds)
					.done(function(videosResponse) {
						playlist.videos(playlistItemsAndVideoItemsToVideos(playlistItemsResponse.items, videosResponse.items));
					})
					.fail(function(videosResponse) {
						playlist.videos(playlistItemsToVideos(playlistItemsResponse.items));
					});
			})
			.fail(function(playlistItemsResponse) {
				playlist.loadingFailed(true);
			})
			.always(function(playlistItemsResponse) {
				playlist.loaded(true);
			});
	};
	self.showVideo = function(video) {
		self.selectedVideo(video);
		$('#videoPopup').modal('show');
	};
	self.doSearch = function(urlExtension) {
		$.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyAPXWUiss6_gZDIEkxTaibPNLs_16Eqdf4&channelId=UCEjpRpZSjy6mkwKqzeTeVrQ&type=video&part=snippet&fields=nextPageToken,prevPageToken,items(id/videoId,snippet/title)&maxResults=10&q=' + encodeURIComponent(self.submittedSearchQuery()) + urlExtension)
			.done(function(response) {
				self.searchFailed(false);
				self.searchResults(searchResultsToVideos(response.items));
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
