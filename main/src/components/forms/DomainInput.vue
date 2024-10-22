<template>
	<div class="mb-5">
		<div class="field is-flex is-align-items-center mb-2">
			<label class="label mb-0 is-flex-grow-1">{{ label }}</label>
			<b-button icon-left="plus-outline" icon-pack="casa" rounded size="is-small" @click="addItem">{{ $t("Add")
				}}</b-button>
		</div>
		<div v-if="items.length == 0" class="is-flex is-align-items-center mb-5 info">
			<span>{{ message }}</span>
		</div>
		<div v-for="(item, index) in items" class="port-item mr-4">
			<b-icon class="is-clickable" icon="close-outline" pack="casa" size="is-small"
				@click.native="removeItem(index)"></b-icon>
			<template v-if="index < 1">
				<b-field grouped>
					<b-checkbox size="is-small" v-model="item.mainLink" @input="updateMainLink(index)"></b-checkbox>
					<b-select v-model="item.scheme">
						<option value="http">http</option>
						<option value="https">https</option>
					</b-select>
					<b-select v-model="item.sslProvider" v-if="shouldShowSSLProvider(item)">
						<option value="selfSigned">Self Signed</option>
						<option value="http">Let's Encrypt</option>
					</b-select>
					<b-field expanded>
						<b-input v-model="item.domain" :placeholder="$t(placeholder)" expanded></b-input>
					</b-field>
				</b-field>
			</template>
			<template v-else>
				<b-field grouped>
					<b-checkbox size="is-small" v-model="item.mainLink" @input="updateMainLink(index)"></b-checkbox>
					<b-select v-model="item.scheme">
						<option value="http">http</option>
						<option value="https">https</option>
					</b-select>
					<b-select v-model="item.sslProvider" v-if="shouldShowSSLProvider(item)">
						<option value="selfSigned">Self Signed</option>
						<option value="http">Let's Encrypt</option>
					</b-select>
					<b-input v-model="item.domain" :placeholder="$t(placeholder)" expanded></b-input>
				</b-field>
			</template>
		</div>
	</div>
</template>
<script>
export default {
	name: "DomainInput",
	data() {
		return {
			isLoading: false,
			min: 0,
		};
	},
	model: {
		prop: "vData",
		event: "change",
	},
	props: {
		vData: Array,
		label: String,
		message: String,
		placeholder: {
			type: String,
			default: "example.local",
		},
	},
	computed: {
		items: {
			get() {
				return this.vData;
			},
			set(val) {
				this.$emit("change", val);
			},
		},
	},
	methods: {
		addItem() {
			console.log(this.vData);
			const itemObj = {
				domain: "",
				scheme: "http",
				sslProvider: "selfSigned",
				mainLink: false,
			};
			this.items.push(itemObj);
		},

		removeItem(index) {
			this.items.splice(index, 1);
		},
		shouldShowSSLProvider(item) {
			return item && item.scheme === 'https';
		},
		updateMainLink(index) {
			this.items.forEach((item, idx) => {
				if (idx !== index) {
					item.mainLink = false;
				}
			});
		},
	},
};
</script>
