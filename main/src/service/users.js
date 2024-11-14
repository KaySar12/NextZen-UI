import { api } from "./service.js";

const PREFIX = "/users"
const PREFIX2 = "/v2/users"
const PANELPREFIX = "/1panel"
const users = {
	// get all user name [OK]
	getAllUserName() {
		return api.get(`${PREFIX}/name`);
	},

	// delete all user [NOT USE]
	deleteAllUser() {
		return api.delete(`${PREFIX}`);
	},
	// get user status [OK]
    getUserStatus() {
		return api.get(`${PREFIX}/status`);
	},
	// get user current info [OK]
	getUserInfo() {
		return api.get(`${PREFIX}/current`);
	},
	// set user current info [OK]
	setUserInfo(data) {
		return api.put(`${PREFIX}/current`, data);
	},
	// change user password [OK]
	changePassword(data) {
		return api.put(`${PREFIX}/current/password`, data);
	},

	getLinkAppDetail() {
		return api.get(`${PREFIX}/current/custom/link`);
	},

	saveLinkAppDetail(data) {
		return api.post(`${PREFIX}/current/custom/link`, data);
	},

	// delete user [NOT USE]
	deleteUser(id) {
		return api.delete(`${PREFIX}/${id}`);
	},

	// get user image [NOT USE]
	getUserImage(path) {
		return api.get(`${PREFIX}/image`, {
			path: path
		});
	},

	// create or update user image from upload
	setUserImage(key, data) {
		return api.put(`${PREFIX}/current/image/${key}`, data);
	},

	// delete user image [NOT USE]
	deleteUserImage(path) {
		return api.delete(`${PREFIX}/current/image`, {
			path: path
		});
	},


	// get custom storage [OK]
	// free store GET
	getCustomStorage(key) {
		return api.get(`${PREFIX}/current/custom/${key}`);
	},

	// set or update custom storage  [OK]
	// free store POST
	setCustomStorage(key, data) {
		return api.post(`${PREFIX}/current/custom/${key}`, data);
	},

	// delete custom storage  [NOT USE]
	deleteCustomStorage(key) {
		return api.delete(`${PREFIX}/current/custom/${key}`);
	},

	// get user info by user name  [NOT USE]
	getUserInfoByName(username) {
		return api.get(`${PREFIX}/${username}`);
	},


	// register [OK]
	register(username, password, role, key) {
		return api.post(`${PREFIX}/register`, {
			username: username,
			password: password,
			role: role,
			key: key
		});
	},
	async getOIDCSettings() {
		return await api.get(`${PREFIX}/oidc/settings`);
	},
	async oidcHealth() {
		return await api.get(`${PREFIX}/oidc/health`);
	},
	async onePanelHealth() {

		return await api.get(`${PANELPREFIX}/health`);
	},
	async updateOnePanelProxyWebsite(data) {
		return await api.post(`${PANELPREFIX}/website/update-proxy`, data);
	},
	async createOnePanelWebsite(data) {
		return await api.post(`${PANELPREFIX}/website/create`, data);
	},
	async updateOnePanelWebsite(data) {
		return await api.post(`${PANELPREFIX}/website/update`, data);
	},
	async deleteOnePanelWebsite(data) {
		return await api.post(`${PANELPREFIX}/website/delete`, data);
	},
	async oidcLogin(state, baseUrl) {
		var res = await api.post(`${PREFIX}/oidc/login`, {
			state: state,
			baseUrl: baseUrl
		});
		window.location.href = res.data?.data || ''
	},
	async oidcProfile() {
		return await api.get(`${PREFIX}/oidc/profile`);
	},
	async oidcUserInfo() {
		return await api.get(`${PREFIX}/oidc/userinfo`);
	},
	async oidcLogout(token) {

		return await api.post(`${PREFIX}/oidc/logout`, {
			authentikToken: token
		});
	},
	async oidcValidateToken(authentikToken) {
		return await api.post(`${PREFIX}/oidc/validateToken`, {
			authentikToken: authentikToken
		})
	},
	async saveOIDCSettings(settings) {
		return await api.post(`${PREFIX}/oidc/saveSettings`, {
			settings: settings
		})
	},
	// login [OK]
	login(username, password) {
		return api.post(`${PREFIX}/login`, {
			username: username,
			password: password
		});
	},

	// refresh token [OK]
	refreshToken(refresh_token) {
		return api.post(`${PREFIX}/refresh`, {
			refresh_token: refresh_token
		});
	},

	// get shutcut [OK]
	getShutcutDetail() {
		return api.get(`${PREFIX}/current/custom/shortcut`);
	},

	// save shutcut [OK]
	saveShutcutDetail(data) {
		return api.post(`${PREFIX}/current/custom/shortcut`, data);
	},

	// get user letter [OK]
	getLetter() {
		return api.get(`${PREFIX2}/events`);
	},

	// delete letter [OK]
	delLetter(uuid) {
		return api.delete(`${PREFIX2}/event/${uuid}`);
	},
	// save user avatar 
	saveAvatar(data) {
		return api.put(`${PREFIX}/avatar`, data);
	},

}

export default users;
