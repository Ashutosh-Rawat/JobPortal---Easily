import app from "./index.js"

const portId = 3100
app.listen(portId,()=> {
    console.log(`server started listening on port ${portId}`)
})