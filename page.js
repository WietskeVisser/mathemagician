var data = {
	courses: [
		{
			name: "Linear Algebra",
			intro: "<p>These web lectures cover most topics of Linear Algebra (8 ECTS). You can post your questions in the comments sections on YouTube.</p><p><em>Coming soon!</em>There is also an online course in preparation (4 ECTS) which contains the first half of these web lectures, electronic exercises with feedback and the possibility to pose questions on forums. To access this course, you need a (free) <a href=\"https://moodle.org/\" target=\"_blank\">Moodle</a> account.</p>",
			playlists: [
				{
					name: "1. Vectors, lines and planes",
					id: "PLJMXXdEk8kMDKHXfYZycypaK2VFsQo25T"
				},
				{
					name: "2. Systems of linear equations",
					id: "PLJMXXdEk8kMBCcedEI8B13tdYBGCnUISg"
				}
			]
		},
		{
			name: "Calculus",
			intro: "Web lectures on selected topics of single variable calculus: introduction to functions, sequences, series and power series. What topic should be covered next? Post your ideas in the comments section of the <a href=\"https://www.youtube.com/watch?v=EGDbnmBpfRY\" target=\"_blank\">introduction video</a>!",
			playlists: [
				{
					name: "1. Introduction to functions",
					id: "PLJMXXdEk8kMD27qyxFL_d7Slkk0NpBAlh"
				},
				{
					name: "2. Limits and continuity",
					id: "PLJMXXdEk8kMDno0Eq0Ph7L7zOtNgYMqQn"
				}
			]
		},
		{
			name: "Complex Analysis",
			intro: "",
			playlists: [
				{
					name: "1. Introduction and Topology",
					id: "PLJMXXdEk8kMBklpaHrBjQaKaCI2Vfxy7h"
				},
				{
					name: "2. Elementary functions",
					id: "PLJMXXdEk8kMDETr7WetPdqF9GbQud6jDd"
				}
			]
		},
		{
			name: "Miscellaneous",
			intro: "Some web lectures on precalculus and on general mathematical background.",
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


