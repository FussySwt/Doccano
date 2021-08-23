<template>
  <confirm-form
    title="提示"
    message="你确定要驳回吗?"
    :button-true-text="$t('generic.yes')"
    :button-false-text="$t('generic.cancel')"
    @ok="$emit('click:ok')"
    @cancel="$emit('click:cancel')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import ConfirmForm from '@/components/utils/ConfirmForm.vue'

export default Vue.extend({
  components: {
    ConfirmForm
  }
})
</script>
