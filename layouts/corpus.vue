<template>
  <v-app>
    <the-header>
      <template #leftDrawerIcon>
        <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
      </template>
    </the-header>

    <v-navigation-drawer
      v-model="drawerLeft"
      app
      clipped
      color=""
    >
      <corpus-bar
        :link="getLink"
        :selected="selected"
        :role="getCurrentUserRole"
        :project="currentProject"
        :filtered-items="corpusItems"
        @changeSelect="handleChange"
      />
    </v-navigation-drawer>

    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          justify-center
        >
          <v-flex fill-height>
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import CorpusBar from '~/components/layout/CorpusSideBar.vue'
import TheHeader from '~/components/layout/TheHeader'

export default {
  middleware: ['check-auth', 'auth'],

  components: {
    CorpusBar,
    TheHeader
  },

  data() {
    return {
      drawerLeft: null,
      corpusItems: [],
      selected: 0
    }
  },
  computed: {
    ...mapGetters('projects', ['getLink', 'getCurrentUserRole', 'currentProject'])
  },
  async created(){
    const items = await this.$api.getCorpusInfo()
    items.data.data.forEach((item,index)=>{
      if(Number(item.id) === Number(this.$route.params.id)){
        this.selected = index
      }
    })
    this.corpusItems = items.data.data
  },
  methods: {
    handleChange(val){
      this.selected = val
    }
  }
}
</script>
