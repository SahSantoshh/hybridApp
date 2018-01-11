angular.module('starter')
	.controller('MenuCtrl', function ($http, $scope, FileSys, $sce, $ionicScrollDelegate, $timeout, $rootScope) {

		$scope.categories = [];

		$http.get("https://www.scubadivingtheory.com/api/get_category_index/").then(
			function (returnedData) {
				// title of category is object please check that
				$scope.categories = returnedData.data.categories;
				$scope.categories.forEach(function (element, index, array) {
					element.title = $sce.trustAsHtml(element.title);
				})
				console.log(returnedData);
				// caches categories
				$rootScope.insertData($rootScope.catFile, $scope.categories);

			}, function (err) {
				console.log(err);
			});


		$rootScope.delay(function () {
			$rootScope.fetchData($rootScope.catFile).then(function (data) {
				$scope.categories = JSON.parse(data);
				$scope.categories.forEach(function (element, index, array) {
					// check that title is object
					element.title = $sce.trustAsHtml(JSON.stringify(element.title));
				});
			});
		}, 5000);

	})

	.controller('MainCtrl', function ($http, $scope,$rootScope, $sce, $ionicScrollDelegate, $timeout, $localStorage, $ionicLoading) {

		$scope.offset = 0;
		$scope.count_total = 1;

		$scope.doRefresh = function () {
			$scope.recent_posts = [];
			$http.get("https://www.scubadivingtheory.com/api/get_posts/").then(function (data) {
				console.log(data);
				$scope.recent_posts = data.data.posts;
				$scope.count_total = data.data.count_total;
				$scope.recent_posts.forEach(function (element, index, array) {
					element.excerpt = element.excerpt.substr(0, 100);
					element.excerpt = element.excerpt + "... Read More";
					element.excerpt = $sce.trustAsHtml(element.excerpt);
					if ($scope.Favorites.indexOf(element.id) != -1)
						element.isFavorite = true;
					else
						element.isFavorite = false;
				})

				$scope.$broadcast('scroll.refreshComplete');

			}, function (err) {

			})
		}

		$scope.Favorites = $localStorage.Favorites;
		if (!$scope.Favorites)
			$scope.Favorites = [];

		$scope.recent_posts = [];

		$http.get("https://www.scubadivingtheory.com/api/get_posts/").then(function (data) {
			console.log(data);
			$scope.recent_posts = data.data.posts;
			$scope.count_total = data.data.count_total;
			$scope.recent_posts.forEach(function (element, index, array) {
				element.excerpt = element.excerpt.substr(0, 100);
				element.excerpt = element.excerpt + "... Read More";
				element.excerpt = $sce.trustAsHtml(element.excerpt);
				if ($scope.Favorites.indexOf(element.id) != -1)
					element.isFavorite = true;
				else
					element.isFavorite = false;
			})
		}, function (err) {

		})

		$scope.canLoadMore = function () {
			return true;
		}

		$scope.timer = new Date().getTime();
		$scope.lastTimer = new Date().getTime();

		$scope.loadMore = function () {

			$scope.timer = new Date().getTime();
			//console.log(new Date($scope.timer - $scope.lastTimer).getTime())
			if (new Date($scope.timer - $scope.lastTimer) > 5000) {
				$scope.lastTimer = new Date().getTime();
				$http.get("https://www.scubadivingtheory.com/api/get_posts/?offset=" + $scope.offset)
					.then(function (data) {
						var newPosts = data.data.posts;
						$scope.count_total = data.data.count_total;

						newPosts.forEach(function (element, index, array) {
							element.excerpt = element.excerpt.substr(0, 100);
							element.excerpt = element.excerpt + "... Read More";
							element.excerpt = $sce.trustAsHtml(element.excerpt);
						})

						$scope.recent_posts.push.apply($scope.recent_posts, newPosts);
						$scope.$broadcast("scroll.infiniteScrollComplete");
						$scope.offset += 10;
					});
			}


		};

		$scope.searchTextChanged = function () {
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
		}

		$scope.toggleFavorite = function (post) {

			post.isFavorite = !post.isFavorite;

			if (post.isFavorite == true) {
				$scope.Favorites.push(post.id);
			}
			else {
				$scope.Favorites.forEach(function (e, i, a) {
					if (e == post.id) {
						$scope.Favorites.splice(i, 1);
						console.log("Spliced index " + i);
					}
				})
			}

			$localStorage.Favorites = $scope.Favorites;
		}

		// show local posts
		// show if offline,check offline
		// $scope.recent_posts = [];
		// $rootScope.delay(function () {
		// 	$rootScope.getPostIds().then(function(success){
		// 		$scope.recent_posts = success;
		// 		$scope.count_total = $scope.mainPosts.length;
	
		// 		$scope.recent_posts.forEach(function(element,index,array){
		// 			element.excerpt = element.post_content.substr(0, 100);
		// 			element.excerpt = element.excerpt + "... Read More";
		// 			element.excerpt = $sce.trustAsHtml(element.excerpt);
		// 			if ($scope.Favorites.indexOf(element.id) != -1)
		// 				element.isFavorite = true;
		// 			else
		// 				element.isFavorite = false;
		// 		});
		// 	});
		// }, 5000);


		


	})

	.controller('PostCtrl', function ($scope, $http, $stateParams, $sce, $rootScope) {

		$scope.post = {
			"post_id": "",
			"post_title": "",
			"post_category": "",
			"post_content": "",
			"post_date": "",
			"post_authorName": "",
			"post_authorImage": "",
			"post_image": "",
			"post_commentCount": "",
			"post_views": "",
			"post_url": "",
		}

		$http.get('https://www.scubadivingtheory.com/api/get_post/?id=' + $stateParams.postId).then(
			function (data) {
				// $scope.post_title = data.data.post.title;
				// $scope.post_category = data.data.post.categories[0].title ? data.data.post.categories[0]
				// 	.title : 'No Category';
				// $scope.post_content = $sce.trustAsHtml(data.data.post.content);
				// $scope.post_date = data.data.post.date;
				// $scope.post_authorName = data.data.post.author.first_name + " " + data.data.post.author.last_name;
				// if ($scope.post_authorName.trim() == '')
				// 	$scope.post_authorName = "No Name";
				// $scope.post_authorImage = 'http://ionicframework.com/img/docs/mcfly.jpg';
				// $scope.post_image = data.data.post.thumbnail_images.full.url;
				// $scope.post_commentCount = data.data.post.comment_count;
				// $scope.post_views = data.data.post.custom_fields.post_views_count[0];
				// $scope.post_url = data.data.post.url;

				$scope.post.post_id = data.data.post.id;
				$scope.post.post_title = data.data.post.title;
				$scope.post.post_category = data.data.post.categories[0].title ? data.data.post.categories[0].title : 'No Category';
				$scope.post.post_content = $sce.trustAsHtml(data.data.post.content);
				$scope.post.post_date = data.data.post.date;
				$scope.post.post_authorName = data.data.post.author.first_name + " " + data.data.post.author.last_name;
				if ($scope.post.post_authorName.trim() == '')
					$scope.post.post_authorName = "No Name";
				$scope.post.post_authorImage = 'http://ionicframework.com/img/docs/mcfly.jpg';
				$scope.post.post_image = data.data.post.thumbnail_images.full.url;
				$scope.post.post_commentCount = data.data.post.comment_count;
				// $scope.post.post_views = data.data.post.custom_fields.post_views_count[0];
				$scope.post.post_url = data.data.post.url;

				$rootScope.insertPostId($scope.post.post_id);
				$rootScope.insertData($scope.post.post_id + $rootScope.postFile, $scope.post);

			}, function (err) {

			})

		$rootScope.delay(function () {
			$rootScope.fetchData($stateParams.postId + $rootScope.postFile).then(function (data) {
				$scope.post = JSON.parse(data);
			});
		}, 5000);

		$scope.Share = function () {
			window.plugins.socialsharing.share($scope.post_title, $scope.post_title, $scope.post_image, $scope.post_url);
		}

	})

	.controller('CatCtrl', function ($http, $scope, $sce, $stateParams) {

		$scope.doRefresh = function () {
			$http.get('https://www.scubadivingtheory.com/api/get_category_posts/?id=' + $stateParams.catId).then(
				function (data) {
					$scope.category_posts = data.data.posts;
					$scope.category_posts.forEach(function (element, index, array) {
						element.excerpt = element.excerpt.substr(0, 100);
						element.excerpt = element.excerpt + '... Read More';
						element.excerpt = $sce.trustAsHtml(element.excerpt);
					})
					$scope.category_title = data.data.category.title;
					$scope.$broadcast('scroll.refreshComplete');

				}, function (err) {

				})
		}

		$scope.doRefresh();

	})

	.controller('FavCtrl', function ($http, $scope, $localStorage, $sce) {

		$scope.doRefresh = function () {

			$scope.Favorites = $localStorage.Favorites;
			$scope.favorite_posts = [];
			$scope.Favorites.forEach(function (element, index, array) {
				$http.get('https://www.scubadivingtheory.com/api/get_post/?id=' + element)
					.success(function (data) {
						$scope.favorite_posts.push(data.post);

						if ($scope.favorite_posts.length == $scope.Favorites.length) {
							$scope.favorite_posts.forEach(function (post, position, list) {
								post.excerpt = post.excerpt.substr(0, 100);
								post.excerpt = post.excerpt + '... Read More';
								post.excerpt = $sce.trustAsHtml(post.excerpt);

								if ($scope.Favorites.indexOf(post.id) != -1)
									post.isFavorite = true;
								else
									post.isFavorite = false;
							})
						}
					})

					.finally(function () {
						$scope.$broadcast('scroll.refreshComplete');
					})
			})

		}

		$scope.doRefresh();

		$scope.toggleFavorite = function (post) {
			post.isFavorite = !post.isFavorite;

			if (post.isFavorite) {
				$scope.Favorites.push(post.id)
			}
			else {
				$scope.Favorites.forEach(function (element, index, array) {
					if (element == post.id) {
						$scope.Favorites.splice(index, 1);
						console.log("Spliced Item from index " + index);
					}
				})
			}

			$localStorage.Favorites = $scope.Favorites;
		}
	})
