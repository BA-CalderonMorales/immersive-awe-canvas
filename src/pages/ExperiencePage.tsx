
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExperienceProvider } from "@/context/ExperienceContext";
import ExperienceContent from "@/components/experience/ExperienceContent";

const ExperiencePage = () => {

  const { slug } = useParams<{ slug?: string }>();

  useEffect(() => {
    document.body.style.opacity = '1';
  }, []);

  return (
  
    <ExperienceProvider>
      <ExperienceContent initialSlug={slug} />
    </ExperienceProvider>
  
  );

};

export default ExperiencePage;
