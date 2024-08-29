import CustomTabBar from "./CustomTabBar";
import Events from "../screens/EventScreen/EventScreen";
import Products from "../screens/ProductScreen/ProductScreen";
import React from "react";
import Shop from "../screens/ShopScreens/ShopScreen";
import WalletScreen from "../screens/WalletScreen/WalletScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import Swap from "../screens/Swap";

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Wallet"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen key={1} name="Wallet" component={WalletScreen} />
        <Tab.Screen key={2} name="Shop" component={Shop} />
        {/* <Tab.Screen key={3} name="SwapScreen" component={Swap} /> */}
        <Tab.Screen key={3} name="Product" component={Products} />
        <Tab.Screen key={4} name="GameFi" component={Events} />
      </Tab.Navigator>
    </>
  );
};

export default BottomNavigation;
