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
				<b-tab-item :label="$t('Server')" value="server">
				</b-tab-item>
			</b-tabs>
		</section>
	</div>
</template>
<script>
export default {
	name: 'authentik-panel',
	components: {},
	data() {
	},
	mounted() {
	},
	methods: {
		onInput(e) {
			switch (e) {
				case "server":
					this.$refs.server.active(true)
					break;
				default:
					break;
			}
		},
	}
}
</script>