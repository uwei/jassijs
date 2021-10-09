var reportdesign = {
	content: [
        "Hallo ${name}",
        "${address.street}",
        "${parameter.date}"
    ]
};

export function test() {
    return { 
        reportdesign,
        data:{
            name:"Klaus",
            address:{
                street:"Mainstreet 8"
            }
        },        
        parameter:{date:"2021-10-10"}      //parameter
    };
}
