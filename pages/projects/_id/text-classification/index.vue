<template>
  <layout-text v-if="example.id">
    <template v-slot:header>
      <toolbar-laptop
        :doc-id="example.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="example.isConfirmed"
        :is-access="isAccess"
        :approve="example.corpus_example_content.fields.status"
        :show-approve-button="project.permitApprove"
        :total="totalExample"
        class="d-none d-sm-block"
        @click:clear-label="clearActions(project.id, example.id)"
        @click:review="confirm(project.id)"
        @click:undo-label="clickPass(example.id,1)"
        @click:pass="clickPass(example.id,3)"
      >
        <button-label-switch
          class="ms-2"
          @change="labelComponent=$event"
        />
        <!-- <v-text-field v-if="getCurrentUserRole.is_project_admin"></v-text-field> -->
        <!-- v-if="getCurrentUserRole.is_project_admin" -->
        <div style="display:flex;">
          <!-- <v-text-field
            v-model="search"
          style="height:90%;"
            prepend-inner-icon="search"
            :label="$t('generic.search')"
            single-line
            hide-details
            filled
          /> -->
          <v-btn v-if="getCurrentUserRole.is_annotator || getCurrentUserRole.is_project_admin" style="height:90%;" :disabled="example.corpus_example_content.fields.status == 1 ? false : true" @click="clickPass(example.id, 2)">提交</v-btn>
        </div>
      </toolbar-laptop>
      <toolbar-mobile
        :total="totalExample"
        class="d-flex d-sm-none"
      />
    </template>
    <template v-slot:content>
      <v-card
        v-shortkey="shortKeys"
        @shortkey="annotateOrRemoveLabel(project.id, example.id, $event.srcKey)"
      >
        <v-card-title>
          <component
            :is="labelComponent"
            :labels="labels"
            :annotations="teacherList"
            :single-label="project.singleClassClassification"
            @add="addLabel(project.id,example.id,$event)"
            @remove="removeTeacher(project.id, example.id, $event)"
          />
        </v-card-title>
        <v-divider />
        <v-card-text
          class="title highlight"
          style="white-space: pre-wrap;"
          v-text="example.text"
        />
      </v-card>
    </template>
    <template v-slot:sidebar>
      <list-metadata :metadata="example.meta" />
    </template>
  </layout-text>
</template>

<script>
import { toRefs, useContext, useFetch, ref, watch } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import LabelGroup from '@/components/tasks/textClassification/LabelGroup'
import LabelSelect from '@/components/tasks/textClassification/LabelSelect'
import LayoutText from '@/components/tasks/layout/LayoutText'
import ListMetadata from '@/components/tasks/metadata/ListMetadata'
import ToolbarLaptop from '@/components/tasks/toolbar/ToolbarLaptop'
import ToolbarMobile from '@/components/tasks/toolbar/ToolbarMobile'
import ButtonLabelSwitch from '@/components/tasks/toolbar/buttons/ButtonLabelSwitch'
import { useExampleItem } from '@/composables/useExampleItem'
import { useLabelList } from '@/composables/useLabelList'
import { useProjectItem } from '@/composables/useProjectItem'
import { useTeacherList } from '@/composables/useTeacherList'

export default {
  layout: 'workspace',

  components: {
    ButtonLabelSwitch,
    LabelGroup,
    LabelSelect,
    LayoutText,
    ListMetadata,
    ToolbarLaptop,
    ToolbarMobile
  },

  data() {
    return {
      // search: '',
      isAccess: false,
      isSubmit: false
    }
  },
  computed: {
    ...mapGetters('projects', ['getCurrentUserRole'])
  },
  mounted(){
    console.log(this.exampleState)
  },
  methods: {
    async clickPass(id,state){
      await this.$api.changeRes(`/v1/projects/${this.$route.params.id}/examples/${id}/states`,{status: state})
      this.example.corpus_example_content.fields.status = state
      console.log(state)
      this.isAccess = !this.isAccess
      // if(state === 2 || state === 1){
      //   this.isSubmit = !this.isSubmit
      // }
    },
    async addLabel(a1,a2,a3){
      try{
        this.annotateLabel(a1, a2, a3)
        if(this.example.corpus_example_content.fields.status === 0){
          this.example.corpus_example_content.fields.status = 1
          await this.$api.changeRes(`/v1/projects/${this.$route.params.id}/examples/${this.example.id}/states`,{status: 1})
        }
      }catch(e){
        console.log(e)
      }
    },
    async clearActions(da1, da2){
      try{
        this.clearTeacherList(da1, da2)
        if(this.example.corpus_example_content.fields.status === 1){
          this.example.corpus_example_content.fields.status = 0
          await this.$api.changeRes(`/v1/projects/${this.$route.params.id}/examples/${this.example.id}/states`,{status: 0})
        }
      }catch(e){
        console.log(e)
      }
    }
  },
  setup() {
    const { app, params, query } = useContext()
    const projectId = params.value.id
    const { state: projectState, getProjectById } = useProjectItem()
    const { state: exampleState, confirm, getExample } = useExampleItem()
    const {
      state: teacherState,
      annotateLabel,
      annotateOrRemoveLabel,
      autoLabel,
      clearTeacherList,
      getTeacherList,
      removeTeacher
    } = useTeacherList(app.$services.textClassification)
    const enableAutoLabeling = ref(false)
    const { state: labelState, getLabelList, shortKeys } = useLabelList()
    const labelComponent = ref('label-group')

    getLabelList(projectId)
    getProjectById(projectId)

    const { fetch } = useFetch(async() => {
      await getExample(
        projectId,
        query.value
      )
      if (enableAutoLabeling.value) {
        try {
          await autoLabel(projectId, exampleState.example.id)
        } catch(e) {
          enableAutoLabeling.value = false
          alert(e.response.data.detail)
        }
      } else {
        await getTeacherList(projectId, exampleState.example.id)
      }
    })
    watch(query, fetch)

    return {
      ...toRefs(labelState),
      ...toRefs(projectState),
      ...toRefs(teacherState),
      ...toRefs(exampleState),
      confirm,
      annotateLabel,
      annotateOrRemoveLabel,
      clearTeacherList,
      enableAutoLabeling,
      labelComponent,
      removeTeacher,
      shortKeys,
    }
  },
  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(query.page)
  }
}
</script>
