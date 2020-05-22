<template>
    <div>
          <el-form
            v-for="(item,index) in listCount"
            :key="item"
            :model="form[index]"
            :inline="true"
          >
          <el-form-item
              label="店名">
              <el-select
                  filterable
                  clearable
                  style="width: 180px;"
                  v-model="form[index].storeName"
                  placeholder="請選擇店名">
                  <el-option
                      v-for="option in storeName"
                      :key="option.id"
                      :label="option.name"
                      :value="option.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item
              label="品名">
              <el-input
                  style="width: 130px;"
                  maxlength="20"
                  v-model="form[index].dishName"
                  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
              label="熱量">
                <el-input-number
                  v-model="form[index].calories"
                  style="width: 80px;"
                  :max="9999"
                  :min="0"
                  size="large"
                  :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item
              label="蛋白質">
                <el-input-number
                  v-model="form[index].protein"
                  style="width: 80px;"
                  :max="9999"
                  :min="0"
                  size="large"
                  :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item
              label="脂肪">
                <el-input-number
                  v-model="form[index].fats"
                  style="width: 80px;"
                  :max="9999"
                  :min="0"
                  size="large"
                  :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item
              label="碳水化合物(糖類)">
                <el-input-number
                  v-model="form[index].carbohydrate"
                  style="width: 80px;"
                  :max="9999"
                  :min="0"
                  size="large"
                  :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item
              label="總重量">
                <el-input-number
                  v-model="form[index].grossWeight"
                  style="width: 80px;"
                  :max="9999"
                  :min="0"
                  size="large"
                  :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item
              label="單位">
              <el-select
                  style="width: 80px;"
                  placeholder=""
                  v-model="form[index].unit">
                  <el-option
                      v-for="option in unit"
                      :key="option.id"
                      :label="option.text"
                      :value="option.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item
              label="重量單位">
              <el-select
                  style="width: 80px;"
                  placeholder=""
                  v-model="form[index].weightUnit">
                  <el-option
                      v-for="option in weightUnit"
                      :key="option.id"
                      :label="option.text"
                      :value="option.id"></el-option>
              </el-select>
          </el-form-item>
          <div class="expand-cursor" @click="handlerExpand(index)">
            <i
              ref="arrow"
              :class="['fas',
                        'fa-angle-right',
                        'fa-lg']"></i>
          </div>
          <div class="expand" ref="expand" v-show="false">
            <el-form-item
              label="Label">
              <tag
                type="Label"
                :data="form[index].label"
                v-model="form[index].label"
                :isEdit="true"></tag>
            </el-form-item>
            <el-form-item
              label="同義字">
              <tag
                type="同義字"
                :data="form[index].synonym"
                v-model="form[index].synonym"
                :isEdit="true"></tag>
            </el-form-item>
          </div>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'dishForm',
  props: {
    storeName: Array,
    weightUnit: Array,
    unit: Array,
    isGetData: Boolean,
  },
  data() {
    return {
      form: [], // [dishDetail]
      isVaild: true,
    };
  },
  created() {
    this.emptyForm();
  },
  computed: {
    listCount() {
      return this.$store.state.status.listCount;
    },
  },
  methods: {
    emptyForm() {
      this.form = [];
      for (let i = 0, len = this.listCount; i < len; i += 1) {
        this.form.push({
          storeName: '',
          dishName: '',
          calories: '',
          protein: '',
          fats: '',
          carbohydrate: '',
          grossWeight: '',
          unit: '',
          weightUnit: '',
          label: [],
          synonym: [],
        });
      }
    },
    checkForm() {
      this.isVaild = true;
      for (let i = 0, len = this.form.length; i < len; i += 1) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(this.form[i])) {
          if (value === '' || value === undefined) {
            this.translation(key);
            this.isVaild = false;
            return;
          }
        }
      }
    },
    translation(key) {
      switch (key) {
        case 'storeName':
          this.keyName = '店名';
          break;
        case 'dishName':
          this.keyName = '品名';
          break;
        case 'calories':
          this.keyName = '熱量';
          break;
        case 'protein':
          this.keyName = '蛋白質';
          break;
        case 'fats':
          this.keyName = '脂肪';
          break;
        case 'carbohydrate':
          this.keyName = '碳水化合物(醣類)';
          break;
        case 'grossWeight':
          this.keyName = '總重量';
          break;
        case 'unit':
          this.keyName = '單位';
          break;
        case 'weightUnit':
          this.keyName = '重量單位';
          break;
        default:
          this.keyName = '';
          break;
      }
    },
    handlerExpand(index) {
      const classList = this.$refs.arrow[index].classList.value;
      if (this.$refs.expand[index].style.display === 'none') {
        this.$refs.expand[index].style.display = ''; // isShow
        const newClass = classList.concat(' fa-rotate-90'); // icon
        this.$refs.arrow[index].classList.value = newClass;
      } else {
        this.$refs.expand[index].style.display = 'none'; // isShow
        const newClass = classList.slice(0, -13); // icon
        this.$refs.arrow[index].classList.value = newClass;
      }
    },
  },
  watch: {
    listCount: {
      handler() {
        this.emptyForm();
      },
    },
    isGetData: {
      handler(val) {
        if (val) {
          this.checkForm();
          if (this.isVaild) {
            this.$emit('dishData',
              this.listCount,
              {
                form: this.form,
                title: this.title,
              });
          } else {
            this.$_alert('warning', 'nullValue', this.keyName);
          }
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.expand-cursor{
  cursor: pointer;
  margin-bottom: 20px;
}
.expand{
  margin: 20px 0px;
  padding-top: 20px;
  padding-left: 20px;
  background-color: rgb(255, 252, 232);
}
</style>
