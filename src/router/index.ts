import { RouteRecordRaw, createRouter,createWebHistory } from 'vue-router';


let routes: Array<RouteRecordRaw> = [
    {
        // 默认页面是-主页
        path: '/',
        name: 'index',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../page/index.vue'),
        children:[
            {
                path:'user',
                name:'user',
                component:() => import('../page/user.vue')
            },
            {
                path:'blog',
                name:'blog',
                component:() => import('../page/blog.vue')
            },
            {
                path:'comments',
                name:'comments',
                component:() => import('../page/comments.vue')
            },
            {
                path:'feedback',
                name:'feedback',
                component:() => import('../page/feedback.vue')
            },
            {
                path:'notice',
                name:'notice',
                component:() => import('../page/notice.vue')
            }
        ]
       
    }

    //{
    //配置404页面
    //path: '/:catchAll(.*)',
    //name: '404',
    //component: () => import(''),
    //}
]




const router = createRouter({
    history:createWebHistory(),
    routes
})

// 导出
export default router 