const getEnv = (type, env) => {
    switch (env) {
        case 'development':
            return `DEVELOPMENT_${type}`
        case 'demo':
            return `DEMO_${type}`
        case 'test':
            return `TEST_${type}`
        default:
            return `DEVELOPMENT_${type}`
    }
}
