<template>
  <div class="sidebar">
    <div class="user">
      <div class="user-picture">
        <img :src="user.picture_url" class="ui circular image" />
      </div>

      <div class="user-info">
        <div class="user-info-pseudo">{{ user.username }}</div>

        <div class="user-info-status ui simple dropdown">
          <div class="available text">
            En ligne
          </div>
          <i class="dropdown icon"> </i>
          <div class="menu">
            <div class="item" @click="deauthenticate">
              <i class="logout icon"> </i>
              Déconnexion
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu">
      <div class="blue button" @click="openCommunity">
        <i class="users icon"> </i>
        <br />
        <span>Communauté</span>
      </div>
      <div v-if="true" class="blue button" @click="openMessageSearch">
        <i class="search icon"> </i>
        <br />
        <span>Messages</span>
      </div>
      <div v-if="true" class="blue button" @click="openGroupeProjet">
        <i class="search icon"> </i>
        <br />
        <span>GroupeDev</span>
      </div>
    </div>

    <div class="conversations">
      <div class="conversation-search">
        <div class="ui fluid search">
          <div class="ui icon input">
            <input v-model="search" class="prompt" placeholder="Rechercher une conversation" type="text" />
            <i class="search icon"> </i>
          </div>
        </div>
      </div>
      <div
        class="conversation"
        v-for="laconversation in FilterConversations"
        :key="laconversation.id"
        :class="{
          selected: laconversation.id === conversationIsActive,
          available: oneParticipantIsOnline(laconversation.participants),
          new: messageNeverSeen(laconversation)
        }"
        @click="openConversation(laconversation.id)"
      >
        <img
          v-if="laconversation.type === 'one_to_one'"
          :src="users.find(e => laconversation.participants.includes(e.username)).picture_url"
          class="avatar"
        />
        <img v-else src="https://clic-igeac.org/wp-content/uploads/2021/03/group-1824145_1280.png" class="avatar" />

        <div class="content">
          <div class="metadata">
            <div class="title">
              <i
                class="ui small icon circle"
                v-if="oneParticipantIsOnline(laconversation.participants) || messageNeverSeen(laconversation)"
              >
              </i>
              {{ laconversation.title }}
            </div>

            <div class="time" v-if="laconversation.lastMessage.posted_at != ''">
              {{ new Date(laconversation.lastMessage.posted_at).toLocaleTimeString() }}
            </div>
          </div>
          <div class="text">{{ laconversation.lastMessage.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Sidebar',

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
    openConversation(id) {
      this.conversationIsActive = id;
      router.push({ name: 'Conversation', params: { id } });
    },
    openGroupeProjet() {
      router.push({ name: 'openGroupeProjet' });
    },
    oneParticipantIsOnline(participants) {
      return this.usersAvailable.some(x => participants.includes(x) && x != this.user.username);
    },
    messageNeverSeen(conversation) {
      if (conversation.seen[this.user.username].message_id === conversation.lastMessage.id) {
        return false;
      } else {
        return true;
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'users', 'conversations', 'conversation', 'usersAvailable']),
    FilterConversations() {
      let FilterConversations = [];
      FilterConversations = this.conversations.map(conversation => ({
        ...conversation
      }));

      return FilterConversations.filter(conversation =>
        conversation.title.toLowerCase().includes(this.search.toLowerCase())
      ).sort(function(a, b) {
        return new Date(b.lastMessage.posted_at) - new Date(a.lastMessage.posted_at);
      });
    }
  }
};
</script>

<style scoped src="./Sidebar.css" />
