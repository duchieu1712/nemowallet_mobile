import { COLORS, IMAGES, MyTextApp, SOCIALS } from "../../../themes/theme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { useRoute, useTheme } from "@react-navigation/native";

import AccountLayout from "../../../layout/AccountLayout";
import Icon from "react-native-vector-icons/AntDesign";
import IconAvatar from "react-native-vector-icons/FontAwesome5";
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from "../../../components/ToastInfo";
import ToggleComponent from "../../../components/ToggleComponent";
import { useTranslation } from "react-i18next";
import { ellipseText } from "../../../common/utilities";
import ImageLoaderComponent from "../../../components/ImageComponent/ImageLoaderComponent";

// import RNPickerSelect from "react-native-picker-select";
// import DatePicker from "react-native-date-picker";

export default function MyAccountScreen({ navigation }: { navigation: any }) {
  const route = useRoute();
  const { t } = useTranslation();
  const { account }: any = route.params;
  const { colors } = useTheme();
  const refRB = useRef<any>();

  return (
    <AccountLayout title={t("account.my_account")}>
      <View>
        <View style={{ ...styles.card, backgroundColor: colors.card }}>
          <View style={{ alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                overflow: "hidden",
              }}
              onPress={() => refRB.current.open()}
            >
              {account?.profile_picture ? (
                <ImageLoaderComponent
                  source={account?.profile_picture}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              ) : (
                <Image
                  source={IMAGES.defaultAvatart}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              )}
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  height: "30%",
                  backgroundColor: "#0000007a",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MyTextApp
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: COLORS.white,
                  }}
                >
                  {t("common.edit")}
                </MyTextApp>
              </View>
            </TouchableOpacity>
            <RBSheet
              ref={refRB}
              closeOnDragDown={true}
              customStyles={{
                wrapper: {},
                container: {
                  backgroundColor: colors.background,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  height: 150,
                },
                draggableIcon: {
                  marginTop: 5,
                  marginBottom: 0,
                  height: 5,
                  width: 90,
                  backgroundColor: colors.text,
                },
              }}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 50,
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  gap: 20,
                }}
                onPress={() =>
                  navigation.navigate("ImageViewScreen", {
                    images: [
                      {
                        title: t("account.avatar"),
                        url: account.profile_picture,
                      },
                    ],
                  })
                }
              >
                <IconAvatar
                  name="user-circle"
                  size={25}
                  color={colors.title}
                  style={{ width: 30 }}
                />
                <MyTextApp
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.title,
                  }}
                >
                  {t("account.watch_avatar")}
                </MyTextApp>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  gap: 20,
                }}
                onPress={() => {
                  Toast.warning(t("common.comming_soon_feature"));
                }}
              >
                <IconAvatar
                  name="images"
                  size={25}
                  color={colors.title}
                  style={{ width: 30 }}
                />
                <MyTextApp
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.title,
                  }}
                >
                  {t("account.edit_avatar")}
                </MyTextApp>
              </TouchableOpacity>
            </RBSheet>
            <MyTextApp
              style={{ fontSize: 18, fontWeight: "bold", color: colors.title }}
            >
              {account.name}
            </MyTextApp>
          </View>
        </View>
        <View style={{ gap: 24 }}>
          <View style={styles.block}>
            <MyTextApp style={{ color: colors.text }}>
              {t("account.profile")}
            </MyTextApp>
            <TouchableOpacity style={styles.link}>
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("account.full_name")}
              </MyTextApp>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MyTextApp style={{ color: colors.text, marginRight: 5 }}>
                  {account.name}
                </MyTextApp>
                <Icon name="right" color={colors.title} size={14} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link}>
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("account.email")}
              </MyTextApp>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MyTextApp style={{ color: colors.text, marginRight: 5 }}>
                  {ellipseText(account.email)}
                </MyTextApp>
                <Icon name="right" color={colors.title} size={14} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link}>
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("account.phone_number")}
              </MyTextApp>
              <Icon name="right" color={colors.title} size={14} />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("account.gender")}
              </MyTextApp>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                {/* <CustomPicker
                  style={{ borderWidth: 1, borderColor: "red" }}
                  options={genders}
                  getLabel={(item) => item?.label}
                  fieldTemplate={renderField}
                  defaultValue={account.gender}
                  // optionTemplate={this.renderOption}
                  // headerTemplate={this.renderHeader}
                  // footerTemplate={this.renderFooter}
                  placeholder="Gender"
                  onValueChange={(value) => {
                    console.log(
                      "Selected Item",
                      value || "No item were selected!"
                    );
                  }}
                /> */}
                <MyTextApp style={{ color: colors.text, marginRight: 5 }}>
                  {account.gender}
                </MyTextApp>
                <Icon name="right" color={colors.title} size={14} />
              </View>
            </View>
            <TouchableOpacity style={styles.link}>
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("account.birthday")}
              </MyTextApp>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MyTextApp style={{ color: colors.text, marginRight: 5 }}>
                  {account.birthday}
                </MyTextApp>
                <Icon name="right" color={colors.title} size={14} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.link}
              onPress={() => {
                navigation.navigate("VerifyEmailStep1Screen", {
                  signup: false,
                  isChangePW: true,
                  username: account.email,
                });
              }}
            >
              <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                {t("account.change_password")}
              </MyTextApp>
              <Icon name="right" color={colors.title} size={14} />
            </TouchableOpacity>
          </View>
          <View style={styles.block}>
            <MyTextApp style={{ color: colors.text }}>
              {t("account.social_accounts")}
            </MyTextApp>
            <View style={{ ...styles.link, height: 34 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={SOCIALS.facebook}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {t("account.connect_facebook")}
                </MyTextApp>
              </View>
              <ToggleComponent
                size={26}
                onToggle={() => {
                  Toast.warning(t("common.comming_soon_feature"));
                }}
              />
            </View>
            <View style={{ ...styles.link, height: 34 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={SOCIALS.google}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {t("account.connect_google")}
                </MyTextApp>
              </View>
              <ToggleComponent
                size={26}
                onToggle={() => {
                  Toast.warning(t("common.comming_soon_feature"));
                }}
              />
            </View>
            <View style={{ ...styles.link, height: 34 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={SOCIALS.apple}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <MyTextApp style={{ color: colors.title, fontWeight: "bold" }}>
                  {t("account.connect_apple")}
                </MyTextApp>
              </View>
              <ToggleComponent
                size={26}
                onToggle={() => {
                  Toast.warning(t("common.comming_soon_feature"));
                }}
              />
            </View>
          </View>
        </View>
        {/* <DatePicker
          modal
          open={modal}
          date={date}
          onConfirm={(date) => {
            setModal(false);
            setDate(date);
          }}
          onCancel={() => {
            setModal(false);
          }}
        /> */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ position: "relative", width: "100%" }}>
                <MyTextApp
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: colors.title,
                    textAlign: "center",
                  }}
                >
                  Edit Full Name
                </MyTextApp>
                <TouchableOpacity
                  onPress={() => closeModal()}
                  style={styles.closeBtn}
                >
                  <Icon name="close" size={25} color={colors.title} />
                </TouchableOpacity>
              </View>
              <View style={styles.nameInput}>
                <MyTextApp
                  style={{
                    borderRightWidth: 2,
                    borderColor: COLORS.border,
                    color: colors.title,
                    paddingRight: 10,
                  }}
                >
                  {account.name}
                </MyTextApp>
                <TextInput style={{ flex: 1 }} />
              </View>
              <Button title="Submit" />
            </View>
          </View>
        </Modal> */}
      </View>
    </AccountLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  block: {
    gap: 14,
  },
  copy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 22,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000081",
    padding: 30,
  },
  modalContent: {
    margin: 20,
    backgroundColor: COLORS.greyBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    gap: 24,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  nameInput: {
    backgroundColor: COLORS.darkBackground,
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    height: 48,
  },
});
