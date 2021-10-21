<template>
  <div>
    <el-form :model="noticeInfo" :rules="rules" ref="noticeInfoForm" label-width="130px" label-position="left">
      <el-form-item label="公告主题" prop="noticeName">
        <el-input v-model="noticeInfo.noticeName" clearable placeholder="请输入公告主题"></el-input>
      </el-form-item>
      <el-form-item label="公告描述" prop="noticeDescription">
        <ckeditor v-model="noticeInfo.noticeDescription" :editor="editor" :config="editorConfig" @ready="onReady"></ckeditor>
      </el-form-item>
      <el-form-item label="是否使用" prop="isUseful">
        <el-radio-group v-model="noticeInfo.isUseful">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addNotice" :loading="loading">添加</el-button>
        <el-button @click="$refs.noticeInfoForm.resetFields()">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
class MyUploadAdapter {
  constructor( loader ) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }
  // Starts the upload process.
  upload() {
    return this.loader.file
      .then( file => new Promise( ( resolve, reject ) => {
        this._initRequest();
        this._initListeners( resolve, reject, file );
        this._sendRequest( file );
      } ) );
  }
  // Aborts the upload process.
  abort() {
    if ( this.xhr ) {
      this.xhr.abort();
    }
  }
  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();
    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open( 'POST', `${process.env.BASE_API}upload`, true );
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.token}`)
    xhr.responseType = 'json';
  }
  // Initializes XMLHttpRequest listeners.
  _initListeners( resolve, reject, file ) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${ file.name }.`;
      xhr.addEventListener( 'error', () => reject( genericErrorText ) );
      xhr.addEventListener( 'abort', () => reject() );
      xhr.addEventListener( 'load', () => {
        const response = xhr.response;
        // This example assumes the XHR server's "response" object will come with
        // an "error" which has its own "message" that can be passed to reject()
        // in the upload promise.
        //
        // Your integration may handle upload errors in a different way so make sure
        // it is done properly. The reject() function must be called when the upload fails.
        if ( !response || response.error ) {
            return reject( response && response.error ? response.error.message : genericErrorText );
        }
        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        // This URL will be used to display the image in the content. Learn more in the
        // UploadAdapter#upload documentation.
        resolve( {
          default: response.url
        } );
      } );
      // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
      // properties which are used e.g. to display the upload progress bar in the editor
      // user interface.
      if ( xhr.upload ) {
        xhr.upload.addEventListener( 'progress', evt => {
          if ( evt.lengthComputable ) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        } );
      }
    }
  // Prepares the data and sends the request.
  _sendRequest( file ) {
    // Prepare the form data.
    const data = new FormData();
    data.append( 'upload', file );
    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.
    // Send the request.
    this.xhr.send( data );
  }
}
function MyUploadAdapterPlugin(editor) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = function( loader ) {
    console.log(loader)
    return new MyUploadAdapter( loader );
  }
}
export default {
  name: 'add',
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      noticeInfo: {
        noticeName: '',
        noticeDescription: '',
        isUseful: 1
      },
      loading: false,
      rules: {},
      editor: DecoupledEditor,
      editorConfig: {
        language: 'zh-cn',
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
          ]
        },
        link: {
          decorators: {
            openInNewTab: {
              mode: 'manual',
              label: 'Open in a new tab',
              defaultValue: true,			// This option will be selected by default.
              attributes: {
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            }
          }
        },
        extraPlugins: [ MyUploadAdapterPlugin ]
      }
    }
  },
  methods: {
    addNotice() {
      this.$refs.noticeInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request('post', 'notice/add', this.noticeInfo).then(res => {
            this.$refs.noticeInfoForm.resetFields()
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        }
      });
    },
    onReady( editor )  {
      // Insert the toolbar before the editable area.
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }
  }
}
</script>

<style>

</style>