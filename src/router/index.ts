import { RouteRecordRaw, createRouter,createWebHistory } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

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
            },
            
            
        ]
       
    },
    {
        path:'/login',
        name:'login',
        component:() => import('../page/login.vue')
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
//白名单
const whiteList = ['/','/login']
router.beforeEach((to, from, next) => {
    // console.log(whiteList.includes(to.path) );

    if (whiteList.includes(to.path) || localStorage.getItem('token')) {
        // if (to.matched.some(record => record.meta.keepAlive)) {
        //     // 如果当前路由包含meta.keepAlive，则需要缓存
        //     to.meta.isKeepAlive = true
        // } else {
        //     // 否则不需要缓存
        //     to.meta.isKeepAlive = false
        // }
        next()
    } else {
        ElMessage({
            showClose: true,
            message: '您还未登录,登录后才能使用哦',
            type: 'error',
        })
        // console.log('???');

        next({name:'login'})
        // router.push('/login')
    }
})
// 导出
export default router 