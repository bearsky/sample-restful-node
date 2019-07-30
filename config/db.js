if(process.env.NODE_ENV === 'dev') {
        mongoURI = 'mongodb://localhost/crud-app'
} else if(process.env.NODE_ENV === 'production') {
        mongoURI = 'mLAB string'
} else if(process.env.NODE_ENV == 'test') {
        mongoURI = 'mongodb://localhost/crud-app-test'
}

module.exports = {mongoURI};