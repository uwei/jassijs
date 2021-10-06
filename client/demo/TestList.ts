
var reportdesign = {
	content: [
		{
			text: [{text: "werqwreqwreqwreq  ewq we rqw eqw rqw qw qw eqw"}],
			editTogether: true
		},
		{ol: ["kkkk","hhhh","item 3"]},
		{
			ul: [{foreach: "person",text: "${person.name}"}]
		}
	]
};




export async function test() {
	// kk.o=0;
	var dlg: any = { reportdesign };
	dlg.reportdesign.data=[{name:"Max"},{name:"Moritz"}]
	return dlg;
}
