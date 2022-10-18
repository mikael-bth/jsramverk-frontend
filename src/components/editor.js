import * as React from "react";
import { TrixEditor } from "react-trix";
import "trix";

class Editor extends React.Component {
  editorReady(editor) {
    console.log("Editor ready");
  }
  render() {
    return (
      <div>
        <trix-toolbar id="trix-toolbar"></trix-toolbar>
        <TrixEditor onEditorReady={this.editorReady} onChange={this.props.handleChange} id="trixEditorContent" className="trix-editor" toolbar="trix-toolbar" />
      </div>
    );
  }
}

export default Editor;