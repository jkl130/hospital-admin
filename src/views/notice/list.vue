<template>
  <div>
    <el-table
      :data="noticeList"
      border
      style="width: 100%">
      <el-table-column
        prop="noticeName"
        fixed
        label="公告主题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="noticeDescription"
        label="公告描述"
        align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.noticeDescription"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="noticeType"
        label="公告类型"
        align="center">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isUseful"
        label="是否使用"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isUseful">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="updateNoticeInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="deleteNotice(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改公告信息" :visible.sync="updateDialogVisible" :close-on-click-modal="false" @close="resetNoticeInfo" width="80%">
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
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="resetNoticeInfo">取 消</el-button>
        <el-button type="primary" @click="submitNoticeInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
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
  name: 'notice',
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
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
      },
      noticeList: [],
      noticeInfo: {},
      updateDialogVisible: false,
      rules: {
        noticeName: [
          { required: true, message: '公告主题不能为空', trigger: 'blur' }
        ],
        noticeDescription: [
          { required: true, message: '公告描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getNoticeList()
  },
  methods: {
    // MyUploadAdapterPlugin(editor) {
    //   editor.plugins.get( 'FileRepository' ).createUploadAdapter = function( loader ) {
    //     console.log(loader)
    //   }
    // },
    getNoticeList() {
      this.$request('get', 'notice/list').then(res => {
        this.noticeList = res.data.data
      })
    },
    updateNoticeInfo(noticeInfo) {
      this.noticeInfo = JSON.parse(JSON.stringify(noticeInfo))
      this.updateDialogVisible = true
    },
    submitNoticeInfo() {
      this.$refs.noticeInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'notice/update', this.noticeInfo).then(res => {
            this.getNoticeList()
            this.resetNoticeInfo()
          })
        }
      });
    },
    resetNoticeInfo() {
      this.updateDialogVisible = false
      this.$refs.noticeInfoForm.resetFields()
    },
    deleteNotice(noticeInfo) {
      this.$confirm('确定删除该通知？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request('delete', `notice/delete/${noticeInfo.id}`).then(res => {
          this.getNoticeList();
        })
      }).catch(() => {});
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