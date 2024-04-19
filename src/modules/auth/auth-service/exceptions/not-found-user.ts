import { ErrorException } from '../../../../system/exceptions/error-handler';

export class EmailUserExistedException extends ErrorException {
    constructor() {
        super('Email existed');
        this.status = 404;
    }
}

export class EmailUserNotFoundException extends ErrorException {
    constructor() {
        super('Email not found');
        this.status = 404;
    }
}

export class TokenUserNotFoundException extends ErrorException {
    constructor() {
        super('Token refresh not found');
        this.status = 404;
    }
}

export class TokenUserExpired extends ErrorException {
    constructor() {
        super('The refresh token has expired');
        this.status = 404;
    }
}
