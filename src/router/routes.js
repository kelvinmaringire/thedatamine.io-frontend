const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'homepage', component: () => import('pages/IndexPage.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthenticationLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/Auth/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Auth/RegisterPage.vue') },
      { path: 'password-reset', name: 'password_reset', component: () => import('pages/Auth/ForgotPasswordPage.vue') },
    ],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/Dashboard/IndexPage.vue') },
      { path: 'betting', name: 'betting', component: () => import('pages/Dashboard/Betting/IndexPage.vue') },
      { path: 'editor', name: 'editor', component: () => import('pages/Dashboard/Editor/IndexPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
