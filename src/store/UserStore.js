import {defineStore} from 'pinia';
import frontSideApiService from '../services/FrontSideApiService';

export const useUserStore = defineStore('user', {
    state: () => ({
        role: null,
        token: localStorage.getItem('token') || null,
        sessionToken: sessionStorage.getItem('token') || null,
        reservationDTO: null,
        needLogin : false
    }),
    actions: {
        setToken(token) {
            this.token = token;
        },
        setSessionToken(sessionToken) {
            this.sessionToken = sessionToken;
        },
        setRole(role) {
            this.role = role;
        },
        setReservationDTO(data) {
            this.reservationDTO = data;
        },
        setNeedLogin(needLogin) {
            this.needLogin = needLogin;
        },
        async logout() {
            await frontSideApiService.logout();
            this.role = null;
            this.token = null;
            this.sessionToken = null;
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
        },
        async localStorageAuthenticatedRequest() {
            try {
                const response = await frontSideApiService.authCheckLocal({token: this.token});
                if (response.data) {
                    localStorage.removeItem('token');
                    this.token = response.data.token;
                    this.setRole(response.data.role);
                    localStorage.setItem('token', this.token);
                } else {
                    localStorage.removeItem('token');
                    await this.logout();
                }
            } catch (error) {
                console.error('정상적인 인증이 아님 : ', error);
                localStorage.removeItem('token');
                await this.logout();
            }
        },
        async sessionStorageUserAuthenticated() {
            try {
                const response = await frontSideApiService.authCheckSession({token: this.sessionToken});
                if (response.data) {
                    sessionStorage.removeItem('token');
                    this.sessionToken = response.data.token;
                    this.setRole(response.data.role);
                    sessionStorage.setItem('token', this.sessionToken);
                } else {
                    sessionStorage.removeItem('token');
                    await this.logout();
                }
            } catch (error) {
                console.error('정상적인 인증이 아님 : ', error);
                sessionStorage.removeItem('token');
                await this.logout();
            }
        }
    }
});