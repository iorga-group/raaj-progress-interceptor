'use strict';

angular.module('blank-iraj')
.controller('UserSearchCtrl', function ($scope, $http, $location, irajTableService) {
	/// Action methods ///
	/////////////////////
	
	$scope.search = function() {
		$scope.tableParams.page(1);
		irajTableService.reloadLazyLoadingTable($scope.tableParams);
	};

	/// Initialization ///
	/////////////////////
	$http.get('api/administration/userSearch/init').success(function(data) {
		$scope.profileList = data.profileList;
	});
	
	irajTableService.initLazyLoadingTableWithSearchScopeAndHistory('tableParams', 'userForm', $scope, function(tableParams, callbackFn) {
		$http.post('api/administration/userSearch/search', $scope.userForm).success(function (results) {
			callbackFn(results);
		});
	}, function(tableParams, callbackFn) {
		$http.post('api/administration/userSearch/count', $scope.userForm).success(function (count) {
			$scope.count = count;
			callbackFn(count);
		});
	});
});