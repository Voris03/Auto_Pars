import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SubmenuNav from "./components/SubmenuNav/SubmenuNav";

function App() {
  return (
    <>
      <Header />
      <SubmenuNav />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;