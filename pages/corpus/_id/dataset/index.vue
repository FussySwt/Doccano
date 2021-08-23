<!-- 语料信息页 -->
<template>
    <v-card>
        <!-- 语料信息顶部按钮 -->
        <v-card-title>
            <corpus-menu
                @uploadCorpus="uploadCorpus"
                @downloadCorpus="downloadCorpus"
            />
            <v-btn
                class="text-capitalize ms-2 primary"
                :disabled="selected.length <= 0"
                @click.stop="openProjectAdd"
            >
                {{ $t('generic.importProject') }}
            </v-btn>
            <v-btn
                class="text-capitalize ms-2"
                :disabled="selected.length <= 0"
                outlined
                @click.stop="dialogDelete=true"
            >
                {{ $t('generic.delete') }}
            </v-btn>
        </v-card-title>
        <!-- 删除语料对话框 -->
        <v-dialog v-model="dialogDelete">
            <corpus-delete
            :selected="selected"
            @cancel="dialogDelete=false"
            @remove="removeItem"
            />
        </v-dialog>
        <!-- 筛选语料 -->
        <v-card>
            <v-row align="center">
                <v-col
                    class="d-flex"
                    cols="3"
                    sm="3"
                >
                    <v-subheader style="width:100px;flex-shrink:0;">
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
                    <v-subheader style="width:110px;flex-shrink:0;">
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
                            label="请选择时间"
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
                            取消
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(dates)"
                        >
                            确定
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row align="center" style="padding: 0 20px;">
                <!-- <v-col
                    sm="2"
                >
                    <v-switch
                        v-model="sampleRange"
                        :label="sampleRange? '表格搜索':'全局搜索'"
                    ></v-switch>
                </v-col> -->
                <v-col
                    cols="9"
                    sm="9"
                >
                    <v-text-field
                        v-model="esSearchVal"
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
        <!-- 语料列表 -->
        <v-data-table
            v-model="selected"
            :headers="header"
            :items="desserts"
            show-select
            :single-expand="true"
            show-expand
            :loading="isLoading"
            hide-default-footer
            :page.sync="pageInfo.pageNo"
            :expanded.sync="expanded"
            item-key="id"
            class="elevation-1"
        >
            <template v-slot:item.action="{ item }">
                <v-btn @click="checkEdit(item)">修改</v-btn>
            </template>
            <template v-slot:item.created_at="{ item }">
                <span>{{ item.created_at | dateParse('YYYY-MM-DDTHH:mm:ss') | dateFormat('DD/MM/YYYY HH:mm') }}</span>
            </template>
            <!-- 语料列表章节预览 -->
            <template v-slot:expanded-item="{ headers,item }">
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
                                >
                                {{ item.abstraction }}
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-data-table
                                :headers="partHeaders"
                                :items="partDesserts"
                                :loading="isPartLoading"
                                class="elevation-1"
                            ></v-data-table>
                        </v-card>
                    </div>
                </td>
            </template>
        </v-data-table>
        <!-- 导入工程对话框 -->
        <v-dialog v-model="dialogDeleteAll" width="60%">
            <v-card>
                <v-card-title class="text-h5 text-center blue darken-2 indigo white--text">
                加入项目
                <v-btn
                    icon
                    @click="addNewProject"
                >
                    <v-icon>
                    mdi-plus-circle
                    </v-icon>
                </v-btn>
                </v-card-title>

                <v-card-text>
                    <div style="display:flex;align-items:center;">
                        <v-text-field
                        v-model="projectInput"
                        label="标题"
                        >
                            <v-icon
                                slot="prepend"
                            >
                            search
                            </v-icon>
                        </v-text-field>
                        <v-btn class="text-capitalize primary" style="margin-left: 40px;" @click="searchInput(projectInput)">搜索</v-btn>
                    </div>
                </v-card-text>
                <v-radio-group v-model="radioGroup" style="padding-left: 20px;margin-top:0;height: 200px;overflow-y:auto;">
                    <v-radio
                        v-for="n in objectList"
                        :key="n.id"
                        :label="n.name"
                        :value="n.id"
                    ></v-radio>
                </v-radio-group>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="dialogDeleteAll = false;radioGroup=''"
                >
                    取消
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    :disabled="radioGroup == ''"
                    @click="checkEnter"
                >
                    确定
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- 添加项目对话框 -->
        <v-dialog v-model="dialogCreate" width="75%">
            <form-create
            v-bind.sync="editedItem"
            @cancel="close"
            @save="create"
            />
        </v-dialog>
        <!-- 语料列表分页 -->
        <div class="text-center">
            <v-pagination
            v-model="pageInfo.pageNo"
            :length="pageInfo.totalPages"
            @input="pageChange"
            ></v-pagination>
        </div>
        <div style="height:50px;"></div>
        <v-row justify="center">
            <!-- 修改语料对话框 -->
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
                            label="标题"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row align="center" class="d-flex justify-center">
                        <v-col
                            class="d-flex"
                            cols="10"
                            sm="10"
                        >
                            <v-text-field
                            v-model="organizationInput"
                            label="机构"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row align="center" class="d-flex justify-center">
                        <v-col
                            class="d-flex"
                            cols="10"
                            sm="10"
                        >
                            <v-text-field
                            v-model="authorInput"
                            label="作者"
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

<script>
import Vue from 'vue'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse'
import CorpusDelete from '~/components/project/CorpusDelete.vue'
import CorpusMenu from '~/components/example/CorpusMenu.vue'
import FormCreate from '~/components/project/FormCreate.vue'
Vue.use(VueFilterDateFormat)
Vue.use(VueFilterDateParse)
export default {
    layout: 'corpus',
    components: {
        CorpusMenu,
        FormCreate,
        CorpusDelete
    },
    data(){
        return {
            // 是否展开章节
            expanded: [],
            // 选中的语料信息
            selected: [],
            // 修改对话框中的标题
            titleInput: '',
            // 章节预览是否加载
            isPartLoading: false,
            // 是否激活删除语料对话框
            dialogDelete: false,
            // 语料列表是否在加载中
            isLoading: false,
            // 修改对话框中的机构
            organizationInput: '',
            // 是否显示删除语料对话框
            dialogDeleteAll: false,
            // 修改对话框中的作者
            authorInput: '',
            // 是否显示修改对话框
            isEditVisible: false,
            // 是否显示添加项目对话框
            dialogCreate: false,
            // 导入工程对话框中的关键字搜索
            projectInput: '',
            // 导入工程对话框中的项目列表
            objectList: [],
            // 导入工程对话框中选中的项目列表
            radioGroup: '',
            // 语料列表分页信息
            pageInfo: {
                pageNo: 0,
                totalPages: 0
            },
            // 添加项目对话框中添加项目对话框的内容信息
            editedItem: {
                name: '',
                description: '',
                projectType: 'DocumentClassification',
                enableRandomOrder: false,
                enableShareAnnotation: false,
                singleClassClassification: false
            },
            // 搜索范围
            sampleRange: '',
            // ES搜索的关键字
            esSearchVal: '',
            // 选中的语料id
            selectId: '',
            // 选中的语料状态
            selectType: '',
            // 选中的语料类型
            selectStatus: '',
            // 状态下拉框选中内容
            selectArea: '0',
            // 标注类型下拉框列表信息
            typeItems: [{state: '全部',abbr: ''},{state: '文本分类',abbr: '文本分类'},{state: '序列标注',abbr: '序列标注'}],
            // 状态下拉框列表信息
            statusItems: [{state: '全部',abbr: ''},{state: '未审核',abbr: '2'},{state: '已审核',abbr: '3'},{state: '未标注',abbr: '0'},{state: '标注中',abbr: '1'}],
            // 搜索范围下拉框列表信息
            areaItems: [{state: '全部',abbr: '0'},{state: '标题',abbr: '1'},{state: '机构',abbr: '2'},{state: '作者',abbr: '3'},{state: '全文',abbr: '4'}],
            // 搜索日期范围
            dates: [],
            // 是否激活日期选择器对话框
            menu: false,
            // 语料列表表头
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
                // { text: this.$t('dataset.publistTime'), align: 'center', value: 'publish_time'},
                { text: this.$t('dataset.belongProject'),align: 'center', value: 'project.name' },
                { text: this.$t('dataset.action'),align: 'center', value: 'action' },
            ],
            // 语料列表中的章节预览列表表头
            partHeaders: [
                {
                    text: this.$t('dataset.part'),
                    align: 'center',
                    value: 'partId',
                },
                { text: this.$t('dataset.content'),align: 'center', value: 'text' },
                // { text: this.$t('dataset.status'),align: 'center', value: 'status' }
            ],
            // 语料列表内容
            desserts: [
            ],
            // 章节预览列表内容
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
    watch: {
        // 点击展开章节预览
        async expanded(val){
            try{
                const res = await this.$api.previewPart({
                    id: val[0].id
                })
                res.data.data.forEach(item=>{
                    item.partId = item.filename.substring(item.filename.lastIndexOf('part'))
                })
                this.partDesserts = res.data.data
            }catch(e){
                console.log(e)
            }
        },
    },
    // 组件加载时生成列表内容
    async created(){
        this.isLoading = true
        const res = await this.$api.getCorpusList({
            id: this.$route.params.id,
            pageNumber: 1,
            pageSize: 10,
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
    methods: {
        // 跳转至导入语料页面
        uploadCorpus(){
            // console.log(this.$route)
            this.$router.push(`${this.$route.fullPath}/upload`)
        },
        // 关闭添加项目对话框
        close(){
            this.dialogCreate = false
            this.editedItem = {
                name: '',
                description: '',
                projectType: 'DocumentClassification',
                enableRandomOrder: false,
                enableShareAnnotation: false,
                singleClassClassification: false
            }
        },
        // 语料查询
        async conditionSearch(){
            console.log(this.dates)
            console.log(new Date(this.dates[0]).getTime())
            this.isLoading = true
            const pojo = {             
                id: this.$route.params.id,
                pageNumber: this.pageInfo.pageNo,
                pageSize: 10,
                status: this.selectStatus,
                annotationtype: this.selectType,
                startTime: this.dates.length > 0 ? new Date(this.dates[0]).getTime() : '',
                endTime: this.dates.length > 0 ? new Date(this.dates[1]).getTime() : '',
            }
            if(this.esSearchVal){
                pojo.key = this.esSearchVal
                pojo.keyType = this.selectArea
            }
            const res = await this.$api.getCorpusListFromEs(pojo)
            // const res = await this.$api.getCorpusList({
            //     id: this.$route.params.id,
            //     pageNumber: this.pageInfo.pageNo,
            //     pageSize: 10,
            //     status: this.selectStatus,
            //     annotationtype: this.selectType,
            //     startTime: this.dates.length > 0 ? this.dates[0] +' 00:00:00' : '',
            //     endTime: this.dates.length > 0 ? this.dates[1] +' 00:00:00' : ''
            // })
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
        // 确认添加新项目
        async create(){
            // console.log(123)
            const project = await this.$services.project.create(this.editedItem)
            this.close()
            this.openProjectAdd()
        },
        // 下载语料
        downloadCorpus(){
            if(this.selected.length <= 0){
                alert('请选中语料！')
                return
            }
            // if(this.selected.length > 1){
            //     alert('只能选中一条语料！')
            //     return
            // }
            this.selected.forEach(item=>{
                this.downloadFile(`http://218.94.150.38:8010/tagging/fail/download/${item.id}`)
            })
            // const url = `http://218.94.150.38:8010/tagging/fail/download/${this.selected[0].id}`
            // window.open(url)
        },
        downloadFile(url){
            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.style.height = 0
            iframe.src = url
            document.body.appendChild(iframe)
            setTimeout(() => {
                iframe.remove()
            }, 30000);
        },
        // 切换页码
        async pageChange(val){
            console.log(val)
            const res = await this.$api.getCorpusList({
                id: this.$route.params.id,
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
        // 确认将语料导入项目
        async checkEnter(){
            console.log(this.radioGroup)
            console.log(this.selected)
            const arr = []
            this.selected.forEach(item=>{
                arr.push(item.id)
            })
            console.log(arr)
            try{
                await this.$api.addToProject({
                    id: this.radioGroup,
                    corpusInfoIds: arr
                })
                this.dialogDeleteAll = false
                this.isLoading = true
                const res = await this.$api.getCorpusList({
                    id: this.$route.params.id,
                    pageNumber: 1,
                    pageSize: 10,
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
            }catch(e){
                console.log(e)
            }
        },
        // 点击导入工程按钮
        async openProjectAdd(){
            this.dialogDeleteAll = true
            const res = await this.$api.getProjectList()
            this.objectList = res.data
        },
        // 加入项目对话框模糊查询
        async searchInput(data){
            const res = await this.$api.searchProject({
                name: data
            })
            this.objectList = res.data.data
            console.log(this.objectList)
        },
        // 点击修改语料信息按钮
        checkEdit(data){
            this.selectId = data.id
            this.titleInput = data.title
            this.organizationInput = data.organ
            this.authorInput = data.author
            this.isEditVisible = true
        },
        // 删除语料信息
        async removeItem(){
            // console.log('删除成功！')
            console.log(this.selected)
            const pojo = []
            this.selected.forEach(item=>{
                pojo.push(item.id)
            })
            try{
                const res = await this.$api.deleteCorpus({
                    corpusInfoIds: pojo
                })
                console.log(res)
                if(res.data.code === 0){
                    this.dialogDelete = false
                    this.isLoading = true
                    const res = await this.$api.getCorpusList({
                        id: this.$route.params.id,
                        pageNumber: 1,
                        pageSize: 10,
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
                }else{
                    alert('删除失败！')
                }
            }catch(e){
                console.log(e)
            }
        },
        // 点击确认修改语料信息
        async clickUpdate(){
            const res = await this.$api.updateCorpusList({
                id: this.selectId,
                title: this.titleInput,
                organ: this.organizationInput,
                author: this.authorInput
            })
            if(res.data.code !== 0){
                // console.log('修改成功！')
                alert('修改失败！')
                this.isEditVisible = false
            }else{
                this.isEditVisible = false
                const res = await this.$api.getCorpusList({
                    id: this.$route.params.id,
                    pageNumber: 1,
                    pageSize: 10
                })
                this.desserts = res.data.data.corpusList
                this.pageInfo = {
                    pageNo: res.data.data.page.pageNo,
                    totalPages: res.data.data.page.totalPages
                }
            }
        },
        // 点击导入工程对话框的添加项目按钮
        addNewProject(){
            this.dialogCreate = true
        }
    }
}
</script>

<style scoped>

</style>
