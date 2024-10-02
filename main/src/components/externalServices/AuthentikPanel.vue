<template>
	<div class="modal-card">
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">Authentik</h3>
			</div>
			<b-icon class="close-button ml-2" icon="close-outline" pack="casa" @click.native="$emit('close');" />
		</header>
		<section class="modal-card-body " style="overflow:hidden">
			<b-tabs :animated="false" @input="onInput">
				<b-tab-item :label="$t('Credentials')" value="credentials">
					<authentik-provider-card></authentik-provider-card>
				</b-tab-item>
				<b-tab-item :label="$t('Providers')" value="providers">

				</b-tab-item>
			</b-tabs>
		</section>
	</div>
</template>
<script>
import AuthentikProviderCard from './AuthentikProviderCard.vue';
export default {
	name: 'authentik-panel',
	components: { AuthentikProviderCard },
	data() {
		return {};
	},
	mounted() {
	},
	methods: {
		onInput(e) {
			switch (e) {
				case "credentials":
					this.$refs.credentials.active(true)
					break;
				case "providers":
					this.$refs.providers.active(true)
					break;
				default:
					break;
			}
		},
	}
}
</script>