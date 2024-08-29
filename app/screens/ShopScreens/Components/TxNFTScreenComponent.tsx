import ListTransaction_NFT from "../../../components/ShopComponents/ListTransactionNftComponent";
import { type cf_services } from "../../../config/services";

export default function ListTransactionNFTScreenComponent({
  game,
  setGame,
}: {
  game: (typeof cf_services)[0];
  setGame: any;
}) {
  return <ListTransaction_NFT gameSelected={game} setGameSelected={setGame} />;
}
