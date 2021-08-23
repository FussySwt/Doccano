<template>
  <action-menu
    :items="items"
    :text="$t('dataset.actions')"
    @uploadCorpus="$emit('uploadCorpus')"
    @downloadCorpus="$emit('downloadCorpus')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import ActionMenu from '~/components/utils/ActionMenu.vue'

export default Vue.extend({
  components: {
    ActionMenu
  },

  computed: {
    items() {
        return [
          {
            title: this.$t('dataset.uploadCorpus'),
            icon: 'mdi-upload',
            event: 'uploadCorpus'
          },
          {
            title: this.$t('dataset.downloadCorpus'),
            icon: 'mdi-download',
            event: 'downloadCorpus'
          }
      ]
    }
  }
})
</script>
