<template>
  <base-card
    :title="$t('overview.deleteProjectTitle')"
    :agree-text="$t('generic.yes')"
    :cancel-text="$t('generic.cancel')"
    @agree="$emit('remove')"
    @cancel="$emit('cancel')"
  >
    <template #content>
      {{ $t('overview.deleteProjectMessage') }}
      <v-list dense>
        <v-list-item v-for="(item, i) in selected" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <span v-show="hasNonDeletableProjects" class="font-weight-bold">
        You don't have permission to delete the following projects. We try to delete the projects except for the following.
      </span> -->
      <!-- <v-list dense>
        <v-list-item v-for="(item, i) in nonDeletableProjects" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
    </template>
  </base-card>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseCard from '@/components/utils/BaseCard.vue'
import { ProjectDTO } from '~/services/application/project/projectData'

export default Vue.extend({
  components: {
    BaseCard
  },

  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    // nonDeletableProjects(): ProjectDTO[] {
    //   return this.selected
    // },
    // hasNonDeletableProjects(): boolean {
    //   return this.nonDeletableProjects.length > 0
    // }
  }
})
</script>
