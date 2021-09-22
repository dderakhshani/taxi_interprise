export interface HttpService {
    getData<T>(action: string): Promise<T>;
    getDataByParam<T>(param: any, action: string): Promise<T>;
    postJsonData<T>(data: any, action: string): Promise<T>;
}