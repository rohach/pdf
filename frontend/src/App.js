import React from "react";
import Header from "./Component/Header";
import PdfTool from "./Component/PdfTool";
import Footer from "./Component/Footer";
import "./styles/App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <PdfTool />
      </main>
      <Footer />
    </div>
  );
}

export default App;
