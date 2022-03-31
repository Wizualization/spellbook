import { useState, useEffect, Fragment, useRef, useMemo, createRef, useLayoutEffect, Suspense } from 'react'
//import { Hands } from '@react-three/xr'
// hands should be added in parent app
import { Mesh } from 'three';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber'
import { CurveModifier } from '@react-three/drei'
import { SpellBlock } from './SpellBlock'
import * as THREE from 'three';
import { Nodes, Node } from './Nodes'
//import { Vector } from 'html2canvas/dist/types/render/vector';
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
  

function Page({ position = [0.06, 0.06, 0.06], code, language }) { //: any
  //const blockRef = useRef<Mesh | null>();
  const blockRef = useRef();
  const { gl } = useThree()
  //const hand0 = (gl.xr as any).getHand(0) as any;
  //const hand1 = (gl.xr as any).getHand(1) as any;
  const hand0 = (gl.xr).getHand(0);
  const hand1 = (gl.xr).getHand(1);

  useFrame(() => {
    if (!blockRef.current) return
    const index0 = hand0.joints['index-finger-tip']
    const index1 = hand1.joints['index-finger-tip']
    const thumb0 = hand0.joints['thumb-tip']
    const thumb1 = hand1.joints['thumb-tip']
    if(index0 && index1){
      const left_isNear = Math.max(0, 1 - index0.position.distanceTo(blockRef.current?.position) / 0.1) > 0.8
      const right_isNear = Math.max(0, 1 - index1.position.distanceTo(blockRef.current?.position) / 0.1) > 0.8
      if(left_isNear){
        const grabPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1) > 0.6
        if(grabPinch_left){
          //blockRef.current?.position.set(index0.position.x, index0.position.y, index0.position.z);
          blockRef.current.position.x = index0.position.x;
          blockRef.current.position.y = index0.position.y;
          blockRef.current.position.z = index0.position.z;
          blockRef.current.rotation.x = index0.rotation.x;
          blockRef.current.rotation.y = index0.rotation.y;
          blockRef.current.rotation.z = index0.rotation.z;
        }
      } else {
        //lefty dominance if trying to grab with both hands, which the user should never do bc it will craft a spell lol
        if(right_isNear){
          const grabPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1) > 0.6
          if(grabPinch_right){
            //blockRef.current?.position.set(index1.position.x, index1.position.y, index1.position.z);
            blockRef.current.position.x = index1.position.x;
            blockRef.current.position.y = index1.position.y;
            blockRef.current.position.z = index1.position.z;
            blockRef.current.rotation.x = index1.rotation.x;
            blockRef.current.rotation.y = index1.rotation.y;
            blockRef.current.rotation.z = index1.rotation.z;
              }
            
        }
    
      }
    }
  });
  //wrap in a mesh that will get the ref in the parent function
  return (
      <mesh ref={blockRef} position={position} >
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

/*
        <CurveModifier ref={ref => linkRefs.current[i] = ref} curve={curve}>
          <bufferGeometry />
          <lineBasicMaterial color="hotpink" />
        </CurveModifier>
      
 */

        
function Line({ start, end }) { // : any
  const ref = useRef() //<any>
  useLayoutEffect(() => {
    //ref.current!.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
  }, [start, end])
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  )
}


function SpellPages(props ) { //: any
  //const pageRefs = useMemo(() => Array(props.spells.length).fill(0).map(i=> createRef()), []);
  //const pageRefs = useRef<Mesh[] | null[]>([]);
  const [[...pageRefs]] = useState(() => [...Array(props.spells)].map(createRef))
  //const linkRefs = useRef<THREE.Line[] | null[]>([]);
  useEffect(() => {
    //pageRefs.current = pageRefs.current.slice(0, props.spells.length);
    //linkRefs.current = linkRefs.current.slice(0, props.spells.length-1);
 }, [props.spells]);
/*
useFrame(()=>{
  const lines = [];
  [...Array(props.spells.length-1)].map((_, i) => {
    if(typeof pageRefs.current[i+1] != null){
      const v1 = new THREE.Vector3(pageRefs.current[i]!.position.x, pageRefs.current[i]!.position.y-0.5, pageRefs.current[i]!.position.z)
      const v2 = new THREE.Vector3(pageRefs.current[i+1]!.position.x, pageRefs.current[i+1]!.position.y+0.5, pageRefs.current[i+1]!.position.z)
      const curve = new THREE.CubicBezierCurve3(pageRefs.current[i]!.position, v1, v2, pageRefs.current[i+1]!.position)
      linkRefs.current[i]!.geometry = curve;
    }
  })
  //lines.push(new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(20))
})
  */

 //todo: fix hands stuff so that we can use
  //HandsReady
  //but this may be more useful in wiz, actually?
  // line refs won't work this way
  //ref={ref => linkRefs.current[i] = ref }
  /*
  return (
    <mesh>
      {[...Array(props.spells.length)].map((_, i) => (
        <mesh ref={ref => pageRefs.current[i] = ref } >
          <Page key={i} code={props.spells[i]['code']} language={props.spells[i]['language']} />
        </mesh>
      ))}
      {[...Array(props.spells.length)].map((_, i) => (
        <Line ref={ref => linkRefs.current[i] = ref }>

        </Line>
      ))}
      </mesh>
  )
  */

  //in theory this part should work but why not?
  /* 
      <Nodes dashed color="#ff1050" lineWidth={1}>
      {[...Array(props.spells.length)].map((_, i) => (
        <Node ref={ref => pageRefs[i] = ref } name={"node_"+i.toString()} position={[0.1*i, 0.1*i, 1]} />
      ))}
      </Nodes>
*/
  return (
    <Suspense fallback={<></>}> 
    <Nodes dashed color="#ff1050" lineWidth={1}>
      {[...Array(props.spells.length)].map((_, i) => (i > 0 ? 
        <Node key={"node_"+i.toString()}  
          ref={pageRefs[i]} 
          name={"node_"+i.toString()} 
          position={[Math.PI*0.1*i, 1.5, Math.PI*0.1*i]}  
          rotation={[0, 0, Math.PI*0.1*i]}  
          code={props.spells[i]['code']} 
          language={props.spells[i]['language']} 
          connectedTo={[pageRefs[(i-1)]]}
        /> : 
        <Node key={"node_"+i.toString()}  
          ref={pageRefs[i]} 
          name={"node_"+i.toString()} 
          position={[Math.PI*0.1*i, 1.5, Math.PI*0.1*i]}  
          rotation={[0, 0, Math.PI*0.1*i]}  
          code={props.spells[i]['code']} 
          language={props.spells[i]['language']} 
        /> 
      ))}
      </Nodes>
    </Suspense>
  )

}

export { SpellPages };