export class Property {
    public label: string;
    public type: string;
    public required: boolean;
    public readable: boolean;
    public writable: boolean;

    populate(datas: any = {}) {
        if (!datas) {
            console.error('Wrong parameter: you should set datas to populate Property model, none give.');
        } else {
            this.label = datas['hydra:title'];
            this.type = datas['hydra:property']['@type'];
            this.required = datas['hydra:required'];
            this.readable = datas['hydra:readable'];
            this.writable = datas['hydra:writable'];
        }
    }
}
