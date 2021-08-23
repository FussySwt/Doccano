<template>
  <v-card>
    <!-- 语料库列表顶部按钮 -->
    <v-card-title>
      <v-btn
        class="text-capitalize"
        color="primary"
        @click.stop="dialogCreate=true"
      >
        {{ $t('generic.create') }}
      </v-btn>
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete=true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <!-- 创建语料库对话框 -->
      <v-dialog v-model="dialogCreate">
        <base-card
            :disabled="!valid"
            :title="$t('overview.createProjectTitle')"
            :agree-text="$t('generic.save')"
            :cancel-text="$t('generic.cancel')"
            @agree="handleSave"
            @cancel="dialogCreate = false"
        >
            <template #content>
                <v-form v-model="valid">
                    <v-text-field
                        v-model="createName"
                        :rules="projectNameRules($t('rules.projectNameRules'))"
                        :label="$t('overview.projectName')"
                        prepend-icon="mdi-account-multiple"
                        required
                        autofocus
                    />
                </v-form>
            </template>
        </base-card>
      </v-dialog>
      <!-- 删除语料库对话框 -->
      <v-dialog v-model="dialogDelete">
        <corpus-delete
          :selected="selected"
          @cancel="dialogDelete=false"
          @remove="remove"
        />
      </v-dialog>
    </v-card-title>
    <!-- 语料库列表 -->
    <corpus-list
      v-model="selected"
      :items="items"
      :is-loading="isLoading"
      @updateName="checkEdit"
      />
    <v-row justify="center">
      <!-- 修改语料库信息对话框 -->
      <v-dialog
          v-model="isEditVisible"
          persistent
          max-width="600px"
          >
          <v-card style="overflow-x:hidden;">
              <v-row align="center" class="d-flex justify-center" style="padding-top:30px;">
                  <v-col
                      class="d-flex"
                      cols="10"
                      sm="10"
                  >
                      <v-text-field
                      v-model="titleInput"
                      label="名称"
                      ></v-text-field>
                  </v-col>
              </v-row>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="isEditVisible = false"
                  >
                      取消
                  </v-btn>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="clickUpdate"
                  >
                      确定
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import CorpusList from '@/components/project/CorpusList.vue'
import { projectNameRules } from '@/rules/index'
import BaseCard from '@/components/utils/BaseCard.vue'
import CorpusDelete from '~/components/project/CorpusDelete.vue'

export default Vue.extend({
  layout: 'projects',

  middleware: ['check-auth', 'auth'],

  components: {
    CorpusDelete,
    CorpusList,
    BaseCard
  },

  // 获取所有语料库信息
  async fetch() {
    this.isLoading = true
    const item = await this.$api.getCorpusInfo()
    this.items = item.data.data || []
    console.log(this.items)
    this.isLoading = false
  },

  data() {
    return {
        projectNameRules,
        // 新建对话框中的语料库名称
        createName: '',
        // 是否激活对话框
        valid: false,
        // 选中的语料库的id
        selectId: '',
        // 修改语料库对话框中的语料库名称
        titleInput: '',
        // 是否激活修改语料库对话框
        isEditVisible: false,
        // 是否激活创建语料库对话框
        dialogCreate: false,
        // 是否激活删除语料库对话框
        dialogDelete: false,
        // 语料库列表
        items: [],
        // 选中的语料库
        selected: [] as any,
        // 表格是否在加载中
        isLoading: false
    }
  },

  computed: {
    // 计算属性：判断删除按钮是否激活
    canDelete(): boolean {
      return this.selected.length > 0
    },
  },

  methods: {
    // 创建语料库
    async handleSave() {
        try{
            const res = await this.$api.createCorpus({
              title: this.createName
            })
            if(res.data.code === 0){
              this.dialogCreate = false
              this.createName = ''
              this.$fetch()
            }
        }catch(e){
          console.log(e)
        }
    },
    // 点击修改语料库
    checkEdit(data: any){
        this.selectId = data.id
        this.titleInput = data.title
        this.isEditVisible = true
    },
    // 确认修改语料库
    async clickUpdate(){
      // console.log('修改语料')
      try{
        await this.$api.corpusRepository({
          id: this.selectId,
          title: this.titleInput
        })
        this.isEditVisible = false
        this.isLoading = true
        const item = await this.$api.getCorpusInfo()
        this.items = item.data.data || []
        this.isLoading = false
      }catch(e){
        console.log(e)
      }
    },
    // 确认删除语料库
    async remove() {
      // await this.$services.project.bulkDelete(this.selected)
      if(this.selected[0].id){
        await this.$api.removeCorpus({id: this.selected[0].id})
        this.$fetch()
        this.dialogDelete = false
        this.selected = []
      }
    },
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
