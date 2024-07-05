<template>
    <div class="modal-card">
        <section class="modal-card-body">
            <div class="closeOverlay">
                <b-button class="closem" type="is-dark" icon-left="close" label="Close" @click="$parent.close()"
                    style="z-index: 1000;">
                </b-button>
            </div>
            <iframe src="http://10.0.0.4:1081" title="OpenMediaVault"
                style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden;"
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

        }
    },
    methods: {
        setSessionStorage() {
            const iframe = document.querySelector('iframe');
            iframe.contentWindow.postMessage({
                type: 'setSessionStorage',
                data: {
                    username: 'nextzendev',
                    permissions: {
                        role: 'admin'
                    }
                }
            }, 'http://10.0.0.4:1081');
        }
    }
}
</script>
<style lang="scss">
.closem {
    position: fixed;
    left: 50%;
    transform: translate(-50%, -200%);
    top: 15px;
    transition: transform 0.2s ease-in;
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