//import { useState } from 'react'
import SpellCode from './SpellCode';
//pass block position, code, and language params as props
const SpellBlock = (props : any) => {
    console.log(props)
    //probably dont need useState for this but maybe will change mind
    //const [size, set] = useState(0.5)
    //const [hidden, setVisible] = useState(false)
    const size = 0.1;
    //previously an attribute of the Html class: onOcclude={setVisible}
    // but i dont like it and it doesnt work in tsx
    // no longer needed 
    //<boxGeometry args={[size, size, 0.01]}/>
    //<meshStandardMaterial />
  //hold off on these attributes of mesh for now: position={props.position} rotation={props.rotation}
return (
      <mesh scale={size}>
          <SpellCode code={props.code} language={props.language} />
      </mesh>
    )
  }

export { SpellBlock };
  //module.exports.Block = Block;