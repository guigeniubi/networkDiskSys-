<template>
  <div>
    <div v-for="message in messages" :key="message.id">{{ message.content }}</div>

    <input v-model="currentMessage" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMessage: '',
      messages: [],
      socket: null
    };
  },
  methods: {
    sendMessage() {
      if (!this.currentMessage.trim()) return;

      // 从Vuex获取用户名
      const username = this.$store.state.user.name;
      const messageContent = `${username}: ${this.currentMessage}`;

      // 发送到服务器
      this.socket.send(messageContent);

      this.currentMessage = '';
    },
    receiveMessage(event) {
      console.log("Received data:", event.data);

      // 检查接收到的数据是否为Blob
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.readAsText(event.data);
        reader.onload = () => {
          // 将Blob数据转换为文本后，将其推入到messages数组中
          this.messages.push({ id: Date.now(), content: reader.result });
        };
      } else {
        // 如果数据已经是文本，直接将其推入到messages数组中
        this.messages.push({ id: Date.now(), content: event.data });
      }
    }

  },
  mounted() {
    this.socket = new WebSocket('ws://192.168.211.143:8080');
    this.socket.addEventListener('message', this.receiveMessage);

  },
  beforeDestroy() {
    this.socket.close();
  }
};
</script>
