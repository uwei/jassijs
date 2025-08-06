import printMe from './print';

function component() {
  const element = document.createElement('div');
  const button = document.createElement('button');

  button.innerHTML = new Date().toString();
  button.onclick =()=>printMe();

  element.appendChild(button);
  return element;
}

let element = component();
document.body.prepend(element);


const context = require.context('./', true, /\.js$/);

/*context.keys().forEach((key) => {
  context(key); // Modul laden
  console.log("ac"+key);  
  if (module.hot) {
    module.hot.accept(key, () => {
      console.log(`🔄 Modul aktualisiert: ${key}`);
      // Optional: neu rendern oder neu binden
    });
  }
});*/

// 🔥 HMR akzeptieren
if (module.hot) { 

  module.hot.accept('./print', () => {
        console.log('🔄 print.js wurde aktualisiert!');
  //  document.body.removeChild(element);
   // element = component();
  //  document.body.appendChild(element); 
  });
}