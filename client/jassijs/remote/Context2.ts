import { getStackContext, useStackContext } from "jassijs/remote/Context";

class A{
  async h(){
    return await this.h2();
  }
  async h2(){
    console.log('Aktueller StackContext:'+ getStackContext()?.sessionId);
    return "Ok";
  }
}

async function test2(){
  return await new A().h();
}
export async function test(){
  const hallo = await useStackContext({ sessionId: 'abc-124' }, async () => {
  // await new Promise(res => setTimeout(res, 10));
    return test2();
  });
  console.log(hallo);
}


