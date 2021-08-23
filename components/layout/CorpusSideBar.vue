<template>
  <v-list dense>
    <v-list-item-group
      v-model="select"
      mandatory
    >
      <v-list-item
        v-for="(item, i) in filteredItems"
        :key="i"
        @change="$emit('changeSelect', i)"
        @click="$router.push(localePath(`/corpus/${item.id}/dataset`))"
      >
        <!-- <v-list-item-action>
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-list-item-action> -->
        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: '',
      required: true
    },
    role: {
      type: Object,
      default: () => {},
      required: true
    },
    project: {
      type: Object,
      default: () => {},
      required: true
    },
    filteredItems: {
        type: Array,
        default: () => {},
        required: true
    },
    selected: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      select: this.selected
    }
  },

//   computed: {
//     filteredItems() {
//       const items = [
//         {
//           icon: 'mdi-home',
//           text: this.$t('projectHome.home'),
//           link: '',
//           isVisible: true
//         },
//         {
//           icon: 'mdi-database',
//           text: this.$t('dataset.dataset'),
//           link: 'dataset',
//           isVisible: this.role.is_project_admin
//         },
//         {
//           icon: 'label',
//           text: this.$t('labels.labels'),
//           link: 'labels',
//           isVisible: this.role.is_project_admin && this.project.canDefineLabel
//         },
//         {
//           icon: 'person',
//           text: this.$t('members.members'),
//           link: 'members',
//           isVisible: this.role.is_project_admin
//         },
//         {
//           icon: 'mdi-comment-account-outline',
//           text: this.$t('comments.comments'),
//           link: 'comments',
//           isVisible: this.role.is_project_admin
//         },
//         {
//           icon: 'mdi-book-open-outline',
//           text: this.$t('guideline.guideline'),
//           link: 'guideline',
//           isVisible: this.role.is_project_admin
//         },
//         {
//           icon: 'mdi-chart-bar',
//           text: this.$t('statistics.statistics'),
//           link: 'statistics',
//           isVisible: this.role.is_project_admin
//         },
//         {
//           icon: 'mdi-cog',
//           text: this.$t('settings.title'),
//           link: 'settings',
//           isVisible: this.role.is_project_admin
//         }
//       ]
//       return items.filter(item => item.isVisible)
//     }
//   },

  methods: {
    // toLabeling() {
    //   const query = this.$services.option.findOption(this.$route.params.id)
    //   this.$router.push({
    //     path: this.localePath(this.link),
    //     query
    //   })
    // }
  }
}
</script>
