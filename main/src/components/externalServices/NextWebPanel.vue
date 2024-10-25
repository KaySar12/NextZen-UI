<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">NextWeb</h3>
			</div>
			<b-icon class="close-button ml-2" icon="close-outline" pack="casa" @click.native="$emit('close')" />
		</header>
		<section class="modal-card-body" style="overflow: hidden">
			<b-tabs :animated="false" @input="onInput">
				<b-tab-item :label="$t('Server')" value="server">
					<div class="modal-card">
						<section class="modal-card-body">
							<div class="card-content mr-6" style="margin-left: -1 rem">
								<b-field :label="$t('Server')">
									<b-input name="clientId"></b-input>
								</b-field>
								<b-field :label="$t('Username')">
									<b-input name="issuer"></b-input>
								</b-field>
								<b-field :label="$t('Password')">
									<b-input name="password" password-reveal type="password">
									</b-input>
								</b-field>
							</div>
						</section>
						<footer class="modal-card-foot is-flex is-align-items-center">
							<div class="is-flex-grow-1">
								<b-button :label="$t('Save')" rounded type="is-primary" />
							</div>
						</footer>
					</div>
				</b-tab-item>
			</b-tabs>
		</section>
	</div>
</template>

<script>
import NextWebServerCard from './NextWebServerCard.vue';

export default {
	name: "nextweb-panel",
	components: {
		NextWebServerCard
	},
	data() {
		return {};
	},
	mounted() { },
	methods: {
		onInput(e) {
			switch (e) {
				case "server":
					this.$refs.server.active(true);
					break;
				default:
					break;
			}
		},
	},
};
</script>