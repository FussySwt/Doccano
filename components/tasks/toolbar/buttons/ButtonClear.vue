<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
        @click="$emit('click:clear')"
      >
        <v-icon>
          mdi-delete-outline
        </v-icon>
      </v-btn>
    </template>
    <span>{{$t('dataset.clearLabel')}}</span>
  </v-tooltip>
</template>
