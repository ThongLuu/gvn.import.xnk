import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./containers/Main";
import Export from "./containers/Export";
import authServices from "./services/auth.services";
import { GlobalProvider } from "./context/GlobalContext";
import SideBar from "./containers/Layout/SideBar";

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
      <GlobalProvider>
        {/* Flex container */}
        <div className="flex h-screen">
          {/* Sidebar: width cố định */}
          <SideBar />

          {/* Main Content: chiếm không gian còn lại */}
          <div className="flex-grow bg-gray-100 p-4 overflow-auto">
            <Routes>
              <Route index path={`/`} element={<Main />} />
              <Route path={`/pages/build-pc`} element={<Main />} />
              <Route path={`/pages/export-build-pc`} element={<Export />} />
            </Routes>
          </div>
        </div>
      </GlobalProvider>
    </Router>
  );
}

export default App;
