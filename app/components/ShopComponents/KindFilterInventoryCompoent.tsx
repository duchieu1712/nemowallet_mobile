import { Image, View } from "react-native";

import { ICONS } from "../../themes/theme";
import { ListInventory } from "../../common/enum";
import SelectDropdown from "react-native-select-dropdown";
import { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function KindFilterinventoryComponent({
  kindInventory,
  setKindInventory,
}: {
  kindInventory: ListInventory;
  setKindInventory: any;
}) {
  const { t } = useTranslation();
  const { colors, dark } = useTheme();
  const KindFilter = useMemo(() => {
    return ({
      kindInventory,
      setKindInventory,
    }: {
      kindInventory: ListInventory;
      setKindInventory: any;
    }) => (
      <View style={{ width: "100%" }}>
        <SelectDropdown
          data={Object.values(ListInventory)}
          defaultButtonText={t("nfts.inventory_tab.select_kind")}
          defaultValue={kindInventory}
          buttonTextAfterSelection={(_) =>
            t(
              `nfts.inventory_tab.${kindInventory
                ?.toLowerCase()
                ?.split(/\s+/)
                ?.join("_")}`,
            )
          }
          rowTextForSelection={(item) =>
            t(
              `nfts.inventory_tab.${item.toLowerCase()?.split(/\s+/).join("_")}`,
            )
          }
          onSelect={(e) => setKindInventory(e)}
          rowTextStyle={{
            color: colors.text,
            fontWeight: "bold",
          }}
          dropdownStyle={{
            shadowColor: "transparent",
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 10,
            backgroundColor: colors.card,
            //   borderWidth: 1,
            //   borderColor: "red",
            marginTop: -20,
            elevation: 0,
            maxHeight: 160,
          }}
          dropdownOverlayColor="transparent"
          rowStyle={{
            borderBottomColor: dark ? "#282C35" : "rgba(52, 52, 68, 0.2)",
            backgroundColor: colors.card,
            borderRadius: 4,
            width: "100%",
          }}
          selectedRowStyle={{
            backgroundColor: dark ? "rgba(52, 52, 68, 1)" : colors.background,
            borderRadius: 8,
          }}
          selectedRowTextStyle={{
            color: colors.text,
          }}
          buttonStyle={{
            height: 50,
            width: "100%",
            backgroundColor: colors.card,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 8,
            marginTop: 8,
          }}
          buttonTextStyle={{
            color: colors.text,
            fontWeight: "bold",
            textAlign: "left",
          }}
          renderDropdownIcon={() => (
            <Image
              source={ICONS.arrowDown2x}
              style={{ width: 24, height: 24 }}
            />
          )}
        />
      </View>
    );
  }, [dark]);

  return (
    <KindFilter
      kindInventory={kindInventory}
      setKindInventory={setKindInventory}
    />
  );
}
