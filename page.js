var getUrlParameter = function(parameterKey) {
	var parameters = decodeURIComponent(window.location.search.substring(1)).split('&');
	for (var parameter of parameters) {
		parameterKeyValue = parameter.split('=');
		if (parameterKeyValue[0] === parameterKey) {
			return parameterKeyValue[1];
		}
	}
	return null;
};

var getCourseByPageId = function(courses, pageId) {
	if (pageId) {
		for (var course of courses) {
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
	self.selectedCourse = getCourseByPageId(self.courses, getUrlParameter('page'));
};

document.addEventListener('DOMContentLoaded', function() {
	ko.applyBindings(new ViewModel(window.data));
});
