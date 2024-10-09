<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">{{ $t("Domains") }}</h3>
			</div>
			<div>
				<div class="is-flex is-align-items-center">
					<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close')" />
				</div>
			</div>
		</header>
		<!-- Modal-Card Header End -->

		<!-- Modal-Card Body Start -->
		<section class="modal-card-body">
			<!-- <VMdEditor v-model="tips" :mode="controlEditorState" left-toolbar right-toolbar>
			</VMdEditor> -->
			<DomainInput v-model="domains"></DomainInput>
			<div v-if="name" class="is-flex is-flex-direction-row-reverse mt-2">
				<b-icon class="is-clickable has-text-green-default" icon="check-outline" pack="casa"
					@click.native="save"></b-icon>
			</div>
		</section>
		<!-- Modal-Card Body End -->

		<!-- Modal-Card Footer Start-->
		<footer v-if="!name" class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div class="is-flex is-flex-direction-row-reverse">
				<b-button rounded size="is-small" type="is-primary" @click="$emit('submit') && $emit('close')">{{
					$t("Next Steps") }}
				</b-button>
			</div>
		</footer>
		<!-- Modal-Card Footer End-->
	</div>
</template>
<script>
import YAML from "yaml";
import merge from "lodash/merge";
// import VMdEditor from '@kangc/v-md-editor';
import DomainInput from "@/components/forms/DomainInput.vue";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import hljs from "highlight.js";
import { ice_i18n } from "@/mixins/base/common-i18n";

// VMdEditor.use(githubTheme, {
// 	Hljs: hljs,
// 	// extend(md) {},
// });

export default {
	name: "domainEditorModal",
	components: {
		DomainInput,
	},
	data() {
		return {
			controlEditorState: "preview",
			icon: "edit-outline",
			domains: [],
		};
	},
	props: {
		composeData: {
			type: Object,
			required: true,
		},
		name: {
			type: String,
			// required: true
		},
	},
	computed: {
	},
	watch: {
		isEditing(val) {
			if (val) {
				// editor is editable
				this.controlEditorState = "edit";
				this.icon = "check-outline";
			} else {
				// editor is not editable
				this.controlEditorState = "preview";
				this.icon = "edit-outline";
			}
			return this.isEditing;
		},
		composeData: {
			handler() {
				debugger;
				//Get tips in compose.
				let getValueByPath = this.composeData["x-casaos"];
				if (getValueByPath?.["domains"]) {
					this.domains = getValueByPath["domains"] || ice_i18n(getValueByPath["domains"]);
				} else {
					this.domains = [];
				}
			},
			immediate: true,
		},
	},
	mounted() { },
	methods: {
		/*
		 * 1、Enter the editor state
		 * 2, Conservation
		 * */

		save() {
			let realComposeData = this.getCompleteComposeData();
			var domains = realComposeData["x-casaos"]["domains"]
			domains.forEach((item) => {
				this.$api.users.createOnePanelWebsite({
					domain: item.domain,
					protocol: item.scheme,
					port: realComposeData["x-casaos"]["port_map"] || 8080

				})
					.then((res) => {
						if (res.status === 200) {
							this.$buefy.toast.open({
								message: res.data.message,
								type: "is-success",
								position: "is-top",
								duration: 5000,
							});
						}
					})
					.catch((e) => {
						this.$buefy.toast.open({
							message: e.response.data.data,
							type: "is-danger",
							position: "is-top",
							duration: 5000,
						});
					});
			})
			this.$openAPI.appManagement.compose
				.applyComposeAppSettings(this.name, YAML.stringify(realComposeData))
				.then((res) => {
					if (res.status === 200) {
						this.$buefy.toast.open({
							message: res.data.message,
							type: "is-success",
							position: "is-top",
							duration: 5000,
						});
					}
				})
				.catch((e) => {
					console.log("Error in saving tips:", e);
					this.$buefy.toast.open({
						message: e.response.data.data,
						type: "is-danger",
						position: "is-top",
						duration: 5000,
					});
				});
		},
		getCompleteComposeData() {
			debugger;
			/*let lines = this.tips.split('\n');
				  let body = [];
	  
				  lines.forEach(line => {
					  let splitArray = line.split(':');
					  let value = splitArray.length > 1 ? splitArray[0] : 'user input';
					  let content = splitArray.length > 1 ? splitArray[1] : splitArray[0];
					  body.push({value, content: {default: content}});
				  });*/

			let result = merge(this.composeData, {
				"x-casaos": {
					domains: this.domains,
				},
			});
			return result;
		},
	},
};
</script>
