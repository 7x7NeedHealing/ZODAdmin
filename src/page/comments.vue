<template>
    <div class="userContainer">
        <div class="search">
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">评论ID</span>
                <el-input v-model="commentId" class="w-50 m-2 w-i" placeholder="输入需要查询的评论ID" :prefix-icon="Search" />
                <el-button type="primary" @click="searchCommentId()">搜索</el-button>
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
                <el-table-column type="selection" width="75" fixed />
                <el-table-column label="评论ID" width="260">
                    <template #default="scope">{{ scope.row.commentId }}</template>
                </el-table-column>
                <el-table-column property="content" label="评论内容" width="410" />
                <el-table-column property="reason" label="举报理由" width="410" show-overflow-tooltip />
                <el-table-column label="操作" width="340">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">无罪</el-button>

                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">有罪</el-button>
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
interface Comment {
    commentId: string
    reason: string
    content: string
};
let commentId = ref('');
// 用于修改时确定修改谁的指针。
let indexUser = ref(0);

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Comment[]>([])
let tableData: Comment[] = reactive([]);

const toggleSelection = (rows?: Comment[]) => {
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
const handleSelectionChange = (val: Comment[]) => {
    multipleSelection.value = val
}

const handleEdit = (index: number, row: Comment) => {
    console.log(index, row);
    // app?.proxy?.$forceUpdate();
    indexUser.value = index;
    ElMessageBox.confirm(
        // 换成你的内容提示(删除操作时的确认提示)
        '确认该评论无罪?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            axios.get('http://localhost:888/adminDeleteCommentNoSin?commentId=' + row.commentId)
                .then(() => {
                    tableData.splice(index, 1);
                    ElMessage({
                        type: 'success',
                        message: '无罪!无罪!无罪!',
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

    app?.proxy?.$forceUpdate();
    // dialogFormVisible.value = true;

}
const handleDelete = (index: number, row: Comment) => {
    console.log(index, row);
    ElMessageBox.confirm(
        '确认该评论有罪?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            axios.get('http://localhost:888/adminDeleteCommentHasSin?commentId=' + row.commentId)
                .then(() => {
                    tableData.splice(index, 1);
                    ElMessage({
                        type: 'success',
                        message: '有罪!有罪!有罪!',
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

const searchCommentId = () => {
    
    axios.get('http://localhost:888/adminCheckCommentByCommentId?commentId=' + commentId.value)
        .then((res) => {
            // 清空
            tableData = reactive([]);
            // app?.proxy?.$forceUpdate()
            res.data.forEach((element: Comment) => {
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
    

    axios.get('http://localhost:888/adminCheckAllComments')
        .then((res) => {
            // 清空原有数据
            tableData = reactive([]);
            // 添加新数据
            res.data.forEach((element: Comment) => {
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
    axios.get('http://localhost:888/adminCheckAllComments')
        .then((res) => {
            res.data.forEach((element: Comment) => {
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