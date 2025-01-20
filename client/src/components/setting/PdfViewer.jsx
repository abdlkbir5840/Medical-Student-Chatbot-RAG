'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className='w-full' style={{ padding: '0px', fontFamily: 'Arial, sans-serif' }}>

      {file && (
        <iframe
        src={file}
        width="100%"
        height="670px"
        style={{ border: 'none' }}
        title="PDF Preview"
      ></iframe>
        // <div>

        //   <Document
        //     file={file}
        //     onLoadSuccess={onDocumentLoadSuccess}
        //     onLoadError={(err) => setError(`Error loading document: ${err.message}`)}
        //   >

        //     {Array.from(new Array(numPages), (el, index) => (
        //       <Page
        //         key={`page_${index + 1}`}
        //         pageNumber={index + 1}
        //         width={700}
        //         renderTextLayer={false}
        //         renderAnnotationLayer={false}
        //       />
        //     ))}
        //   </Document>
        // </div>
      )}
    </div>
  );
};

export default PdfViewer;

// const PdfViewer = ({ file }) => {
//   return (
//     <>
//       {file && (
//         <iframe
//           src={file}
//           width="100%"
//           height="600px"
//           title="PDF Preview"
//         ></iframe>
//       )}
//     </>
//   );
// };
// export default PdfViewer;
