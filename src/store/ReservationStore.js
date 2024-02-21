import { defineStore } from 'pinia';

export const useReservationStore = defineStore('reservation', {
    state: () => ({
        userSelectedDateDetail : null,
        rvno : null,
    }),
    actions: {
        setUserSelectedDateDetail(userSelectedDateDetail){
            this.userSelectedDateDetail = userSelectedDateDetail;
        },
        setRvno(rvno){
            this.rvno = rvno;
        }
    }
});