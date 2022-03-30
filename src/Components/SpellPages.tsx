import { useState, useEffect, Fragment, useRef } from 'react'
//import { Hands } from '@react-three/xr'
// hands should be added in parent app
import { Mesh } from 'three';
import { useThree, useFrame } from '@react-three/fiber'
import { SpellBlock } from './SpellBlock'
//Dont need to bother with anything that isnt pinching
export const joints = [
/*    'wrist',
    'thumb-metacarpal',
    'thumb-phalanx-proximal',
    'thumb-phalanx-distal',*/
    'thumb-tip',
/*    'index-finger-metacarpal',
    'index-finger-phalanx-proximal',
    'index-finger-phalanx-intermediate',
    'index-finger-phalanx-distal',*/
    'index-finger-tip'//,
/*    'middle-finger-metacarpal',
    'middle-finger-phalanx-proximal',
    'middle-finger-phalanx-intermediate',
    'middle-finger-phalanx-distal',
    'middle-finger-tip',
    'ring-finger-metacarpal',
    'ring-finger-phalanx-proximal',
    'ring-finger-phalanx-intermediate',
    'ring-finger-phalanx-distal',
    'ring-finger-tip',
    'pinky-finger-metacarpal',
    'pinky-finger-phalanx-proximal',
    'pinky-finger-phalanx-intermediate',
    'pinky-finger-phalanx-distal',
    'pinky-finger-tip'*/
  ]
  

function Page({ position = [0.06, 0.06, 0.06], code, language }: any) {
  const blockRef = useRef<Mesh | null>();
  /*
  const { gl } = useThree()
  const hand0 = (gl.xr as any).getHand(0) as any;
  const hand1 = (gl.xr as any).getHand(1) as any;

  useFrame(() => {
    if (!blockRef.current) return
    const index0 = hand0.joints['index-finger-tip']
    const index1 = hand1.joints['index-finger-tip']
    const thumb0 = hand0.joints['thumb-tip']
    const thumb1 = hand1.joints['thumb-tip']
    if(index0 && index1){
      const left_isNear = Math.max(0, 1 - index0.position.distanceTo(blockRef.current?.position) / 0.1) > 0.52
      const right_isNear = Math.max(0, 1 - index1.position.distanceTo(blockRef.current?.position) / 0.1) > 0.52
      if(left_isNear){
        const grabPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1) > 0.52
        if(grabPinch_left){
          blockRef.current?.position.set(index0.position);
        }
      } else {
        //lefty dominance if trying to grab with both hands, which the user should never do bc it will craft a spell lol
        if(right_isNear){
          const grabPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1) > 0.52
          if(grabPinch_right){
            blockRef.current?.position.set(index1.position);
          }
            
        }
    
      }
    }
  });
  */
  return (
      <mesh ref={blockRef} position={position}>
        <SpellBlock code={code} language={language} />
      </mesh>
  )
}
/*
function HandsReady(props: any) {
  const [ready, setReady] = useState(false)
  const { gl } = useThree()
  useEffect(() => {
    if (ready) return
    const joint = (gl.xr as any).getHand(0).joints['index-finger-tip']
    if (joint) return
    const id = setInterval(() => {
      const joint = (gl.xr as any).getHand(0).joints['index-finger-tip']
      if(joint){
        if (joint?.jointRadius !== undefined) {
          setReady(true)
        }
      }
    }, 500)
    return () => clearInterval(id)
  }, [gl, ready])

  return ready ? props.children : null
}
*/

function SpellPages(props : any) {
  
  /* not needed
  const [floorRef] = usePlane(() => ({
    args: [10, 10],
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 1, 0],
    type: 'Static'
  }))
  */
  /* //not needed in return()
  <Sky />
  <Plane ref={floorRef} args={[10, 10]} receiveShadow>
    <meshStandardMaterial attach="material" color="#fff" />
  </Plane>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[1, 8, 1]} angle={0.3} penumbra={1} intensity={1} castShadow />
  */
 //todo: fix hands stuff so that we can use
  //HandsReady
  return (
      <mesh>
      {[...Array(props.spells.length)].map((_, i) => (
        <Page key={i} position={[0.1 * i, 1.1, -0.25]} code={props.spells[i]['code']} language={props.spells[i]['language']} />
      ))}
      </mesh>
  )
}

export { SpellPages };