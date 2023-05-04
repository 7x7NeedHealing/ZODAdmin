<template>
    <div class="userContainer">
        <div class="search">
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">博客ID</span>
                <el-input v-model="blogId" class="w-50 m-2 w-i" placeholder="输入需要查询的博客ID" :prefix-icon="Search" />
                <el-button type="primary" @click="searchblogId()">搜索</el-button>
            </div>
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">标题</span>
                <el-input v-model="title" class="w-50 m-2 w-i" placeholder="输入需要查询的博客标题" :prefix-icon="Search" />
                <el-button type="primary" @click="searchTitle()">搜索</el-button>
            </div>
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">状态</span>
                <el-input v-model="status" class="w-50 m-2 w-i" placeholder="输入需要查询的博客状态" :prefix-icon="Search" />
                <el-button type="primary" @click="searchStatus()">搜索</el-button>
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
                <el-table-column label="博客ID" width="460">
                    <template #default="scope">{{ scope.row.blogId }}</template>
                </el-table-column>
                <el-table-column property="title" label="标题" width="460" />
                <el-table-column property="status" label="状态" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="340">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog v-model="dialogFormVisible" title="用户信息编辑">
                <el-form :model="form">
                    <el-form-item label="博客ID" :label-width="formLabelWidth">
                        <span>{{ tableData[indexUser].blogId }}</span>
                    </el-form-item>
                    <el-form-item label="博客标题" :label-width="formLabelWidth">
                        <span>{{ form.title }}</span>
                        <!-- <el-input v-model="form.title" autocomplete="off" /> -->
                    </el-form-item>
                    <el-form-item label="博客状态" :label-width="formLabelWidth">
                        <el-input v-model="form.status" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false;">取消</el-button>
                        <el-button type="primary" @click=" changeBlogInfo ">
                            确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
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
interface Blog {
    blogId: string
    title: string
    status: string
};
let dialogFormVisible = ref(false);
const formLabelWidth = '140px';
let form = reactive({
    blogId: '',
    title: '',
    status: '',
});
let blogId = ref('');
let title = ref('');
let status = ref('');
// 用于修改时确定修改谁的指针。
let indexUser = ref(0);

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Blog[]>([])
let tableData: Blog[] = reactive([]);

const toggleSelection = (rows?: Blog[]) => {
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
const handleSelectionChange = (val: Blog[]) => {
    multipleSelection.value = val
}

const handleEdit = (index: number, row: Blog) => {
    console.log(index, row);
    // app?.proxy?.$forceUpdate();
    indexUser.value = index;

    // 把以下内容换成你的form
    form.blogId = tableData[indexUser.value].blogId;
    form.title = tableData[indexUser.value].title;
    form.status = tableData[indexUser.value].status;

    app?.proxy?.$forceUpdate();
    dialogFormVisible.value = true;

}
const handleDelete = (index: number, row: Blog) => {
    console.log(index, row);
    ElMessageBox.confirm(
        // 换成你的内容提示(删除操作时的确认提示)
        '确认删除该博客?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            axios.get('http://localhost:888/adminDeleteBlog?blogId=' + row.blogId)
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
const changeBlogInfo = () => {
    // 更新前获取需要更新的博客ID
    form.blogId = tableData[indexUser.value].blogId;
    axios.post('http://localhost:888/adminUpdateBlog', form)
        .then(() => {
            // 将更新后的数据更新到视图中
            tableData[indexUser.value].title = form.title;
            tableData[indexUser.value].status = form.status;
            // 重置表格
            form = reactive({
                blogId: '',
                title: '',
                status: '',
            });
            dialogFormVisible.value = false;
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()
        })
        .catch((err) => {
            console.log(err);

        })

}
const searchblogId = () => {
    axios.get('http://localhost:888/adminCheckBlogByBlogId?blogId=' + blogId.value)
        .then((res) => {
            // 清空
            tableData = reactive([]);
            res.data.forEach((element: Blog) => {
                tableData.push(element)
            });
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()
        })
        .catch((err) => {
            console.log(err);

        })
}
const searchTitle = () => {
    axios.get('http://localhost:888/adminCheckBlogByTitle?title=' + title.value)
        .then((res) => {

            // 清空
            tableData = reactive([]);
            res.data.forEach((element: Blog) => {
                tableData.push(element)
            });
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()

        })
        .catch((err) => {
            console.log(err);

        })
}
const searchStatus = () => {

    axios.get('http://localhost:888/adminCheckBlogByStatus?status=' + status.value)
        .then((res) => {
            console.log(status.value);
            
            // 清空
            tableData = reactive([]);
            
            
            res.data.forEach((element: Blog) => {
                tableData.push(element)
            });
            console.log(tableData);
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()

        })
        .catch((err) => {
            console.log(err);

        })
}
const searchAll = () => {
    axios.get('http://localhost:888/adminCheckAllBlog')
        .then((res) => {
            // 清空原有数据
            tableData = reactive([]);
            // 添加新数据
            res.data.forEach((element: Blog) => {
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
    axios.get('http://localhost:888/adminCheckAllBlog')
        .then((res) => {
            res.data.forEach((element: Blog) => {
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