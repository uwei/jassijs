

var reportdesign = {
	defaultStyle: {italics: true},
	styles: {
		header: {bold: true,fontSize: 22},
		underline: {decoration: "underline"}
	},
	content: [
		{style: "header",text: "The Header"},
		{
			columns: [
				{width: 215,stack: ["firstname lastname","street","place"]},
				{
					width: 245,
					style: "underline",
					stack: [
						{fontSize: 18,text: "Invoice"},
						"\n",
						"Date: ",
						"Number: "
					]
				}
			]
		},
		{
			table: {body: [["Item","Price"],["hh","999"]]}
		}
	]
};


export async function test() {
    
   
    // kk.o=0;
    return {
        reportdesign: reportdesign
    }
}
