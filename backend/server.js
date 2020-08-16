const OkdbServer = require("okdb-server");

// create and start server on 7899 port by default
const options = {
    cors: {
        enabled: true
    }
}
const okdb = new OkdbServer(options);

// sample authentication, e.g. should validate your own auth token
const names = ["Lucas","Charlotte", "Oliver"];
let nameIdx = 0;
okdb.handlers().auth((token) => {
    if(token === "12345") {
        console.log("auth attempt for ", token, " success");
        const userName = names[nameIdx];
        const userId = "1" + nameIdx;
        nameIdx = (nameIdx + 1) % names.length;
        return { id: userId, name: userName}
    }    
    console.log("auth attempt for ", token, " failed");
    return null;
});


// Handling Ctrl-C (workaround for Windows)
if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}
//graceful shutdown on Ctrl-C (all other platforms)
process.on("SIGINT", function () {    
    okdb.stop(()=> {
        console.log("server stopped");
        process.exit();
    });
});