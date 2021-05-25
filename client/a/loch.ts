
export function test(){
       const format = new Intl.NumberFormat();
    const parts = format.formatToParts(12345.6);
    debugger;
    const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
    const index = new Map(numerals.map((d, i) => [d, i]));
    this._group = new RegExp(`[${parts.find(d => d.type === "group").value}]`, "g");
    this._decimal = new RegExp(`[${parts.find(d => d.type === "decimal").value}]`);
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = d => index.get(d);
  //  console.log(new Intl.NumberFormat('de-DE',{unit:"ll",
  //style: 'decimal',minimumFractionDigits:2 }).format(50.3));

}