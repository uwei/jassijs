export class SampleServerReport{
    content:any=undefined;
    layout(me){
        this.content={
            stack: [
                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: "{{name}}{{name2}}"
                                },
                            ]
                        }
                    ]
                }
            ]
        }
        
    }
    async run(data:any,param:any){
        //do database query with param
        //getBase64
    }
}