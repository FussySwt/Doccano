<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        :disabled="approve == 2 ? false : true"
        v-on="on"
        @click="handleClick"
      >
        <v-icon>
          mdi-undo
        </v-icon>
      </v-btn>
    </template>
    <span>{{ $t('annotation.undo') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    ableClick: {
      type: Boolean,
      default: false
    },
    approve: {
      type: Number,
      default: 1
    }
  },
  methods: {
      handleClick(){
          console.log(123)
          this.$emit('click:undo')
      }
  },
})
</script>
