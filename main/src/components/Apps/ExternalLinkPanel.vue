<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-header">{{ panelTitle }}</h3>
      </div>
      <b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close')" />
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">
      <div class="node-card">
        <div class="mb-0">
          <ValidationObserver ref="ob1">
            <ValidationProvider v-slot="{ errors, valid }" rules="required">
              <b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
                class="is-flex-wrap-nowrap">
                <template #label>
                  {{ $t("Address") }}
                  <label style="color: red">*</label>
                </template>
                <b-autocomplete ref="inputs" v-model="hostname" :data="filteredDataObj"
                  :placeholder="$t('Local URL,Pblic URL')" append-to-body field="hostname" max-height="120px"
                  open-on-focus>
                </b-autocomplete>
              </b-field>
            </ValidationProvider>

            <div v-if="!state_hostIsExist" class="message-alert is-flex is-align-items-center">
              <div class="left mr-2 is-flex is-align-items-center">
                <b-icon icon="danger" pack="casa"></b-icon>
              </div>
              <div class="main is-flex is-align-items-center">
                {{ $t("Eg: //192.168.1.1:5000 or https://www.google.com") }}
              </div>
            </div>

            <ValidationProvider v-slot="{ errors, valid }" rules="required">
              <b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
                class="is-flex-wrap-nowrap">
                <template #label>
                  {{ $t("App Name") }}
                  <label style="color: red">*</label>
                </template>
                <b-input v-model="name" :disabled="disableEditName" :placeholder="$t('Customize your APP name')"
                  max-height="120px">
                </b-input>
              </b-field>
            </ValidationProvider>

            <b-field :label="$t('Icon URL')">
              <p class="control">
                <span class="button is-static container-icon">
                  <b-image :key="icon" :src="icon" :src-fallback="require('@/assets/img/app/default.svg')"
                    class="is-32x32" ratio="1by1"></b-image>
                </span>
              </p>
              <b-input v-model="icon" :placeholder="$t('Your custom icon URL')" expanded></b-input>
            </b-field>
          </ValidationObserver>
        </div>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Connect')" :loading="isLoading" expaned rounded type="is-primary" @click="connect" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import smoothReflow from "vue-smooth-reflow";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import Business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import Business_LinkApp from "@/mixins/app/Business_LinkApp";

export default {
  mixins: [smoothReflow, Business_ShowNewAppTag, Business_LinkApp],
  components: { ValidationProvider, ValidationObserver },
  props: {
    linkName: {
      type: String,
      default: "",
    },
    linkHost: {
      type: String,
      default: "",
    },
    linkIcon: {
      type: String,
      default: "",
    },
    linkType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      hostname: "",
      name: "",
      title: {
        en_us: "",
      },
      icon: "",
      app_type: "",
      isLoading: false,
    };
  },
  computed: {
    filteredDataObj() {
      return this.$store.state.networkStorage;
    },
    state_hostIsExist() {
      return this.hostname === "" ? false : true;
    },
    panelTitle() {
      if (this.linkName === "") {
        return this.$t("Add External Link/APP");
      } else {
        return this.$t("Set External Link/APP");
      }
    },
    disableEditName() {
      return !!this.linkName;
    },
  },
  watch: {},
  created() {
    this.hostname = this.linkHost || "http://";
    this.name = this.linkName;
    this.icon = this.linkIcon;
    this.app_type = this.linkType;
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.inputs.focus();
    });
  },
  methods: {
    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean}
     */
    async checkStep(ref) {
      let isValid = await ref.validate();
      console.log(ref);
      return isValid;
    },

    connect() {
      debugger;
      this.isLoading = true;
      this.checkStep(this.$refs.ob1).then(async (valid) => {
        if (valid) {
          if (this.app_type == 'DefaultApp') {
            await this.connectDefaultApp()
          }
          else {
            await this.connectLinkApp()
          }
        }
      });
    },
    async connectDefaultApp() {
      let listDefaultApp = await this.getDefaultAppList();
      const existingApp = listDefaultApp.find((item) => item.name === this.name);
      if (existingApp) {
        existingApp.hostname = this.hostname;
        existingApp.icon = this.icon;
      }
      // Save the updated list
      this.saveLinkApp(listDefaultApp, this.app_type)
    },
    async connectLinkApp() {
      let listLinkApp = await this.getLinkAppList();

      const existingApp = listLinkApp.find((item) => item.name === this.name);

      if (existingApp) {
        existingApp.hostname = this.hostname;
        existingApp.icon = this.icon;
      } else {
        const newApp = {
          hostname: this.hostname,
          name: this.name,
          icon: this.icon,
          app_type: "LinkApp",
          status: "running",
        };
        listLinkApp = [...listLinkApp, newApp];

        this.addIdToSessionStorage(this.name);
      }

      // Save the updated list
      this.saveLinkApp(listLinkApp, this.app_type);
    },
    getLinkAppByHost() {
      this.$api.sys
        .getProxyRequestContent(this.hostname)
        .then((res) => {
          this.isLoading = false;
          if (res.status == 200) {
            this.name = "";
            this.icon = "https://avatars.githubusercontent.com/u/91336243?s=200&v=4";
          } else {
            this.$buefy.toast.open({
              message: res.data.message,
              type: "is-warning",
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$buefy.toast.open({
            message: err.response.data.message || "NOT FOUND",
            type: "is-danger",
          });
        });
    },

    saveLinkApp(data, app_type) {
      debugger;
      let json = JSON.stringify(data);
      if (app_type === 'DefaultApp') {
        this.$api.users
        .saveDefaultAppList(json)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success == 200) {
            let stor = res.data.data;
            if (stor === "") {
              stor = [];
            }
            this.$emit("updateState");
            this.$emit("close");
          } else {
            this.$buefy.toast.open({
              message: res.data.message,
              type: "is-warning",
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$buefy.toast.open({
            message: err.response.data.message || "NOT FOUND",
            type: "is-danger",
          });
        });
      }
      else {
        this.$api.users
        .saveLinkAppDetail(json)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success == 200) {
            let stor = res.data.data;
            if (stor === "") {
              stor = [];
            }
            this.$emit("updateState");
            this.$emit("close");
          } else {
            this.$buefy.toast.open({
              message: res.data.message,
              type: "is-warning",
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$buefy.toast.open({
            message: err.response.data.message || "NOT FOUND",
            type: "is-danger",
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-card {
  max-width: 40rem;
}

.modal-card-body {
  overflow-y: hidden;
}

.message-alert {
  padding: 0.4rem 1rem;
  margin-bottom: 1.75rem;
  background: #fff7e6;
  border-radius: 4px;
  color: #d99000;
  font-size: 0.875rem;
}
</style>

<style lang="scss">
.network-storage-modal {
  .field-label {
    text-align: left;
  }
}

.smb-media {
  color: #999;
}
</style>
