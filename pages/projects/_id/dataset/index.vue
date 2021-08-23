<template>
  <v-card>
    <v-card-title>
      <!-- <action-menu
        @uploadCorpus="uploadCorpus"
        @upload="upload"
        @download="dialogDownload=true"
      /> -->
      <v-btn class="blue darken-1 white--text" @click="uploadCorpus">{{$t('dataset.importCorpus')}}</v-btn>
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete=true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <v-spacer />
      <v-btn
        :disabled="!item.count"
        class="text-capitalize"
        color="error"
        @click="dialogDeleteAll=true"
      >
        {{ $t('generic.deleteAll') }}
      </v-btn>
      <v-dialog v-model="dialogDelete">
        <form-delete
          :selected="selected"
          :item-key="itemKey"
          @cancel="dialogDelete=false"
          @remove="remove"
        />
      </v-dialog>
      <v-dialog v-model="dialogDeleteAll">
        <form-delete-bulk
          @cancel="dialogDeleteAll=false"
          @remove="removeAll"
        />
      </v-dialog>
      <v-dialog v-model="dialogDownload">
        <form-download
          @cancel="dialogDownload=false"
        />
      </v-dialog>
    </v-card-title>
    <v-row align="center">
        <v-col
            class="d-flex"
            cols="4"
            sm="4"
        >
            <v-subheader>
            状态：
            </v-subheader>
            <v-select
            v-model="selectStatus"
            :items="statusItems"
            item-text="state"
            item-value="abbr"
            label="状态"
            solo
            @change="statusChange"
            ></v-select>
        </v-col>
    </v-row>
    <image-list
      v-if="isImageTask"
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <audio-list
      v-else-if="isAudioTask"
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <document-list
      v-else
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import DocumentList from '@/components/example/DocumentList.vue'
import FormDelete from '@/components/example/FormDelete.vue'
import FormDeleteBulk from '@/components/example/FormDeleteBulk.vue'
import FormDownload from '@/components/example/FormDownload.vue'
import ImageList from '~/components/example/ImageList.vue'
import AudioList from '~/components/example/AudioList.vue'
import { ExampleListDTO, ExampleDTO } from '~/services/application/example/exampleData'
// import ActionMenu from '~/components/example/ActionMenu.vue'
import { ProjectDTO } from '~/services/application/project/projectData'

export default Vue.extend({
  layout: 'project',

  components: {
    // ActionMenu,
    AudioList,
    DocumentList,
    ImageList,
    FormDelete,
    FormDeleteBulk,
    FormDownload,
  },

  async fetch() {
    this.isLoading = true
    const obj = JSON.parse(JSON.stringify(this.$route.query))
    console.log(this.selectStatus)
    obj.status = this.selectStatus
    this.item = await this.$services.example.list(this.projectId, obj)
    for(const entry of this.item.items){
      switch(entry.corpus_example_content.fields.status){
        case 0:
          entry.corpus_example_content.fields.status = '未标注'
          break
        case 1:
          entry.corpus_example_content.fields.status = '标注中'
          break
        case 2:
          entry.corpus_example_content.fields.status = '未审核'
          break
        case 3:
          entry.corpus_example_content.fields.status = '已审核'
          break
      }
    }
    this.isLoading = false
  },

  data() {
    return {
      dialogDelete: false,
      dialogDeleteAll: false,
      dialogDownload: false,
      project: {} as ProjectDTO,
      item: {} as ExampleListDTO,
      selected: [] as ExampleDTO[],
      isLoading: false,
      selectType: {state: '全部',abbr: 'all'},
      selectStatus: '',
      typeItems: [{state: '全部',abbr: 'all'},{state: '语料库',abbr: 'corpus'},{state: '标题',abbr: 'title'},{state: '摘要',abbr: 'abstract'},{state: '属性',abbr: 'prop'}],
      statusItems: [{state: '全部',abbr: ''},{state: '未审核',abbr: '2'},{state: '已审核',abbr: '3'},{state: '未标注',abbr: '0'},{state: '已标注',abbr: '1'}]
    }
  },

  computed: {
    canDelete(): boolean {
      return this.selected.length > 0
    },
    projectId(): string {
      return this.$route.params.id
    },
    isImageTask(): boolean {
      return this.project.projectType === 'ImageClassification'
    },
    isAudioTask(): boolean {
      return this.project.projectType === 'Speech2text'
    },
    itemKey(): string {
      if (this.isImageTask || this.isAudioTask) {
        return 'filename'
      } else {
        return 'text'
      }
    }
  },

  watch: {
    '$route.query': _.debounce(function() {
        // @ts-ignore
        this.$fetch()
      }, 1000
    ),
  },

  async created() {
    this.project = await this.$services.project.findById(this.projectId)
    console.log(this.project)
  },

  methods: {
    async remove() {
      await this.$services.example.bulkDelete(this.projectId, this.selected)
      this.$fetch()
      this.dialogDelete = false
      this.selected = []
    },
    async removeAll() {
      await this.$services.example.bulkDelete(this.projectId, [])
      this.$fetch()
      this.dialogDeleteAll = false
      this.selected = []
    },
    upload() {
      this.$router.push(`/projects/${this.projectId}/upload`)
    },
    uploadCorpus(){
      this.$router.push(`/projects/${this.projectId}/uploadCorpus`)
    },
    updateQuery(query: object) {
      console.log(query)
      this.$router.push(query)
    },
    movePage(query: object) {
      console.log(this.project)
      this.updateQuery({
        path: this.localePath(this.project.pageLink),
        query
      })
    },
    statusChange(val:any){
      this.$fetch()
    },
    codeToWord(val: any){
      switch(val){
        case '0':
          return '未标注'
        case '1':
          return '标注中'
        case '2':
          return '未审核'
        case '3':
          return '已审核'
        default:
          return ''
      }
    }
  },

  validate({ params, query }) {
    // @ts-ignore
    return /^\d+$/.test(params.id) && /^\d+|$/.test(query.limit) && /^\d+|$/.test(query.offset)
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
