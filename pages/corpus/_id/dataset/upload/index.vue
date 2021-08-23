<!-- 导入语料页面 -->
<template>
  <v-card>
    <v-card-title>
      {{ $t('dataset.importDataTitle') }}
    </v-card-title>
    <v-card-text>
      <v-overlay :value="taskId">
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
      <v-select
        v-model="selected"
        :items="catalog"
        item-text="name"
        :label="$t('dataset.fileFormat')"
        outlined
      />
      <v-form v-model="valid">
        <v-text-field
          v-if="selected == 'TextFile'"
          v-model="uploadInfo.title"
          placeholder="请输入标题"
          label="标题"
          outlined
        />
        <v-text-field
          v-if="selected == 'TextFile'"
          v-model="uploadInfo.organization"
          placeholder="请输入机构"
          label="机构"
          outlined
        />
        <v-text-field
          v-if="selected == 'TextFile'"
          v-model="uploadInfo.author"
          placeholder="请输入作者"
          label="作者"
          outlined
        />
      </v-form>
      <v-sheet
        v-if="selected"
        :dark="!$vuetify.theme.dark"
        :light="$vuetify.theme.dark"
        class="mb-5 pa-5"
      >
      <pre>{{ example }}</pre>
      </v-sheet>
      <!-- <file-pond
        v-if="selected && acceptedFileTypes !== '*'"
        ref="pond"
        chunk-uploads="true"
        label-idle="Drop files here..."
        :allow-multiple="true"
        :accepted-file-types="acceptedFileTypes"
        :server="server"
        :files="myFiles"
        @processfile="handleFilePondProcessfile"
        @removefile="handleFilePondRemovefile"
      /> -->
      <file-pond
        v-if="selected && acceptedFileTypes === '*'"
        ref="pond"
        chunk-uploads="true"
        label-idle="Drop files here..."
        :allow-multiple="true"
        :server="server"
        :files="myFiles"
        @processfile="handleFilePondProcessfile"
        @removefile="handleFilePondRemovefile"
      />
      <v-file-input
      v-if="selected && acceptedFileTypes !== '*'"
        label="File input"
        @change="fileChange"
      ></v-file-input>
      <v-data-table
        v-if="errors.length > 0"
        :headers="headers"
        :items="errors"
        class="elevation-1"
      ></v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        class='text-capitalize me-2 primary'
        :disabled="isDisabled"
        @click="injest"
      >
        <!-- Injest -->
        {{ $t('dataset.injest') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Cookies from 'js-cookie'
import vueFilePond from "vue-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
)

export default {
  layout: 'corpus',

  components: {
    FilePond,
  },
  data() {
    return {
      fileObj: {},
      catalog: [],
      selectType: '',
      selected: null,
      isDisabled: true,
      uploadInfo: {
        title: '',
        organization: '',
        author: ''
      },
      myFiles: [],
      option: {'column_data': '', 'column_label': '', 'delimiter': ''},
      taskId: null,
      polling: null,
      errors: [],
      headers: [
        { text: 'Filename', value: 'filename' },
        { text: 'Line', value: 'line' },
        { text: 'Message', value: 'message' }
      ],
      requiredRules: [
        v => !!v || 'Field value is required'
      ],
      server: {
        url: '/v1/fp',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        process: {
          url: '/process/',
          method: 'POST',
        },
        patch: '/patch/',
        revert: '/revert/',
        restore: '/restore/',
        load: '/load/',
        fetch: '/fetch/'
      },
      uploadedFiles: [],
      valid: false,
    }
  },

  computed: {
    // isDisabled() {
    //   // return this.fileObj !== {}
    // },
    properties() {
      const item = this.catalog.find(item => item.name === this.selected)
      if (item) {
        return item.properties
      } else {
        return {}
      }
    },
    textFields() {
      const asArray = Object.entries(this.properties)
      const textFields = asArray.filter(([key, value]) => !('enum' in value))
      return Object.fromEntries(textFields)
    },
    selectFields() {
      const asArray = Object.entries(this.properties)
      const textFields = asArray.filter(([key, value]) => 'enum' in value)
      return Object.fromEntries(textFields)
    },
    acceptedFileTypes() {
      const item = this.catalog.find(item => item.name === this.selected)
      if (item) {
        return item.acceptTypes
      } else {
        return ''
      }
    },
    example() {
      console.log(this.catalog)
      const item = this.catalog.find(item => item.name === this.selected)
      if (item) {
        const column_data = 'column_data'
        const column_label = 'column_label'
        console.log(item)
        if (column_data in this.option && column_label in this.option) {
          return item.example.replaceAll(column_data, this.option[column_data])
                             .replaceAll(column_label, this.option[column_label])
                             .trim()
        } else {
          return item.example.trim()
        }
      } else {
        return ''
      }
    }
  },

  watch: {
    selected(val) {
      const item = this.catalog.find(item => item.name === this.selected)
      for (const [key, value] of Object.entries(item.properties)) {
        this.option[key] = value.default
      }
      this.myFiles = []
      for (const file of this.uploadedFiles) {
        this.$services.parse.revert(file.serverId)
      }
      this.uploadedFiles = []
      this.errors = []
    }
  },

  created() {
    // this.catalog = await this.$services.catalog.list(this.$route.params.id)
    // 上传预料的格式规范
    this.catalog = [{"name":"TextFile","accept_types":"text/*","title":"OptionEncoding","type":"object","properties":{"encoding":{"title":"Encoding","default":"utf_8","enum":["Auto","ascii","big5","big5hkscs","cp037","cp273","cp424","cp437","cp500","cp720","cp737","cp775","cp850","cp852","cp855","cp856","cp857","cp858","cp860","cp861","cp862","cp863","cp864","cp865","cp866","cp869","cp874","cp875","cp932","cp949","cp950","cp1006","cp1026","cp1125","cp1140","cp1250","cp1251","cp1252","cp1253","cp1254","cp1255","cp1256","cp1257","cp1258","cp65001","euc_jp","euc_jis_2004","euc_jisx0213","euc_kr","gb2312","gbk","gb18030","hz","iso2022_jp","iso2022_jp_1","iso2022_jp_2","iso2022_jp_2004","iso2022_jp_3","iso2022_jp_ext","iso2022_kr","latin_1","iso8859_2","iso8859_3","iso8859_4","iso8859_5","iso8859_6","iso8859_7","iso8859_8","iso8859_9","iso8859_10","iso8859_11","iso8859_13","iso8859_14","iso8859_15","iso8859_16","johab","koi8_r","koi8_t","koi8_u","kz1048","mac_cyrillic","mac_greek","mac_iceland","mac_latin2","mac_roman","mac_turkish","ptcp154","shift_jis","shift_jis_2004","shift_jisx0213","utf_32","utf_32_be","utf_32_le","utf_16","utf_16_be","utf_16_le","utf_7","utf_8","utf_8_sig"],"type":"string"}},"example":"\n├── 202104210943.txt\n├── 202104210944.txt\n└── 202104210945.txt\n"},{"name":"JSON","accept_types":"application/json","title":"OptionColumn","type":"object","properties":{"encoding":{"title":"Encoding","default":"utf_8","enum":["Auto","ascii","big5","big5hkscs","cp037","cp273","cp424","cp437","cp500","cp720","cp737","cp775","cp850","cp852","cp855","cp856","cp857","cp858","cp860","cp861","cp862","cp863","cp864","cp865","cp866","cp869","cp874","cp875","cp932","cp949","cp950","cp1006","cp1026","cp1125","cp1140","cp1250","cp1251","cp1252","cp1253","cp1254","cp1255","cp1256","cp1257","cp1258","cp65001","euc_jp","euc_jis_2004","euc_jisx0213","euc_kr","gb2312","gbk","gb18030","hz","iso2022_jp","iso2022_jp_1","iso2022_jp_2","iso2022_jp_2004","iso2022_jp_3","iso2022_jp_ext","iso2022_kr","latin_1","iso8859_2","iso8859_3","iso8859_4","iso8859_5","iso8859_6","iso8859_7","iso8859_8","iso8859_9","iso8859_10","iso8859_11","iso8859_13","iso8859_14","iso8859_15","iso8859_16","johab","koi8_r","koi8_t","koi8_u","kz1048","mac_cyrillic","mac_greek","mac_iceland","mac_latin2","mac_roman","mac_turkish","ptcp154","shift_jis","shift_jis_2004","shift_jisx0213","utf_32","utf_32_be","utf_32_le","utf_16","utf_16_be","utf_16_le","utf_7","utf_8","utf_8_sig"],"type":"string"},"column_data":{"title":"Column Data","default":"baseinfo","type":"string"},"column_label":{"title":"Column Label","default":"label","type":"string"}},"example":"\n{\n        \"column_data\": {\n            \"title\":xxx,\n            \"corpustype\":xxx,\n            \"annotationtype\": xxx,\n            \"organ\": xxx,\n            \"author\": xxx,\n            \"abstraction\": xxx \\n xxx \\n xxx\n        },\n        \"content\": {\n            \"part1\": xxx,\n            \"part2\": xxx,\n            \"part3\": xxx,\n            \"part4\": xxx\n        }\n}\n"}]
    this.pollData()
  },

  beforeDestroy() {
	  clearInterval(this.polling)
  },

  methods: {
    handleFilePondProcessfile(error, file) {
      console.log(error)
      this.uploadedFiles.push(file)
      this.$nextTick()
    },
    fileChange(val){
      if(val){
        this.selectType = val.type
        this.fileObj = val
        this.isDisabled = false
        console.log(this.fileObj)
      }else{
        this.isDisabled = true
      }
    },
    handleFilePondRemovefile(error, file) {
      console.log(error)
      const index = this.uploadedFiles.findIndex(item => item.id === file.id)
      if (index > -1) {
          this.uploadedFiles.splice(index, 1)
          this.$nextTick()
      }
    },
    async injest() {
      console.log(this.selected)
      if(this.selected === 'TextFile'){
        if(!this.uploadInfo.title || !this.uploadInfo.organization || !this.uploadInfo.author){
         alert('请将信息填写完整！')
        }else{
          if(this.selectType !== 'text/plain'){
            alert('请上传txt文件！')
            return
          }
          const fd = new FormData()
          fd.append('file', this.fileObj)
          fd.append('corpusRepositoryId', this.$route.params.id)
          fd.append('title', this.uploadInfo.title)
          fd.append('organ', this.uploadInfo.organization)
          fd.append('author', this.uploadInfo.author)
          const res = await this.$api.uploadCorpus(fd)
          if(res.data.code !== 0){
            alert('请求异常！')
          }else{
            alert('导入成功！')
            this.$router.back()
          }
        }
      }else{
        if(this.selectType !== 'application/json'){
            alert('请上传json文件！')
            return
          }
        const fd = new FormData()
        fd.append('file', this.fileObj)
        fd.append('corpusRepositoryId', this.$route.params.id)
        fd.append('title', this.uploadInfo.title)
        fd.append('organ', this.uploadInfo.organization)
        fd.append('author', this.uploadInfo.author)
        const res = await this.$api.uploadCorpus(fd)
        if(res.data.code !== 0){
          alert('请求异常！')
        }else{
          alert('导入成功！')
          this.$router.back()
        }
      }
      
      // this.taskId = await this.$services.parse.analyze(
      //   this.$route.params.id,
      //   this.selected,
      //   this.uploadedFiles.map(item => item.serverId),
      //   this.option
      // )
    },
    pollData() {
		  this.polling = setInterval(async() => {
        if (this.taskId) {
          const res = await this.$services.taskStatus.get(this.taskId)
          if (res.ready) {
            this.taskId = null
            this.errors = res.result.error
            this.myFiles = []
            this.uploadedFiles = []
          }
        }
  		}, 3000)
	  },
    toVisualize(text) {
      if (text === '\t') {
        return 'Tab'
      } else if (text === ' ') {
        return 'Space'
      } else if (text === '') {
        return 'None'
      } else {
        return text
      }
    }
  },
};
</script>
