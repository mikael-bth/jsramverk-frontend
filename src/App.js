import './App.css';
import "trix/dist/trix.css";

import DocToolbar from './components/doctools';
import UserToolbar from './components/usertools';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>JSRamverk Editor</h1>
      </header>
      <div className="App-user">
        { UserToolbar() }
      </div>
      <div className="App-editor">
        { DocToolbar() }
      </div>
      <footer className="App-footer">
        <h3>JSRamverk Editor : Mikael Menonen</h3>
      </footer>
    </div>
  );
}

export default App;
