<template>
  <div>
    <el-tag
      :closable="isEdit"
      v-for="(item,index) in data"
      :key="index"
      @close="handleClose(index)">
      {{item}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      maxlength="15"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-input style="display:none"></el-input>
    <el-button
      v-if="isEdit"
      class="button-new-tag"
      size="small"
      @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
export default {
  name: 'tag',
  data() {
    return {
      inputValue: '',
      inputVisible: false,
    };
  },
  props: {
    data: Array, // ['xxx','xxx']
    type: String,
    isEdit: Boolean,
  },
  methods: {
    handleClose(index) {
      this.data.splice(index, 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      this.inputVisible = false;
      const { inputValue } = this;
      if (inputValue) {
        switch (this.type) {
          case 'Label':
            if (this.checkLength()) {
              this.data.splice(1, 1);
              this.$_alert('error', 'LabelLimited');
            } else {
              this.data.push(inputValue);
            }
            break;
          case '同義字':
            this.data.push(inputValue);
            break;
          default:
            break;
        }
      }
      this.inputValue = '';
    },
    checkLength() {
      let isOverLength = false;
      if (this.data.length >= 1) {
        isOverLength = true;
      }
      return isOverLength;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
