const tokens = {
  admin: {
    token: "admin-token"
  },
  user: {
    token: "user-token"
  }
};
// 第一个版本
const menus = {
  "admin-token": [
    {
      id: 1,
      title: "首页",
      path: "home",
      name: 'Home',
      parent_id: 0,
      icon: "icon-my-home"
    },
    {
      id: 2,
      title: "测试菜单",
      path: "test",
      name: 'Test',
      parent_id: 0,
      icon: "icon-my-android-fill"
    },
    {
      id: 3,
      title: "系统设置",
      path: "set",
      name: "Set",
      parent_id: 0,
      icon: "icon-my-setting"
    },
    {
      id: 4,
      title: "密码设置",
      path: "password-set",
      name: "PasswordSet",
      parent_id: 3
    },
    {
      id: 5,
      title: "IT中心",
      path: "it",
      name: 'It',
      parent_id: 0,
      icon: "icon-my-appstore"
    },
    {
      id: 6,
      title: "IT资产",
      path: "asset",
      name: "Asset",
      parent_id: 5
    },
    {
      id: 7,
      title: "资产管理",
      path: "edit",
      name: "Edit",
      parent_id: 6
    },
    {
      id: 8,
      title: "时段统计",
      path: "time",
      name: "Time",
      parent_id: 6
    },
  ]
};

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
  // user logout
  {
    url: "/user/logout",
    type: "post",
    response: () => {
      return {
        status: 1,
        data: "success"
      };
    }
  }
];
