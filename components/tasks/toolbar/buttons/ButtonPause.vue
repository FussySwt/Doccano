<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        :disabled="approve == 2 ? false : true"
        v-on="on"
        @click="$emit('click:pass')"
      >
        <v-icon>
          mdi-pause-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <span>{{ $t('annotation.access') }}</span>
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
  }
})
</script>
