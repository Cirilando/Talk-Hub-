import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import "./App.css";
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
