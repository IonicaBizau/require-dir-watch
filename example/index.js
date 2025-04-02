"use strict";

const path = require("path");
const requireDirWatch = require("../lib");

// Define the directory to watch
const functionsDir = path.join(__dirname, "functions");

// Load and watch the functions directory
const functions = requireDirWatch(functionsDir, {
    onError: err => console.error("[ERROR]", err),
    onCreate: (name, module) => console.log(`[CREATE] Module '${name}' loaded:`, module),
    onUpdate: (name, module) => console.log(`[UPDATE] Module '${name}' reloaded:`, module),
    onDelete: name => console.log(`[DELETE] Module '${name}' removed.`)
});

// Periodically invoke a function if it exists and log the function map
setInterval(() => {
    if (typeof functions.sum === "function") {
        console.log("sum(35, 7) =", functions.sum(35, 7));
    } else {
        console.log("Function 'sum' is not available.");
    }
    console.log("Current modules:", functions);
}, 1000);