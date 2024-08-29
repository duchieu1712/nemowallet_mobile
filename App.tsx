import "./i18n.config";

import { NotifServiceContext, getDefaultContextInfo } from "./Context";
import React, { useEffect } from "react";

import { CacheManager } from "@georstat/react-native-image-cache";
import { Dirs } from "react-native-file-access";
import { Provider } from "react-redux";
import Routes from "./app/Navigations/Routes";
import SplashScreen from "react-native-splash-screen";
import { store } from "./app/modules";

// Load your font
export default function App() {
  // const appContext = useContext(NotifServiceContext);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    // const fetchTokenByLocal = async () => {
    //   await getFcmTokenFromLocalStorage();
    // };
    // fetchTokenByLocal();
    // requestUserPermission();
    // appContext && notificationListener(appContext.notif);
  }, []);

  CacheManager.config = {
    baseDir: `${Dirs?.CacheDir}/images_cache/`,
    blurRadius: 15,
    cacheLimit: 0,
    maxRetries: 3 /* optional, if not provided defaults to 0 */,
    retryDelay: 3000 /* in milliseconds, optional, if not provided defaults to 0 */,
    sourceAnimationDuration: 500,
    thumbnailAnimationDuration: 500,
    getCustomCacheKey: (source: string) => {
      // Remove params from the URL for caching images (useful for caching images from Amazons S3 bucket and etc)
      let newCacheKey = source;
      if (source.includes("?")) {
        newCacheKey = source.substring(0, source.lastIndexOf("?"));
      }
      return newCacheKey;
    },
  };

  return (
    <Provider store={store}>
      <NotifServiceContext.Provider value={getDefaultContextInfo()}>
        {/* <SafeAreaView style={styles.container}> */}
        <Routes />
        {/* </SafeAreaView> */}
      </NotifServiceContext.Provider>
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ECF0F1',
//   },
//   buttonsContainer: {
//     padding: 10,
//   },
//   textStyle: {
//     textAlign: 'center',
//     marginBottom: 8,
//   },
// });
