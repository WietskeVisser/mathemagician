var data = {
	courses: [
		{
			name: "Linear Algebra",
			playlists: [
				{
					name: "Linear Algebra - vectors, lines and planes",
					id: "PLJMXXdEk8kMDKHXfYZycypaK2VFsQo25T"
				},
				{
					name: "Linear Algebra - systems of linear equations",
					id: "PLJMXXdEk8kMBCcedEI8B13tdYBGCnUISg"
				}
			]
		},
		{
			name: "Calculus",
			playlists: [
				{
					name: "Calculus - introduction to functions",
					id: "PLJMXXdEk8kMD27qyxFL_d7Slkk0NpBAlh"
				},
				{
					name: "Calculus - limits and continuity",
					id: "PLJMXXdEk8kMDno0Eq0Ph7L7zOtNgYMqQn"
				}
			]
		},
		{
			name: "Complex Analysis",
			playlists: [
				{
					name: "Complex Analysis - Introduction and Topology",
					id: "PLJMXXdEk8kMBklpaHrBjQaKaCI2Vfxy7h"
				},
				{
					name: "Complex Analysis - Elementary functions",
					id: "PLJMXXdEk8kMDETr7WetPdqF9GbQud6jDd"
				}
			]
		},
		{
			name: "Miscellaneous",
			playlists: [
				{
					name: "Algebra - factorization of polynomials",
					id: "PLJMXXdEk8kMDQowCiEe6JiRVODuMILx6X"
				},
				{
					name: "General mathematical background",
					id: "PLJMXXdEk8kMB2EjGXI3xkIuu1QNbbVhkw"
				}
			]
		}
	]
};

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
	ko.applyBindings(new ViewModel(data));
});


