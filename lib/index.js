"use strict";

const fs = require("fs");
const path = require("path");

/**
 * requireDirWatch
 * Reimport the files from a directory when they are being updated.
 *
 * @name requireDirWatch
 * @function
 * @param {String} directoryPath The directory to watch.
 * @param {Object} [options] Configuration options.
 * @param {Function} [options.onError] A callback function to handle errors.
 * @param {Function} [options.onCreate] A callback function when a file is created.
 * @param {Function} [options.onUpdate] A callback function when a file is updated.
 * @param {Function} [options.onDelete] A callback function when a file is deleted.
 * @return {Object} An object with file base names as keys and their exports as values.
 */
module.exports = function requireDirWatch(directoryPath, options = {}) {
    const { onError = console.error, onCreate, onUpdate, onDelete } = options;

    if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
        throw new Error("Invalid directory path");
    }

    const exportsMap = {};

    function loadFile(filePath, isNew = false) {
        try {
            const ext = path.extname(filePath);
            if (ext !== ".js" && ext !== ".json") return;

            const baseName = path.basename(filePath, ext);
            delete require.cache[require.resolve(filePath)];
            exportsMap[baseName] = require(filePath);
            
            if (isNew && onCreate) onCreate(baseName, exportsMap[baseName]);
            else if (onUpdate) onUpdate(baseName, exportsMap[baseName]);
        } catch (err) {
            onError(err);
        }
    }

    function unloadFile(filePath) {
        try {
            const ext = path.extname(filePath);
            if (ext !== ".js" && ext !== ".json") return;

            const baseName = path.basename(filePath, ext);
            delete require.cache[require.resolve(filePath)];
            delete exportsMap[baseName];
            
            if (onDelete) onDelete(baseName);
        } catch (err) {
            onError(err);
        }
    }

    function init() {
        try {
            fs.readdirSync(directoryPath).forEach(file => {
                loadFile(path.join(directoryPath, file), true);
            });
        } catch (err) {
            onError(err);
        }
    }

    fs.watch(directoryPath, (eventType, filename) => {
        if (!filename) return;
        const filePath = path.join(directoryPath, filename);

        try {
            if (eventType === "rename") {
                if (fs.existsSync(filePath)) {
                    loadFile(filePath, true);
                } else {
                    unloadFile(filePath);
                }
            } else if (eventType === "change") {
                loadFile(filePath);
            }
        } catch (err) {
            onError(err);
        }
    });

    init();
    return exportsMap;
};
