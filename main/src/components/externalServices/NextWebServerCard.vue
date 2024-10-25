<template>
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
				<b-button :label="$t('Save')" expanded rounded type="is-primary" />
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	name: "nextweb-server",
	data() {
		return {};
	},
	methods: {}
};
</script>