import AdminJS, { ComponentLoader } from "adminjs";
import { buildAuthenticatedRouter } from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
import mongoose from "mongoose";
import loadModels from "../models/loadModels.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const componentLoader = new ComponentLoader();

// const Components = {
//   Dashboard: componentLoader.add(
//     "Dashboard",
//     path.join(__dirname, "../../youwatchAdmin/components/Dashboard.jsx")
//   ),
// };

AdminJS.registerAdapter({ Database, Resource });

// const componentLoader = new ComponentLoader();
// const DashboardPath = path.resolve(
//   dirname(fileURLToPath(import.meta.url)),
//   "../admin/components/Dashboard.jsx"
// );
// const Components = {
//   Dashboard: componentLoader.add("Dashboard", DashboardPath),
// };

await loadModels();
const models = mongoose.modelNames().map((name) => mongoose.model(name));

const admin = new AdminJS({
  // componentLoader,
  resources: models,
  rootPath: "/admin",
  branding: {
    companyName: "YouWatch Admin",
    softwareBrothers: false,
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: "#0d1117",
        primary80: "#161b22",
        primary60: "#30363d",
        accent: "#58a6ff",
      },
    },
  },
  // dashboard: {
  //   component: Components.Dashboard,
  // },
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const adminRouter = buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      // Replace with your own admin auth logic
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return ADMIN; // must return a truthy object on success
      }
      return null;
    },
    cookieName: "adminjs",
    cookiePassword: process.env.COOKIE_SECRET,
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production to enforce HTTPS
      sameSite: "lax", // lax is default-safe for same-origin
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }
);

export { admin, adminRouter };
