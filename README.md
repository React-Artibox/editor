# React Artibox Editor V2

Rich Editor built with React Hooks

## Example

```javascript
import {
  ArtiboxProvider,
  Editor,
  createFileUploader,
  BlockTypes,
} from '@artibox/editor';

const artiboxOptions = {
  availableTypes: [
    BlockTypes.IMAGE,
    BlockTypes.YOUTUBE,
  ],
  parseImageFile: createFileUploader('http://sample.artibox.org/uploader/files', files => files[0]),
  parseImageURL: file => `http://sample.artibox.org/uploads/${file}`,
};

function SimpleForm() {
  return (
    <ArtiboxProvider options={artiboxOptions}>
      <div>
        <Editor onChange={content => console.log('Editor Content', content)} />
      </div>
    </ArtiboxProvider>
  );
}
```

### Use with [redux-form](https://redux-form.com/)

```javascript
import {
  ArtiboxProvider,
  reduxFormEditor,
} from '@artibox/editor';
import {
  Field,
} from 'redux-form';

function SimpleForm() {
  return (
    <ArtiboxProvider>
      <form>
      	 <Field
      	   name="content"
           component={reduxFormEditor} />
      </form>
    </ArtiboxProvider>
  );
}
```


## Options

- availableTypes: Array\<BlockTypes.IMAGE | BlockTypes.YOUTUBE\>

Push an array including block types you wanna use.

- parseImageFile: (file: File, emitter: ?Emitter) => Promise

Custom parser for image block, the upload image stored with base64 encoder in default. You can pass a new parse function changing to upload to server like s3. This function should return a promise object and resolve the data you want to store (like URL, filename)

- parseImageURL: (filename: string) => string

With parseImageFile function, when image block shown, the block viewer will call this function to map a correct image url.

## Helpers

- createFileUploader(targetURL: string, done: Function, fieldKey?: string = 'files', method?: string = 'POST') => Function

You can use this helper to create HTTP formdata/multipart POST easier. This function will return a proper function for parseImageFile.

- toJSON(storedValue: { blocks: Array<BlockType> })

You can use this function to transform value into json can be stringified.
