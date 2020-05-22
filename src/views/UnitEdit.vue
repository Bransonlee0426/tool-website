<template>
  <el-row class="container" type="flex" justify="center" align="middle">
    <el-col v-loading="loading" class="container-col" :span="18" style="background-color:#F2F6FC">
      <el-row type="flex" align="middle" class="content-row">
        <el-col :span="8">
          <el-select
            v-model="unitType"
            placeholder="請選擇項目">
            <el-option
              v-for="item in allUnit"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" class="content-row">
        <el-col class="padding-right" :span="6">
          <el-input
            v-model="addInput"
            :maxlength="unitType === 0 ? 20 : 2"
            show-word-limit
            :disabled="unitType === ''"
            placeholder="請輸入"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            :disabled="addInput === ''"
            type="primary"
            @click="createBtn">新增單位</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" class="content-row">
        <el-col class="padding-right" :span="6">
          <el-select
            filterable
            v-model="updateUnit"
            :disabled="unitType === ''"
            @visible-change="selectOption"
            placeholder="請選擇項目"
            :loading="selectLoading">
            <el-option
              v-for="item in unitArray"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col class="padding-right" :span="6">
          <el-input
            v-model="updateInput"
            :disabled="unitType === ''"
            :maxlength="unitType === 0 ? 20 : 2"
            show-word-limit
            placeholder="請輸入"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            :disabled="updateInput === '' || updateUnit === ''"
            type="primary"
            @click="updateBtn">修改單位</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" class="content-row">
        <el-col class="padding-right" :span="6">
          <el-select
            filterable
            v-model="deleteUnit"
            :disabled="unitType === ''"
            placeholder="請選擇項目"
            :loading="selectLoading"
            @visible-change="selectOption">
            <el-option
              v-for="item in unitArray"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button
            :disabled="deleteUnit === ''"
            type="primary"
            @click="deleteBtn">刪除單位</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import dataProperty from '../toolbox/dataProperty';

export default {
  data() {
    return {
      unitType: '',
      updateUnit: '',
      updateInput: '',
      deleteUnit: '',
      addInput: '',
      loading: false,
      selectLoading: false,
      unitArray: [],
      getMeals: {
        client: 'backend',
        name: this.$query.getMeals,
        variables: {
          brandId: '',
          keyWord: '',
          page: '',
        },
      },
      unitCreate: {
        client: 'backend',
        name: this.$mutation.unitCreate,
        variables: {
          text: '',
        },
      },
      weightUnitCreate: {
        client: 'backend',
        name: this.$mutation.weightUnitCreate,
        variables: {
          text: '',
        },
      },
      unitDelete: {
        client: 'backend',
        name: this.$mutation.unitDelete,
        variables: {
          id: '',
        },
      },
      weightUnitDelete: {
        client: 'backend',
        name: this.$mutation.weightUnitDelete,
        variables: {
          id: '',
        },
      },
      unitUpdate: {
        client: 'backend',
        name: this.$mutation.unitUpdate,
        variables: {
          id: '',
          text: '',
        },
      },
      weightUnitUpdate: {
        client: 'backend',
        name: this.$mutation.weightUnitUpdate,
        variables: {
          id: '',
          text: '',
        },
      },
      breadsCreate: {
        client: 'backend',
        name: this.$mutation.breadsCreate,
        variables: {
          name: '',
        },
      },
      brandsUpdate: {
        client: 'backend',
        name: this.$mutation.brandsUpdate,
        variables: {
          id: '',
          name: '',
        },
      },
      brandsDelete: {
        client: 'backend',
        name: this.$mutation.brandsDelete,
        variables: {
          id: '',
        },
      },
    };
  },
  computed: {
    allUnit() {
      const allUnit = [];
      for (let i = 0, len = dataProperty.editUnit.length; i < len; i += 1) {
        allUnit.push(dataProperty.editUnit[i]);
      }
      return allUnit;
    },
  },
  methods: {
    updateBtn() {
      switch (this.unitType) {
        case 0:
          this.brandsUpdate.variables.id = this.updateUnit;
          this.brandsUpdate.variables.name = this.updateInput;
          this.updateUnitAPI(this.brandsUpdate);
          break;
        case 1:
          this.unitUpdate.variables.id = this.updateUnit;
          this.unitUpdate.variables.text = this.updateInput;
          this.updateUnitAPI(this.unitUpdate);
          break;
        case 2:
          this.weightUnitUpdate.variables.id = this.updateUnit;
          this.weightUnitUpdate.variables.text = this.updateInput;
          this.updateUnitAPI(this.weightUnitUpdate);
          break;
        default:
          break;
      }
    },
    updateUnitAPI(unitTypeAPI) {
      this.loading = true;
      this.$_mutationApi(unitTypeAPI,
        () => {
          this.$_alert('success', 'updateSuccess');
          this.loading = false;
        }, (err) => {
          this.$_alert('error', 'updateFailed');
          this.loading = false;
          console.log('err', err);
        });
    },
    deleteBtn() {
      switch (this.unitType) {
        case 0:
          this.$_confirm('deleteStore',
            () => {
              this.brandsDelete.variables.id = this.deleteUnit;
              this.deleteUnitAPI(this.brandsDelete);
            },
            (err) => {
              console.log('err', err);
            });
          break;
        case 1:
          this.unitDelete.variables.id = this.deleteUnit;
          this.deleteUnitAPI(this.unitDelete);
          break;
        case 2:
          this.weightUnitDelete.variables.id = this.deleteUnit;
          this.deleteUnitAPI(this.weightUnitDelete);
          break;
        default:
          break;
      }
    },
    deleteUnitAPI(unitTypeAPI) {
      this.loading = true;
      this.$_mutationApi(unitTypeAPI,
        () => {
          this.$_alert('success', 'successDelete');
          this.deleteUnit = '';
          this.loading = false;
        }, (err) => {
          this.$_alert('error', 'failedDelete');
          this.loading = false;
          console.log('err', err);
        });
    },
    createBtn() {
      switch (this.unitType) {
        case 0:
          this.breadsCreate.variables.name = this.addInput;
          this.createAPI(this.breadsCreate);
          break;
        case 1:
          this.unitCreate.variables.text = this.addInput;
          this.createAPI(this.unitCreate);
          break;
        case 2:
          this.weightUnitCreate.variables.text = this.addInput;
          this.createAPI(this.weightUnitCreate);
          break;
        default:
          break;
      }
    },
    createAPI(api) {
      this.loading = true;
      this.$_mutationApi(api,
        () => {
          this.$_alert('success', 'addSuccess');
          this.addInput = '';
          this.loading = false;
        }, (err) => {
          this.$_alert('error', 'addFailed');
          this.loading = false;
          console.log('err', err);
        });
    },
    setUnitArray(unitType) {
      this.selectLoading = true;
      this.getMeals.variables = {};
      const isStore = unitType === 'brands';
      this.$_queryApi(this.getMeals,
        (res) => {
          this.unitArray = [];
          res.data.Meals[unitType].forEach((ele) => {
            if (isStore) { // 餐廳格式重組
              const store = {
                id: ele.id,
                text: ele.name,
              };
              this.unitArray.push(store);
            } else {
              this.unitArray.push(ele);
            }
          });
          this.selectLoading = false;
        }, (err) => {
          this.selectLoading = false;
          console.log('err', err);
        });
    },
    selectOption(isDraw) {
      if (isDraw) {
        switch (this.unitType) {
          case 0:
            this.setUnitArray('brands');
            break;
          case 1:
            this.setUnitArray('units');
            break;
          case 2:
            this.setUnitArray('weightUnits');
            break;
          default:
            break;
        }
      }
    },
  },
  watch: {
    unitType: {
      handler() {
        // init unitSelect
        this.updateUnit = '';
        this.deleteUnit = '';
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.padding-right{
  padding-right: 10px;
}
.container{
  height: 60%;
  .container-col{
    height: 80%;
    .content-row{
      padding:15px;
      font-size: 20px;
      height: 25%;
    }
  }
}
</style>
