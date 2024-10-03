<template>
	<div class="modal-card">
		<!-- Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1 is-flex ">
			</div>
			<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
		</header>
		<!-- Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body is-flex is-justify-content-center is-align-items-center mb-5">
			<div class="node-card ">
				<div class="cover is-unselectable is-flex is-justify-content-center is-align-items-center">
					<div :class="item | coverType">
						<img :class="item | iconType" :src="getIconFile(item)" alt="folder" />
					</div>
				</div>
				<div class="info mt-3 is-flex is-flex-direction-column is-justify-content-center">
					<p class="title">{{ item.name }}</p>
					<div class="buttons is-justify-content-center">
						<b-button type="is-primary" @click="download">{{ $t('Download') }}
						</b-button>
						<!-- <b-button type="is-primary" @click="download">{{ $t('Download') }}
							{{ item.size | renderSize }}
						</b-button> -->
						<b-button v-if="isCompressed" type="is-primary" @click="extract">{{ $t('Extract') }}
						</b-button>
					</div>
				</div>
			</div>
		</section>
		<!-- Modal-Card Body End -->
	</div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import { extractLocators } from 'vee-validate/dist/types/utils/rules';

export default {
	mixins: [mixin],
	inject: ['filePanel'],
	props: {
		item: Object
	},
	data() {
		return {}
	},
	computed:
	{
		isCompressed() {
			var ext = this.getFileExt(this.item)
			return ext === 'gz' || ext === 'zip' || ext === 'rar';
		}
	},
	methods: {
		download() {
			this.downloadFile(this.item);
			this.$emit('close')
			// this.$parent.fullScreen = true
			// console.log(this.$parent);
		},
		async extract() {
			
			var ext = this.getFileExt(this.item)
			await this.extractFile(this.item, ext);
			this.filePanel.reload()
			this.$emit('close')

		}
	},
}
</script>