export class ApplicationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApplicationError';
    }
}

export class ApplicationNotFoundError extends ApplicationError {
    constructor(id: string) {
        super(`Application with id ${id} not found`);
        this.name = 'ApplicationNotFoundError';
    }
}

export class UnauthorizedError extends ApplicationError {
    constructor() {
        super('Unauthorized access to application');
        this.name = 'UnauthorizedError';
    }
}

export class ValidationError extends ApplicationError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
} 