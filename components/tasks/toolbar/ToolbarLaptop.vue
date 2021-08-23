<template>
  <v-toolbar
    class="toolbar-control"
    dense
    flat
  >
    <v-row no-gutters>
      <v-btn-toggle>
        <!-- <button-review
          v-if="showApproveButton"
          :is-reviewd="isReviewd"
          @click:review="$emit('click:review')"
        /> -->

        <button-filter
          :value="filterOption"
          @click:filter="changeFilter"
        />

        <button-guideline
          @click:guideline="dialogGuideline=true"
        />
        <v-dialog v-model="dialogGuideline">
          <form-guideline
            :guideline-text="guidelineText"
            @click:close="dialogGuideline=false"
          />
        </v-dialog>

        <button-comment
          @click:comment="dialogComment=true"
        />
        <v-dialog v-model="dialogComment">
          <form-comment
            :doc-id="docId"
            @click:cancel="dialogComment=false"
          />
        </v-dialog>

        <button-auto-labeling
          @click:auto="dialogAutoLabeling=true"
        />
        <v-dialog v-model="dialogAutoLabeling">
          <form-auto-labeling
            :is-enabled="enableAutoLabeling"
            :error-message="errorMessage"
            @click:cancel="dialogAutoLabeling=false"
            @input="updateAutoLabeling"
          />
        </v-dialog>

        <button-clear
          @click:clear="dialogClear=true"
        />
        <v-dialog v-model="dialogClear">
          <form-clear-label
            @click:ok="$emit('click:clear-label');dialogClear=false"
            @click:cancel="dialogClear=false"
          />
        </v-dialog>
        <button-pause v-if="getCurrentUserRole.is_project_admin || getCurrentUserRole.is_annotation_approver" :able-click="isAccess" :approve="approve"
        @click:pass="$emit('click:pass')" />
        <button-undo v-if="getCurrentUserRole.is_project_admin || getCurrentUserRole.is_annotation_approver" :able-click="isAccess" :approve="approve" @click:undo="dialogUndo=true"/>
        <v-dialog v-model="dialogUndo">
          <form-undo-label
            @click:ok="$emit('click:undo-label');dialogUndo=false"
            @click:cancel="dialogUndo=false"
          />
        </v-dialog>
      </v-btn-toggle>
      <slot />
      <v-spacer />
      <button-pagination
        :value="page"
        :total="total"
        @click:prev="updatePage(page - 1)"
        @click:next="updatePage(page + 1)"
        @click:first="updatePage(1)"
        @click:last="updatePage(total)"
        @click:jump="updatePage($event)"
      />
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ButtonAutoLabeling from './buttons/ButtonAutoLabeling.vue'
import ButtonClear from './buttons/ButtonClear.vue'
import ButtonComment from './buttons/ButtonComment.vue'
import ButtonFilter from './buttons/ButtonFilter.vue'
import ButtonGuideline from './buttons/ButtonGuideline.vue'
import ButtonPagination from './buttons/ButtonPagination.vue'
// import ButtonReview from './buttons/ButtonReview.vue'
import ButtonPause from './buttons/ButtonPause.vue'
import ButtonUndo from './buttons/ButtonUndo.vue'
import FormAutoLabeling from './forms/FormAutoLabeling.vue'
import FormClearLabel from './forms/FormClearLabel.vue'
import FormUndoLabel from './forms/FormUndoLabel.vue'
import FormComment from './forms/FormComment.vue'
import FormGuideline from './forms/FormGuideline.vue'

export default Vue.extend({
  components: {
    ButtonAutoLabeling,
    ButtonClear,
    ButtonComment,
    ButtonFilter,
    ButtonGuideline,
    ButtonPagination,
    // ButtonReview,
    ButtonPause,
    ButtonUndo,
    FormAutoLabeling,
    FormClearLabel,
    FormUndoLabel,
    FormComment,
    FormGuideline
  },

  props: {
    docId: {
      type: Number,
      required: true
    },
    enableAutoLabeling: {
      type: Boolean,
      default: false,
      required: true
    },
    guidelineText: {
      type: String,
      default: '',
      required: true
    },
    isReviewd: {
      type: Boolean,
      default: false
    },
    showApproveButton: {
      type: Boolean,
      default: false,
      required: true
    },
    total: {
      type: Number,
      default: 1
    },
    isAccess: {
      type: Boolean,
      default: false
    },
    approve: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      dialogAutoLabeling: false,
      dialogClear: false,
      dialogUndo: false,
      dialogComment: false,
      dialogGuideline: false,
      errorMessage: ''
    }
  },

  computed: {
    ...mapGetters('projects', ['getCurrentUserRole']),
    page(): number {
      // @ts-ignore
      return parseInt(this.$route.query.page, 10)
    },
    filterOption(): string {
      // @ts-ignore
      return this.$route.query.isChecked
    }
  },

  methods: {
    updatePage(page: number) {
      this.$router.push({ query: {
        page: page.toString(),
        isChecked: this.filterOption,
        q: this.$route.query.q
      }})
    },

    changeFilter(isChecked: string) {
      this.$router.push({ query: {
        page: '1',
        isChecked,
        q: this.$route.query.q
      }})
    },
    
    updateAutoLabeling(isEnable: boolean) {
      if (isEnable) {
        this.$emit('update:enable-auto-labeling', true)
      } else {
        this.$emit('update:enable-auto-labeling', false)
      }
    }
  }
})
</script>

<style scoped>
.toolbar-control >>> .v-toolbar__content {
  padding: 0px !important;
}

::v-deep .v-dialog {
  width: 800px;
}
</style>