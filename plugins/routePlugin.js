// Route registration file for product-related endpoints.

const userRoutes = require("../routes/userRoutes")

let routePlugin = {

    name: 'routePlugin',
    version: '1.0.0',
    register: (server, options)=> {
        server.route(userRoutes)
    }
}

module.exports = routePlugin;