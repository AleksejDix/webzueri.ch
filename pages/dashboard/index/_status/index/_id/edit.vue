<template>
  <modal-window @close="$router.go(-1)">
    <div slot="title">
      <div class="flex owl-x">
        <div>{{ $route.params.status | capitalize }}</div>
        <Badge color="red" v-if="current && current.status === 'proposal'"
          >locked</Badge
        >
      </div>
    </div>
    <dynamic-component
      v-if="current"
      class="flex flex-col flex-1"
      :data="current"
      :settings="{
        path: 'forms-update',
        type: $route.params.status
      }"
    />
    <div slot="aside">
      <div class="w-3/5 mx-auto">
        <Ratio :width="999" :height="834">
          <img
            src="~assets/svg/undraw_setup_wizard_r6mr.svg"
            alt="Crafting a new Story"
            loading="lazy"
          />
        </Ratio>
      </div>
    </div>
  </modal-window>
</template>

<script>
import DynamicComponent from "@/components/dynamic/";
import ModalWindow from "@/components/ModalWindow";
export default {
  components: { DynamicComponent, ModalWindow },
  computed: {
    current() {
      return this.$store.state.dashboard[this.$route.params.status].current;
    }
  },
  fetch({ store, params }) {
    return store.dispatch(`dashboard/${params.status}/get`, params.id);
  }
};
</script>
