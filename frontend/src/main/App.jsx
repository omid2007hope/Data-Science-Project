import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import Header from "../component/layout/Header";

function App() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-between">
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
