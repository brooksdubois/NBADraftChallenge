export default class BallDontLieApiClient {
    fetchOptions: object
    baseURL = ""

    constructor(apiKey: string) {
        this.fetchOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + apiKey
            }
        };
    }
}