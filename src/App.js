import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./containers/Main";
import Export from "./containers/Export";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index path={`/dashboard`} element={<Main />} />
          <Route path={`/pages/build-pc`} element={<Main />} />
          <Route path={`/pages/export-build-pc`} element={<Export />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
