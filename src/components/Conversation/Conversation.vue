<template>
  <div class="conversation">
    <div class="conversation-header">
      <img
        v-if="this.conversation.type === 'one_to_one'"
        class="avatar"
        :src="this.users.find(e => e.username === this.conversation.participants[0]).picture_url"
      />
      <div v-else class="avatar">
        <i class="ui users icon"></i>
      </div>

      <div class="title">
        <div class="ui compact">
          <i class="icon circle"></i>
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
            <div class="time">01:33:32</div>
            <div class="message">
              <div class="bubble top">Oui je l'aime beaucoup aussi</div>
              <div class="reacts"></div>
              <div class="controls">
                <i title="Répondre" class="circular reply icon"></i
                ><span class="react"
                  ><i title="Aimer" class="circular heart outline icon"></i
                  ><i title="Pouce en l'air" class="circular thumbs up outline icon"></i
                  ><i title="Content" class="circular smile outline icon"></i
                  ><i title="Pas content" class="circular frown outline icon"></i
                ></span>
              </div>
            </div>
            <div class="message">
              <div class="bubble middle">
                <p class="reply_content">C'est vraiment chouette</p>
                On peut répondre à un message
              </div>
              <div class="reacts"></div>
              <div class="controls">
                <i title="Répondre" class="circular reply icon"></i
                ><span class="react"
                  ><i title="Aimer" class="circular heart outline icon"></i
                  ><i title="Pouce en l'air" class="circular thumbs up outline icon"></i
                  ><i title="Content" class="circular smile outline icon"></i
                  ><i title="Pas content" class="circular frown outline icon"></i
                ></span>
              </div>
            </div>
            <div class="message">
              <img title="Bob" src="https://source.unsplash.com/7omHUGhhmZ0/100x100" />
              <div class="bubble bottom">Ou bien y réagir</div>
              <div class="reacts">
                <i title="Aimer" class="circular heart outline icon">1</i>
              </div>
              <div class="controls">
                <i title="Répondre" class="circular reply icon"></i
                ><span class="react"
                  ><i title="Aimer" class="circular heart outline icon"></i
                  ><i title="Pouce en l'air" class="circular thumbs up outline icon"></i
                  ><i title="Content" class="circular smile outline icon"></i
                  ><i title="Pas content" class="circular frown outline icon"></i
                ></span>
              </div>
            </div>
            <div class="message">
              <img title="Alice" src="https://source.unsplash.com/mK_sjD0FrXw/100x100" />
              <div class="bubble top bottom">
                On peut même éditer ou supprimer des messages !
              </div>
              <div class="reacts"></div>
              <div class="controls">
                <i title="Répondre" class="circular reply icon"></i
                ><span class="react"
                  ><i title="Aimer" class="circular heart outline icon"></i
                  ><i title="Pouce en l'air" class="circular thumbs up outline icon"></i
                  ><i title="Content" class="circular smile outline icon"></i
                  ><i title="Pas content" class="circular frown outline icon"></i
                ></span>
              </div>
            </div>
            <div class="view">
              <img title="Vu par Bob à 01:35:50" src="https://source.unsplash.com/7omHUGhhmZ0/100x100" />
            </div>

            <div class="time">01:36:24</div>
            <div class="message mine">
              <div class="bubble top bottom">
                Et on peut voir qui a vu un message ou non ?
              </div>
              <div class="reacts"></div>
              <div class="controls">
                <i title="Supprimer" class="circular trash icon"></i><i title="Editer" class="circular edit icon"></i
                ><i title="Répondre" class="circular reply icon"></i>
              </div>
            </div>
            <div class="time">01:36:31</div>
            <div class="message">
              <img title="Alice" src="https://source.unsplash.com/mK_sjD0FrXw/100x100" />
              <div class="bubble top bottom">Oui !</div>
              <div class="reacts"></div>
              <div class="controls">
                <i title="Répondre" class="circular reply icon"></i
                ><span class="react"
                  ><i title="Aimer" class="circular heart outline icon"></i
                  ><i title="Pouce en l'air" class="circular thumbs up outline icon"></i
                  ><i title="Content" class="circular smile outline icon"></i
                  ><i title="Pas content" class="circular frown outline icon"></i
                ></span>
              </div>
            </div>
            <div class="time">01:36:38</div>
            <div class="message mine">
              <div class="bubble top bottom">Incroyable !</div>
              <div class="reacts"></div>
              <div class="controls">
                <i title="Supprimer" class="circular trash icon"></i><i title="Editer" class="circular edit icon"></i
                ><i title="Répondre" class="circular reply icon"></i>
              </div>
            </div>

            <div v-for="message in this.conversation.messages" :key="message.id">
              <Message :message="message" @onReply="replyToMsg"> </Message>
            </div>
            <div class="view">
              <img title="Vu par Alice à 01:36:39" src="https://source.unsplash.com/mK_sjD0FrXw/100x100" /><img
                title="Vu par Gael à 01:36:39"
                src="https://source.unsplash.com/OYH7rc2a3LA/100x100"
              />
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
              <i title="Abandonner" class="circular times small icon link" @click="print"></i>
              Répondre à {{ this.message.replyTo.from }} :
              <span>
                {{ this.message.replyTo.content }}
              </span>
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
        replyTo: { id: -1, from: '', content: '' }
      }
    };
  },
  mounted() {
    this.scrollBottom();
  },
  updated() {
    this.scrollBottom();
  },
  computed: {
    ...mapGetters(['user', 'users', 'conversation', 'conversations', 'authenticating'])
  },
  methods: {
    ...mapActions(['postMessage', 'replyMessage']),
    print() {
      console.log('la conv', this.conversation);
    },
    scrollBottom() {
      setTimeout(() => {
        let scrollElement = document.querySelector('#scroll');
        if (scrollElement) {
          scrollElement.scrollTop = document.querySelector('#scroll').scrollHeight;
        }
      }, 0);
    },
    sendMessage() {
      console.log('message: ', this.message.content);
      let promise;
      if (this.message.replyTo.id === -1) {
        console.log('message normal');
        //message normal
        promise = this.postMessage({
          conversation: this.conversation,
          content: this.message.content
        });
      } else {
        console.log('message a reply');
        promise = this.replyMessage({
          conversation: this.conversation,
          messageId: this.message.replyTo.id,
          content: this.message.content
        });
      }

      promise.finally(() => {
        this.message = {
          content: '',
          replyTo: { id: -1, from: '', content: '' }
        };
      });
    },
    replyToMsg(msg) {
      this.message.replyTo = { msg };
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
