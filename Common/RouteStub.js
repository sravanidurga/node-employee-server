class RouteStub {
    constructor(VERB, PATH, FUNCTION_NAME, MIDDLEWARE) {
        this.VERB = VERB;
        this.PATH = PATH
        this.FUNCTION_NAME = FUNCTION_NAME;
        this.MIDDLEWARE = MIDDLEWARE
    }
}

module.exports = RouteStub;