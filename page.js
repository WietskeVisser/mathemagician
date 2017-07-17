var ViewModel = function(data) {
	var self = this;
	self.courses = ko.observableArray(data.courses);
	self.selectedCourse = ko.observable(null);
	
	self.selectHome = function() {
		self.selectedCourse(null);
	}
	
	self.selectCourse = function(course) {
		self.selectedCourse(course);
	};
};

document.addEventListener('DOMContentLoaded', function() {
	ko.applyBindings(new ViewModel(window.data));
});
