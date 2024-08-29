import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomNavigation from "./BottomNavigation";
import Account from "../screens/AccountScreen/AccountScreen";
import { LOCALE_STORAGE } from "../common/enum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEmpty } from "lodash";

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE._DATA_DEEP_LINGING).then(
      (dataDeepLinking) => {
        if (!isEmpty(dataDeepLinking)) {
          const data = JSON.parse(dataDeepLinking ?? "");
          navigation.navigate("DetailNFTScreen", {
            collectionID: data?.collectionID,
            tokenID: data?.tokenID,
            servicesID: data.servicesID,
          });
          AsyncStorage.setItem(LOCALE_STORAGE._DATA_DEEP_LINGING, "");
        }
      },
    );
  }, []);

  return (
    <>
      <Drawer.Navigator
        drawerContent={() => <Account navigation={navigation} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: "100%",
          },
        }}
      >
        <Drawer.Screen name="BottomNavigation" component={BottomNavigation} />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerNavigation;
