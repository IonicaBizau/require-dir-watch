## Documentation

You can see below the API reference of this module.

### `requireDirWatch(directoryPath, [options], [options.onError], [options.onCreate], [options.onUpdate], [options.onDelete])`
Reimport the files from a directory when they are being updated.

#### Params

- **String** `directoryPath`: The directory to watch.
- **Object** `[options]`: Configuration options.
- **Function** `[options.onError]`: A callback function to handle errors.
- **Function** `[options.onCreate]`: A callback function when a file is created.
- **Function** `[options.onUpdate]`: A callback function when a file is updated.
- **Function** `[options.onDelete]`: A callback function when a file is deleted.

#### Return
- **Object** An object with file base names as keys and their exports as values.

