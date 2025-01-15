import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./containers/Main";
import Export from "./containers/Export";
import authServices from "./services/auth.services";
import SideBar from "./containers/Layout/SideBar";
import Models from "./containers/Models";

function App() {
  useEffect(() => {
    const checkExpirationInterval = setInterval(() => {
      if (authServices.isExpired()) {
        window.location.href = "/login";
      }
    }, 60000);

    return () => clearInterval(checkExpirationInterval);
  }, []);

  return (
    <Router>
      {/* Flex container */}
      <div className="flex flex-col h-screen">
        {/* Header: chiếm hết chiều ngang màn hình */}
        <header className="bg-red-500 text-white p-4">
          <h1>IMPORT XNK</h1>
        </header>

        {/* Main Content với Sidebar */}
        <div className="flex flex-grow">
          {/* Sidebar: width cố định */}
          <SideBar />

          {/* Main Content: chiếm không gian còn lại */}
          <div className="flex-grow bg-gray-300 p-4 overflow-auto">
            <Routes>
              <Route index path={`/`} element={<Main />} />
              <Route path={`/pages/build-pc`} element={<Main />} />
              <Route path={`/pages/export-build-pc`} element={<Export />} />
              <Route path={`/models`} element={<Models />} />
            </Routes>
          </div>
        </div>

        {/* Footer: chiếm hết chiều ngang màn hình */}
        <footer className="bg-red-500 text-white p-4 text-center">
          <p>GEARVN 205</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
