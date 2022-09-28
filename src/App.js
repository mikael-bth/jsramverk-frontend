import './App.css';
import "trix";
import "trix/dist/trix.css";

import { TrixEditor } from "react-trix";

import DocToolbar from './components/doctools';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>JSRamverk Editor</h1>
      </header>
      <div className="App-editor">
        <div className="App-toolbar">
          { DocToolbar() }
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
