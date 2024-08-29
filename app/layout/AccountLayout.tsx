import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import HeaderBarComponent from "../components/HeaderComponent/HeaderComponent";
import { useTheme } from "@react-navigation/native";

export default function AccountLayout({
  children,
  title,
}: {
  children: any;
  title: any;
}) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // useEffect(() => {
  //   if (refreshing) {
  //     const ress = {
  //       sub: "635ebdca59b6db6ec810e968",
  //       email: "annemagrath@mphaotu.com",
  //       email_verified: true,
  //       name: "Binh An2",
  //       gender: "male",
  //       birthday: "",
  //       profile_picture:
  //         "https://gid-uat.nemoverse.io/public/upload/1673925214001-R.webp",
  //       public_key: "GqDVRKMiOliziCQtoTPAYFygNx8pcKXvzOvoi1rKTX8=",
  //       redirect_uri: "https://testnet.nemoverse.io",
  //       client_id: "nemo",
  //       access_token: "x9x9g3cv1eK1cidEvp4nXLVRaE3LUvpKl5M923kLXgI",
  //       expires_in: 3600,
  //       id_token:
  //         "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjRkNUdPY293M2lQa1R6SndBZG5kYlFRR2dHNTRucy1JQ1JlaXRYcGFPSDQifQ.eyJzdWIiOiI2MzVlYmRjYTU5YjZkYjZlYzgxMGU5NjgiLCJhdF9oYXNoIjoiTlEtZHRXYmpjVzBPb0QxeE9BNzhMQSIsImF1ZCI6Im5lbW8iLCJleHAiOjE2OTAyNTQ2MDIsImlhdCI6MTY5MDI1MTAwMiwiaXNzIjoiaHR0cHM6Ly9naWQtdWF0Lm5lbW92ZXJzZS5pbyJ9.D_x4s4qm-TjZ6zFbHC_Dh0CqIFHTYVIpBvouZr-P9YFoQcJuO_jpaa0LtBP70vRdH7XFlnOOag9NaSZSF0bxQb7PacaI-MEHoQa2FaL06HTplDpMUDwCXdqIDG-Ij8C4JdViW6Zu-FHZfAGW8_WLmcnMGvqo3v9vfwfsBlZUoK6oTdPcyAMIafEv0RrRmLfcrJp4zavLlnY9VyxMXYdD3N7wHuZwu7O9mEUmnzTYRxe2iadGF1jk22F7YlhXpZ9NyV2hW3agEXSJUzMQpP7UPXZ15CJNebmSEa8Ej9HgSJsNWkFQpAIgDY5TcXPQpEBo3lEqu1x_C1MmOogdBGkhKQ",
  //       refresh_token: "qm18oPiEChsUspeG54_z4JAJHe_9u92gUxmNk9A9NJO",
  //       token_type: "Bearer",
  //       google_two_factor_authentication: false,
  //       fund_password: true,
  //       signature: {
  //         message:
  //           "0x6163636f756e743a3078613435386362333436316437646139633839303836333761666364623137326637616538303438397075626c69635f6b65793a316161306435343461333232336135386233383832343264613133336330363035636130333731663239373061356566636365626538386235616361346437667369676e61747572655f74746c3a3136393033333734303276657273696f6e3a76323032333032323131343030",
  //         hash: "2f2c13d57fc49a0746eec44ca19858cbe47d1c879c91b63266127babdf6e55975a8d06550357c26e72b67c0f3fa1d00fe273306d9ac2b5b272fb34553f11087e1b",
  //         ttl: 1690337402,
  //       },
  //       nemo_address: "NEMOxa458cb3461d7da9c8908637afcdb172f7ae80489",
  //       wallet_address: [
  //         "0xd92bee9b0cba5f0d97d596f0270353836db66fb2",
  //         "0x783f8d60d360b4f02c90e7fca29e3c647b6177ab",
  //       ],
  //       accessTokenExpires: 1690254604639,
  //       publicKeyBytes: "GqDVRKMiOliziCQtoTPAYFygNx8pcKXvzOvoi1rKTX8=",
  //       privateKeyBytes:
  //         "1/fzLrjXaHwk9aIXXZxaJqfJXQNBN8IthuFOAkdoEqYaoNVEoyI6WLOIJC2hM8BgXKA3Hylwpe/M6+iLWspNfw==",
  //       code_verifier:
  //         "dc07ec23650bc42028b9a66638ebba3e31986f87e863de26f4bdbe50",
  //       code: "tlPuQvZf9s3i_MpIMv35O-gzeH9DVM0Up2w8KSTyGuT",
  //     };
  //     dispatchAccount(ress);
  //     saveAccount(ress);
  //   }
  // }, [refreshing]);
  return (
    <>
      <HeaderBarComponent leftIcon={"back"} title={title} />
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ ...styles.container, backgroundColor: colors.background }}
        >
          {children}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
