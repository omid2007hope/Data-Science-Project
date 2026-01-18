import { CSS_WH_screen } from "../libraries/CSS_Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import Header from "../component/layout/Header";

function App() {
  return (
    <main className={CSS_WH_screen}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
