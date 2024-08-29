import { COLORS, MyTextApp, SIZES } from "../../../../themes/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import { IconLoadingDataComponent } from "../../../../components/LoadingComponent";
import ImageLoaderComponent from "../../../../components/ImageComponent/ImageLoaderComponent";
import ImageViewer from "react-native-image-zoom-viewer";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function ImageView({ navigation }: { navigation: any }) {
  const route = useRoute();
  const { t } = useTranslation();
  const { images }: any = route.params;

  // const images: any = [
  //   { props: { source: MYSTERY_BOX_9D?.ABOX } },
  //   { props: { source: MYSTERY_BOX_9D?.DBOX } },
  // ];
  // const images = [
  //   {
  //     title: "haha",
  //     url: "https://media.istockphoto.com/id/1091348950/photo/close-up-of-hands-typing-on-laptop-night-work-concept.webp?b=1&s=612x612&w=0&k=20&c=UpoDIa9kfMvuCsPYqvKbLTGK7M-IPxB4YEtw5ubGAzE=",
  //   },
  //   {
  //     title: "hihi",
  //     url: "https://media.istockphoto.com/id/1176118043/photo/woman-shopping-online-with-laptop-and-credit-card.webp?b=1&s=612x612&w=0&k=20&c=I8ITxW4PGw5HV0ykIznkwaawZItGi99CCplyUGpQgBc=",
  //   },
  // ];

  const renderImageCustom = (props: any) => {
    return (
      <>
        {props.source.uri ? (
          <ImageLoaderComponent
            source={props.source.uri}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        ) : (
          <Image
            source={props.source}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        )}
      </>
    );
  };

  const renderImageHeader = (currentIndex?: any) => {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 45,
          position: "absolute",
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
          }}
        >
          <FeatherIcon name="arrow-left" size={25} color={COLORS.white} />
        </TouchableOpacity>
        <MyTextApp
          style={{ color: COLORS.white, fontSize: 20, fontWeight: "bold" }}
        >
          {images[currentIndex]?.title ?? ""}
        </MyTextApp>
      </View>
    );
  };

  const renderImageFooter = (props: any) => {
    return (
      <>
        {images.length === 1 ? null : (
          <View
            style={{
              width: SIZES.width,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: "5%",
            }}
          >
            {images.map((e, i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === props ? COLORS.white : COLORS.text,
                }}
              ></View>
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <View>
      <View style={{ width: "100%", height: "100%" }}>
        <ImageViewer
          imageUrls={images}
          enableImageZoom={true}
          renderImage={(props) => renderImageCustom(props)}
          renderHeader={(index) => renderImageHeader(index)}
          renderIndicator={() => <Text></Text>}
          renderFooter={(props) => renderImageFooter(props)}
          menuContext={{
            saveToLocal: t("common.save_to_local"),
            cancel: t("common.cancel"),
          }}
          loadingRender={() => <IconLoadingDataComponent />}
        />
      </View>
    </View>
  );
}
