<template>
  <el-container>
      <el-aside
        width="220px">
        <el-menu
          class="el-menu"
          :default-active="activeIndex"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleMenu">
          <el-row class="profile-row">
            <el-col>
              <el-avatar :size="60" src="https://i.ibb.co/s5rLDV9/167527.jpg"></el-avatar>
            </el-col>
            <el-col class="profile-name">
              Gal gadot
            </el-col>
            <el-col>
              <el-dropdown
                trigger="click"
                @command="handleDropdown">
                <span class="el-dropdown-link">
                  Nutritionist <i class="fas fa-sort-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="Profile">Profile</el-dropdown-item>
                  <el-dropdown-item
                    command="Logout" divided>Logout</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <el-menu-item index="1">
            <i class="fas fa-utensils" style="margin-right:5px;"></i>
            <span slot="title">{{menu.menuTitle[0].submenu}}</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="fas fa-pen-square" style="margin-right:5px;"></i>
              <span>{{menu.menuTitle[1].submenu}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">{{menu.menuTitle[1].image}}</el-menu-item>
              <el-menu-item index="2-2">{{menu.menuTitle[1].unit}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3">
            <i class="fas fa-user-friends" style="margin-right:5px;"></i>
            <span slot="title">{{menu.menuTitle[2].submenu}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <transition name="component-fade" mode="out-in">
          <router-view/>
        </transition>
      </el-main>
  </el-container>
</template>

<script>
import dataProperty from '../toolbox/dataProperty';

export default {
  data() {
    return {
      activeIndex: '1',
      menu: dataProperty,
    };
  },
  created() {
    this.handleMenu(this.activeIndex);
  },
  methods: {
    handleMenu(index) {
      switch (index) {
        case '1':
          this.$router.push({ name: 'dishData' });
          break;
        case '2-1':
          this.$router.push({ name: 'imageEdit' });
          break;
        case '2-2':
          this.$router.push({ name: 'unitEdit' });
          break;
        case '3':
          this.$router.push({ name: 'members' });
          break;
        default:
          break;
      }
    },
    handleDropdown(item) {
      switch (item) {
        case 'Profile':
          break;
        case 'Logout':
          this.logout();
          break;
        default:
          break;
      }
    },
    logout() {
      localStorage.removeItem('admin-token');
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style scoped lang="scss">

.el-menu{
    height: 100%;
    .profile-row{
      padding: 20px 20px;
      background-color: #68727c;
      line-height: 1.5;
      .profile-name{
        color:rgb(221, 221, 221);
      }
    }
    .el-dropdown-link {
      cursor: pointer;
      color: rgb(146, 162, 255);
    }
}
.el-main{
  background-color: rgb(238, 238, 238);
  height: 100vh;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}

</style>
