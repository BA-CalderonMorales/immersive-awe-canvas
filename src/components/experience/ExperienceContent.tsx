
import DynamicBackground from "@/components/scene/DynamicBackground";
import DynamicLights from "@/components/scene/DynamicLights";
import DynamicObject from "@/components/scene/DynamicObject";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { WorldData } from "@/types/scene";
import ObjectManager from "@/components/scene/ObjectManager";

interface ExperienceContentProps {
  worldData: WorldData | null;
  editableSceneConfig: any;
  isObjectLocked: boolean;
  theme: 'day' | 'night';
}

const ExperienceContent = ({ worldData, editableSceneConfig, isObjectLocked, theme }: ExperienceContentProps) => {
  const { camera } = useThree();
  const [ , getKeys ] = useKeyboardControls()
  
  useEffect(() => {
    if (worldData && worldData.cameraPosition) {
      camera.position.set(
        worldData.cameraPosition[0],
        worldData.cameraPosition[1],
        worldData.cameraPosition[2]
      );
    }
  }, [worldData, camera]);

  useFrame((state, delta) => {
    if (getKeys().forward) {
      camera.position.z -= 0.5
    }
    if (getKeys().back) {
      camera.position.z += 0.5
    }
  })

  if (!worldData) {
    return <></>;
  }

  const editableConfig = editableSceneConfig || worldData.sceneConfig;
  const themeConfig = theme === 'day' ? editableConfig.day : editableConfig.night;

  return (
    <>
      <DynamicBackground
        background={themeConfig.background}
        extras={themeConfig.extras}
      />
      <DynamicLights lights={themeConfig.lights} />
      
      <DynamicObject
        type={editableConfig.type}
        themeConfig={themeConfig}
        isLocked={isObjectLocked}
      />
      
      {/* Add the ObjectManager to render scene objects */}
      <ObjectManager />
      
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

export default ExperienceContent;
