<template>
  <div class="conversation">
    <div class="conversation-header">
      <img
        v-if="this.conversation.type === 'one_to_one'"
        class="avatar"
        :src="pictureOfUser(this.conversation.title)"
      />
      <div v-else class="avatar">
        <i class="ui users icon"></i>
      </div>

      <div class="title">
        <div class="ui compact">
          <i v-if="isOnline" class="icon circle available"></i>
          <span>{{ this.conversation.title.substring(0, 40) }}</span>

          <span v-if="this.conversation.title.length > 40">...</span>
          <div class="ui simple dropdown item">
            <i class="vertical ellipsis icon"></i>

            <div class="menu">
              <div v-if="true" class="item">
                <i class="ui icon paint brush"></i>
                Modifier le thème
              </div>
              <div v-if="true" class="item">
                <i class="ui icon edit"></i>
                Modifier le titre
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell slash"></i>
                Mettre en sourdine
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell"></i>
                Rétablir les notifications
              </div>
              <div class="item" @click="groupPanel = !groupPanel">
                <i class="ui icon users"></i>
                Gérer les participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="conversation-container">
      <div class="conversation-main">
        <div class="conversation-body" id="scroll">
          <div class="wrapper">
            <div v-for="(message, index) in this.conversation.messages" :key="message.id">
              <Message
                :position="positionmessage(conversation.messages, index)"
                :index="index"
                :conversation="conversation"
                :message="message"
                @onReply="replyToMsg"
                @onEdit="editMsg"
              >
              </Message>
              <div class="view">
                <span v-for="participant in conversation.participants" :key="participant">
                  <img
                    v-if="conversation.seen[participant].message_id === message.id"
                    :title="'Vu par ' + participant + ' à ' + new Date(message.posted_at).toLocaleTimeString()"
                    :src="pictureOfUser(participant)"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="typing">
          <div class="wrapper">
            Alice est en train d'écrire...
          </div>
        </div>
        <div class="conversation-footer">
          <div class="wrapper">
            <p v-if="this.message.replyTo.id !== -1">
              <i title="Abandonner" class="circular times small icon link" @click="closeReply"></i>
              Répondre à {{ this.message.replyTo.from }} :
              <span>
                {{ this.message.replyTo.content }}
              </span>
            </p>
            <p v-if="this.message.editMsg.id !== -1">
              <i title="Abandonner" class="circular times small icon link" @click="closeEdit"></i>
              Edition
            </p>

            <div class="ui fluid search">
              <div class="ui icon input">
                <input
                  v-model="message.content"
                  class="prompt"
                  type="text"
                  placeholder="Rédiger un message"
                  @keyup.enter="sendMessage()"
                />

                <i class="send icon link" @click="sendMessage()"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="conversation-sidebar" v-if="groupPanel">
        <Group />
      </div>
    </div>
  </div>
</template>

<script>
import Group from '@/components/Group/Group';
import Message from '@/components/Message/Message';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Conversation',
  components: { Group, Message },
  data() {
    return {
      groupPanel: false,
      message: {
        content: '',
        replyTo: { id: -1, from: '', content: '' },
        editMsg: { id: -1, content: '' }
      }
    };
  },
  mounted() {
    this.scrollBottom();
    this.conversationSeen();
  },
  updated() {
    this.scrollBottom();
  },
  computed: {
    ...mapGetters(['user', 'users', 'conversation', 'conversations', 'authenticating', 'usersAvailable']),

    isOnline() {
      return this.usersAvailable.some(x => this.conversation.participants.includes(x) && x != this.user.username);
    }
  },
  methods: {
    ...mapActions(['postMessage', 'replyMessage', 'editMessage', 'seeConversation']),
    scrollBottom() {
      setTimeout(() => {
        let scrollElement = document.querySelector('#scroll');
        if (scrollElement) {
          scrollElement.scrollTop = document.querySelector('#scroll').scrollHeight;
        }
      }, 0);
    },
    pictureOfUser(username) {
      return this.users.find(e => e.username === username).picture_url;
    },
    positionmessage(message, index) {
      if (message != null && index != null && message.length > 0 && message.length >= index) {
        let messagePrecedent = this.conversation.messages.filter((message, indexMessage) => indexMessage === index - 1);

        if (messagePrecedent.length) {
          messagePrecedent = messagePrecedent[0];
        }

        let messagesuivance = this.conversation.messages.filter((message, indexMessage) => indexMessage === index + 1);

        if (messagesuivance.length) {
          messagesuivance = messagesuivance[0];
        }

        let messageActuel = this.conversation.messages.filter((message, indexMessage) => indexMessage === index)[0];

        if (
          messagePrecedent &&
          messagesuivance &&
          messageActuel &&
          messagePrecedent.from === messageActuel.from &&
          messagesuivance.from === messageActuel.from
        ) {
          return 'middle';
        } else if (messagePrecedent && messageActuel && messagePrecedent.from === messageActuel.from) {
          return 'bottom';
        } else if (messagesuivance && messageActuel && messagesuivance.from === messageActuel.from) {
          return 'top';
        } else {
          return 'top bottom';
        }
      }
    },
    sendMessage() {
      console.log('message: ', this.message.content);
      let promise;
      if (this.message.replyTo.id !== -1) {
        console.log('message a reply');
        promise = this.replyMessage({
          conversation: this.conversation,
          messageId: this.message.replyTo.id,
          content: this.message.content
        });
      } else if (this.message.editMsg.id !== -1) {
        console.log('message editer');
        promise = this.editMessage({
          conversation: this.conversation,
          messageId: this.message.editMsg.id,
          content: this.message.content
        });
      } else {
        console.log('message normal');
        //message normal
        promise = this.postMessage({
          conversation: this.conversation,
          content: this.message.content
        });
      }

      promise.finally(() => {
        this.message = {
          content: '',
          replyTo: { id: -1, from: '', content: '' },
          editMsg: { id: -1, content: '' }
        };
      });
    },
    replyToMsg(msg) {
      this.message.replyTo = { ...msg };
    },
    closeReply() {
      this.message.replyTo = { id: -1, from: '', content: '' };
    },
    editMsg(msg) {
      this.message.editMsg = { ...msg };
      this.message.content = msg.content;
    },
    closeEdit() {
      this.message.editMsg = { id: -1, content: '' };
      this.message.content = '';
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
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    conversation(newConversation, oldConversation) {
      this.scrollBottom();
    }
  }
};
</script>

<style src="./Conversation.css" scoped />
