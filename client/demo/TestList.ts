
var reportdesign = {
	content: [
		{
			text: [{text: "werqwreqwreqwreq  ewq we rqw eqw rqw qw qw eqw"}],
			editTogether: true
		},
		{
			ol: [
				"item 1",
				{
					text: [
						{text: "item 2eqw rqew q"},
						{bold: true,text: "we qw eqw qw eqw e qwe  "},
						{
							text: "we lkq jklqj qälkjqkeljlkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjj"
						}
					],
					editTogether: true
				},
				"item 3"
			],
			reversed: true
		},
		{
			ul: [{foreach: "person",text: "${person.name}"}]
		}
	]
};




export async function test() {
	// kk.o=0;
	var dlg: any = { reportdesign };
	dlg.data=[{name:"Max"},{name:"Moritz"}]
	return dlg;
}
