const expectedCaches = ['static-v2'];

const appRouteLookup = {
	'/': ['/people', '/person', '/person_form', '/publications', '/publication', '/publication_form', '/quotes', '/quote', '/quote_form']
}

function onInstall(event) {
	console.log('[Serviceworker]', "Installing!", event);
	event.waitUntil(
		caches.open("static-v2")
			.then(function (cache) {
				return cache.addAll([
					'/favicon.ico',
					'/manifest.json',
					'/offline.html',
					'<%= asset_pack_path 'application.js' %>',
					'<%= asset_pack_path 'media/images/Convertable.png' %>',
					'<%= root_path %>'

				])
					.then(function (e) {
						console.log(e);
					})
					.catch(function (e) {
						console.log(e.message);
					});
			}).catch(function (err) {
				console.log(err.message);
			})
	);
}

function onActivate(event) {
	console.log('[Serviceworker]', "Activating!", event);
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					// Return true if you want to remove this cache,
					// but remember that caches are shared across
					// the whole origin
					return !expectedCaches.includes(cacheName);
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
}

function onFetch(event) {
	event.respondWith(
		// try to return untouched request from network first
		fetch(event.request).catch(function () {
			// if it fails, try to return request from the cache
			return caches.match(request_to_base_route(event.request)).then(function (response) {
				if (response) {
					return response;
				} else {
					// if that fails, see if the request is for a route within the single page app
					// in which case it is cached under a different path/ request
					let pathname = new URL(event.request.url).pathname;
					let route_key = Object.keys(appRouteLookup).find(function (key) {
						let route = appRouteLookup[key].find(function (route) {
							return pathname === route;
						})
						return route;
					});

					if (route_key) {
						caches.match(route_key).then(function (response){
							if(response){
								return response;
							}
						});
					}
				}
				// if not found in cache, return default offline content for navigate requests
				if (event.request.mode === 'navigate' ||
					(event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
					console.log('[Serviceworker]', "Fetching offline content", event);
					return caches.match('/offline.html');
				} else if(event.request.mode === 'cors'){
					console.log("Tried to get data while offline");
					let empty_response_data = []
					let myBlob = new Blob([JSON.stringify(empty_response_data)], {type : 'application/json'});
					let init = { "status" : 200 , "statusText" : "OK" };
					return new Response(myBlob,init);
				}
			})
		})
	);
}

function request_to_base_route(request) {
	let pathname = new URL(request.url).pathname;
	let rootPath = Object.keys(appRouteLookup).find(function (key) {
		let route = appRouteLookup[key].find(function (route) {
			return pathname === route;
		})
		return route;
	});
	if(rootPath){
		return rootPath;
	} else {
		return request;
	}

}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);