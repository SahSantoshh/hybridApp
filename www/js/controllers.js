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
				// $rootScope.insertData($rootScope.catFile, $scope.categories);

			}, function (err) {
				console.log(err);
			});


		// $rootScope.delay(function () {
		// 	$rootScope.fetchData($rootScope.catFile).then(function (data) {
		// 		$scope.categories = JSON.parse(data);
		// 		$scope.categories.forEach(function (element, index, array) {
		// 			// check that title is object
		// 			element.title = $sce.trustAsHtml(JSON.stringify(element.title));
		// 		});
		// 	});
		// }, 5000);

	})

	.controller('MainCtrl', function ($http, $scope,$ionicPlatform,$cordovaNetwork, $rootScope, $sce, $ionicScrollDelegate, $timeout, $localStorage, $ionicLoading) {

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
		// uncomment below codes if devise is offline

		$ionicPlatform.ready(function () {
		// $rootScope.delay(function () {
			var isNet = $cordovaNetwork.isOnline();
			if (!isNet) {
				alert("Devise is offline");

				$ionicPopup.confirm({
					title: "No Internet Connection",
					content: "Connect to receive all articles."
				})

				$scope.recent_posts = [];

				$rootScope.getPostIds().then(function (success) {
					$scope.recent_posts = success;
					$scope.count_total = $scope.mainPosts.length;

					$scope.recent_posts.forEach(function (element, index, array) {
						element.excerpt = element.excerpt + "... Read More";
						element.excerpt = $sce.trustAsHtml(element.excerpt);
						if ($scope.Favorites.indexOf(element.id) != -1)
							element.isFavorite = true;
						else
							element.isFavorite = false;
					});
				});
			}//offline ends

		})
		// }, 5000);
	})

	.controller('PostCtrl', function ($scope, $http, $stateParams, $sce, $rootScope) {

		$scope.post = {
			"id": "",
			"title": "",
			"category": "",
			"content": "",
			"date": "",
			"authorName": "",
			"authorImage": "",
			"image": "",
			"commentCount": "",
			"views": "",
			"url": "",
			"excerpt": "",
		}

		$http.get('https://www.scubadivingtheory.com/api/get_post/?id=' + $stateParams.postId).then(
			function (data) {
				// $scope.title = data.data.post.title;
				// $scope.category = data.data.post.categories[0].title ? data.data.post.categories[0]
				// 	.title : 'No Category';
				// $scope.content = $sce.trustAsHtml(data.data.post.content);
				// $scope.date = data.data.post.date;
				// $scope.authorName = data.data.post.author.first_name + " " + data.data.post.author.last_name;
				// if ($scope.authorName.trim() == '')
				// 	$scope.authorName = "No Name";
				// $scope.authorImage = 'http://ionicframework.com/img/docs/mcfly.jpg';
				// $scope.image = data.data.post.thumbnail_images.full.url;
				// $scope.commentCount = data.data.post.comment_count;
				// $scope.views = data.data.post.custom_fields.post_views_count[0];
				// $scope.url = data.data.post.url;

				$scope.post.id = data.data.post.id;
				$scope.post.title = data.data.post.title;
				$scope.post.category = data.data.post.categories[0].title ? data.data.post.categories[0].title : 'No Category';
				$scope.post.content = $sce.trustAsHtml(data.data.post.content);
				$scope.post.date = data.data.post.date;
				$scope.post.authorName = data.data.post.author.first_name + " " + data.data.post.author.last_name;
				if ($scope.post.authorName.trim() == '')
					$scope.post.authorName = "No Name";
				$scope.post.authorImage = 'http://ionicframework.com/img/docs/mcfly.jpg';
				$scope.post.image = data.data.post.thumbnail_images.full.url;
				$scope.post.commentCount = data.data.post.comment_count;
				// $scope.post.views = data.data.post.custom_fields.post_views_count[0];
				$scope.post.url = data.data.post.url;
				var details = data.data.post.content;
				$scope.post.content = details;
				$scope.post.excerpt = details.substr(0, 100);

				$rootScope.insertPostId($scope.post.id);
				$rootScope.insertData($scope.post.id + $rootScope.postFile, $scope.post);

			}, function (err) {

			})

		// show local posts
		// show if offline,check offline
		// uncomment below codes if devise is offline

		$rootScope.delay(function () {
			$rootScope.fetchData($stateParams.postId + $rootScope.postFile).then(function (data) {
				$scope.post = JSON.parse(data);
			});
		}, 5000);

		$scope.Share = function () {
			window.plugins.socialsharing.share($scope.title, $scope.title, $scope.image, $scope.url);
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
