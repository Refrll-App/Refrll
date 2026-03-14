// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { store } from "./app/store.js";
// import { setCredentials, setInitialized } from "./features/auth/authSlice.js";
// import App from "./App.jsx";
// import "./index.css";

// fetch("/api/auth/refresh", {
//   method: "POST",
//   credentials: "include",
//   headers: { "Content-Type": "application/json" },
// })
//   .then((res) => (res.ok ? res.json() : null))
//   .then((data) => {
//     if (data?.accessToken) {
//       store.dispatch(setCredentials(data));
//     } else {
//       store.dispatch(setInitialized());
//     }
//   })
//   .catch(() => store.dispatch(setInitialized()))
//   .finally(() => {
//     createRoot(document.getElementById("root")).render(
//       <Provider store={store}>
//         <App />
//       </Provider>
//     );
//   });



import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { setCredentials, setInitialized } from "./features/auth/authSlice.js";
import App from "./App.jsx";
import "./index.css";

fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/refresh`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => (res.ok ? res.json() : null))
  .then((data) => {
    if (data?.accessToken) {
      store.dispatch(setCredentials(data));
    } else {
      store.dispatch(setInitialized());
    }
  })
  .catch(() => store.dispatch(setInitialized()))
  .finally(() => {
    createRoot(document.getElementById("root")).render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });