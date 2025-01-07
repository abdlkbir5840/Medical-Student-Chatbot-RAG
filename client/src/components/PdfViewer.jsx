import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-[500px] w-full overflow-auto">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer 
          fileUrl={url} 
          plugins={[defaultLayoutPluginInstance]} 
          initialPage={2} // Show only the first page initially
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;


// import React, { useEffect, useState, useRef } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';

// // Set the workerSrc to the correct path
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// const PdfViewer = ({ url }) => {
//   const [pdf, setPdf] = useState(null);
//   const [pageNum, setPageNum] = useState(1);
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const loadPdf = async () => {
//       const loadedPdf = await pdfjsLib.getDocument(url).promise;
//       setPdf(loadedPdf);
//     };

//     loadPdf();
//   }, [url]);

//   useEffect(() => {
//     const renderPage = async (pageNum) => {
//       if (!pdf || !canvasRef.current) return;

//       const page = await pdf.getPage(pageNum);
//       const viewport = page.getViewport({ scale: zoom, rotation: rotation });
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;

//       await page.render({
//         canvasContext: context,
//         viewport: viewport
//       }).promise;
//     };

//     renderPage(pageNum);
//   }, [pdf, pageNum, zoom, rotation]);

//   const changePage = (offset) => {
//     setPageNum((prevPageNum) => {
//       const newPageNum = prevPageNum + offset;
//       return newPageNum > 0 && newPageNum <= pdf.numPages ? newPageNum : prevPageNum;
//     });
//   };

//   const handleZoomChange = (e) => {
//     setZoom(parseFloat(e.target.value));
//   };

//   const rotateClockwise = () => {
//     setRotation((prevRotation) => (prevRotation + 90) % 360);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-gray-100 shadow-2xl rounded-lg overflow-hidden">
//       <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
//         <h2 className="text-xl font-bold">PDF Viewer</h2>
//         <div className="flex items-center space-x-1 bg-white p-4 rounded-lg shadow">
//           {/* <button
//             onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))}
//             disabled={zoom <= 0.5}
//             className="p-2 bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
//             </svg>
//           </button> */}
//           <input
//             type="range"
//             min="0.5"
//             max="3"
//             step="0.1"
//             value={zoom}
//             onChange={handleZoomChange}
//             className="flex-grow appearance-none bg-gray-200 h-2 rounded-full"
//           />
//           {/* <button
//             onClick={() => setZoom(Math.min(zoom + 0.25, 3))}
//             disabled={zoom >= 3}
//             className="p-2 bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//           </button> */}
//           <span className="text-sm font-medium w-16 text-center bg-gray-100 px-2 py-1 rounded">
//             {Math.round(zoom * 100)}%
//           </span>
//         </div>
//       </div>
//       <div className="p-6">
//         <div className="mb-4 flex justify-center bg-white rounded-lg shadow-inner p-4">
//           <canvas ref={canvasRef} className="max-w-full max-h-[calc(100vh-300px)]" />
//         </div>
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => changePage(-1)}
//             disabled={pageNum === 1}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
//           >
//             Previous
//           </button>
//           <span className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow">
//             Page {pageNum} of {pdf ? pdf.numPages : 0}
//           </span>
//           <button
//             onClick={() => changePage(1)}
//             disabled={pageNum === (pdf ? pdf.numPages : 0)}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
//           >
//             Next
//           </button>
//         </div>
       
//       </div>
//     </div>
//   );
// };

// export default PdfViewer;

