import React, { useState } from 'react'
import { Html } from '@react-three/drei'
import Code from './Code';
//pass block position, code, and language params as props
module.exports = function Block(props : any){
    //probably dont need useState for this but maybe will change mind
    const [size, set] = useState(0.5)
    const [hidden, setVisible] = useState(false)
    //previously an attribute of the Html class: onOcclude={setVisible}
    // but i dont like it and it doesnt work in tsx
    return (
      <mesh scale={size * 2}>
        <boxGeometry args={[size, size, 0.01]}/>
        <meshStandardMaterial />
        <Html
          style={{
            transition: 'all 0.2s',
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 0.5 : 1})`
          }}
          distanceFactor={1.5}
          position={[0, 0, 0.51]}
          transform
          occlude
        >
          <Code code={props.code} language={props.language} />
        </Html>
      </mesh>
    )
  }

  //module.exports.Block = Block;