const tokens = {
  admin: {
    token: "admin-token"
  },
  user: {
    token: "user-token"
  }
};
// const menus = {
//   "admin-token": [
//     {
//       menuId: "01",
//       parentId: "0",
//       menuName: "权限管理",
//       menuUrl: "auth-management",
//       menuIcon: "el-icon-lock",
//       menuSort: "9994",
//       createDate: null,
//       createPersonId: null,
//       updateDate: null,
//       updatePersonId: null,
//       logicDelete: "0",
//       subMenuList: [
//         {
//           menuId: "11",
//           parentId: "01",
//           menuName: "角色管理",
//           menuUrl: "role-management",
//           menuIcon: null,
//           menuSort: null,
//           createDate: null,
//           createPersonId: null,
//           updateDate: null,
//           updatePersonId: null,
//           logicDelete: "0",
//           subMenuList: []
//         },
//         {
//           menuId: "12",
//           parentId: "01",
//           menuName: "菜单管理",
//           menuUrl: "menu-management",
//           menuIcon: null,
//           menuSort: null,
//           createDate: null,
//           createPersonId: null,
//           updateDate: null,
//           updatePersonId: null,
//           logicDelete: "0",
//           subMenuList: []
//         }
//       ]
//     },
//     {
//       menuId: "02",
//       parentId: "0",
//       menuName: "基本信息",
//       menuUrl: "basic-information",
//       menuIcon: "el-icon-setting",
//       menuSort: "9998",
//       createDate: null,
//       createPersonId: null,
//       updateDate: null,
//       updatePersonId: null,
//       logicDelete: "0",
//       subMenuList: [
//         {
//           menuId: "21",
//           parentId: "39acd7d439674d9687a115adc86e6785",
//           menuName: "系统设置",
//           menuUrl: "system-seeting",
//           menuIcon: null,
//           menuSort: "99980",
//           createDate: null,
//           createPersonId: null,
//           updateDate: null,
//           updatePersonId: null,
//           logicDelete: "0",
//           subMenuList: []
//         }
//       ]
//     }
//   ]
// };
// 第一个版本
const menus = {
  "admin-token": [
    {
      id: 1,
      title: "IT中心",
      path: "it",
      parent_id: null
    },
    {
      id: 2,
      title: "IT资产",
      path: "asset",
      parent_id: 1
    },
    {
      id: 3,
      title: "资产管理",
      path: "edit",
      parent_id: 2
    },
    {
      id: 4,
      title: "时段统计",
      path: "time",
      parent_id: 2
    },
    {
      id: 5,
      title: "系统设置",
      path: "set",
      parent_id: null
    },
    {
      id: 6,
      title: "密码设置",
      path: "password-set",
      parent_id: 5
    },
    {
      id: 7,
      title: "测试菜单",
      path: "test",
      parent_id: null
    }
  ]
};

// // Leems 版本
// const menus = {
//   "admin-token": [
//     {
//       id: 39,
//       menuName: "系统设置",
//       menuUrl: "/set",
//       parent_id: ""
//     }
//   ]
// };
export default [
  // user login
  {
    url: "/user/login",
    type: "post",
    response: config => {
      const { username } = config.body;
      const token = tokens[username];

      // mock error
      if (!token) {
        return {
          status: 401,
          message: "账号和密码错误."
        };
      }

      return {
        status: 1,
        data: token
      };
    }
  },

  // user menus
  {
    url: "/user/getUserMenus",
    type: "post",
    response: config => {
      const { token } = config.query;
      const menu = menus[token];

      // mock error
      if (!menu) {
        return {
          status: 0,
          message: "获取菜单数据错误."
        };
      }

      return {
        status: 1,
        data: menu
      };
    }
  },

  // get user info
  {
    url: "/user/info.*",
    type: "get",
    response: config => {
      const { token } = config.query;
      const info = users[token];

      // mock error
      if (!info) {
        return {
          status: 50008,
          message: "Login failed, unable to get user details."
        };
      }

      return {
        status: 1,
        data: info
      };
    }
  },

  // user logout
  {
    url: "/user/logout",
    type: "post",
    response: _ => {
      return {
        status: 1,
        data: "success"
      };
    }
  }
];
