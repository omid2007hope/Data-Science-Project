import { CSS_mainStyle } from "../libraries/CSS_General";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import Header from "../component/layout/Header";

function App() {
  return (
    <main className={CSS_mainStyle}>
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
