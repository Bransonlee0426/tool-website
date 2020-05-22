export default [
  {
    path: '/',
    name: 'Login',
    props: true,
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '',
    name: 'index',
    props: true,
    meta: { requireAuth: true },
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '/image-edit',
        name: 'imageEdit',
        props: true,
        meta: { requireAuth: true },
        component: () => import('@/views/ImageEdit.vue'),
      }, {
        path: '/unit-edit',
        name: 'unitEdit',
        props: true,
        meta: { requireAuth: true },
        component: () => import('@/views/UnitEdit.vue'),
      }, {
        path: '/dish-data',
        name: 'dishData',
        props: true,
        meta: { requireAuth: true },
        component: () => import('@/views/DishData.vue'),
      }, {
        path: '/members',
        name: 'members',
        props: true,
        meta: { requireAuth: true },
        component: () => import('@/views/Members.vue'),
      },
    ],
  }];
