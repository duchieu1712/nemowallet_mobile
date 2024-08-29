import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../../themes/theme";
import { cf_services } from "../../config/services";
import { useMemo } from "react";
import { useTheme } from "@react-navigation/native";

export default function ListGameComponent({
  game,
  setGame,
}: {
  game: (typeof cf_services)[0];
  setGame: any;
}) {
  const { colors } = useTheme();
  const ListGame = useMemo(() => {
    return ({
      game,
      setGame,
    }: {
      game: (typeof cf_services)[0];
      setGame: any;
    }) => (
      <ScrollView
        horizontal
        style={{
          marginHorizontal: 19,
        }}
      >
        <View style={styles.scrollSelectGame}>
          {cf_services.map((e, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setGame(e)}
              activeOpacity={0.8}
              style={{
                borderWidth: game.serviceID == e.serviceID ? 1 : 0,
                borderColor:
                  game.serviceID == e.serviceID
                    ? colors.primary
                    : COLORS.transparent,
                borderRadius: 12,
              }}
            >
              <Image
                source={e.logoGame}
                style={{
                  ...styles.logoGame,
                  opacity: game.serviceID == e.serviceID ? 1 : 0.5,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }, []);

  return <ListGame game={game} setGame={setGame} />;
}

const styles = StyleSheet.create({
  scrollSelectGame: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 12,
  },
  logoGame: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
});
