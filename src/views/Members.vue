<template>
    <el-row>
        <el-col>
            <modal
                :title="modalTitle"
                :width="'40%'"
                :isFullscreen="false"
                :isModalVisible="isModalVisible"
                @closeModal="closeModal"
                @confirm="confirm">
                <div>
                    暱稱:{{details.nickname}}
                    <br>
                    性別:{{translate('gender',details.gender)}}
                    <br>
                    身高:{{Math.round(details.height)}}
                    <br>
                    體重:{{Math.round(details.weight)}}
                    <br>
                    運動量:{{translate('activity',details.activity)}}
                    <br>
                    生日:{{details.birthday ? details.birthday.slice(0,10) : ''}}
                    <br>
                    目標體重:{{Math.round(details.goalWeight)}}
                    <br>
                </div>
            </modal>
        </el-col>
        <el-col>
            <el-table
                height="90vh"
                ref="table"
                :data="tableData"
                border
                style="width: 100%"
                v-loading="loading"
                element-loading-background="rgba(0, 0, 0, 0.3)"
                :row-style="rowClass">
                <el-table-column
                    v-for="item in membersHeader"
                    :key="item"
                    :label="item"
                    :prop="item"
                    :width="columnWidth(item)"
                    sortable
                >
                  <template slot-scope="scope">
                    <span v-if="item === 'userId'">
                        {{scope.row.userId}}
                    </span>
                    <el-button
                        v-if="item ==='詳細資料'"
                        type="primary"
                        @click="handleDetails(scope)"
                    >詳情</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col>
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
      membersHeader: dataProperty.membersHeader,
      modalTitle: '詳細資料',
      currentPage: 1,
      loading: false,
      totalItems: 0,
      pageSize: 50,
      isModalVisible: false,
      tableData: [],
      details: {},
      provider: {
        client: 'backend',
        name: this.$query.provider,
        variables: {
          page: '',
        },
      },
      profiles: {
        client: 'backend',
        name: this.$query.profiles,
        variables: {
          memberId: '',
        },
      },
    };
  },
  created() {
    this.provider.variables.page = 1;
    this.$_queryApi(this.provider,
      (res) => {
        this.setTableData(res);
      },
      (err) => {
        console.log('err', err);
      });
  },
  methods: {
    translate(type, text) {
      switch (type) {
        case 'gender':
          if (text === 0) {
            return '女性';
          }
          return '男性';
        case 'activity':
          if (text === 1) {
            return '低度';
          } if (text === 2) {
            return '中度';
          }
          return '高度';
        default:
          break;
      }
      return '';
    },
    handleCurrentChange(page) {
      console.log('page', page);
    },
    setTableData(data) {
      for (let i = 0, len = data.data.Provider.length; i < len; i += 1) {
        const tableData = {
          userId: data.data.Provider[i].userId,
          memberId: data.data.Provider[i].memberId,
        };
        this.tableData.push(tableData);
      }
    },
    handleDetails(scope) {
      this.profilesAPI(scope);
      this.isModalVisible = true;
    },
    profilesAPI(data) {
      this.profiles.variables.memberId = data.row.memberId;
      this.$_queryApi(this.profiles,
        (res) => {
          this.details = res.data.Profiles;
        }, (err) => {
          console.log('err', err);
        });
    },
    // eslint-disable-next-line consistent-return
    columnWidth(item) {
      let width;
      switch (item) {
        case '詳細資料':
          width = '110px';
          return width;
        default:
          break;
      }
    },
    rowClass(row) {
      if (row.rowIndex % 2 === 0) {
        return { 'background-color': '#e9f6f1' };
      }
      return '';
    },
    closeModal() {
      this.isModalVisible = false;
    },
    confirm() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-col {
  margin-top: 15px;
}
</style>
