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
    usersAvailable(state) {
      return state.usersAvailable;
    },
    conversations(state) {
      return state.conversations.map(conversation => {
        let participantToTitle = conversation.participants.filter(item => item !== state.user.username);
        return {
          ...conversation,
          available: state.usersAvailable.includes(conversation.participants.username),
          title: participantToTitle.join(', '),
          lastMessage: {
            posted_at:
              conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].posted_at : '',
            content:
              conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : ''
          }
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

    upsertAvailableUsers(state, { usernames }) {
      console.log({ usernames });
      state.usersAvailable = usernames;
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
      console.log('TEST', conversation_id, message);
      if (localConversationIndex !== -1) {
        let message_id = message.id;
        //console.log('upsertMsg tetetetete', message_id);
        const localMessageIndex = state.conversations[localConversationIndex].messages.findIndex(
          _message => _message.id === message_id
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
    },
    upsertMessageDeleted(state, { conversation_id, message_id }) {
      const localConversationIndex = state.conversations.findIndex(
        _conversation => _conversation.id === conversation_id
      );
      console.log('TEST', conversation_id, message_id);
      if (localConversationIndex !== -1) {
        //console.log('upsertMsg tetetetete', message_id);
        const localMessageIndex = state.conversations[localConversationIndex].messages.findIndex(
          _message => _message.id === message_id
        );
        if (localMessageIndex !== -1) {
          const message = state.conversations[localConversationIndex].messages.find(
            _message => _message.id === message_id
          );

          Vue.set(state.conversations[localConversationIndex].messages, localMessageIndex, {
            ...message,
            deleted: true
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
      const promise = Vue.prototype.$client.postMessage(conversation.id, content);

      promise.then(({ message }) => {
        commit('upsertMessages', {
          conversation_id: conversation.id,
          message: message
        });
      });
    },

    addParticipant({ commit }, { conversation, user }) {
      const promise = Vue.prototype.$client.addParticipant(conversation.id, user.username);

      promise.then(({ conversation }) => {
        commit('upsertConversation', {
          conversation
        });
      });
    },

    removeParticipant({ commit }, { conversation, user }) {
      const promise = Vue.prototype.$client.removeParticipant(conversation.id, user.username);

      promise.then(({ conversation }) => {
        commit('upsertConversation', {
          conversation
        });
      });
    },

    reactMessage({ commit }, { conversation, message, reaction }) {
      const promise = Vue.prototype.$client.reactMessage(conversation.id, message.id, reaction);
      promise.then(({ message }) => {
        commit('upsertMessages', {
          message
        });
      });
    },

    replyMessage({ commit }, { conversation, messageId, content }) {
      const promise = Vue.prototype.$client.replyMessage(conversation.id, messageId, content);
      promise.then(({ message }) => {
        commit('upsertMessages', {
          conversation_id: conversation.id,
          message: message
        });
      });
    },

    editMessage({ commit }, { conversation, messageId, content }) {
      Vue.prototype.$client.editMessage(conversation.id, messageId, content);
    },

    deleteMessage({ commit }, { conversation, messageId }) {
      Vue.prototype.$client.deleteMessage(conversation.id, messageId);
    }
  }
});
