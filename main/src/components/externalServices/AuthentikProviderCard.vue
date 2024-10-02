<template>
	<div class="modal-card">
		<section class="modal-card-body">
			<div class="card-content mr-6" style="margin-left: -1 rem">
				<b-field :label="$t('ClientId')">
					<b-input v-model="clientId" name="clientId"></b-input>
				</b-field>
				<b-field :label="$t('ClientSecret')">
					<b-input v-model="clientSecret" name="password" password-reveal type="password">
					</b-input>
				</b-field>
				<b-field :label="$t('Issuer')">
					<b-input v-model="issuer" name="issuer"></b-input>
				</b-field>
				<b-field :label="$t('Auth URL')">
					<b-input v-model="authUrl" name="authUrl"></b-input>
				</b-field>
				<b-field :label="$t('Callback URL')">
					<b-input v-model="callbackUrl" name="callbackUrl" ></b-input>
				</b-field>
			</div>
		</section>
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1">
				<b-button :label="$t('Save')" expaned rounded type="is-primary" @click="saveSetting" />
			</div>
		</footer>
	</div>
</template>
<script>
export default {
	name: "authentik-provider-card",
	inject: ['authentikSettings'],
	data() {
		return {
			// http://172.20.60.244:8080/v1/users/oidc/callback
			clientId: this.authentikSettings.clientId,
			clientSecret: this.authentikSettings.clientSecret,
			issuer: this.authentikSettings.issuer,
			authUrl: this.authentikSettings.authUrl,
			callbackUrl: `${window.location.origin}/v1/users/oidc/callback`,
		};
	},
	methods: {
		saveSetting() {
			this.isLoading = true;
			this.$api.users.saveOIDCSettings({
				clientId: this.clientId,
				clientSecret: this.clientSecret,
				issuer: this.issuer,
				authUrl: this.authUrl,
				callbackUrl: this.callbackUrl
			}).then(res => {
				if (res.data.success == 200) {
					this.errorType = "is-success";
					this.errors = "";
				}
			})
		}
	}
};
</script>
