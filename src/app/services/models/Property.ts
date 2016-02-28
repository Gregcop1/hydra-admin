export class Property {
    public label: string;
    public type: string;
    public required: boolean;
    public readable: boolean;
    public writable: boolean;

    constructor(datas: any = {}) {
        if(datas) {
            this.label = datas['hydra:title'];
            this.type = datas['hydra:property']['@type'];
            this.required = datas['hydra:required'];
            this.readable = datas['hydra:readable'];
            this.writable = datas['hydra:writable'];
        }
    }
}
