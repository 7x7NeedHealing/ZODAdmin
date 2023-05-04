<template>
    <div class="userContainer">
        <div class="search">
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">标题</span>
                <el-input v-model="title" class="w-50 m-2 w-i" placeholder="输入需要查询的反馈标题" :prefix-icon="Search" />
                <el-button type="primary" @click="searchTitle()">搜索</el-button>
            </div>
            <div class="searchBox">
                <el-button type="primary" @click="searchAll()">查看全部数据</el-button>

            </div>
        </div>
        <el-divider />
        <div class="body">
            <div style="margin-top: 20px;margin-bottom: 20px;">
                <el-button @click="toggleSelection(tableData)">全选</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
            </div>
            <el-table ref="multipleTableRef" :data="tableData" style="width: 1550px;height:550px"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" fixed />
                <el-table-column label="反馈ID" width="260">
                    <template #default="scope">{{ scope.row.feedbackId }}</template>
                </el-table-column>
                <el-table-column property="title" label="标题" width="260" />
                <el-table-column property="content" label="内容" width="360" />
                <el-table-column property="contact" label="联系方式" width="260" />
                <el-table-column property="account" label="来源账号" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->

                        <el-button size="large" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElTable } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import axios from 'axios';
import { getCurrentInstance } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const app = getCurrentInstance();
interface feedback{
    feedbackId: string,
    title: string,
    content: string,
    contact:string,
    account:string
};
let form = reactive({
    feedbackId: '',
    title: '',
    content: '',
    contact:'',
    account:''
});
let title = ref('');
// 用于修改时确定修改谁的指针。
let indexUser = ref(0);

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<feedback[]>([])
let tableData: feedback[] = reactive([]);

const toggleSelection = (rows?: feedback[]) => {
    if (rows) {
        rows.forEach((row) => {
            // TODO: improvement typing when refactor table
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            multipleTableRef.value!.toggleRowSelection(row, undefined)
        })
    } else {
        multipleTableRef.value!.clearSelection()
    }
}
const handleSelectionChange = (val: feedback[]) => {
    multipleSelection.value = val
}

const handleDelete = (index: number, row: feedback) => {
    console.log(index, row);
    ElMessageBox.confirm(
        // 换成你的内容提示(删除操作时的确认提示)
        '确认删除该反馈?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            axios.get('http://localhost:888/adminDeleteFeedback?feedbackId=' + row.feedbackId)
                .then(() => {
                    tableData.splice(index, 1);
                    ElMessage({
                        type: 'success',
                        message: '删除成功',
                    })
                    app?.proxy?.$forceUpdate();
                })
                .catch((err) => {
                    console.log(err);

                })

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

const searchTitle = () => {
    console.log(title.value);
    
    axios.get('http://localhost:888/adminCheckFeedbackByTitle?title=' + title.value)
        .then((res) => {

            // 清空
            tableData = reactive([]);
            res.data.forEach((element: feedback) => {
                tableData.push(element)
            });
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()

        })
        .catch((err) => {
            console.log(err);

        })
}

const searchAll = () => {
    axios.get('http://localhost:888/adminCheckAllFeedback')
        .then((res) => {
            // 清空原有数据
            tableData = reactive([]);
            // 添加新数据
            res.data.forEach((element: feedback) => {
                tableData.push(element)
            });
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()
        })
        .catch((err) => {
            console.log(err);

        })
}



onMounted(() => {
    axios.get('http://localhost:888/adminCheckAllFeedback')
        .then((res) => {
            res.data.forEach((element: feedback) => {
                tableData.push(element)
            });

        })
        .catch((err) => {
            console.log(err);

        })
})


</script>
<style scoped lang="scss">
.userContainer {
    width: 1660px;
    height: 937px;
    box-sizing: border-box;
    padding: 40px;

    .search {
        height: 100px;
        box-sizing: border-box;
        padding-top: 20px;
        display: flex;

        .searchBox {
            display: flex;
            align-items: center;
            margin-right: 40px;

            // 搜索标题样式
            .ml-3 {
                margin-right: 20px;
                font-weight: 600;
            }

            // 搜索输入框样式
            .w-i {
                width: 200px;
                margin-right: 20px;
            }
        }
    }

    .body {
        width: 1500px;
        height: 747px;
        margin-right: 0;

        .el-table {
            font-size: 22px;
            font-weight: 400;
        }
    }
}
</style>