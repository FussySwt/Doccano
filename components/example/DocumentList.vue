<template>
  <v-data-table
    :value="value"
    :headers="headers"
    :items="items"
    :options.sync="options"
    :server-items-length="total"
    :search="search"
    :loading="isLoading"
    :loading-text="$t('generic.loading')"
    :no-data-text="$t('vuetify.noDataAvailable')"
    :footer-props="{
      'showFirstLastPage': true,
      'items-per-page-options': [10, 50, 100],
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
    <template v-slot:[`item.filename`]="{ item }">
      <span>{{item.filename.substring(item.filename.lastIndexOf('part'))}}</span>
    </template>
    <template v-slot:[`item.text`]="{ item }">
      <span class="d-flex d-sm-none">{{ item.text | truncate(50) }}</span>
      <span class="d-none d-sm-flex">{{ item.text | truncate(200) }}</span>
    </template>
    <template v-slot:[`item.createdAt`]="{ item }">
        <span>{{ item.createdAt | dateParse('YYYY-MM-DDTHH:mm:ss') | dateFormat('DD/MM/YYYY HH:mm') }}</span>
    </template>
    <template v-slot:[`item.meta`]="{ item }">
      {{ JSON.stringify(item.meta, null, 4) }}
    </template>
    <template v-slot:[`item.commentCount`]="{ item }">
      <span> {{ item.commentCount }} </span>
    </template>
    <template v-slot:[`item.action`]="{ item }">
      <v-btn
        small
        color="primary text-capitalize"
        @click="toLabeling(item)"
      >
        {{ $t('dataset.annotate') }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DataOptions } from 'vuetify/types'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse'
import { ExampleDTO } from '~/services/application/example/exampleData'
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
      type: Array as PropType<ExampleDTO[]>,
      default: () => [],
      required: true
    },
    value: {
      type: Array as PropType<ExampleDTO[]>,
      default: () => [],
      required: true
    },
    total: {
      type: Number,
      default: 0,
      required: true
    }
  },

  data() {
    return {
      search: this.$route.query.q,
      options: {} as DataOptions,
    }
  },

  computed: {
    headers() {
      return [
        // {
        //   text: this.$t('dataset.corpus'),
        //   value: 'corpus',
        //   sortable: false
        // },
        {
          text: this.$t('dataset.part'),
          align: 'center',
          value: 'filename',
          sortable: false
        },
        {
          text: this.$t('dataset.title'),
          align: 'center',
          value: 'corpus_info_content',
          sortable: false
        },
        {
          text: this.$t('dataset.text'),
          align: 'center',
          value: 'text',
          sortable: false
        },
        // {
        //   text: this.$t('dataset.attribute'),
        //   value: 'attribute',
        //   sortable: false
        // },
        {
          text: this.$t('dataset.metadata'),
          align: 'center',
          value: 'meta',
          sortable: false
        },
        {
          text: this.$t('comments.comments'),
          align: 'center',
          value: 'commentCount',
          sortable: false
        },
        {
          text: this.$t('dataset.importTimes'),
          align: 'center',
          value: 'createdAt'
        },
        {
          text: this.$t('dataset.status'),
          align: 'center',
          value: 'corpus_example_content.fields.status',
          sortable: false
        },
        {
          text: this.$t('dataset.action'),
          align: 'center',
          value: 'action',
          sortable: false
        }
      ]
    }
  },

  watch: {
    options: {
      handler() {
        this.$emit('update:query', {
          query: {
            limit: this.options.itemsPerPage.toString(),
            offset: ((this.options.page - 1) * this.options.itemsPerPage).toString(),
            q: this.search
          }
        })
      },
      deep: true
    },
    search() {
      this.$emit('update:query', {
        query: {
          limit: this.options.itemsPerPage.toString(),
          offset: '0',
          q: this.search
        }
      })
      this.options.page = 1
    }
  },

  methods: {
    toLabeling(item: ExampleDTO) {
      const index = this.items.indexOf(item)
      const offset = (this.options.page - 1) * this.options.itemsPerPage
      const page = (offset + index + 1).toString()
      this.$emit('click:labeling', { page, q: this.search })
    }
  }
})
</script>
