import HomeBackground from "@/home/components/HomeBackground";
import HomeHero from "@/home/components/HomeHero";
import HomeTopics from "@/home/components/HomeTopics";
import HomeCapabilities from "@/home/components/HomeCapabilities";
import HomeCta from "@/home/components/HomeCta";
import HomeFooter from "@/home/components/HomeFooter";
import { getTopicSummaries } from "@/documentation/utils/topics";
import { docsMetadata } from "@/generated/docs.generated";

export default function HomePage() {
  const topics = getTopicSummaries();
  const docCount = docsMetadata.length;

  return (
    <div className="relative bg-(--bg)">
      <HomeBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <HomeHero docCount={docCount} topicCount={topics.length} />
        <HomeTopics topics={topics} />
        <HomeCapabilities />
        <HomeCta />
      </div>

      <div className="relative z-10">
        <HomeFooter />
      </div>
    </div>
  );
}
