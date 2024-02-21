import axios from "axios";

const API_URL = 'http://localhost';

function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    };
    let token;
    const localToken = localStorage.getItem('token') || null;
    const sessionToken = sessionStorage.getItem('token') || null;
    if (localToken || sessionToken) {
        token = localToken || sessionToken;
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}
export default {
    authCheckLocal(tokenData) {
        return axios.post(API_URL+"/authlocal", tokenData,  { headers: getHeaders() });
    },
    authCheckSession(tokenData) {
        return axios.post(API_URL+"/authsession", tokenData,  { headers: getHeaders() });
    },
    getMain() {
        return axios.get(API_URL + "/main",  { headers: getHeaders() });
    },
    oauthSuccess(param) {
        return axios.get(API_URL, param, { headers: getHeaders() });
    },

    // Member 회원
    login(loginData) {
        return axios.post(API_URL + "/member/login", loginData,  { headers: getHeaders() });
    },
    registerMember(registerData) {
        return axios.post(API_URL + "/member/join", registerData,  { headers: getHeaders() });
    },
    logout(){
        return axios.post(API_URL + "/member/logout",  { headers: getHeaders() });
    },
    getMemberInfo() {
        return axios.get(API_URL + "/member/memberinfo",  { headers: getHeaders() });
    },
    getMemberUpdate() {
        return axios.get(API_URL + "/member/update", {headers: getHeaders()});
    },
    updateMember(updateData) {
        return axios.post(API_URL + "/member/update", updateData,  { headers: getHeaders() });
    },
    changePassword(passwordData) {
        return axios.post(API_URL + "/member/changepw", passwordData,  { headers: getHeaders() });
    },

    // NoticeBoard 공지게시판
    noticeBoardListGet(searchForm){
        return axios.get(API_URL + "/noticeboard/list", searchForm, { headers: getHeaders() });
    },
    noticeBoardRegister(noticeBoardRegisterData) {
        const config = {
            headers: {
                ...getHeaders(), // 기존 헤더 가져오기
                'Content-Type': 'multipart/form-data' // Content-Type 설정
            }
        };
        return axios.post(API_URL + "/noticeboard/register", noticeBoardRegisterData, config);
    },
    noticeBoardRead(nbno){
        return axios.get(API_URL + "/noticeboard/read", nbno, { headers: getHeaders() });
    },
    noticeBoardDelete(nbno){
        return axios.post(API_URL + "/noticeboard/remove", nbno, { headers: getHeaders() });
    },
    noticeBoardModfiy(noticeBoardModifyData){
        const config = {
            headers: {
                ...getHeaders(), // 기존 헤더 가져오기
                'Content-Type': 'multipart/form-data' // Content-Type 설정
            }
        };
        return axios.post(API_URL + "/noticeboard/modify", noticeBoardModifyData, config);
    },

    // JowhangBoard 조황게시판
    jowhangBoardListGet(searchForm){
        return axios.get(API_URL + "/jowhangboard/list", searchForm, { headers: getHeaders() });
    },
    jowhangBoardRegister(jowhangBoardRegisterData) {
        const config = {
            headers: {
                ...getHeaders(), // 기존 헤더 가져오기
                'Content-Type': 'multipart/form-data' // Content-Type 설정
            }
        };
        return axios.post(API_URL + "/jowhangboard/register", jowhangBoardRegisterData, config);
    },
    jowhangBoardRead(nbno){
        return axios.get(API_URL + "/jowhangboard/read", nbno, { headers: getHeaders() });
    },
    jowhangBoardDelete(nbno){
        return axios.post(API_URL + "/jowhangboard/remove", nbno, { headers: getHeaders() });
    },
    jowhangBoardModfiy(noticeBoardModifyData){
        const config = {
            headers: {
                ...getHeaders(), // 기존 헤더 가져오기
                'Content-Type': 'multipart/form-data' // Content-Type 설정
            }
        };
        return axios.post(API_URL + "/jowhangboard/modify", noticeBoardModifyData, config);
    }

    // Reservation 예약
    ,reservationCheck(checkData) {
        return axios.post(API_URL + "/reservation/check", checkData, { headers: getHeaders() });
    },
    reservationDetail(reservationData) {
        return axios.post(API_URL + "/reservation/details", reservationData, { headers: getHeaders() });
    },
    loadReservationData() {
        return axios.get(API_URL + "/reservation/list", { headers: getHeaders() });
    },
    loadReservationDateDetail(regDate) {
        return axios.get(API_URL + "/reservation/register", regDate, { headers: getHeaders() });
    },
    registerReservation(reservationData) {
        return axios.post(API_URL + "/reservation/register", reservationData, { headers: getHeaders() });
    },
}
