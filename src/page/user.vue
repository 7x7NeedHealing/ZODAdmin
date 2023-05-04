<template>
    <div class="userContainer">
        <div class="search">
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">账号</span>
                <el-input v-model="account" class="w-50 m-2 w-i" placeholder="输入需要查询的账号" :prefix-icon="Search" />
                <el-button type="primary" @click="searchAccount()">搜索</el-button>
            </div>
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">昵称</span>
                <el-input v-model="nickname" class="w-50 m-2 w-i" placeholder="输入需要查询的账号昵称" :prefix-icon="Search" />
                <el-button type="primary" @click="searchNickname()">搜索</el-button>
            </div>
            <div class="searchBox">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">状态</span>
                <el-input v-model="status" class="w-50 m-2 w-i" placeholder="输入需要查询的账号状态" :prefix-icon="Search" />
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
                <el-table-column label="账号" width="360">
                    <template #default="scope">{{ scope.row.account }}</template>
                </el-table-column>
                <el-table-column property="nickname" label="昵称" width="360" />
                <el-table-column property="status" label="状态" width="360" show-overflow-tooltip />
                <el-table-column label="操作" width="340">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog v-model="dialogFormVisible" title="用户信息编辑">
                <el-form :model="form">
                    <el-form-item label="用户账号" :label-width="formLabelWidth">
                        <span>{{ tableData[indexUser].account }}</span>
                    </el-form-item>
                    <el-form-item label="用户昵称" :label-width="formLabelWidth">
                        <el-input v-model="form.nickname" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="用户状态" :label-width="formLabelWidth">
                        <el-input v-model="form.status" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false;">取消</el-button>
                        <el-button type="primary" @click=" changeUserInfo ">
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
interface User {
    account: string
    nickname: string
    status: string
};
let dialogFormVisible = ref(false);
const formLabelWidth = '140px';
let form = reactive({
    account: '',
    nickname: '',
    status: '',
});
let account = ref('');
let nickname = ref('');
let status = ref('');
// 用于修改时确定修改谁的指针。
let indexUser = ref(0);

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const toggleSelection = (rows?: User[]) => {
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
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val
}
const handleEdit = (index: number, row: User) => {
    console.log(index, row);
    // app?.proxy?.$forceUpdate();
    indexUser.value = index;
    form.nickname = tableData[indexUser.value].nickname;
    form.status = tableData[indexUser.value].status;
    app?.proxy?.$forceUpdate();
    dialogFormVisible.value = true;

}
const handleDelete = (index: number, row: User) => {
    console.log(index, row);
    ElMessageBox.confirm(
        '确认删除用户?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            axios.get('http://localhost:888/adminDeleteUser?account=' + row.account)
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
const changeUserInfo = () => {
    form.account = tableData[indexUser.value].account;
    axios.post('http://localhost:888/adminUpdateUserInfo', form)
        .then(() => {
            // 将更新后的数据更新到视图中
            tableData[indexUser.value].nickname = form.nickname;
            tableData[indexUser.value].status = form.status;
            // 重置表格
            form = reactive({
                account: '',
                nickname: '',
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
const searchAccount = () => {
    axios.get('http://localhost:888/adminCheckUserByAccount?account=' + account.value)
        .then((res) => {
            // 清空
            tableData = reactive([]);
            res.data.forEach((element: User) => {
                tableData.push(element)
            });
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()
        })
        .catch((err) => {
            console.log(err);

        })
}
const searchNickname = () => {
    axios.get('http://localhost:888/adminCheckUserByNickname?account=' + nickname.value)
        .then((res) => {

            // 清空
            tableData = reactive([]);
            res.data.forEach((element: User) => {
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
    axios.get('http://localhost:888/adminCheckUserByStatus?status=' + status.value)
        .then((res) => {
            // 清空
            tableData = reactive([]);
            res.data.forEach((element: User) => {
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
    axios.get('http://localhost:888/adminCheckUser')
        .then((res) => {
            // 清空原有数据
            tableData = reactive([]);
            // 添加新数据
            res.data.forEach((element: User) => {
                tableData.push(element)
            });
            // 强制更新数据视图
            app?.proxy?.$forceUpdate()
        })
        .catch((err) => {
            console.log(err);

        })
}

let tableData: User[] = reactive([]);

onMounted(() => {
    axios.get('http://localhost:888/adminCheckUser')
        .then((res) => {
            res.data.forEach((element: User) => {
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