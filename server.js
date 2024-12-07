import app from "./index.js"
import connectMongoose from "./src/config/mongooseConfig.js"

const portId = 3100
// server connection
app.listen(portId, () => {
    console.log(`server started for port ${portId}`)
    connectMongoose()
})