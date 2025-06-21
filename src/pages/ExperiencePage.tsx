
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExperienceProvider } from "@/context/ExperienceContext";
import ExperienceContent from "@/components/experience/ExperienceContent";

const ExperiencePage = () => {

  useEffect(() => {
  
    document.body.style.opacity = '1';
  
  }, []);

  const { slug } = useParams<{ slug?: string }>();

  return (
    <ExperienceProvider>
      <ExperienceContent slug={slug} />
    </ExperienceProvider>
  );

};

export default ExperiencePage;
