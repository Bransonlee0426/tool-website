<template>
    <div>
        <el-dialog
            :width="width"
            :fullscreen="isFullscreen"
            v-loading="isLoading"
            show-close
            :title="title"
            :visible.sync="isModalVisible"
            :destroy-on-close="true"
            :before-close="closeModal">
            <div v-if="isInputNumber">
              數量
              <el-input-number
                size="small"
                class="number"
                v-model="count"
                controls-position="right"
                @change="handleChange"
                :min="1" :max="5"></el-input-number>
            </div>
            <slot></slot>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="confirm">確 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'modal',
  props: {
    title: String,
    isFullscreen: Boolean,
    isModalVisible: Boolean,
    isLoading: Boolean,
    isInputNumber: Boolean,
    width: String,
  },
  data() {
    return {
      count: 1,
    };
  },
  created() {},
  methods: {
    handleChange() {
      this.$store.dispatch('status/changeListCount', this.count);
    },
    closeModal() {
      this.$emit('closeModal');
    },
    confirm() {
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="scss" scoped>
.number{
    width: 100px;
    margin-left: 8px;
    margin-bottom: 30px;
}
</style>
