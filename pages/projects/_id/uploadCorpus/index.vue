<template>
    <v-card>
        <v-card-title>
            {{ $t('dataset.chooseCorpus') }}
        </v-card-title>
        <v-combobox
        outlined
        :items="items"
        :text="items.title"
        :label="$t('dataset.chooseCorpusWord')"
        @change="clickEvent"
        ></v-combobox>
        <v-card v-if="isSelected">
            <v-row align="center">
                <v-col
                    class="d-flex"
                    cols="3"
                    sm="3"
                >
                    <v-subheader>
                    状态：
                    </v-subheader>
                    <v-select
                    v-model="selectStatus"
                    :items="statusItems"
                    item-text="state"
                    item-value="abbr"
                    label="状态"
                    solo
                    ></v-select>
                </v-col>
                <v-col
                    class="d-flex"
                    cols="3"
                    sm="3"
                >
                    <v-subheader>
                        标注类型：
                    </v-subheader>
                    <v-select
                        v-model="selectType"
                        :items="typeItems"
                        item-text="state"
                        item-value="abbr"
                        label="状态"
                        solo
                    ></v-select>
                </v-col>
                <v-col
                    class="d-flex"
                    cols="6"
                    sm="6"
                >
                    <v-subheader>
                        时间：
                    </v-subheader>
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="dates"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-combobox
                            v-model="dates"
                            multiple
                            chips
                            clearable
                            small-chips
                            label="Multiple picker in menu"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-combobox>
                        </template>
                        <v-date-picker
                        v-model="dates"
                        range
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(dates)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row align="center" style="padding: 0 20px;">
                <v-col
                    sm="2"
                >
                    <v-switch
                        v-model="sampleRange"
                        :label="sampleRange? '表格搜索':'全局搜索'"
                    ></v-switch>
                </v-col>
                <v-col
                    cols="7"
                    sm="7"
                >
                    <v-text-field
                        :label="$t('generic.search')"
                    >
                        <v-icon
                        slot="prepend"
                        color="green"
                        >
                        search
                        </v-icon>
                    </v-text-field>
                </v-col>
                <v-col
                    cols="3"
                    sm="3"
                >
                    <v-select
                        v-model="selectArea"
                        :items="areaItems"
                        item-text="state"
                        item-value="abbr"
                        label="状态"
                        solo
                    ></v-select>
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col
                    class="d-flex justify-center"
                    cols="12"
                    sm="12"
                >
                    <v-btn class="primary" style="width:150px;" @click="conditionSearch">查询</v-btn>
                </v-col>
            </v-row>
        </v-card>
        <div style="height:50px;"></div>
        <!-- <v-card>123</v-card> -->
        <v-data-table
            v-if="isSelected"
            v-model="selected"
            :headers="header"
            :items="desserts"
            show-select
            :loading="isLoading"
            :single-expand="singleExpand"
            show-expand
            hide-default-footer
            :expanded.sync="expanded"
            item-key="id"
            class="elevation-1"
        >
            <template v-slot:[`item.created_at`]="{ item }">
                <span>{{ item.created_at | dateParse('YYYY-MM-DDTHH:mm:ss') | dateFormat('DD/MM/YYYY HH:mm') }}</span>
            </template>
            <template v-slot:expanded-item="{ headers }">
                <td :colspan="headers.length">
                    <div style="padding: 20px 0;">
                        <v-card>
                            <v-row>
                                <v-col
                                offset="1"
                                style="padding: 20px 0;"
                                >章节预览
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row class="d-flex">
                                <v-col
                                    class="d-flex justify-center"
                                    sm="12"
                                    style="padding: 20px 0;"
                                >摘 要
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col
                                    sm="12"
                                    style="padding: 20px 30px;"
                                >今年以来金融服务实体经济情况如何？怎样看输入性通胀？接下来货币政策是什么取向？……对于当前市场关心的诸多问题，中国人民银行5月11日发布的2021年第一季度《中国货币政策执行报告》（以下简称《报告》）作出分析和解读。《报告》显示，今年以来稳健的货币政策坚持稳字当头，体现了前瞻性、主动性、精准性和有效性，对实体经济支持力度稳固。
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-data-table
                                :headers="partHeaders"
                                :items="partDesserts"
                                class="elevation-1"
                            ></v-data-table>
                        </v-card>
                    </div>
                </td>
            </template>
        </v-data-table>
        <div v-if="isSelected" class="text-center">
            <v-pagination
            v-model="pageInfo.pageNo"
            :length="pageInfo.totalPages"
            @input="pageChange"
            ></v-pagination>
        </div>
        <div style="height:50px;"></div>
        <v-card-actions>
            <v-spacer />
            <v-btn
                class='text-capitalize me-2 primary'
                :disabled="canUpload"
                @click="injest"
            >
                {{ $t('dataset.injest') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Vue from 'vue'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse'
Vue.use(VueFilterDateFormat)
Vue.use(VueFilterDateParse)
export default {
    layout: 'project',
    data(){
        return {
            expanded: [],
            isSelected: false,
            selected: [],
            total: 0,
            sampleRange: '',
            singleExpand: true,
            items: [],
            isLoading: false,
            selectType: '',
            selectStatus: '',
            selectArea: {state: '全部',abbr: 'all'},
            typeItems: [{state: '全部',abbr: ''},{state: '文本分类',abbr: '文本分类'},{state: '序列标注',abbr: '序列标注'}],
            statusItems: [{state: '全部',abbr: ''},{state: '未审核',abbr: '2'},{state: '已审核',abbr: '3'},{state: '未标注',abbr: '0'},{state: '标注中',abbr: '1'}],
            areaItems: [{state: '全部',abbr: 'all'},{state: '标题',abbr: 'title'},{state: '机构',abbr: 'organization'},{state: '作者',abbr: 'author'}],
            dates: [],
            menu: false,
            header: [
                {
                    text: this.$t('dataset.title'),
                    align: 'center',
                    value: 'title',
                },
                { text: this.$t('dataset.time'),align: 'center', value: 'created_at' },
                { text: this.$t('dataset.organization'),align: 'center', value: 'organ' },
                { text: this.$t('dataset.author'),align: 'center', value: 'author' },
                { text: this.$t('dataset.status'),align: 'center', value: 'status' },
                { text: this.$t('dataset.annotateType'),align: 'center', value: 'annotationtype' },
            ],
            pageInfo: {
                pageNo: 0,
                totalPages: 0
            },
            partHeaders: [
                {
                    text: this.$t('dataset.part'),
                    align: 'center',
                    value: 'id',
                },
                { text: this.$t('dataset.content'),align: 'center', value: 'text' },
                // { text: this.$t('dataset.status'),align: 'center', value: 'status' }
            ],
            desserts: [
                // {
                //     id: '10',
                //     title: '6%',
                //     time: 'KitKat',
                //     organization: 518,
                //     author: '测试',
                //     status: 65,
                //     annotateType: 7,
                // },
            ],
            selectVal: '',
            partDesserts: [
                // {
                //     part: '1',
                //     content: '及服务实体经济，《报告》提出，今年以来，金融服务实体经济质量和效率逐步提升，为经济高质量发展提供了适宜的货币金融环境。',
                //     status: '已标注'
                // },
                // {
                //     part: '2',
                //     content: '及服务实体经济，《报告》提出，今年以来，金融服务实体经济质量和效率逐步提升，为经济高质量发展提供了适宜的货币金融环境。',
                //     status: '未标注'
                // },
                // {
                //     part: '3',
                //     content: '及服务实体经济，《报告》提出，今年以来，金融服务实体经济质量和效率逐步提升，为经济高质量发展提供了适宜的货币金融环境。',
                //     status: '已标注'
                // }
            ],
        }
    },
    computed: {
        dateRangeText() {
            return this.dates.join(' ~ ')
        },
        canUpload(){
            return this.selected.length <= 0
        }
    },
    watch: {
        async expanded(val){
            // console.log(val)
            try{
                const res = await this.$api.previewPart({
                    id: val[0].id
                })
                this.partDesserts = res.data.data
            }catch(e){
                console.log(e)
            }
        }
    },
    async created(){
        // await this.$api.getCorpusList({})
        const item = await this.$api.getCorpusInfo()
        if(item.data.data){
            item.data.data.forEach(item=>{
                item.text = item.title
                item.value = item.id
            })
        }
        this.items = item.data.data || []
    },
    methods: {
        async clickEvent(val){
            console.log(val)
            this.selectVal = val.id
            this.isSelected = true
            this.isLoading = true
            const res = await this.$api.getCorpusList({
                id: this.selectVal,
                pageNumber: 1,
                pageSize: 10
            })
            this.desserts = res.data.data.corpusList
            console.log(this.desserts)
            this.desserts.forEach(item=>{
                switch(item.status){
                    case 0:
                        item.status = '未标注'
                        break
                    case 1:
                        item.status = '标注中'
                        break
                    case 2:
                        item.status = '未审核'
                        break
                    case 3:
                        item.status = '已审核'
                        break
                    default:
                        item.status = '未知'
                        break
                }
            })
            this.pageInfo = {
                pageNo: res.data.data.page.pageNo,
                totalPages: res.data.data.page.totalPages
            }
            this.isLoading = false
        },
        async conditionSearch(){
            this.isLoading = true
            const res = await this.$api.getCorpusList({
                id: this.selectVal,
                pageNumber: this.pageInfo.pageNo,
                pageSize: 10,
                status: this.selectStatus,
                annotationtype: this.selectType,
                startTime: this.dates.length > 0 ? this.dates[0] +' 00:00:00' : '',
                endTime: this.dates.length > 0 ? this.dates[1] +' 00:00:00' : ''
            })
            this.desserts = res.data.data.corpusList
            console.log(this.desserts)
            this.desserts.forEach(item=>{
                switch(item.status){
                    case 0:
                        item.status = '未标注'
                        break
                    case 1:
                        item.status = '标注中'
                        break
                    case 2:
                        item.status = '未审核'
                        break
                    case 3:
                        item.status = '已审核'
                        break
                    default:
                        item.status = '未知'
                        break
                }
            })
            this.pageInfo = {
                pageNo: res.data.data.page.pageNo,
                totalPages: res.data.data.page.totalPages
            }
            this.isLoading = false
            console.log(this.dates)
        },
        async pageChange(val){
            console.log(val)
            const res = await this.$api.getCorpusList({
                id: this.selectVal,
                pageNumber: val,
                pageSize: 10
            })
            this.desserts = res.data.data.corpusList
            console.log(this.desserts)
            this.desserts.forEach(item=>{
                switch(item.status){
                    case 0:
                        item.status = '未标注'
                        break
                    case 1:
                        item.status = '标注中'
                        break
                    case 2:
                        item.status = '未审核'
                        break
                    case 3:
                        item.status = '已审核'
                        break
                    default:
                        item.status = '未知'
                        break
                }
            })
            this.pageInfo = {
                pageNo: res.data.data.page.pageNo,
                totalPages: res.data.data.page.totalPages
            }
        },
        async injest(){
            console.log(this.selected)
            const arr = []
            this.selected.forEach(item=>{
                arr.push(item.id)
            })
            const res = await this.$api.addToProject({
                id: this.$route.params.id,
                corpusInfoIds: arr
            })
            if(res.data.code === 0){
                alert('上传成功！')
                this.$router.back()
            }else{
                alert('上传失败！')
            }
        }
    }
}
</script>

<style scoped>

</style>
