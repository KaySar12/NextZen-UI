/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/1 下午8:21
 * @FilePath: /CasaOS-UI/src/router/index.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import api from '@/service/api'
import store from '@/store'
import route from './route.js'
import { apply } from 'lodash/xor.js'

Vue.use(VueRouter)

const routes = route

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err)
}

const needInit = async () => {
	store.state.needInitialization = false;
	store.state.initKey = "";
	try {
		let userStatusRes = await api.users.getUserStatus();
		// if (userStatusRes.data.success === 200 && !userStatusRes.data.data.initialized) {
		if (userStatusRes.data.success === 200) {
			store.commit('SET_NEED_INITIALIZATION', true)
			store.commit('SET_INIT_KEY', userStatusRes.data.data.key)
			// localStorage.removeItem("access_token");
			// localStorage.removeItem("refresh_token");
			return true
		} else {
			return false
		}
	} catch (error) {
		console.error(error)
		return false
	}
}
router.beforeEach(async (to, from, next) => {
	debugger;
	const accessToken = localStorage.getItem("access_token");
	const requireAuth = to.matched.some(record => record.meta.requireAuth);
	if (to.path === '/logout') {
	}
	if (to.path === '/oidc') {
		await api.users.oidcLogin(`/#/callback`);
	}
	if (to.path === '/callback') {
	}
});

// router.beforeEach(async (to, from, next) => {
// 	debugger;
// 	const accessToken = localStorage.getItem("access_token");
// 	const requireAuth = to.matched.some(record => record.meta.requireAuth);

// 	//1. Consolidated Auth Checks
// 	if (requireAuth) {
// 		if (!accessToken) {
// 			next();
// 		}
// 	}

// 	// 2. Prevent Login/Logout Loop (Simplified)
// 	if ((from.path === '/login' && to.path === '/logout') ||
// 		(from.path === '/logout' && to.path === '/login')) {
// 		return next(false); // Stay on the current page
// 	}

// 	// 3. Logout Handling
// 	if (to.path === '/logout') {
// 		localStorage.clear(); // Clear all relevant items
// 		window.location.reload(); // Force reload for immediate effect
// 		return; // No need to call next() after reload
// 	}

// 	// 4. Login Redirect (Already Authenticated)
// 	if (to.path === '/login' && accessToken) {
// 		return next('/'); // Redirect to homepage or dashboard
// 	}

// 	// 5. Attempt Login or Register if No Token
// 	if (!accessToken) {
// 		try {
// 			var res = await api.users.oidcLogin(window.location.href);
// 			//var res = await api.users.login('nextzen', 'smartyourlife');
// 		} catch (err) {
// 			// If login fails, attempt registration
// 			var userStatus = await api.users.getUserStatus();
// 			const initKey = userStatus.data.data.key;
// 			var register = await api.users.register('nextzen', 'smartyourlife', '', initKey);

// 			if (register.data.success == 200) {
// 				// If registration succeeds, try logging in again
// 				res = await api.users.login('nextzen', 'smartyourlife');
// 			} else {
// 				// Handle registration failure (e.g., show error message)
// 				console.error('Registration failed:', register.data);
// 				next('/404')
// 				// You might want to redirect to an error page or display a user-friendly message here
// 			}
// 		}

// 		// If login or registration was successful, store tokens and user data
// 		if (res && res.data.success == 200) {
// 			localStorage.setItem("access_token", res.data.data.token.access_token);
// 			localStorage.setItem("refresh_token", res.data.data.token.refresh_token);
// 			localStorage.setItem("expires_at", res.data.data.token.expires_at);
// 			localStorage.setItem("user", JSON.stringify(res.data.data.user));

// 			store.commit("SET_USER", res.data.data.user);
// 			store.commit("SET_ACCESS_TOKEN", res.data.data.token.access_token);
// 			store.commit("SET_REFRESH_TOKEN", res.data.data.token.refresh_token);
// 		}
// 	}
// 	else {
// 		var version = await fetch("/v1/sys/version")
// 		if (version.status === 401) {
// 			localStorage.clear();
// 			window.location.reload()
// 		}
// 	}
// 	// 6. Fetch Version with Timeout
// 	try {
// 		const versionRes = await new Promise((resolve, reject) => {
// 			const timer = setTimeout(() => {
// 				console.warn("Version fetch timed out. Using default version 1.0.");
// 				resolve({
// 					data: {
// 						success: 200,
// 						message: "ok",
// 						data: {
// 							current_version: "1.0",
// 							need_update: false,
// 							version: {
// 								id: 1,
// 								change_log: "",
// 								version: "1.0",
// 								create_at: "",
// 								update_at: ""
// 							}
// 						}
// 					}
// 				});
// 			}, 1000); // 1 second timeout

// 			api.sys.getVersion().then(response => {
// 				clearTimeout(timer);
// 				resolve(response);
// 			}).catch(reject);
// 		});

// 		if (versionRes.data.success == 200) {
// 			localStorage.setItem("version", versionRes.data.data.current_version);
// 		}
// 	} catch (error) {
// 		// Handle version fetch error (e.g., log it or show a message)
// 		console.error('Error fetching version:', error);
// 	}

// 	next();
// });


export default router
