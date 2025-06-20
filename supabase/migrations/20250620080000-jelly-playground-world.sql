INSERT INTO public.worlds (name, description, scene_config) VALUES (
  'Jelly Playground',
  'A physics sandbox of bouncy blobs.',
  '{"type":"PhysicsPlayground","day":{"mainObjectColor":"#f87171","material":{"roughness":0.3,"metalness":0.1},"background":{"type":"sky","sunPosition":[10,10,5]},"lights":[{"type":"ambient","intensity":1},{"type":"directional","position":[5,10,5],"intensity":0.8}]},"night":{"mainObjectColor":"#60a5fa","material":{"roughness":0.2,"metalness":0.5},"background":{"type":"stars","radius":150,"depth":50,"count":2000,"factor":4,"saturation":0.2,"fade":true,"speed":1},"lights":[{"type":"ambient","intensity":0.2},{"type":"point","position":[0,5,0],"intensity":1,"color":"#60a5fa"}]}}'
);
