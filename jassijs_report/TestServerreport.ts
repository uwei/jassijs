

var reportdesign = {
	content: [
		{
			datatable: {
				header: ["name2233","lastname"],
				dataforeach: "person",
				body: ["${person.name}","${person.lastname}"]
			}
		}
	]
};
 
export async function fill(parameter) {
    var data = [
        { name: "Aoron", lastname: "Müllera" ,fullname:()=>this.name+", "+this.lastname},
        { name: "Heino", lastname: "Brechtp",fullname:()=>this.name+", "+this.lastname}
    ]
    if (parameter.sort === "name")
        data = data.sort((a, b) => { return a.name.localeCompare(b.name) });
    if (parameter.sort === "lastname")
        data = data.sort((a, b) => { return a.lastname.localeCompare(b.lastname) });
    return {
        reportdesign,
        data
    }
}

export async function test(){ 
    return await fill({sort:"lastname"}); 
}
//ok