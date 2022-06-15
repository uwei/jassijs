/*require.config(
    {
      paths :
      {
          'pdfmake' : '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts',// '../../lib/vfs_fonts',
          'pdfMakeLib' :'//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/pdfmake'  //'../../lib/pdfmake'
      },
      shim :
      {    
          pdfMakeLib :
          {           
              exports: 'pdfMake'
          },
          pdfmake : 
          {
              deps: ['pdfMakeLib'],
              exports: 'pdfMake'
          }
      }
    });*/
    if(window["globalThis"]!==undefined)
        console.log("window.globalThis is defined")
    define("jassijs_report/ext/pdfmake",['pdfMakelib',"vfs_fonts"],function(ttt,vfs){
        var fonts=require("vfs_fonts");

            return {
                default:pdfMake
            }
    });

