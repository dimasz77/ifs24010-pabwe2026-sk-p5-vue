import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken } from "./helpers/apiHelper";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import AucationLayout from "./features/aucations/layouts/AucationLayout.vue";

export const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "login", component: () => import("./features/auth/pages/LoginPage.vue") },
      { path: "register", component: () => import("./features/auth/pages/RegisterPage.vue") },
    ],
  },
  {
    path: "/",
    component: AucationLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: () => import("./features/aucations/pages/HomePage.vue") },
      { path: "aucations/:aucationId", component: () => import("./features/aucations/pages/DetailPage.vue") },
      { path: "users", component: () => import("./features/users/pages/UsersPage.vue") },
      { path: "profile", component: () => import("./features/users/pages/ProfilePage.vue") },
    ],
  },
  { path: "/:pathMatch(.*)*", component: () => import("./features/common/pages/NotFoundPage.vue") },
];

export function authGuard(to) {
  const loggedIn = Boolean(getAccessToken());
  if (to.meta.requiresAuth && !loggedIn) return "/auth/login";
  if (to.path.startsWith("/auth") && loggedIn) return "/";
  return true;
}

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(authGuard);

export default router;
