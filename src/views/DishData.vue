<template>
  <el-row>
    <el-col class="search-col">
      <el-row>
        <el-col :span="24">
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
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            class="dish-search"
            placeholder="菜餚搜尋"
            v-model="keyWord"
            @keyup.enter.native="handleSearch"
          ></el-input>
          <el-button
            type="primary"
            class="search-btn"
            @click="handleSearch"
            native-type="submit"
            :disabled="isSearchBtnDisabled"
            >查詢</el-button
          >
          <el-button type="success" @click="addingSingle"
            >新增菜餚</el-button
          >
          <!-- <el-button type="success" @click="test">TEST</el-button> -->
          <modal
            :title="modalTitle"
            :isFullscreen="isFullscreen"
            :isModalVisible="isModalVisible"
            :isLoading="isModalLoading"
            isInputNumber
            @closeModal="closeModal"
            @confirm="confirm"
          >
          <dish-Form
            :storeName="storesName"
            :unit="unit"
            :weightUnit="weightUnit"
            :isGetData="isGetData"
            @dishData="dishData"
          ></dish-Form>
          </modal>
        </el-col>
      </el-row>
    </el-col>
    <el-col>
      <el-table
        height="85vh"
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :row-style="rowClass"
      >
        <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline>
            <el-form-item
              v-for="item in expandLabel"
              :key="item['水果類']"
              :label="item">
            <el-input-number
              v-show="props.row.isEdit"
              size="small"
              class="input-number"
              v-model="props.row[item]"
              :controls="false">
            </el-input-number>
             <span v-show="!props.row.isEdit" class="expand-span">{{props.row[item]}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item
                v-for="item in expandLabel"
                :key="item['Label']"
                :label="item"
              >
                <!-- <el-input-number
                v-show="props.row.isEdit"
                size="small"
                class="input-number"
                v-model="props.row[item]">
              </el-input-number> -->
                <tag
                  :type="item"
                  :data="props.row[item]"
                  :isEdit="props.row.isEdit"
                  v-model="props.row[item]"
                ></tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in dishLabel"
          :key="item"
          :label="item"
          :prop="item"
          :width="columnWidth(item)"
          sortable
        >
          <template slot-scope="scope">
            <el-select
              v-if="item ==='店名'"
              v-model="scope.row[scope.column.property]"
              filterable
              :disabled="!scope.row.isEdit"
              size="small"
            >
              <el-option
                v-for="item in storesName"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="scope.row.isEdit && item === '品名'"
              size="small"
              maxlength="20"
              style="text-align:center"
              v-model="scope.row[item]"
            >
            </el-input>
            <el-select
              v-if="item === '單位'"
              v-model="scope.row[scope.column.property]"
              :disabled="!scope.row.isEdit"
              size="small"
              filterable
            >
              <el-option
                v-for="item in unit"
                :key="item.id"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="item === '重量單位'"
              v-model="scope.row[scope.column.property]"
              :disabled="!scope.row.isEdit"
              size="small"
              filterable
            >
              <el-option
                v-for="item in weightUnit"
                :key="item.id"
                :label="item.text"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input-number
              v-if="scope.row.isEdit
              && item !== '品名'
              && item !== '店名'
              && item !== '單位'
              && item !== '重量單位'
              && item !== '操作'"
              :max="9999"
              :min="0"
              size="small"
              class="input-number"
              v-model="scope.row[item]"
              :controls="false"
            ></el-input-number>
            <span
              v-if="!scope.row.isEdit
              && item !== '店名'
              && item !== '單位'
              && item !== '重量單位'
              && item !== '操作'"
              style="padding:10px">
              {{scope.row[item]}}</span>
            <el-button
              v-if="item === '操作'"
              size="mini"
              :type="scope.row.isEdit ? 'success' : ''"
              @click="handleEdit(scope, scope.row)"
            >
              {{ scope.row.isEdit ? "完成" : "編輯" }}
            </el-button>
            <el-button
              v-if="item === '操作'"
              type="danger"
              size="mini"
              @click="handleDelete(scope)">
              刪除
            </el-button>
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
        layout="prev, pager, next, jumper"
        :total="totalItems">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
import dataProperty from '../toolbox/dataProperty';

export default {
  data() {
    return {
      dietitianId: localStorage.getItem('user-account'),
      dishLabel: dataProperty.dishHeader,
      // expandLabel: dataProperty.ingredientExpand,
      expandLabel: dataProperty.labelExpand,
      unitHeader: dataProperty.unitHeader,
      detailsLabel: dataProperty.detailsLabel,
      loading: false,
      search: '',
      isSearchBtnDisabled: true,
      tableData: [],
      storesName: [],
      currentPage: 1,
      totalItems: 0,
      pageSize: 50,
      storeId: '',
      unitId: '',
      weightUnitId: '',
      selectStore: '',
      keyWord: '',
      unit: [],
      weightUnit: [],
      isModalVisible: false,
      isFullscreen: false,
      isModalLoading: false,
      successfullLog: [],
      successfullLength: 0,
      modalTitle: '',
      isGetData: false,
      getMeals: {
        client: 'backend',
        name: this.$query.getMeals,
        variables: {
          brandId: '',
          keyWord: '',
          page: '',
        },
      },
      mealsUpdate: {
        client: 'backend',
        name: this.$mutation.mealsUpdate,
        variables: {
          dishInfo: {},
        },
      },
      mealsCreate: {
        client: 'backend',
        name: this.$mutation.mealsCreate,
        variables: {
          dishInfo: {},
        },
      },
      mealsDelete: {
        client: 'backend',
        name: this.$mutation.mealsDelete,
        variables: {
          id: '',
        },
      },
    };
  },
  created() {
    this.getMealsAPI();
  },
  methods: {
    test() {},
    async getMealsAPI() {
      this.getMeals.variables = {};
      this.$_queryApi(
        this.getMeals,
        (res) => {
          const { brands } = res.data.Meals;
          const { units } = res.data.Meals;
          const { weightUnits } = res.data.Meals;
          for (let i = 0, len = brands.length; i < len; i += 1) {
            this.storesName.push(brands[i]);
          }
          for (let i = 0, len = units.length; i < len; i += 1) {
            this.unit.push(units[i]);
          }
          for (let i = 0, len = weightUnits.length; i < len; i += 1) {
            this.weightUnit.push(weightUnits[i]);
          }
        },
        (err) => {
          console.log('err', err);
          this.$_alert('error', 'getFail');
        },
      );
    },
    getMealsDishAPI(id, keyWord, page) {
      this.isSearchBtnDisabled = true;
      this.loading = true;
      if (id === '') {
        // 餐廳沒有選的時候不帶任何參數
        this.getMeals.variables = {
          keyWord,
          page,
        };
      } else {
        this.getMeals.variables = {
          brandId: id,
          keyWord,
          page,
        };
      }
      this.$_queryApi(
        this.getMeals,
        (res) => {
          this.isSearchBtnDisabled = false;
          this.loading = false;
          this.dishesFormat(res);
        },
        (err) => {
          this.isSearchBtnDisabled = false;
          this.loading = false;
          console.log('err', err);
          this.$_alert('error', 'getFail');
        },
      );
    },
    handleSearch() {
      this.getMealsDishAPI(this.selectStore, this.keyWord, 1);
      this.currentPage = 1;
    },
    addingSingle() {
      this.modalTitle = '單筆新增菜餚';
      this.isFullscreen = true;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    confirm() {
      this.isGetData = true;
    },
    async dishData(count, data) {
      // init successfullLog
      this.successfullLog = [];
      // 記錄成功次數
      this.successfullLength = count;
      if (data.form !== undefined) {
        this.isModalLoading = true;
        for (let i = 0, len = data.form.length; i < len; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await this.mealsCreateAPI(data.form[i], i);
        }
      }
    },
    mealsCreateAPI(data, index) {
      this.mealsCreate.variables.dishInfo.dietitianId = this.dietitianId;
      this.mealsCreate.variables.dishInfo.dishesId = '';
      this.mealsCreate.variables.dishInfo.brandId = data.storeName;
      this.mealsCreate.variables.dishInfo.protein = data.protein;
      this.mealsCreate.variables.dishInfo.calories = data.calories;
      this.mealsCreate.variables.dishInfo.grossWeight = data.grossWeight;
      this.mealsCreate.variables.dishInfo.unitId = data.unit;
      this.mealsCreate.variables.dishInfo.weightUnitId = data.weightUnit;
      this.mealsCreate.variables.dishInfo.fats = data.fats;
      this.mealsCreate.variables.dishInfo.carbohydrate = data.carbohydrate;
      this.mealsCreate.variables.dishInfo.name = data.dishName;
      this.mealsCreate.variables.dishInfo.label = data.label.join();
      this.mealsCreate.variables.dishInfo.synonym = data.synonym.join();
      return new Promise((resolve, reject) => {
        this.$_mutationApi(
          this.mealsCreate,
          () => {
            this.successfullLog.push(index);
            this.showMessage();
            resolve();
          },
          (err) => {
            this.$_alert('error', 'addFailed', index);
            this.isModalLoading = false;
            reject();
            console.log('err', err);
          },
        );
      });
    },
    showMessage() {
      if (this.successfullLog.length === this.successfullLength) {
        this.$_alert('success', 'addSuccess');
        this.isModalLoading = false;
        this.isModalVisible = false;
      }
    },
    dishesFormat(data) {
      this.tableData = [];
      this.totalItems = data.data.Meals.searchResponse.totalPages * this.pageSize;
      const diaryDishItemArr = data.data.Meals.searchResponse.dishes;
      for (let i = 0, len = diaryDishItemArr.length; i < len; i += 1) {
        const dishesDetailsFormat = {
          id: diaryDishItemArr[i].id,
          nutrId: diaryDishItemArr[i].nutrients.id,
          店名: diaryDishItemArr[i].brandName,
          品名: diaryDishItemArr[i].name,
          單位: diaryDishItemArr[i].unit,
          熱量: diaryDishItemArr[i].nutrients.calories,
          蛋白質: diaryDishItemArr[i].nutrients.protein,
          脂肪: diaryDishItemArr[i].nutrients.fats,
          '碳水化合物(醣類)': diaryDishItemArr[i].nutrients.carbohydrate,
          總重量: diaryDishItemArr[i].grossWeight,
          重量單位: diaryDishItemArr[i].weightUnit,
          // expand
          水果類: diaryDishItemArr[i].nutrients.fruits,
          '乳品-低脂': diaryDishItemArr[i].nutrients.lightMilk,
          '豆魚肉蛋-高脂': diaryDishItemArr[i].nutrients.meatHigh,
          '豆魚肉蛋-低脂': diaryDishItemArr[i].nutrients.meatLow,
          '豆魚肉蛋-中脂': diaryDishItemArr[i].nutrients.meatMedium,
          '豆魚肉蛋-超高脂肪': diaryDishItemArr[i].nutrients.meatSuper,
          堅果類: diaryDishItemArr[i].nutrients.nuts,
          '乳品-脫脂': diaryDishItemArr[i].nutrients.skimMilk,
          全穀雜糧: diaryDishItemArr[i].nutrients.starchProducts,
          蔬菜類: diaryDishItemArr[i].nutrients.vegetables,
          '乳品-全脂': diaryDishItemArr[i].nutrients.wholeMilk,
          // 2020/03/27 Added.
          同義字: this.labelArray(diaryDishItemArr[i].synonym),
          Label: this.labelArray(diaryDishItemArr[i].label),
          isEdit: false,
        };
        this.tableData.push(dishesDetailsFormat);
      }
    },
    labelArray(val) {
      if (val === '') {
        return [];
      }
      return val.split(',');
    },
    resetTableData(page) {
      this.getMealsDishAPI(this.selectStore, this.keyWord, page);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      // To top the scroll.
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.resetTableData(page);
    },
    rowClass(row) {
      if (row.rowIndex % 2 === 0) {
        return { 'background-color': '#e9f6f1' };
      }
      return '';
    },
    handleEdit(index, row) {
      if (!this.formCheck(row)) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      row.isEdit = !row.isEdit;
      if (!row.isEdit) {
        this.mealsUpdateAPI(row);
      }
    },
    formCheck(data) {
      let isVaild = true;
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(data)) {
        if (value === '' || value === undefined) {
          this.$_alert('warning', 'nullValue', key);
          isVaild = false;
        }
      }
      return isVaild;
    },
    mealsUpdateAPI(columnData) {
      if (this._.isNumber(columnData['單位'])) {
        this.unitId = columnData['單位'];
      } else {
        this.unit.forEach((e) => {
          if (e.text === columnData['單位']) {
            this.unitId = e.id;
          }
        });
      }
      if (this._.isNumber(columnData['重量單位'])) {
        this.weightUnitId = columnData['重量單位'];
      } else {
        this.weightUnit.forEach((e) => {
          if (e.text === columnData['重量單位']) {
            this.weightUnitId = e.id;
          }
        });
      }
      this.mealsUpdate.variables.dishInfo.dietitianId = this.dietitianId;
      this.mealsUpdate.variables.dishInfo.dishesId = columnData.id;
      this.mealsUpdate.variables.dishInfo.protein = columnData['蛋白質'];
      this.mealsUpdate.variables.dishInfo.calories = columnData['熱量'];
      this.mealsUpdate.variables.dishInfo.grossWeight = columnData['總重量'];
      this.mealsUpdate.variables.dishInfo.unitId = this.unitId;
      this.mealsUpdate.variables.dishInfo.weightUnitId = this.weightUnitId;
      this.mealsUpdate.variables.dishInfo.fats = columnData['脂肪'];
      this.mealsUpdate.variables.dishInfo.carbohydrate = columnData['碳水化合物(醣類)'];
      this.mealsUpdate.variables.dishInfo.name = columnData['品名'];
      this.mealsUpdate.variables.dishInfo.label = columnData.Label.join();
      this.mealsUpdate.variables.dishInfo.synonym = columnData['同義字'].join();
      this.$_mutationApi(
        this.mealsUpdate,
        (res) => {
          if (res.data.Meals === true) {
            this.$_alert('success', 'successEdit');
          } else {
            this.$_alert('error', 'getFail');
          }
        },
        () => {
          this.$_alert('error', 'getFail');
        },
      );
    },
    handleDelete(scope) {
      this.$_confirm('confirmDelete',
        () => {
          this.mealsDeleteAPI(scope);
        },
        (err) => {
          console.log('err', err);
        });
    },
    mealsDeleteAPI(scope) {
      this.mealsDelete.variables.id = scope.row.id;
      this.$_mutationApi(
        this.mealsDelete,
        () => {
          this.tableData.splice(scope.$index, 1);
          this.$_alert('success', 'successDelete');
        },
        () => {
          this.$_alert('error', 'failedDelete');
        },
      );
    },
    // eslint-disable-next-line consistent-return
    columnWidth(item) {
      let width;
      switch (item) {
        case '店名':
          width = '180px';
          return width;
        case '品名':
          width = '180px';
          return width;
        case '熱量':
          width = '120px';
          return width;
        case '蛋白質':
          width = '120px';
          return width;
        case '脂肪':
          width = '120px';
          return width;
        case '碳水化合物(醣類)':
          width = '155px';
          return width;
        case '單位':
          width = '120px';
          return width;
        case '重量單位':
          width = '120px';
          return width;
        case '總重量':
          width = '100px';
          return width;
        case '操作':
          width = '150px';
          return width;
        default:
          break;
      }
    },
    searchBtnDisabled(id, keyWord) {
      if (id !== '' || keyWord !== '') {
        this.isSearchBtnDisabled = false;
      } else {
        this.isSearchBtnDisabled = true;
      }
    },
    resetTableList(val) {
      if (val === '') {
        this.tableData = [];
        this.totalItems = 50;
      }
    },
  },
  watch: {
    selectStore: {
      handler(val) {
        this.resetTableList(val);
        this.searchBtnDisabled(val, this.keyWord);
      },
    },
    keyWord: {
      handler(val) {
        this.resetTableList(val);
        this.searchBtnDisabled(val, this.selectStore);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.search-col {
  padding-bottom: 10px;
  .dish-search {
    width: 20%;
    margin-left: 5px;
  }
  .search-btn {
    margin-left: 5px;
  }
}
::v-deep .el-input__inner {
  text-align: left;
}
.table-expand {
  ::v-deep label {
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
.expand-span {
  display: inline-block;
  width: 130px;
}
.selection-store {
  width: 20%;
}
.pagination-col {
  margin-top: 15px;
}
</style>
