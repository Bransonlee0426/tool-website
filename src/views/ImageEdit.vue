<template>
  <div class="container">
    <el-row type="flex" justify="center">
      <el-col >
        <el-select
          v-model="selectStore"
          filterable
          placeholder="請選擇店名"
          @change="handleSelect"
          class="select"
          clearable>
            <el-option
              v-for="item in brandsDate"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="middle-row">
      <el-col class="middle-col">
        <el-row class="title" type="flex" justify="start">
          <el-col class="store-image">商店圖片</el-col>
          <el-col class="store-name">店名</el-col>
          <el-col class="operating-image">操作圖片</el-col>
          <el-col class="operating">操作</el-col>
        </el-row>
          <ul class="store-ul" v-loading="loading">
            <li
              ref="storeItem"
              v-for="(item,index) in listData"
              :key="item.id"
              class="store-li">
              <el-row>
                <el-col :span="5" class="store-col">
                  <el-image
                    class="image-default"
                    :src="imageURL(item.image)"
                  ></el-image>
                </el-col>
                <el-col :span="19">
                  <el-row>
                    <el-col :span="5">
                      <div class="store-name">
                        {{item.name}}
                      </div>
                    </el-col>
                    <el-col :span="14">
                      <el-upload
                        action="#"
                        ref="upload"
                        :limit="1"
                        accept="image/jpeg,image/gif,image/png,image/jpg"
                        list-type="picture-card"
                        :on-remove="(file)=>handleRemove(index, file)"
                        :on-change="(file)=>handleChange(index, file)"
                        :auto-upload="false">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </el-col>
                    <el-col :span="5" class="button-col">
                      <el-row class="button-row">
                        <el-col style="padding:5px" :span="24">
                          <el-button
                            class="btn-style"
                            type="primary"
                            @click="handleAdd(index,item)"
                            >新增</el-button>
                        </el-col>
                        <el-col style="padding:5px" :span="24">
                          <el-button
                            class="btn-style"
                            type="primary"
                            @click="handleUpdate(index,item)"
                            >更換</el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
          </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brandsDate: [], // 總資料，數量不會變
      listData: [], // Show出來的動態 List
      imageArray: [],
      selectStore: '',
      loading: false,
      getMeals: {
        client: 'backend',
        name: this.$query.getMeals,
        variables: {},
      },
      brandImageCreate: {
        client: 'backend',
        name: this.$mutation.brandImageCreate,
        variables: {
          brandId: '',
          image: '',
          name: '',
        },
      },
      brandImageUpdate: {
        client: 'backend',
        name: this.$mutation.brandImageUpdate,
        variables: {
          brandId: '',
          image: '',
          name: '',
        },
      },
    };
  },
  created() {
    this.getAllBrandsAPI();
  },
  methods: {
    handleAdd(index, item) {
      const imageFile = this.imageArray.find(ele => ele.index === index);
      if (!this.beforeUploadCheck(imageFile)) {
        return;
      }
      this.brandImageCreate.variables.brandId = item.id;
      this.brandImageCreate.variables.image = imageFile.file.raw;
      this.brandImageCreate.variables.name = item.name.replace(/\s*/g, '');// 去空格
      this.loading = true;
      this.$_loading(this.$refs.storeItem[index]);
      this.$_mutationApi(this.brandImageCreate,
        (res) => {
          // 移除圖片
          this.$refs.upload[index].handleRemove();
          this.$_alert('success', 'addSuccess');
          this.refreshImage('create', item, res);
          this.$_loadingClose(this.loadingInstance);
          this.loading = false;
        },
        (err) => {
          if (err.message === 'GraphQL error: 品牌圖片已存在') {
            this.$_alert('warning', 'existImage');
            this.$_loadingClose(this.loadingInstance);
            this.loading = false;
          }
        });
    },
    beforeUploadCheck(imageFile) {
      if (imageFile === undefined) {
        this.$_alert('warning', 'noUploadImage');
        return false;
      }
      if (this.checkSize(imageFile)) {
        this.$_alert('warning', 'imageOversize');
        return false;
      }
      return true;
    },
    refreshImage(apiType, selectItem, imageFile) {
      for (let i = 0, len = this.listData.length; i < len; i += 1) {
        if (this.listData[i].id === selectItem.id) {
          if (apiType === 'create') {
            this.listData[i].image = imageFile.data.BrandImageCreate.name;
          } else if (apiType === 'update') {
            this.listData[i].image = imageFile.data.BrandImageUpdate.name;
          }
        }
      }
    },
    handleUpdate(index, item) {
      const imageFile = this.imageArray.find(ele => ele.index === index);
      if (!this.beforeUploadCheck(imageFile)) {
        return;
      }
      this.brandImageUpdate.variables.brandId = item.id;
      this.brandImageUpdate.variables.image = imageFile.file.raw;
      this.brandImageUpdate.variables.name = item.name.replace(/\s*/g, '');// 去空格
      this.loading = true;
      this.$_loading(this.$refs.storeItem[index]);
      this.$_mutationApi(this.brandImageUpdate,
        (res) => {
          if (res.data.BrandImageUpdate.name === '') {
            this.$_alert('warning', 'noAddImage');
          } else {
            this.$_alert('success', 'updateSuccess');
            // 移除圖片
            this.$refs.upload[index].handleRemove();
            this.refreshImage('update', item, res);
          }
          this.loading = false;
          this.$_loadingClose(this.loadingInstance);
        },
        (err) => {
          this.loading = false;
          this.$_loadingClose(this.loadingInstance);
          console.log('err', err);
        });
    },
    imageURL(image) {
      let url = '';
      const randomNum = Math.random();
      if (image !== '') {
        url = `https://bskini-brand-images.s3-ap-northeast-1.amazonaws.com/${image}?${randomNum}`;
      } else {
        url = '';
      }
      return url;
    },
    handleRemove(index) {
      for (let i = 0, len = this.imageArray.length; i < len; i += 1) {
        if (this.imageArray[i].index === index) {
          this.imageArray.splice(i, 1);
        }
      }
    },
    handleChange(index, file) {
      this.imageArray.push(
        {
          index,
          file,
        },
      );
    },
    checkSize(file) {
      if (file.file.size > 512000) {
        return true;
      }
      return false;
    },
    getAllBrandsAPI() {
      this.loading = true;
      this.$_queryApi(this.getMeals,
        (res) => {
          for (let i = 0, len = res.data.Meals.brands.length; i < len; i += 1) {
            this.brandsDate.push(res.data.Meals.brands[i]);
          }
          this.loading = false;
          this.handleSelect();
        },
        (err) => {
          this.loading = false;
          this.$_alert('error', 'getFail');
          console.log('err', err);
        });
    },
    handleSelect() {
      this.setListData();
    },
    setListData() {
      this.listData = [];
      if (this.selectStore === '') {
        for (let i = 0, len = this.brandsDate.length; i < len; i += 1) {
          this.listData.push(this.brandsDate[i]);
        }
      } else {
        this.listData = this.brandsDate.filter(ele => ele.id === this.selectStore);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 90vh;
}
.select{
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}
.middle-row{
  height: 85vh;
  .middle-col{
    height: 100%;
    .title{
      color:#606266;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 3px;
      font-size: 25px;
      padding:10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      background-color: rgb(233, 233, 233);
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      .store-image{
        width: 20%;
      }
      .store-name{
        width: 17%;
      }
      .operating-image{
        width: 47.5%;
      }
      .operating{
        width: 15.5%;
      }
    }
    .store-ul{
      overflow: auto;
      margin-top: 10px;
      border-radius: 4px;
      height: 90%;
      .store-li{
        margin: 10px;
        height: 148px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, .12);
        background-color: #E4E7ED;
        .store-name{
          font-size: 20px;
          padding-top: 60px;
        }
        .store-col{
          padding-left: 5px;
        }
        .btn-style{
          width: 100px;
          margin:3px;
        }
        .image-default{
          width: 148px;
          height: 148px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        }
        .button-col{
          padding:22px 0px;
        }
      }
    }
  }
}
</style>
