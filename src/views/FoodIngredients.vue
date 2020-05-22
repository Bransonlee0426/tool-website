<template>
  <el-row>
    <el-col class="upload-col">
      <el-row>
        <el-col :span="12">
          <el-upload
            class="upload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-excel"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-exceed="handleExceed"
            :limit="1"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上傳檔案</el-button>
            <div slot="tip" class="el-upload__tip">只能上傳 Excel 文件</div>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <el-input v-model="search" placeholder="請輸入樣品名稱"></el-input>
        </el-col>
      </el-row>
    </el-col>
    <el-col>
      <el-table
        height="60vh"
        :data="ingredientsList"
        style="width: 100%"
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        @selection-change="handleSelectionChange"
        :empty-text="emptyText"
        :row-style="rowClass"
      >
       <el-table-column
        type="selection"
        width="45">
       </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item
                v-for="item in detailsLabel"
                :key="item"
                :label="item"
              >
                <span>{{ props.row[item] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in headerLabel"
          :key="item['整合編號']"
          :width="item === '整合編號' ? '100px': ''"
          :label="item"
          :prop="item"
        >
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="selection-col">
      <h3 class="selected-item">已選取 {{selectionIngredients.length}} 個項目</h3>
      <el-popover
        placement="right"
        width="350"
        trigger="hover">
        <div v-if="selectionIngredients.length === 0" style="text-align:center">
          目前無任何項目
        </div>
        <ul v-else class="popover-ul">
          <li class="popover-li" v-for="item in selectionIngredients" :key="item['樣品名稱']">
            {{item['整合編號']}}-{{item['樣品名稱']}}
          </li>
        </ul>
        <el-button slot="reference">顯示項目</el-button>
      </el-popover>
    </el-col>
    <el-col class="bottomBtn-col" :span="24" >
       <div>
          <el-button class="bottomBtn" type="primary" @click="submit">送出</el-button>
       </div>
    </el-col>
  </el-row>
</template>

<script>
import XLSX from 'xlsx';
import dataProperty from '../toolbox/dataProperty';

export default {
  data() {
    return {
      fileList: [],
      headerLabel: dataProperty.ingredientHeader,
      detailsLabel: dataProperty.detailsLabel,
      loading: false,
      workbook: '',
      search: '',
      ingredientsDatabase: JSON.parse(localStorage.getItem('IngredientsDatabase')),
      ingredientsData: [],
      noSearchList: [],
      selectionIngredients: [],
      ingredientsNumber: [],
    };
  },
  created() {
    if (this.ingredientsDatabase) {
      this.initData();
    }
  },
  computed: {
    ingredientsList() {
      if (this.search === '' || this.search === ' ') {
        return this.noSearchList;
      }
      return this.ingredientsData.filter(
        item => item.樣品名稱.toLowerCase().indexOf(this.search.toLowerCase()) !== -1,
      );
    },
    emptyText() {
      if (this.ingredientsDatabase) {
        return '輸入樣品名稱後顯示';
      }
      return '請上傳Excel檔案';
    },
  },
  methods: {
    initData() {
      this.ingredientsData = []; // clean the array before update.
      this.ingredientsDatabase = JSON.parse(
        localStorage.getItem('IngredientsDatabase'),
      );
      this.ingredientsDatabase.sheet.forEach((ele) => {
        this.ingredientsData.push(ele);
      });
    },
    handleSelectionChange(val) {
      this.selectionIngredients = val;
    },
    submit() {
      this.selectionIngredients.forEach((ele) => {
        this.ingredientsNumber.push(ele['整合編號']);
      });
    },
    rowClass(row) {
      if (row.rowIndex % 2 === 0) {
        return { 'background-color': '#e9f6f1' };
      }
      return '';
    },
    handleExceed() {
      this.$_alert('warning', 'uploadMaximum');
    },
    handleFileChange(file) {
      this.loading = true;
      // settimeout for ready loadding.
      setTimeout(() => {
        this.readExcelToJSON(file.raw).then((res) => {
          localStorage.setItem('IngredientsDatabase', JSON.stringify(res[0]));
          this.initData();
          this.$_alert('success', 'successUpload');
          this.loading = false;
        });
      }, 500);
    },
    readExcelToJSON(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          this.workbook = XLSX.read(data, {
            type: 'binary',
          });
          const result = [];
          this.workbook.SheetNames.forEach((sheetName) => {
            // if (sheetName === '收集菜餚資料') {
            result.push({
              sheetName,
              // { range: 1 } effects start to parse by second row
              sheet: XLSX.utils.sheet_to_json(this.workbook.Sheets[sheetName], { range: 1 }),
            });
            // }
          });
          resolve(result);
        };
        reader.readAsBinaryString(file);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-col {
  height: 90px;
}
.selection-col{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 10px;
  color:#606266;
  .selected-item{
    font-size: 16px;
    width: 130px;
    margin-right: 10px;
  }
}
.popover-ul{
  overflow: auto;
  width: 350px;
  max-height: 200px;
  .popover-li{
    width: auto;
    padding: 5px;
  }
}
.bottomBtn-col{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
// table
.table-expand {
  background-color:#FFFAF2;
  margin: -21px -50px -21px -50px;
  padding: 20px 50px 20px 50px;
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 20%;
}
</style>
