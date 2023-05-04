    
<template>
    <div class="indexContainer">
        <div class="menu">
            <el-row class="tac">
                <el-col>
                    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                        default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose">
                        <el-menu-item index="1">

                            <!-- <span>用户管理</span> -->
                            <RouterLink :to="{ name: 'user' }" class="routerLink" active-class="routerLinkActive">
                                <el-icon>
                                    <UserFilled />
                                </el-icon>
                                用户管理
                            </RouterLink>
                        </el-menu-item>
                        <el-menu-item index="2">

                            <RouterLink :to="{ name: 'blog' }" class="routerLink" active-class="routerLinkActive">
                                <el-icon>
                                    <Share />
                                </el-icon>
                                博客管理
                            </RouterLink>
                            <!-- <span>博客管理</span> -->
                        </el-menu-item>
                        <el-menu-item index="3">

                            <RouterLink :to="{ name: 'comments' }" class="routerLink" active-class="routerLinkActive">
                                <el-icon>
                                    <Comment />
                                </el-icon>
                                评论管理
                            </RouterLink>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <RouterLink :to="{ name: 'feedback' }" class="routerLink" active-class="routerLinkActive">
                                <el-icon>
                                    <Promotion />
                                </el-icon>
                                反馈管理
                            </RouterLink>
                        </el-menu-item>
                        <!-- <el-menu-item index="5">
                            <RouterLink :to="{ name: 'notice' }" class="routerLink" active-class="routerLinkActive">
                                <el-icon>
                                    <WarnTriangleFilled />
                                </el-icon>
                                通告发布
                            </RouterLink>
                        </el-menu-item> -->
                    </el-menu>
                </el-col>
            </el-row>
        </div>
        <div class="body">
            <RouterView></RouterView>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import {
    UserFilled,
    Promotion,
    Comment,
    WarnTriangleFilled,
    Share
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>
    
<style lang="scss">
.indexContainer {
    width: 1920px;
    min-width: 1920px;
    height: 937px;
    display: flex;

    .menu {
        width: 260px;
        height: 100%;
        background-color: rgb(84, 92, 100);

        .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item {
            font-size: 20px;
            padding-left: 60px;
        }

        .routerLink {
            text-decoration: none;
            color: white;
        }

        .routerLinkActive {
            color: rgb(255, 208, 75)
        }


    }

    .body {
        width: 1660px;
        height: 100%;
    }
}
</style>
