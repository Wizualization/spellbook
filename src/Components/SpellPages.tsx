import { useState, useEffect, Fragment } from 'react'
//import { Hands } from '@react-three/xr'
// hands should be added in parent app
import { useThree, useFrame } from '@react-three/fiber'
import { Box, Sphere } from '@react-three/drei' //useMatcapTexture
import { Physics, useBox, useSphere } from '@react-three/cannon' //usePlane
import { SpellBlock } from './SpellBlock'
export const joints = [
    'wrist',
    'thumb-metacarpal',
    'thumb-phalanx-proximal',
    'thumb-phalanx-distal',
    'thumb-tip',
    'index-finger-metacarpal',
    'index-finger-phalanx-proximal',
    'index-finger-phalanx-intermediate',
    'index-finger-phalanx-distal',
    'index-finger-tip',
    'middle-finger-metacarpal',
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
    'pinky-finger-tip'
  ]
  

function Cube({ position, args = [0.06, 0.06, 0.06], code, language }: any) {
  const [boxRef] = useBox(() => ({ position, mass: 1, args }))
  
  
  /*
  const [tex] = useMatcapTexture('C7C0AC_2E181B_543B30_6B6270')
    //previous contents of return()
    <Box ref={boxRef} args={args as any} castShadow>
      <meshMatcapMaterial attach="material" matcap={tex as any} />
    </Box>
  */
  
  return (
      <Box ref={boxRef} args={args as any}>
        <SpellBlock code={code} language={language} />
      </Box>
  )
}

function JointCollider({ index, hand }: { index: number; hand: number }) {
  const { gl } = useThree()
  const handObj = (gl.xr as any).getHand(hand)
  const joint = handObj.joints[joints[index]] as any
  const size = joint.jointRadius ?? 0.0001
  const [tipRef, api] = useSphere(() => ({ args: size, position: [-1, 0, 0] }))
  useFrame(() => {
    if (joint === undefined) return
    api.position.set(joint.position.x, joint.position.y, joint.position.z)
  })

  return (
    <Sphere ref={tipRef} args={[size]}>
      <meshBasicMaterial transparent opacity={0} attach="material" />
    </Sphere>
  )
}

function HandsReady(props: any) {
  const [ready, setReady] = useState(false)
  const { gl } = useThree()
  useEffect(() => {
    if (ready) return
    const joint = (gl.xr as any).getHand(0).joints['index-finger-tip']
    if (joint?.jointRadius !== undefined) return
    const id = setInterval(() => {
      const joint = (gl.xr as any).getHand(0).joints['index-finger-tip']
      if (joint?.jointRadius !== undefined) {
        setReady(true)
      }
    }, 500)
    return () => clearInterval(id)
  }, [gl, ready])

  return ready ? props.children : null
}

const HandsColliders = (): any =>
  [...Array(25)].map((_, i) => (
    <Fragment key={i}>
      <JointCollider index={i} hand={0} />
      <JointCollider index={i} hand={1} />
    </Fragment>
  ))

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
  
  return (
    <Physics>
      <HandsReady>
        <HandsColliders />
      </HandsReady>
      {[...Array(props.spells.length)].map((_, i) => (
        <Cube key={i} position={[0, 1.1 + 0.1 * i, -0.5]} code={props.spells[i]['code']} language={props.spells[i]['language']} />
      ))}
    </Physics>
  )
}

export { SpellPages };