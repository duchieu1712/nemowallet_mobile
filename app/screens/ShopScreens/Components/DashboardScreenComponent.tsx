import DashboardComponent from "../../../components/ShopComponents/DashboardComponent/DashboardComponent";
import { type cf_services } from "../../../config/services";

export default function DashboardScreenComponent({
  game,
  setGame,
}: {
  game: (typeof cf_services)[0];
  setGame: any;
}) {
  return (
    <>
      <DashboardComponent
        game={game}
        setGame={setGame}
        serviceID={game.serviceID}
      />
    </>
  );
}
