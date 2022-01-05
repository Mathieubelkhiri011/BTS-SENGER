<template>
  <div v-if="!message.deleted">
    <div class="time" v-if="index === 0 || conversation.messages[index - 1].from !== message.from">
      {{ new Date(message.posted_at).toLocaleTimeString() }}
    </div>
    <div v-if="message.from === this.user.username" class="message mine">
      <div v-if="message.reply_to" :class="'bubble ' + position">
        <p class="reply_content">{{ message.reply_to.content }}</p>
        {{ message.content }}
      </div>
      <div v-else :class="'bubble ' + position">{{ message.content }}</div>
      <div class="reacts">
        <div v-for="(values, reaction) in countReaction" :key="reaction">
          <i v-if="values >= 1" :class="'circular ' + EmoteReaction(reaction) + ' outline icon'">{{ values }}</i>
        </div>
      </div>
      <div class="controls">
        <i title="Supprimer" class="circular trash icon" @click="deleteMsg()"></i>
        <i
          title="Editer"
          class="circular edit icon"
          @click="$emit('onEdit', { id: message.id, content: message.content })"
        ></i
        ><i
          title="Répondre"
          class="circular reply icon"
          @click="$emit('onReply', { id: message.id, from: message.from, content: message.content })"
        ></i>
      </div>
    </div>
    <div v-else class="message">
      <img
        title="Bob"
        v-if="index === conversation.messages.length - 1 || conversation.messages[index + 1].from !== message.from"
        :src="users.find(e => e.username === message.from).picture_url"
      />
      <div v-if="message.reply_to" :class="'bubble ' + position">
        <p class="reply_content">{{ message.reply_to.content }}</p>
        {{ message.content }}
      </div>
      <div v-else :class="'bubble ' + position">{{ message.content }}</div>
      <div class="reacts">
        <div v-for="(values, reaction) in countReaction" :key="reaction">
          <i v-if="values >= 1" :class="'circular ' + EmoteReaction(reaction) + ' outline icon'">{{ values }}</i>
        </div>
      </div>
      <div class="controls">
        <i
          title="Répondre"
          class="circular reply icon"
          @click="$emit('onReply', { id: message.id, from: message.from, content: message.content })"
        ></i
        ><span class="react"
          ><i title="Aimer" class="circular heart outline icon" @click="addReaction('HEART')"></i
          ><i title="Pouce en l'air" class="circular thumbs up outline icon" @click="addReaction('THUMB')"></i
          ><i title="Content" class="circular smile outline icon" @click="addReaction('HAPPY')"></i
          ><i title="Pas content" class="circular frown outline icon" @click="addReaction('SAD')"></i
        ></span>
      </div>
    </div>
  </div>
  <div v-else class="message " :class="message.from === user.username ? 'mine' : ''">
    <div class="bubble bubble-deleted top bottom">
      Message supprimé
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Message',
  props: ['message', 'position', 'index', 'conversation'],
  data() {
    return {
      groupPanel: false
    };
  },
  computed: {
    ...mapGetters(['user', 'users']), //, 'conversation'
    countReaction() {
      let HEART = 0;
      let THUMB = 0;
      let HAPPY = 0;
      let SAD = 0;
      for (var react of Object.values(this.message.reactions)) {
        if (react === 'HEART') {
          HEART++;
        } else if (react === 'THUMB') {
          THUMB++;
        } else if (react === 'HAPPY') {
          HAPPY++;
        } else {
          SAD++;
        }
      }
      return { HEART, THUMB, HAPPY, SAD };
    }
  },
  methods: {
    ...mapActions(['reactMessage', 'deleteMessage', 'seeConversation']),
    addReaction(valueReact) {
      this.conversationSeen();
      let promise = this.reactMessage({
        conversation: this.conversation,
        message: this.message,
        reaction: valueReact
      });
      promise.finally(() => {
        console.log('Réaction ajoutée !');
      });
    },

    EmoteReaction(reaction) {
      switch (reaction) {
        default:
          return 'heart';
        case 'THUMB':
          return 'thumbs up';
        case 'HAPPY':
          return 'smile';
        case 'SAD':
          return 'frown';
      }
    },
    deleteMsg() {
      this.conversationSeen();
      let promise = this.deleteMessage({
        conversation: this.conversation,
        messageId: this.message.id
      });
      promise.finally(() => {
        console.log('Message supprimé!');
      });
    },
    conversationSeen() {
      let promise = this.seeConversation({
        conversationId: this.conversation.id,
        messageId: this.conversation.messages[this.conversation.messages.length - 1].id
      });
      promise.finally(() => {
        console.log('Conversation seen!');
      });
    }
  }
};
</script>

<style src="./Message.css" scoped />
