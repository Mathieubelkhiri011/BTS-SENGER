import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: false,
    user: {
      username: null,
      token: null,
      picture_url: null
    },
    users: [],
    conversations: [],
    currentConversationId: null,
    usersAvailable: []
  },
  getters: {
    authenticating(state) {
      return state.authenticating;
    },
    authenticated(state) {
      return state.user.token !== null;
    },
    user(state) {
      return state.user;
    },
    users(state) {
      return state.users.map(user => ({
        ...user
        //TODO
      }));
    },
    conversations(state) {
      return state.conversations.map(conversation => {
        let participantToTitle = conversation.participants;
        const indexOfConnectedUser = conversation.participants.indexOf(localStorage.getItem('username'));
        if (indexOfConnectedUser > -1) {
          participantToTitle.splice(indexOfConnectedUser, 1);
        }
        return {
          ...conversation,
          title: participantToTitle.join(', ')
          //TODO
        };
      });
    },

    conversation(state, getters) {
      return getters.conversations.filter(item => item.id === state.currentConversationId)[0];
    }
  },
  mutations: {
    syncCurrentConversation(state, conversationId) {
      state.currentConversationId = conversationId;
    },
    setAuthenticating(state, authenticating) {
      state.authenticating = authenticating;
    },
    setUser(state, { username, token, picture_url }) {
      Vue.set(state.user, 'username', username);
      Vue.set(state.user, 'token', token);
      Vue.set(state.user, 'picture_url', picture_url);
    },
    setUsers(state, users) {
      state.users = users;
    },
    setConversations(state, conversations) {
      state.conversations = conversations.map(conversation => {
        return {
          ...conversation
          //TODO
        };
      });
    },

    upsertUser(state, { user }) {
      const localUserIndex = state.users.findIndex(_user => _user.username === user.username);

      if (localUserIndex !== -1) {
        Vue.set(state.users, localUserIndex, user);
      } else {
        state.users.push({
          ...user
        });
      }
    },

    upsertConversation(state, { conversation }) {
      const localConversationIndex = state.conversations.findIndex(
        _conversation => _conversation.id === conversation.id
      );

      if (localConversationIndex !== -1) {
        Vue.set(state.conversations, localConversationIndex, conversation);
      } else {
        state.conversations.push({
          ...conversation
        });
      }
    },

    upsertMessages(state, { conversation_id, message }) {
      const localConversationIndex = state.conversations.findIndex(
        _conversation => _conversation.id === conversation_id
      );
      if (localConversationIndex !== -1) {
        const localMessageIndex = state.conversations[localConversationIndex].messages.findIndex(
          _message => _message.id === message.id
        );
        if (localMessageIndex !== -1) {
          Vue.set(state.conversations[localConversationIndex].messages, localMessageIndex, message);
        } else {
          state.conversations[localConversationIndex].messages.push({
            ...message
          });
        }
        state.conversations[localConversationIndex].updated_at = new Date().toISOString();
      }
    }
  },
  actions: {
    authenticate({ commit, dispatch }, { username, password }) {
      if (!username || !password) {
        return;
      }
      commit('setAuthenticating', true);
      Vue.prototype.$client
        .authenticate(username, password)
        .then(user => {
          commit('setUser', user);
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);

          dispatch('initializeAfterAuthentication');
        })
        .catch(() => {
          alert("Erreur d'authentification !");
        })
        .finally(() => {
          commit('setAuthenticating', false);
        });
    },

    deauthenticate() {
      localStorage.removeItem('password');
      window.location.reload();
    },

    initializeAfterAuthentication({ dispatch }) {
      dispatch('fetchUsers');
      dispatch('fetchConversations');
    },

    fetchUsers({ commit }) {
      Vue.prototype.$client.getUsers().then(({ users }) => {
        commit('setUsers', users);
      });
    },

    fetchConversations({ commit }) {
      Vue.prototype.$client.getConversations().then(({ conversations }) => {
        commit('setConversations', conversations);
      });
    },

    createOneToOneConversation({ commit }, username) {
      const promise = Vue.prototype.$client.getOrCreateOneToOneConversation(username);

      promise.then(({ conversation }) => {
        commit('upsertConversation', {
          conversation
        });

        router.push({
          name: 'Conversation',
          params: { id: conversation.id }
        });
      });

      return promise;
    },

    createManyToManyConversation({ commit }, usernames) {
      const promise = Vue.prototype.$client.createManyToManyConversation(usernames);
      console.log('usernames : ', usernames);

      promise.then(({ conversation }) => {
        commit('upsertConversation', {
          conversation
        });

        router.push({
          name: 'Conversation',
          params: { id: conversation.id }
        });
      });

      return promise;
    },
    postMessage({ commit }, { conversation, content }) {
      console.log('content ', content);
      const promise = Vue.prototype.$client.postMessage(conversation.id, content);

      console.log('promise postMessage', promise);
      promise.then(({ message }) => {
        conversation.messages.push(message);
        commit('upsertConversation', {
          conversation
        });
      });
    }
  }
});
