<template>
	<div class="contact-bar is-flex is-align-items-center has-text-white">

		<popper :options="{
			placement: 'top',
			modifiers: { offset: { offset: '0,4px' } }
		}" enter-active-class="fade-enter-active" leave-active-class="" transition='fade' trigger="hover">
			<div class="popper  tooltip-content">
				{{ $t('Submit a feedback or report an issue') }}
			</div>
			<a slot="reference" @click="showFeedback">
				<b-icon icon="eedback" pack="casa"></b-icon>
			</a>
		</popper>

		<popper :options="{
			placement: 'top',
			modifiers: { offset: { offset: '0,4px' } }
		}" enter-active-class="fade-enter-active" leave-active-class="" transition='fade' trigger="hover">
			<div class="popper  tooltip-content">
				{{ $t('Join Facebook') }}
			</div>
			<a slot="reference" rel="noopener" href="https://www.facebook.com/NextZenos" target="_blank">
				<b-icon icon="facebook" pack="casa" style="scale: 0.9;"></b-icon>
			</a>
		</popper>
		<popper :options="{
			placement: 'top',
			modifiers: { offset: { offset: '0,4px' } }
		}" enter-active-class="fade-enter-active" leave-active-class="" transition='fade' trigger="hover">
			<div class="popper  tooltip-content">
				{{ $t('youtube') }}
			</div>
			<a slot="reference" rel="noopener" href="https://www.youtube.com/channel/UCtNlYbQXQdJYyutXlUJCQCQ" target="_blank">
				<img :src="require('@/assets/img/social/youtube.png')" alt="pending" class="is-24x24" />
			</a>
		</popper>

		<popper :options="{
			placement: 'top',
			modifiers: { offset: { offset: '0,4px' } }
		}" enter-active-class="fade-enter-active" leave-active-class="" transition='fade' trigger="hover">
			<div class="popper  tooltip-content">
				{{ $t('Twitter') }}
			</div>
			<a slot="reference" rel="noopener" href="https://twitter.com/nextzenos" target="_blank">
				<span class="icon is-small"><i class="casa casa-twitter"></i></span>
			</a>
		</popper>
		
		<popper :options="{
			placement: 'top',
			modifiers: { offset: { offset: '0,4px' } }
		}" enter-active-class="fade-enter-active" leave-active-class="" transition='fade' trigger="hover">
			<div class="popper  tooltip-content">
				{{ $t('Visit our Website') }}
			</div>
			<a slot="reference" rel="noopener"
				:href="this.$i18n.locale === 'vi_vn' ? 'https://nextzenos.com' : 'https://nextzenos.com/en'"
				target="_blank">
				<span class="icon mr-1 ml-2 is-20"><i class="casa casa-language-outline is-size-4"></i></span>
			</a>

		</popper>

		<popper :options="{
			placement: 'top',
			modifiers: { offset: { offset: '0,4px' } }
		}" enter-active-class="fade-enter-active" leave-active-class="" transition='fade' trigger="hover">
			<div class="popper  tooltip-content">
				{{ $t('Share NextZenOS') }}
			</div>
			<a slot="reference" @click="showShareModal">
				<b-icon icon="chat" pack="casa"></b-icon>
			</a>
		</popper>

	</div>
</template>

<script>
import FeedbackPanel from './feedback/FeedbackPanel.vue'
import ShareModal from '@/components/share/ShareModal.vue'
import Popper from 'vue-popperjs';


export default {
	name: "contact-bar",
	components: {
		Popper,
	},
	methods: {
		showFeedback() {
			// messageBus :: feedback
			this.$messageBus('connect_feedback');
			this.$buefy.modal.open({
				parent: this,
				component: FeedbackPanel,
				hasModalCard: true,
				customClass: 'feedback-modal',
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
			})
		},
		showShareModal() {
			// messageBus :: share
			this.$messageBus('connect_sharecasaos');
			this.$buefy.modal.open({
				parent: this,
				component: ShareModal,
				hasModalCard: true,
				customClass: 'network-storage-modal',
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.contact-bar {
	position: fixed;
	right: 1.375rem;
	bottom: 0;
	//z-index: 10;

	a {
		color: #fff;
		margin: 0.625rem;
		display: flex;
		align-items: center;

		&:hover {
			color: #fff;
		}
	}
}

.popper {
	background-color: $primary;
	padding: 0.35rem 0.75rem;
	box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
	border: none;
	color: #ffffff;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 400;
}


@media screen and (max-width: 480px) {
	.contact-bar {
		right: 0;
		bottom: 0rem;
		background-color: transparent;
		backdrop-filter: none;
		display: flex;
		justify-content: center;
		width: 100%;
	}
}
</style>

<style lang="scss">
.popper .popper__arrow {
	border-color: $primary transparent transparent transparent !important;
}
</style>
