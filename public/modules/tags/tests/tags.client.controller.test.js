'use strict';

(function() {
	// Tags Controller Spec
	describe('Tags Controller Tests', function() {
		// Initialize global variables
		var TagsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tags controller.
			TagsController = $controller('TagsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tag object fetched from XHR', inject(function(Tags) {
			// Create sample Tag using the Tags service
			var sampleTag = new Tags({
				name: 'New Tag'
			});

			// Create a sample Tags array that includes the new Tag
			var sampleTags = [sampleTag];

			// Set GET response
			$httpBackend.expectGET('tags').respond(sampleTags);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tags).toEqualData(sampleTags);
		}));

		it('$scope.findOne() should create an array with one Tag object fetched from XHR using a tagId URL parameter', inject(function(Tags) {
			// Define a sample Tag object
			var sampleTag = new Tags({
				name: 'New Tag'
			});

			// Set the URL parameter
			$stateParams.tagId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tags\/([0-9a-fA-F]{24})$/).respond(sampleTag);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tag).toEqualData(sampleTag);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tags) {
			// Create a sample Tag object
			var sampleTagPostData = new Tags({
				name: 'New Tag'
			});

			// Create a sample Tag response
			var sampleTagResponse = new Tags({
				_id: '525cf20451979dea2c000001',
				name: 'New Tag'
			});

			// Fixture mock form input values
			scope.name = 'New Tag';

			// Set POST response
			$httpBackend.expectPOST('tags', sampleTagPostData).respond(sampleTagResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tag was created
			expect($location.path()).toBe('/tags/' + sampleTagResponse._id);
		}));

		it('$scope.update() should update a valid Tag', inject(function(Tags) {
			// Define a sample Tag put data
			var sampleTagPutData = new Tags({
				_id: '525cf20451979dea2c000001',
				name: 'New Tag'
			});

			// Mock Tag in scope
			scope.tag = sampleTagPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tags\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tags/' + sampleTagPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tagId and remove the Tag from the scope', inject(function(Tags) {
			// Create new Tag object
			var sampleTag = new Tags({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tags array and include the Tag
			scope.tags = [sampleTag];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tags\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTag);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tags.length).toBe(0);
		}));
	});
}());