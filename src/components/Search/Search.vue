<template>
  <div class="search-message">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input v-model="search" class="prompt" type="text" placeholder="Rechercher un message" />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="conversations" v-if="this.search.length > 0">
      <div class="conversation" v-for="laconversation in FilterConversations" :key="laconversation.id">
        <div
          class="author"
          v-if="
            laconversation.search &&
              laconversation.search.length > 0 &&
              laconversation.messages.some(m => laconversation.search.includes(m))
          "
        >
          <img
            v-if="laconversation.type === 'one_to_one'"
            :src="users.find(e => e.username === laconversation.title).picture_url"
            class="avatar"
          />
          <img v-else src="https://clic-igeac.org/wp-content/uploads/2021/03/group-1824145_1280.png" class="avatar" />
        </div>
        <div class="messages" v-for="message in laconversation.search" :key="message.id">
          <div class="message">
            <div class="time">
              {{ new Date(message.posted_at).toLocaleTimeString() }}
            </div>
            <div class="bubble">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Search',

  data() {
    return {
      usernameUserConnecte: localStorage.getItem('username'),
      search: '',
      conversationIsActive: ''
    };
  },
  methods: {
    ...mapActions(['deauthenticate']),
    openCommunity() {
      router.push({ name: 'Community' });
    },
    openMessageSearch() {
      router.push({ name: 'Search' });
    },

    openGroupeProjet() {
      router.push({ name: 'openGroupeProjet' });
    }
  },
  computed: {
    ...mapGetters(['user', 'users', 'conversations', 'conversation', 'messages']),
    FilterConversations() {
      let FilterConversations = [];

      FilterConversations = this.conversations.map(conversation => ({
        ...conversation,
        search: conversation.messages.filter(
          m => m.content && m.content.toLowerCase().includes(this.search.toLowerCase())
        )
      }));

      return FilterConversations.sort(function(a, b) {
        return new Date(b.lastMessage.posted_at) - new Date(a.lastMessage.posted_at);
      });
    }
  }
};
</script>

<style src="./Search.css" scoped />
