//import { useEffect } from "react";
import { Suspense } from 'react';
import { VRHtml } from './VRHtml'
import Prism from "prismjs";
//import loadLanguages from 'prismjs/components/index.js';
import './prism.min.css';

const SpellCode = ({ code, language } : any) => {
  //loadLanguages([language]);
  const hidden = false;

  //Prism.highlightAll(); //does this happen async without needed to be inside useEffect?
  const highlightedText = Prism.highlight(code, Prism.languages[language], language);
  //console.log(highlightedText);
  /*useEffect(() => {
    Prism.highlightAll();
  }, []);*/
  // previously inside div:
  /*
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
  */
  return (
    <Suspense fallback={<></>}>
    <VRHtml width={2} height={2}
    style={{
      transition: 'all 0.2s',
      opacity: hidden ? 0 : 1,
      transform: `scale(${hidden ? 2 : 1})`
    }}
    distanceFactor={1.5}
    position={[0, 0, 0.51]}
    transform
    occlude
  >

    <div className="Code"        
      style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "100px",
          margin: "1px",
          backgroundColor: 'white',
        }}
    >
      <div dangerouslySetInnerHTML={{__html: highlightedText}}></div>
    </div>
    </VRHtml>
    </Suspense>
  );
}

export default SpellCode;