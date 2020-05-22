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
          <el-row>
            <el-col :span="24">
              <template>
                <!-- <el-select
                  class="selection-store"
                  v-model="selectStore"
                  multiple
                  filterable
                  default-first-option
                  placeholder="請選擇店名">
                  <el-option
                    v-for="item in storesName"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select> -->
                <el-select
                  class="selection-store"
                  v-model="selectStore"
                  filterable
                  clearable
                  placeholder="請選擇店名"
                >
                <el-option
                  v-for="item in storesName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </template>
            </el-col>
            <el-col :span="24">
              <el-input
                class="input-dish"
                v-model="search"
                placeholder="請輸入樣品名稱"
                @keyup.enter.native="handleSearch"></el-input>
              <el-button
                type="primary"
                @click="handleSearch"
                native-type="submit"
                :disabled="isSearchBtnDisabled"
                >查詢</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
    <el-col>
      <el-table
        height="70vh"
        :data="tableDataEnd"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :empty-text="emptyText"
        :row-style="rowClass"
      >
        <el-table-column
          v-for="item in headerLabel"
          :key="item['店名']"
          :width="columnWidth(item)"
          :label="item"
          :prop="item"
          sortable
        >
         <template slot-scope="scope">
          <el-input
            v-if="scope.row.isEdit"
            size="small"
            style="text-align:center"
            :type="item === '備註'? 'textarea' : 'text'"
            v-model="scope.row[item]"
            ></el-input>
          <span v-else style="padding:10px">{{scope.row[item]}}</span>
        </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150px"
          >
          <template slot-scope="scope">
              <el-button
                size="mini"
                :type="scope.row.isEdit ? 'success' : '' "
                @click="handleEdit(scope.$index, scope.row)">
                {{scope.row.isEdit ? '完成' : '編輯'}}
              </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleUpdate(scope.$index, scope.row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="pagination-col">
      <el-pagination
        background
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalItems">
      </el-pagination>
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
      headerLabel: dataProperty.dishDataHeader,
      detailsLabel: dataProperty.detailsLabel,
      loading: false,
      workbook: '',
      search: '',
      dishDatabase: JSON.parse(localStorage.getItem('dishDatabase')),
      tableDataBegin: [],
      tableDataEnd: [],
      storesName: [],
      currentPage: 1,
      totalItems: 0,
      pageSize: 50,
      selectStore: [],
      isCorrectFile: false,
      isSearchBtnDisabled: false,
      getAllBrands: {
        name: this.$query.getAllBrands,
        variables: {
          id: '0',
        },
      },
      dishesDetails: {
        name: this.$query.dishesDetails,
        variables: {
          id: '1',
        },
      },
    };
  },
  created() {
    // For excel.
    if (this.dishDatabase) {
      this.initData();
    }
  },
  computed: {
    emptyText() {
      return '無資料參考';
    },
  },
  methods: {
    initData() {
      this.tableDataBegin = []; // clean the array before update.
      this.dishDatabase = JSON.parse(localStorage.getItem('dishDatabase'));
      // initData
      this.dishDatabase.sheet.forEach((ele) => {
        this.storesName.push(ele['店名']);
        this.tableDataBegin.push(ele);
      });
      // 去除重複店名
      this.storesName = Array.from(new Set(this.storesName));
      this.perPageSize();
    },
    getAllBrandsAPI() {
      this.$_queryApi(this.getAllBrands,
        (res) => {
          res.data.Brand.forEach((ele) => {
            this.storesName.push(ele);
          });
        }, (err) => {
          console.log('err', err);
          this.$_alert('error', 'getFail');
        });
    },
    dishesDetailsAPI() {
      this.isSearchBtnDisabled = true;
      this.$_queryApi(this.dishesDetails,
        (res) => {
          this.isSearchBtnDisabled = false;
          console.log('res', res.data.Brand);
        }, (err) => {
          this.isSearchBtnDisabled = false;
          this.$_alert('error', 'getFail');
          console.log('err', err);
        });
    },
    handleSearch() {
      // For excel.
      // this.doFilter();
      // this.perPageSize();
      this.dishesDetailsAPI();
    },
    doFilter() {
      this.tableDataBegin = []; // clean the array before update.
      this.tableDataEnd = [];
      if (this.selectStore.length !== 0) {
        // 有選店名時
        const storeFilterArr = this.dishDatabase.sheet.filter(
          ele => this.selectStore.indexOf(ele['店名']) > -1 && ele['品名'].toString().indexOf(this.search) > -1,
        );
        storeFilterArr.forEach((ele) => {
          this.tableDataBegin.push(ele);
        });
        this.tableDataBegin = storeFilterArr;
      } else {
        // 沒有選店名時
        const nameFilterArr = this.dishDatabase.sheet.filter(
          ele => ele['品名'].toString().indexOf(this.search.trim()) > -1,
        );
        this.tableDataBegin = nameFilterArr;
      }
    },
    perPageSize() {
      // 列表長度及每頁顯示數目
      this.totalItems = this.tableDataBegin.length;
      if (this.totalItems > this.pageSize) {
        for (let index = 0; index < this.pageSize; index += 1) {
          this.tableDataEnd.push(this.tableDataBegin[index]);
        }
      } else {
        this.tableDataEnd = this.tableDataBegin;
      }
    },
    handleCurrentChange(val) {
      // 當前頁
      this.currentPage = val;
      this.currentChangePage(this.tableDataBegin);
    },
    // 組件自帶監控當前頁碼
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      const to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from += 1) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
      // 當頁面row為空值且不是在第一頁時，回上一頁
      if (this.tableDataEnd.length === 0 && this.currentPage !== 1) {
        this.currentPage -= 1;
      }
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
    handleEdit(index, row) {
      // eslint-disable-next-line no-param-reassign
      row.isEdit = !row.isEdit;
      if (!row.isEdit) {
        console.log('API', row);
      }
    },
    handleUpdate(index, row) {
      console.log(index, row);
    },
    // eslint-disable-next-line consistent-return
    columnWidth(item) {
      let width;
      switch (item) {
        case '店名':
          width = '130px';
          return width;
        case '品名':
          width = '180px';
          return width;
        case '單位':
          width = '80px';
          return width;
        case '熱量':
          width = '85px';
          return width;
        case '蛋白質':
          width = '95px';
          return width;
        case '脂肪':
          width = '85px';
          return width;
        case '碳水化合物(醣類)':
          width = '155px';
          return width;
        case '總重量':
          width = '90px';
          return width;
        case '重量單位':
          width = '115px';
          return width;
        case '包裝份量':
          width = '115px';
          return width;
        default:
          break;
      }
    },
    setAttributes(data) {
      const mdata = {
        sheetName: '收集菜餚資料',
        sheet: [],
      };
      const arr = [];
      data.sheet.forEach((ele) => {
        arr.push({
          店名: ele['店名'],
          品名: ele['品名'],
          單位: ele['單位'],
          熱量: ele['熱量'],
          蛋白質: ele['蛋白質'],
          脂肪: ele['脂肪'],
          '碳水化合物(醣類)': ele['碳水化合物(醣類)'],
          總重量: ele['總重量'],
          重量單位: ele['重量單位'],
          包裝份量: ele['包裝份量'],
          備註: ele['備註'],
          isEdit: false,
        });
      });
      mdata.sheet = arr;
      return mdata;
    },
    handleFileChange(file) {
      this.loading = true;
      // settimeout for ready loadding.
      setTimeout(() => {
        this.readExcelToJSON(file.raw).then((res) => {
          localStorage.setItem('dishDatabase', JSON.stringify(this.setAttributes(res[0])));
          this.initData();
          this.$_alert('success', 'successUpload');
          this.loading = false;
        }).catch((e) => {
          console.log('catch', e);
          this.$_alert('error', 'failedUpload');
          this.loading = false;
        });
      }, 500);
    },
    readExcelToJSON(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          this.workbook = XLSX.read(data, {
            type: 'binary',
          });
          const result = [];
          this.isCorrectFile = false;
          this.workbook.SheetNames.forEach((sheetName) => {
            if (sheetName === '收集菜餚資料') {
              this.isCorrectFile = true;
              result.push({
                sheetName,
                // { range: 1 } effects start to parse by second row
                sheet: XLSX.utils.sheet_to_json(this.workbook.Sheets[sheetName]),
              });
            }
          });
          if (!this.isCorrectFile) {
            reject(new Error('error file!'));
          } else {
            resolve(result);
          }
        };
        reader.readAsBinaryString(file);
      });
    },
  },
  watch: {
    tableDataBegin: {
      handler() {
        // 內容資料有變動初使化當前頁為第一頁
        this.currentPage = 1;
      },
    },
    selectStore: {
      immediate: true,
      handler(newIndex) {
        // 控制查詢按鈕
        if (this._.isNumber(newIndex)) {
          this.isSearchBtnDisabled = false;
        } else {
          this.isSearchBtnDisabled = true;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-col {
  padding-bottom: 10px;
}
// .input-dish{
//   width: 80%;
//   padding-right: 5px;
// }
.selection-store{
  width: 80%;
}
.search-col{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-left: 5px;
  height: 80px;
}
.pagination-col{
  margin-top: 15px;
}
</style>
