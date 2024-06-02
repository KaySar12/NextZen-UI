<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">CasaOS</h3>
			</div>
			<b-tooltip label="Download logs" position="is-bottom" size="is-small" type="is-black">
				<b-icon v-show="showTabName === 'logs'" class="close-button" icon="downloads-outline" pack="casa"
					@click.native="downloadSystemLog" />
			</b-tooltip>
			<b-icon class="close-button ml-2" icon="close-outline" pack="casa" @click.native="$emit('close');" />

		</header>
		<!-- Modal-Card Header End -->

		<!-- Modal-Card Body Start -->
		<section class="modal-card-body " style="overflow:hidden">
			<div class="is-flex-grow-3">
				<b-tabs :animated="false" @input="onInput">
					<b-tab-item :label="$t('Terminal')" value="terminal">
						<terminal-card ref="terminal" :initWsUrl="wsUrl"></terminal-card>
					</b-tab-item>
					<b-tab-item :label="$t('Main Service')" value="logs">
						<logs-card ref="logs" :data="logData"></logs-card>
					</b-tab-item>
					<!-- <b-tab-item :label="$t('User Service')" value="user-service-log">
						<logs-card ref="user-service-log" :data="userServiceData"></logs-card>
					</b-tab-item>
					<b-tab-item :label="$t('GateWay')" value="gateway-log">
						<logs-card ref="gateway-log" :data="gateWayData"></logs-card>
					</b-tab-item>
					<b-tab-item :label="$t('App Management')" value="app-management-log">
						<logs-card ref="app-management-log" :data="appManagementData"></logs-card>
					</b-tab-item> -->
				</b-tabs>

			</div>

		</section>
		<!-- Modal-Card Body End -->

		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
	</div>
</template>

<script>
import TerminalCard from './TerminalCard.vue';
import LogsCard from './LogsCard.vue';
import qs from "qs";

export default {
	name: 'terminal-panel',
	components: {
		TerminalCard,
		LogsCard
	},
	data() {
		return {
			isLoading: false,
			wsUrl: ``,
			logData: "",
			userServiceData: "",
			gateWayData: "",
			appManagementData: "",
			timer: '',
			showTabName: "terminal"
		}
	},
	mounted() {
		this.getLogs();
		this.timer = setInterval(() => {
			this.getLogs();
			// this.getUserServiceLogs();
			// this.getGateWayLogs();
			// this.GetAppManagementLogs();
		}, 1000 * 10);
	},
	methods: {
		getLogs() {
			this.$api.sys.getLogs().then(res => {
				let data = res.data.data
				let replaceData = data.replace(/\n(.{8})/gu, '\n');
				this.logData = replaceData.substring(8, replaceData.length - 1);
			})
		},
		// getUserServiceLogs() {
		// 	this.$api.sys.getUserServiceLogs().then(res => {
		// 		let data = res.data.data
		// 		let replaceData = data.replace(/\n(.{8})/gu, '\n');
		// 		this.userServiceData = replaceData.substring(8, replaceData.length - 1);
		// 	})
		// },
		// getGateWayLogs() {
		// 	this.$api.sys.getGateWayLogs().then(res => {
		// 		let data = res.data.data
		// 		let replaceData = data.replace(/\n(.{8})/gu, '\n');
		// 		this.gateWayData = replaceData.substring(8, replaceData.length - 1);
		// 	})
		// },
		// GetAppManagementLogs() {
		// 	this.$api.sys.GetAppManagementLogs().then(res => {
		// 		let data = res.data.data
		// 		let replaceData = data.replace(/\n(.{8})/gu, '\n');
		// 		this.appManagementData = replaceData.substring(8, replaceData.length - 1);
		// 	})
		// },
		onInput(e) {
			debugger;
			switch (e) {
				case "terminal":
					this.showTabName = "terminal"
					this.$refs.terminal.active(true)
					this.$refs.logs.active(false)
					this.$messageBus('terminallogs_terminal')
					break;
				case "logs":
					this.showTabName = "logs"
					this.$refs.terminal.active(false)
					this.$refs.logs.active(true)
					this.$messageBus('terminallogs_logs')
					break;
				case "user-service-log":
					this.showTabName = "user-service-log"
					this.$refs.terminal.active(false)
					this.$refs.logs.active(true)
					this.$messageBus('terminallogs_users_logs')
					break;
				case "gateway-log":
					this.showTabName = "gateway-log"
					this.$refs.terminal.active(false)
					this.$refs.logs.active(true)
					this.$messageBus('terminallogs_gateway_logs')
					break;
				case "app-management-log":
					this.showTabName = "app-management-log"
					this.$refs.terminal.active(false)
					this.$refs.logs.active(true)
					this.$messageBus('terminallogs_app_management_logs')
					break;
				default:
					break;
			}
			// if (e == "terminal") {
			// 	this.showTabName = "terminal"
			// 	this.$refs.terminal.active(true)
			// 	this.$refs.logs.active(false)
			// 	this.$messageBus('terminallogs_terminal')
			// } else if(e == "logs"){
			// 	this.showTabName = "logs"
			// 	this.$refs.terminal.active(false)
			// 	this.$refs.logs.active(true)
			// 	this.$messageBus('terminallogs_logs')
			// }
		},
		downloadSystemLog() {
			let parameters = {
				token: this.$store.state.access_token
			}
			window.open(`/v2/casaos/health/logs?${qs.stringify(parameters)}`, '_self');
		},
	},
	destroyed() {
		clearInterval(this.timer);
	}
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
	cursor: pointer;
}
</style>
