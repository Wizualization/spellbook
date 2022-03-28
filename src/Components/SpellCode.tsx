//import { useEffect } from "react";
import Prism from "prismjs";
import './prism.min.css';

const SpellCode = ({ code, language } : any) => {
  //Prism.highlightAll(); //does this happen async without needed to be inside useEffect?
  const highlightedText = Prism.highlight(code, Prism.languages[language], language);
  console.log(highlightedText);
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
    <div className="Code">
      <h2> Code Syntax Block {language}</h2>
      {highlightedText}
    </div>
  );
}

export default SpellCode;