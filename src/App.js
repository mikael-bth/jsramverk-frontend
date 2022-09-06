import './App.css';
import "trix";
import "trix/dist/trix.css";

import { TrixEditor } from "react-trix";

function save() {
  const trixEditor = document.querySelector("trix-editor")
  console.log(trixEditor.innerHTML)
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>JSRamverk Editor</h1>
      </header>
      <div className="App-editor">
        <div className="App-toolbar">
          <input id="save" name="save" value={"Spara"} onClick={save}></input>
        </div>
        <TrixEditor id="trixEditorContent" className="trix-editor" toolbar="trix-toolbar"></TrixEditor>
      </div>
      <footer className="App-footer">
        <h3>JSRamverk Editor : Mikael Menonen</h3>
      </footer>
    </div>
  );
}

export default App;
