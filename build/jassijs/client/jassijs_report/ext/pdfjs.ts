
/// <amd-dependency path="pdfjs-dist/build/pdf" name="pdfjs"/>
/// <amd-dependency path="pdfjs-dist/build/pdf.worker" name="worker"/>
declare var pdfjs;
pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
export default pdfjs;
