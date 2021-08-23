<template>
  <action-menu
    :items="items"
    :text="$t('dataset.actions')"
    @create="$emit('create')"
    @upload="$emit('upload')"
    @uploadCorpus="$emit('uploadCorpus')"
    @download="$emit('download')"
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
            title: this.$t('dataset.importCorpus'),
            icon: 'mdi-upload',
            event: 'uploadCorpus'
          },
          {
            title: this.$t('dataset.importDataset'),
            icon: 'mdi-upload',
            event: 'upload'
          },
          {
            title: this.$t('dataset.exportDataset'),
            icon: 'mdi-download',
            event: 'download'
          }
      ]
    }
  }
})
</script>
