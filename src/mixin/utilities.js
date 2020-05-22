import messages from '../toolbox/messages';
import dataProperty from '../toolbox/dataProperty';

export default {
  data() {
    return {
      loadingInstance: '',
    };
  },
  methods: {
    async $_promiseAll(APIsArray, res, err) {
      Promise.all(APIsArray).then(res).catch(err);
    },
    $_loading(targetDom) {
      this.loadingInstance = this.$loading({
        target: targetDom,
        lock: true,
      });
    },
    $_loadingClose(instance) {
      instance.close();
    },
    $_formatCheck(type, val) {
      switch (type) {
        case 'email':
        {
          // eslint-disable-next-line no-useless-escape
          const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return reg.test(val);
        }
        case 'password':
        {
          const reg = /^(?=.*[a-zA-Z]).{6,12}$/;
          return reg.test(val);
        }
        default:
          return '';
      }
    },
    // Message 訊息提示
    $_alert(msgType, msg, val) {
      let msgContent = '';
      // val 判斷是否有自訂文字內容
      if (val) {
        messages.cusMsg(val).forEach((item) => {
          if (msg === item.type) {
            msgContent = item.message;
          }
        });
      } else {
        messages.msg.forEach((item) => {
          if (msg === item.type) {
            msgContent = item.message;
          }
        });
      }
      this.$message({
        showClose: true,
        message: msgContent,
        type: msgType,
      });
    },
    $_confirm(msg, res, err) {
      let msgContent = '';
      messages.msg.forEach((item) => {
        if (msg === item.type) {
          msgContent = item.message;
        }
      });
      this.$confirm(msgContent, dataProperty.confirm[0], {
        confirmButtonText: dataProperty.confirm[1],
        cancelButtonText: dataProperty.confirm[2],
      }).then((res)).catch((err));
    },
  },
};
