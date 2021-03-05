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
define("jassi_report/ext/pdfmake",['pdfmake'],function(ttt){
            return {
                default:pdfMake
            }
    });
