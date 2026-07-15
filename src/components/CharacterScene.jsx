import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/muhammad-character-idle-web.glb";

function Character({ perspective }) {
  const character = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, character);

  useEffect(() => {
    const idle = actions.MM_Subtle_Idle_WeightShift || Object.values(actions)[0];
    idle?.reset().fadeIn(0.35).play();
    return () => idle?.fadeOut(0.2);
  }, [actions]);

  return (
    <group ref={character} position={[0, 0.24, 0]} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
      <pointLight
        color={perspective === "blue" ? "#9db9ff" : "#e07a82"}
        intensity={1.25}
        position={[1.8, 1.6, 1.8]}
      />
    </group>
  );
}

function Studio({ perspective }) {
  const accent = perspective === "blue" ? "#2f63f5" : "#b84550";
  return (
    <>
      <ambientLight intensity={0.82} />
      <directionalLight color="#ffffff" intensity={1.35} position={[3, 5, 4]} />
      <directionalLight color={accent} intensity={0.62} position={[-3, 2, -2]} />
      <Character perspective={perspective} />
    </>
  );
}

export default function CharacterScene({ perspective }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 34, position: [0, 0.05, 5.25], near: 0.01, far: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Studio perspective={perspective} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
