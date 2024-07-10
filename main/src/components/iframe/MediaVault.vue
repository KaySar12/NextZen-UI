<template>
    <div class="modal-card">
        <section class="modal-card-body">
            <div class="iframe-div">
                <b-button class="iframe-closebtn" type="is-dark" icon-left="close" label="Close"
                    @click="$parent.close()" style="z-index: 1000;">
                </b-button>
                <b-button class="iframe-reloadbtn" type="is-dark" icon-left="reload" label="Reload" @click="reload()"
                    style="z-index: 1000;">
                </b-button>
            </div>
            <iframe id="omv-iframe" :src="omvAddress" title="OpenMediaVault"
                style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin-top:2.75rem ; padding:0; overflow:hidden;"
                @load="setSessionStorage()"></iframe>
        </section>
    </div>
</template>
<script>
export default {
    name: "media-vault",
    components: {},
    data() {
        return {
            omvAddress: `${process.env.OMV_APP_IP}:${process.env.OMV_APP_PORT}`,
        }
    },
    methods: {
        setSessionStorage() {
            debugger;
            var username = JSON.parse(localStorage.getItem('user'))?.username || '';
            var role = JSON.parse(localStorage.getItem('user'))?.role || '';
            var permissions = {
                role: role
            }
            const iframe = document.getElementById('omv-iframe');
            iframe.contentWindow.postMessage({
                type: 'setSessionStorage',
                data: {
                    username: username,
                    permissions: permissions,
                }
            }, this.omvAddress);
        },
        reload() {
            document.getElementById('omv-iframe').src = document.getElementById('omv-iframe').src
        }
    }
}
</script>
<style lang="scss">
.iframe-closebtn {
    position: fixed;
    left: 95%;
    transform: translate(-50%, 0%);

    transition: transform 0.2s ease-in;
}

.iframe-reloadbtn {
    position: fixed;
    left: 90%;
    transform: translate(-50%, 0%);
    transition: transform 0.2s ease-in;
}

.iframe-div {
    display: flex;
    position: fixed;
    top: 0.5rem;
}

.closeOverlay {
    position: fixed;
    top: 0;
    left: 20%;
    right: 20%;
    height: 4rem;
    z-index: 1000;

    &:hover {
        .closem {
            transform: translate(-50%, 0)
        }
    }
}
</style>