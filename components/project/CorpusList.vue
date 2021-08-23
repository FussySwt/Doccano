<template>
  <v-data-table
    :value="value"
    :headers="headers"
    :items="items"
    :search="search"
    :single-select="true"
    :loading="isLoading"
    :loading-text="$t('generic.loading')"
    :no-data-text="$t('vuetify.noDataAvailable')"
    :footer-props="{
      'showFirstLastPage': true,
      'items-per-page-text': $t('vuetify.itemsPerPageText'),
      'page-text': $t('dataset.pageText')
    }"
    item-key="id"
    show-select
    @input="$emit('input', $event)"
  >
    <template v-slot:top>
      <v-text-field
        v-model="search"
        prepend-inner-icon="search"
        :label="$t('generic.search')"
        single-line
        hide-details
        filled
      />
    </template>
    <template v-slot:[`item.title`]="{ item }">
      <nuxt-link :to="localePath(`/corpus/${item.id}/dataset`)">
        <span>{{ item.title }}</span>
      </nuxt-link>
    </template>
    <template v-slot:[`item.create_at`]="{ item }">
      <span>{{ item.create_at | dateParse('YYYY-MM-DDTHH:mm:ss') | dateFormat('DD/MM/YYYY HH:mm') }}</span>
    </template>
    <template v-slot:item.action="{ item }">
        <!-- <span v-if="!isEdit">{{item.title}}</span> -->
        <v-btn @click="$emit('updateName', item)">修改</v-btn>
    </template>
    <!-- <template v-slot:[`item.tags`]="{ item }">
      <v-chip
      v-for="tag in item.tags"
      :key="tag.id"
      outlined>{{tag.text}}
      </v-chip>
    </template> -->
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse'
Vue.use(VueFilterDateFormat)
Vue.use(VueFilterDateParse)

export default Vue.extend({
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    items: {
      type: Array,
      default: () => [],
      required: true
    },
    value: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      search: ''
    }
  },

  computed: {
    headers() {
      return [
        { text: this.$t('generic.name'),align:'center', value: 'title' },
        // { text: this.$t('generic.description'), value: 'description' },
        // { text: this.$t('generic.type'), value: 'projectType' },
        { text: '更新时间',align:'center', value: 'create_at' },
        { text: '操作',align:'center', value: 'action' }
        // { text: '标签', value: 'tags'}
      ]
    }
  }
})
</script>
