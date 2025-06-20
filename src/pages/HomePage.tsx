
import { ExperienceProvider } from "@/context/ExperienceContext";
import HomePageContent from "@/components/home/HomePageContent";

const HomePage = () => {
  return (
    <ExperienceProvider>
      <HomePageContent />
    </ExperienceProvider>
  );
};

export default HomePage;
