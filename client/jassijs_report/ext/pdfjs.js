/*require.config(
    {
       // 'pdfjs-dist/build/pdf': 'myfolder/pdf.min',
       // 'pdfjs-dist/build/pdf.worker': 'myfolder/pdf.worker.min'
      paths: {
          'pdfjs-dist/build/pdf': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min',
          'pdfjs-dist/build/pdf.worker': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min',
        //  'pdf.worker.entry': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.entry.min'
         },
      shim: {
        'pdfjs-dist/build/pdf': ['pdfjs-dist/build/pdf.worker'],
        }
  });*/

define("jassijs_report/ext/pdfjs",["pdfjs-dist/build/pdf","pdfjs-dist/build/pdf.worker"],function(pdfjs,worker,pdfjsWorker){
    pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
    //pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    return {
                default:pdfjs
            }
    });
