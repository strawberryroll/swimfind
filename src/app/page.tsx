import { POOL_CARD_MOCKS } from "@/features/pool/mocks/pool-cards.mock";
import { TodayPoolsSection } from "@/features/pool/TodayPoolsSection/TodayPoolsSection";
import { PoolSearchHero } from "@/features/pool-search/PoolSearchHero/PoolSearchHero";

export default function Home() {
  return (
    <main>
      <PoolSearchHero />
      <TodayPoolsSection pools={POOL_CARD_MOCKS} />
    </main>
  );
}
