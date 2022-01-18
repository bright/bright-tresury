export class HealthCheckResponse {
    message: string
    services: ServiceStatus[]
    constructor(services: ServiceStatus[] = []) {
        this.message = 'OK'
        this.services = services
    }
}

export class ServiceStatus {
    name: string
    status: 'up' | 'down'
    constructor(name: string, status: 'up' | 'down') {
        this.name = name
        this.status = status
    }
}
