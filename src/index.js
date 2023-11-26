import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from './store/configureStore'

const store = configureStore()

const root = createRoot(document.getElementById("root"))

const RootComponent = () => {
 
  return (
      <App />
  );
};
 
const renderApp = () => {
  root.render(
    <Provider store={store}>
      <RootComponent />
    </Provider>
  );
};
 
// const renderApp = () =>
//   root.render(
//     <ThemeProvider theme={isDarkTheme}>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </ThemeProvider>
//   );
 
if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./App", renderApp);
}
 
renderApp();
 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals