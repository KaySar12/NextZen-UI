<template>
	<div id="login-page" class="is-flex is-justify-content-center is-align-items-center ">
		<div v-if="isLoading" class="self-building-square-spinner">
			<div class="square"></div>
			<div class="square"></div>
			<div class="square"></div>
			<div class="square clear"></div>
			<div class="square"></div>
			<div class="square"></div>
			<div class="square clear"></div>
			<div class="square"></div>
			<div class="square"></div>
		</div>

		<div v-if="!isLoading" class="login-panel step4 is-shadow">
			<div class="is-flex is-justify-content-center ">
				<div class="has-text-centered">
					<b-image :src="require('@/assets/img/logo/nextzen-dark.png')" class="is-128x128"></b-image>
				</div>

			</div>
			<b-notification v-model="notificationShow" aria-close-label="Close notification" auto-close role="alert"
				type="is-danger">
				{{ message }}
			</b-notification>
			<ValidationObserver ref="observer" v-slot="{ handleSubmit }">
				<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
					<b-field :label="$t('Username')" :message="errors"
						:type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-5">
						<b-input v-model="username" :autofocus="!username" type="text"
							v-on:keyup.enter.native="handleSubmit(login)"></b-input>
					</b-field>
				</ValidationProvider>
				<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5" vid="password">
					<b-field :label="$t('Password')" :message="$t(errors)"
						:type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-2">
						<b-input v-model="password" :autofocus="username" password-reveal type="password"
							v-on:keyup.enter.native="handleSubmit(login)"></b-input>
					</b-field>
				</ValidationProvider>
				<b-button class="mt-5" expanded rounded type="is-primary" @click="handleSubmit(login)">{{ $t('Login') }}
				</b-button>
			</ValidationObserver>
		</div>
	</div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import { register } from "jshint/src/style";
export default {

	name: "login-page",
	data() {
		return {
			username: '',
			password: '',
			isLoading: false,
			message: "",
			notificationShow: false,
		}
	},
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	beforeMount() {
		let userString = localStorage.getItem('user')
		if (userString) {
			let name = JSON.parse(userString).username || '';
			this.username = name;
		}
	},
	mounted() {
		document.querySelector('.modal.is-active ')?.remove();
	},

	methods: {
		async needInit() {
			try {
				let userStatusRes = await this.$api.users.getUserStatus();
				// if (userStatusRes.data.success === 200 && !userStatusRes.data.data.initialized) {
				if (userStatusRes.data.success === 200) {
					this.$store.commit('SET_NEED_INITIALIZATION', true)
					this.$store.commit('SET_INIT_KEY', userStatusRes.data.data.key)
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					return true
				} else {
					return false
				}
			} catch (error) {
				return false
			}
		},
		async register() {
			var init = await this.needInit();
			if (init) {
				const initKey = this.$store.state.initKey;
				this.$api.users.register(this.username, this.password, "admin", initKey).then(res => {
					if (res.data.success == 200) {
						this.loginAction().then(() => {
							// First login set default app order
							this.$api.users.setCustomStorage("app_order", { data: ["App Store", "Files"] })
							return true;
						});
					}
					else {
						return false;
					}
				}).catch(err => {
					return false;
				})
			}
		},

		async checkSshLogin() {
			try {
				console.log("Starting SSH Login Check");
				await this.register()
				await this.loginAction();
				this.$messageBus('terminallogs_connect')
				this.isConnecting = true
				let postData = {
					username: String(this.username),
					password: String(this.password),
					port: String(this.sshPort || 22)
				}

				var ssh = await this.$api.sys.checkSshLogin(postData)
				console.log("SSH Login Check Result:", ssh);
				return ssh != null || ssh != undefined
			} catch (error) {
				console.error("Error in checkSshLogin:", error);
				return false
			}
		},
		timeout(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		async login() {
			try {
				this.isLoading = true;
				console.log("Before SSH Check");
				if (this.username === 'root') {
					var ssh = await this.checkSshLogin();
					console.log("After SSH Check", ssh);
					if (!ssh) {
						await this.loginAction();
					}
				}
				this.isLoading = false
				window.location.href = "#/home"
			} catch (err) {
				this.isLoading = false
				this.message = this.$t("Username or Password error!")
				this.notificationShow = true
			}
		},
		async loginAction() {
			const userRes = await this.$api.users.login(this.username, this.password)
			localStorage.setItem("access_token", userRes.data.data.token.access_token);
			localStorage.setItem("refresh_token", userRes.data.data.token.refresh_token);
			localStorage.setItem("expires_at", userRes.data.data.token.expires_at);
			localStorage.setItem("user", JSON.stringify(userRes.data.data.user));
			this.$store.commit("SET_USER", userRes.data.data.user);
			this.$store.commit("SET_ACCESS_TOKEN", userRes.data.data.token.access_token);
			this.$store.commit("SET_REFRESH_TOKEN", userRes.data.data.token.refresh_token);
			const versionRes = await this.$api.sys.getVersion();
			if (versionRes.data.success == 200) {
				localStorage.setItem("version", versionRes.data.data.current_version);
			}
		},
	}
}
</script>
<style>
.self-building-square-spinner,
.self-building-square-spinner * {
	box-sizing: border-box;
}

.self-building-square-spinner {
	height: 40px;
	width: 40px;
	top: calc(-10px * 2 / 3);
}

.self-building-square-spinner .square {
	height: 10px;
	width: 10px;
	top: calc(-10px * 2 / 3);
	margin-right: calc(10px / 3);
	margin-top: calc(10px / 3);
	background: #0b8ae6;
	float: left;
	position: relative;
	opacity: 0;
	animation: self-building-square-spinner 6s infinite;
}

.self-building-square-spinner .square:nth-child(1) {
	animation-delay: calc(300ms * 6);
}

.self-building-square-spinner .square:nth-child(2) {
	animation-delay: calc(300ms * 7);
}

.self-building-square-spinner .square:nth-child(3) {
	animation-delay: calc(300ms * 8);
}

.self-building-square-spinner .square:nth-child(4) {
	animation-delay: calc(300ms * 3);
}

.self-building-square-spinner .square:nth-child(5) {
	animation-delay: calc(300ms * 4);
}

.self-building-square-spinner .square:nth-child(6) {
	animation-delay: calc(300ms * 5);
}

.self-building-square-spinner .square:nth-child(7) {
	animation-delay: calc(300ms * 0);
}

.self-building-square-spinner .square:nth-child(8) {
	animation-delay: calc(300ms * 1);
}

.self-building-square-spinner .square:nth-child(9) {
	animation-delay: calc(300ms * 2);
}

.self-building-square-spinner .clear {
	clear: both;
}

@keyframes self-building-square-spinner {
	0% {
		opacity: 0;
	}

	5% {
		opacity: 1;
		top: 0;
	}

	50.9% {
		opacity: 1;
		top: 0;
	}

	55.9% {
		opacity: 0;
		top: inherit;
	}
}
</style>
<style lang="scss">
#login-page {
	height: calc(100% - 5.5rem);
	position: relative;
	z-index: 500;

	.login-panel {
		text-align: left;
		background: rgba(255, 255, 255, 0.46);
		backdrop-filter: blur(1rem);
		border-radius: 8px;
		padding: 2.5rem 4rem;

		.label {
			color: #dfdfdf;
		}

		.input {
			background: rgba(255, 255, 255, 0.32);
			border-color: transparent;
		}

		&.step1 {
			padding: 4rem 6rem;
		}

		&.step2 {
			padding: 2.5rem 4rem;
			width: 32rem;
		}

		&.step3 {
			padding: 4rem 8rem;
		}

		&.step4 {
			width: 28rem;
		}
	}
}


@media screen and (max-width: 480px) {
	.login-panel {
		text-align: left;
		background: rgba(255, 255, 255, 0.46);
		backdrop-filter: blur(1rem);
		border-radius: 8px;
		margin: 0 2rem;
		padding: 2rem !important;

		.label {
			color: #dfdfdf;
		}

		.input {
			background: rgba(255, 255, 255, 0.32);
			border-color: transparent;
		}

		.is-128x128 {
			height: 96px;
			width: 96px;
		}

		.is-3 {
			font-size: 1.5rem;
		}

		&.step1 {
			.is-2 {
				font-size: 1.5rem;
			}

			.subtitle {
				font-size: 1rem;
			}
		}

		&.step3 {
			padding: 4rem !important;
		}
	}
}
</style>
