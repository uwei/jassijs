
//height=50 -> gilt für alle und height=function()

var reportdesign = {
	content: [
		{
			table: {
				heights: 50,
				body: [
					["sssd","ssqwr","ewr","\n","\n"],
					["","","","",""],
					["3","qwer","reee","\n","\n"],
					["sdfsdf","df","sdf","",""]
				]
			},
			layout: {
				hLineWidth: function (i, node) {	
                        return (i === 1 ? 2 : 0); //(i === 0 || i === node.table.body.length) ? 4 : 1;		
                    },
				vLineWidth: function (i, node) {	
                        return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;		
                    }
			}
		}
	]
};




export async function test() {
	// kk.o=0;
	var dlg: any = { reportdesign };

	return dlg;
}
