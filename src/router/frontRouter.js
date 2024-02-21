import {createRouter, createWebHistory} from 'vue-router';
import MainComponent from "@/components/MainComponent.vue";
import LoginComponent from '@/components/Member/LoginComponent.vue';
import MemberRegisterComponent from "@/components/Member/MemberRegisterComponent.vue";
import MemberInfoComponent from "@/components/Member/MemberInfoComponent.vue";
import MemberUpdateComponent from "@/components/Member/MemberUpdateComponent.vue";
import MemberPasswordChangeComponent from "@/components/Member/MemberPasswordChangeComponent.vue";
import NoticeBoardListComponent from "@/components/NoticeBoard/NoticeBoardListComponet.vue";
import NoticeBoardRegisterComponent from "@/components/NoticeBoard/NoticeBoardRegisterComponent.vue";
import NoticeBoardReadComponent from "@/components/NoticeBoard/NoticeBoardReadComponent.vue";
import NoticeBoardModifyComponent from "@/components/NoticeBoard/NoticeBoardModifyComponent.vue";
import jowhangBoardListComponent from "@/components/JowhangBoard/JowhangBoardListComponent.vue";
import JowhangBoardRegisterComponent from "@/components/JowhangBoard/JowhangBoardRegisterComponent.vue";
import JowhangBoardReadComponent from "@/components/JowhangBoard/JowhangBoardReadComonent.vue";
import JowhangBoardModifyComponent from "@/components/JowhangBoard/JowhangBoardModifyComponent.vue";
import ReservationCheckComponent from "@/components/Reservation/ReservationCheckComponent.vue";
import ReservationDetailComponent from "@/components/Reservation/ReservationDetailComponent.vue";
import ReservationComponent from "@/components/Reservation/ReservationComponent.vue";
import ReservationRegisterComponent from "@/components/Reservation/ReservationRegisterComponent.vue";
import ReservationSuccessComponent from "@/components/Reservation/ReservationSuccessComponent.vue";
import FrontLayout from "@/components/Layout/FrontLayout.vue";
import {useUserStore} from "@/store/UserStore";

const routes = [
    {
        path: '/',
        component: FrontLayout,
        children: [
            {
                path: '',
                name: 'main',
                component: MainComponent
            },
            {
                path: '/member',
                children: [
                    {
                        path: 'login',
                        name: 'login',
                        component: LoginComponent
                    },
                    {
                        path: 'join',
                        name: 'join',
                        component: MemberRegisterComponent
                    },
                    {
                        path: 'memberinfo',
                        name: 'memberInfo',
                        component: MemberInfoComponent,
                        meta: {requiresAuth: true}
                    },
                    {
                        path: 'update',
                        name: 'memberUpdate',
                        component: MemberUpdateComponent,
                        meta: {requiresAuth: true}
                    },
                    {
                        path: 'changepw',
                        name: 'memberPasswordChange',
                        component: MemberPasswordChangeComponent,
                        meta: {requiresAuth: true}
                    }
                ]
            },
            {
                path: '/noticeboard',
                children: [
                    {
                        path: 'list',
                        name: 'NoticeBoardList',
                        component: NoticeBoardListComponent
                    },
                    {
                        path: 'register',
                        name: 'NoticeBoardRegister',
                        component: NoticeBoardRegisterComponent
                    },
                    {
                        path: 'read',
                        name: 'NoticeBoardRead',
                        component: NoticeBoardReadComponent
                    },
                    {
                        path: 'modify',
                        name: 'NoticeBoardModify',
                        component: NoticeBoardModifyComponent,
                        meta: {adminAuth: true}
                    }
                ]
            },
            {
                path: '/jowhangboard',
                children: [
                    {
                        path: 'list',
                        name: 'JowhangBoardList',
                        component: jowhangBoardListComponent
                    },
                    {
                        path: 'register',
                        name: 'JowhangBoardRegister',
                        component: JowhangBoardRegisterComponent
                    },
                    {
                        path: 'read',
                        name: 'JowhangBoardRead',
                        component: JowhangBoardReadComponent
                    },
                    {
                        path: 'modify',
                        name: 'JowhangBoardModify',
                        component: JowhangBoardModifyComponent,
                        meta: {adminAuth: true}
                    }
                ]
            },
            {
                path: '/reservation',
                children: [
                    {
                        path: 'check',
                        name: 'ReservationCheck',
                        component: ReservationCheckComponent
                    },
                    {
                        path: 'details',
                        name: 'ReservationDetail',
                        component: ReservationDetailComponent
                    },
                    {
                        path: 'list',
                        name: 'Reservation',
                        component: ReservationComponent
                    },
                    {
                        path: 'register',
                        name: 'ReservationRegister',
                        component: ReservationRegisterComponent
                    },
                    {
                        path: 'success',
                        name: 'ReservationSuccess',
                        component: ReservationSuccessComponent
                    }
                ]
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 이전 페이지를 저장하는 전역 변수
let previousPage = null;

// 이전 페이지를 갱신하는 함수
function updatePreviousPage(to) {
    previousPage = to.fullPath;
}

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
    updatePreviousPage(from);

    const userStore = useUserStore();
    const isAuthenticated = userStore.role || null;

    // 인증이 필요한 페이지인 경우
    if (to.meta.requiresAuth) {
        if (isAuthenticated === null) {
            // 인증되지 않은 사용자가 접근 시 로그인 페이지로 리디렉션
            userStore.setNeedLogin(true);
            next({name: "login"});
        } else {
            // 나머지 그냥 진행
            next();
        }
    }
    // 관리자 권한이 필요한 페이지인 경우
    else if (to.meta.adminAuth) {
        if (isAuthenticated !== "ADMIN") {
            // 관리자 권한이 없는 사용자가 접근 시 이전 페이지로 리디렉션
            next(from);
        } else {
            // 관리자 권한이 있는 경우 계속 진행
            next();
        }
    }
    // 인증이 필요하지 않은 페이지인 경우
    else {
        next();
    }
});

// 이전 페이지로 리다이렉트하는 메소드
export function redirectToPreviousPage() {
    if (previousPage) {
        router.push(previousPage);
    } else {
        // 이전 페이지가 없는 경우 기본 페이지로 리다이렉트
        router.push('/');
    }
}

export default router;