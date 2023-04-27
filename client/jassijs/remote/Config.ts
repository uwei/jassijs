

export class Config{
    require:Function;
    isServer:boolean;
    serverConfig:Config;
    clientConfig:Config;
    modules:string[];
}