import * as THREE from 'three';
import React, { createContext, useMemo, useRef, useState, useContext, useLayoutEffect, forwardRef, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
//import { useDrag } from 'react-use-gesture' //no, we need to use the xr hands
import without from 'lodash-es/without';
import { SpellBlock } from './SpellBlock';

const temp = new THREE.Vector3()
const context = createContext()

function Dot(props) {
  return (
    <mesh {...props}>
      <circleGeometry args={[0.05, 16]} />
      <meshBasicMaterial color="#ff1050" />
    </mesh>
  )
}

function Nodes({ children, ...props }) {
  const [nodes, set] = useState([])
  const lines = useMemo(() => {
    const lines = []
    for (let node of nodes) {
      if (node.connectedTo.length) {
        const connections = node.connectedTo?.map((ref) => {
          if(ref){
            return [node.position, ref.current?.position]
          } else {
            return [node.position, new THREE.Vector3(0,0,0)]
          }
        })
        connections.forEach(([start, end]) => {
          start = start?.clone().add(temp.set(0.25, 0, 0))
          end = end?.clone().add(temp.set(-0.25, 0, 0))
          let mid1 = new THREE.Vector3(0,0,0);
          let mid2 = new THREE.Vector3(0,0,0);
          if(typeof start != 'undefined' && typeof end != 'undefined'){
            //have the midpoint y axis be (start?.y - end?.y) or 0?
            mid1 = start?.clone().add(end?.clone().sub(start)).add(new THREE.Vector3((start?.x), start?.y-0.15, start?.z)) // prettier-ignore
            mid2 = start?.clone().add(end?.clone().sub(start)).add(new THREE.Vector3(end?.x, end?.y+0.15, end?.z)) // prettier-ignore
            //original
            //mid = start?.clone().add(end?.clone().sub(start)).add(new THREE.Vector3((start?.x - end?.x), 0, (start?.z - end?.z))) // prettier-ignore
          } 
          //lines.push(new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(20))
          lines.push(new THREE.CubicBezierCurve3(start, mid1, mid2, end).getPoints(20))
        })
      }
    }
    return lines
  }, [nodes])


  const group = useRef()
  //-= delta was original direction but we want the lines to flow backward because that's our forward
  useFrame((_, delta) => group.current.children.forEach((line) => (line.material.uniforms.dashOffset.value += delta)))

  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map((points, index) => (
          <Line key={index} points={points} color="white" dashed dashScale={5} />
        ))}
      </group>
      {children}
      {lines.map((points, i) => (
        <group key={i} position-z={1}>
          <Dot position={points[0]} />
          <Dot position={points[points.length - 1]} />
        </group>
      ))}
    </context.Provider>
  )
}

const Node = forwardRef(({ name, connectedTo = [], position = [0, 0, 0], ...props }, ref) => {
  const set = useContext(context)
  const { size, camera } = useThree()
  const [pos, setPos] = useState(() => new THREE.Vector3(...position))
  const state = useMemo(() => ({ position: pos, connectedTo }), [pos, connectedTo])

  useLayoutEffect(() => {
    // Register this node on mount
    set((nodes) => [...nodes, state])
    // Unregister on unmount
    return () => set((nodes) => without(nodes, state))
  }, [state, pos])

  // Drag n drop, hover; neither of these relevant in xr
  /*
  const [hovered, setHovered] = useState(false)
  useEffect(() => (document.body.style.cursor = hovered ? 'grab' : 'auto'), [hovered])*/
  
  /*const bind = useDrag(({ down, xy: [x, y] }) => {
    document.body.style.cursor = down ? 'grabbing' : 'grab'
    const unprojectedPoint = temp
      .set((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0)
      .unproject(camera)
      .clone()
    setPos(unprojectedPoint)
  })*/

  // {...bind()}
    //const ref = useRef<Mesh | null>([]);
    //const ref = useRef();
    const { gl } = useThree()
    //const hand0 = (gl.xr as any).getHand(0) as any;
    //const hand1 = (gl.xr as any).getHand(1) as any;
    const hand0 = (gl.xr).getHand(0);
    const hand1 = (gl.xr).getHand(1);
    let frame = 0;
    let lastframe = 0;
    useFrame(() => {
      if (!ref.current) return
      const index0 = hand0.joints['index-finger-tip']
      const index1 = hand1.joints['index-finger-tip']
      const thumb0 = hand0.joints['thumb-tip']
      const thumb1 = hand1.joints['thumb-tip']
      /*//this shows that it never makes it past the point of checking whether there is a ref.current; why???
        frame++;
        if(frame+30 > lastframe){
          if(index0){console.log(JSON.stringify(index0.position))}
          console.log(JSON.stringify(ref.current.position))
          lastframe = 1*frame;
        }*/
        if(index0 && index1){
          const left_isNear = Math.max(0, 1 - index0.position.distanceTo(ref.current.position) / 0.1) > 0.8
        const right_isNear = Math.max(0, 1 - index1.position.distanceTo(ref.current.position) / 0.1) > 0.8
        if(left_isNear){
          const grabPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1) > 0.6
          if(grabPinch_left){
            //ref.current?.position.set(index0.position.x, index0.position.y, index0.position.z);
            ref.current.position.x = index0.position.x;
            ref.current.position.y = index0.position.y;
            ref.current.position.z = index0.position.z;
            setPos(index0.position); //setpos needed for line but insufficient for node
            ref.current.rotation.x = index0?.rotation.x;
            ref.current.rotation.y = index0?.rotation.y;
            ref.current.rotation.z = index0?.rotation.z;
          }
        } else {
          //lefty dominance if trying to grab with both hands, which the user should never do bc it will craft a spell lol
          if(right_isNear){
            const grabPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1) > 0.6
            if(grabPinch_right){
              //ref.current?.position.set(index1.position.x, index1.position.y, index1.position.z);
              ref.current.position.x = index1.position.x;
              ref.current.position.y = index1.position.y;
              ref.current.position.z = index1.position.z;
              setPos(index1.position); //setpos needed for line
              ref.current.rotation.x = index1?.rotation.x;
              ref.current.rotation.y = index1?.rotation.y;
              ref.current.rotation.z = index1?.rotation.z;
                }
              
          }
      
        }
      }
    });
  
  return (
    <mesh ref={ref} position={pos} {...props}>
      <Suspense fallback={<></>}>
        <SpellBlock code={props.code} language={props.language} />
      </Suspense>
    </mesh>
  )
})

export { Nodes, Node }
