import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

function PdfViewer(pdf) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (isBrowser) {
    return ReactDOM.createPortal(
      <div>
        <a src={pdf}></a>
      </div>,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

export default PdfViewer;
