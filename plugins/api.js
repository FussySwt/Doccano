/**
 * 接口封装页（/corpus开头的为Java接口，/v1开头的为Python接口）
 * 注意以下注释中的语料库和语料，二者为父子关系
 */
export default function({ app, $axios }, inject) {

    const API = {};

    // 文本分类修改状态（未标注、标注中、未审核、已审核）
    API.changeStatus = function(params) {
        return $axios({
            url:'/corpus/tagging/corpusRepository',
            method: 'post',
            data: params,
        })
    }

    // 序列标注修改状态（未标注、标注中、未审核、已审核）
    API.changeRes = function(urls, params){
        return $axios({
            url: urls,
            method: 'post',
            data: params
        })
    }
    
    // 获取语料库信息
    API.getCorpusInfo = function() {
        return $axios({
            url: '/corpus/tagging/corpusRepository',
            method: 'get'
        })
    }

    // 新建语料库
    API.createCorpus = function(params){
        return $axios({
            url: '/corpus/tagging/corpusRepository',
            method: 'post',
            data: params,
        })
    }
    
    // 删除语料库
    API.removeCorpus = function(params){
        return $axios({
            url: '/corpus/tagging/corpusRepository',
            method: 'delete',
            data: params
        })
    }

    // 获取语料库下的语料列表信息
    API.getCorpusList = function(params){
        return $axios({
            url: '/corpus/tagging/getCorpusList',
            method: 'post',
            data: params
        })
    }
    
    // 上传语料信息
    API.uploadCorpus = function(params){
        return $axios({
            url: '/corpus/tagging/fail/upload',
            method: 'post',
            headers: {
                'Content-type': 'multipart/form-data'
            },
            data: params
        })
    }
    // 修改语料信息
    API.updateCorpusList = function(params){
        return $axios({
            url: '/corpus/tagging/updateCorpus',
            method: 'put',
            data: params
        })
    }

    // 获取所有标注项目信息
    API.getProjectList = function(params){
        return $axios({
            url: '/v1/projects',
            method:'get',
            data: params
        })
    }

    // 获取用户身份信息
    API.getUserInfo = function(){
        return $axios({
            url: '/v1/me',
            method:'get'
        })
    }

    // 标注项目模糊查询
    API.searchProject = function(params){
        return $axios({
            url: '/corpus/tagging/queryProjectList',
            method: 'post',
            data: params
        })
    }
    
    // 删除语料
    API.deleteCorpus = function(params){
        return $axios({
            url: '/corpus/tagging/deleteCorpus',
            method: 'post',
            data: params
        })
    }

    // 预览语料章节信息
    API.previewPart = function(params){
        return $axios({
            url: `/corpus/tagging/previewPart/${params.id}`,
            method: 'get'
        })
    }

    // 语料添加至项目
    API.addToProject = function(params){
        return $axios({
            url: '/corpus/tagging/add2Project',
            method: 'post',
            data: params
        })
    }

    // 下载语料(已弃用)现已在组件中直接使用
    API.downloadCorpus = function(params){
        return $axios({
            url: `/corpus/tagging/fail/download/${params}`,
            method: 'get'
        })
    }
    
    // 下载语料
    API.corpusRepository = function(params){
        return $axios({
            url: '/corpus/tagging/corpusRepository',
            method: 'put',
            data: params
        })
    }

    // 语料信息ES搜索功能
    API.getCorpusListFromEs = function(params){
        return $axios({
            url: '/corpus/tagging/getCorpusListFromEs',
            method: 'post',
            data: params
        })
    }

    app.api = API;
    inject('api',API);
}