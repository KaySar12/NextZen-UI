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
	debugger;
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
	const accessToken = localStorage.getItem("access_token");
	const requireAuth = to.matched.some(record => record.meta.requireAuth);
	if (requireAuth && accessToken) {
		const userData = JSON.parse(localStorage.getItem('user'));
		var oguser = await api.users.getUserInfoByName(userData.username)
		var ogrole = oguser.data.data?.role || '';
		if (userData.role != ogrole) {
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("wallpaper");
			localStorage.removeItem("user");
			next('/login');
		}
	}
	// Prevent direct navigation from /login to /logout and vice versa to avoid redirect loops
	if ((from.path === '/login' && to.path === '/logout') || (from.path === '/logout' && to.path === '/login')) {
		// If navigating directly between /login and /logout, stay on the current page to prevent loop
		return next(false);
	}
	if (requireAuth && !accessToken) {
		// If the route requires authentication and there's no access token, redirect to /login
		next('/login');
	} else if (to.path === '/logout') {
		// Specific handling for /logout to clear tokens and redirect to /login
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("wallpaper");
		localStorage.removeItem("user");
		next('/login');
	} else if (to.path !== '/login' && !accessToken && to.path !== '/logout') {

		next('/login');

	} else if (to.path === '/login' && accessToken) {
		// If already on /login with an access token, redirect to homepage or dashboard
		next('/');
	} else {
		if (to.path === '/register') {
			await needInit()
		}
		// For all other cases, proceed with the navigation
		next();
	}
});

export default router
