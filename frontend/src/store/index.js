import { createStore } from 'vuex'



// Create a new store instance
const store = createStore({
    state: {

    },
    actions: {
        signup: ({commit}, userId) => {
            commit;
            instance.post('/signup', userId)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        }
    },
    mutations: {

    },
    modules: {

    }
})

export default store;