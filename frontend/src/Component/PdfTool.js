import React, { useState } from "react";
import "../styles/PdfTool.css";

// You can replace these URLs with your own hosted icons/images
const benefitsData = [
  {
    img: "https://img.icons8.com/color/96/free/cloud.png",
    title: "Web-based & Free",
    desc: "No installation required, works in any modern browser.",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs06WUETeZWMvipBNwJP4ffSoZqVp3SFYgNw&s",
    title: "Fast Processing",
    desc: "Large PDFs are processed quickly and efficiently.",
  },
  {
    img: "https://img.icons8.com/color/96/free/privacy.png",
    title: "Privacy Ensured",
    desc: "Your files are not stored permanently, ensuring confidentiality.",
  },
  {
    img: "https://static.vecteezy.com/system/resources/thumbnails/013/489/822/small_2x/all-apple-device-mockup-photo.jpg",
    title: "Works on Any Device",
    desc: "Desktop, tablet, or mobile – the tool adapts to all.",
  },
];

const tipsData = [
  {
    img: "https://cdn-icons-png.freepik.com/512/17743/17743305.png",
    title: "Avoid Password-Protected PDFs",
    desc: "The tool cannot process PDFs that are password-protected.",
  },
  {
    img: "https://img.icons8.com/color/96/free/inspection.png",
    title: "Check Your Files",
    desc: "Always verify your processed files before sharing.",
  },
  {
    img: "https://img.icons8.com/color/96/free/hourglass.png",
    title: "Large PDFs Take Time",
    desc: "Merging or compressing large PDFs may take a few seconds.",
  },
];

const PdfTool = () => {
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [compressFile, setCompressFile] = useState([]);
  const [outputLinks, setOutputLinks] = useState([]);

  const sendFormData = async (url, files, key = "pdf") => {
    if (!files || files.length === 0) return alert("Please select a file!");
    const formData = new FormData();
    if (files.length > 1) {
      for (const file of files) formData.append(key, file);
    } else {
      formData.append(key, files[0]);
    }

    try {
      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.files) {
        const filesWithName = data.files.map((f) => ({
          url: `http://localhost:5000${f}`,
          name: f.split("/").pop(),
        }));
        setOutputLinks(filesWithName);
      } else if (!res.ok) {
        alert(data.message || "Server error");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const removeOutput = (idx) => {
    setOutputLinks(outputLinks.filter((_, i) => i !== idx));
  };

  return (
    <div className="pdf-tool">
      {/* Intro Section */}
      <section className="intro">
        <h2>Welcome to Simple PDF Tool</h2>
        <p>
          Easily merge, split, or compress PDFs online. No registration
          required, works on any device, and keeps your files safe.
        </p>
      </section>

      {/* PDF Actions Section */}
      <section className="actions">
        <h3>📄 PDF Tools</h3>
        <div className="card-container">
          <div className="card">
            <h4>Merge PDFs</h4>
            <p>Combine multiple PDF files into a single document quickly.</p>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => setMergeFiles(e.target.files)}
            />
            <button
              onClick={() =>
                sendFormData(
                  "http://localhost:5000/api/pdf/merge",
                  mergeFiles,
                  "pdfs"
                )
              }
            >
              Merge PDFs
            </button>
          </div>

          <div className="card">
            <h4>Split PDF</h4>
            <p>Break your PDF into individual pages for easier management.</p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSplitFile(e.target.files)}
            />
            <button
              onClick={() =>
                sendFormData("http://localhost:5000/api/pdf/split", splitFile)
              }
            >
              Split PDF
            </button>
          </div>

          <div className="card">
            <h4>Compress PDF</h4>
            <p>Reduce the file size of your PDF without losing quality.</p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCompressFile(e.target.files)}
            />
            <button
              onClick={() =>
                sendFormData(
                  "http://localhost:5000/api/pdf/compress",
                  compressFile
                )
              }
            >
              Compress PDF
            </button>
          </div>
        </div>
      </section>

      {/* Output Section */}
      {outputLinks.length > 0 && (
        <section className="output-section">
          <h3>Processed Files</h3>
          {outputLinks.map((file, idx) => (
            <div key={idx} className="output-file">
              <iframe
                src={file.url}
                title={file.name}
                width="100%"
                height="400px"
                style={{ border: "1px solid #ccc", borderRadius: "10px" }}
              ></iframe>

              <div className="file-buttons">
                <button
                  className="download-btn"
                  onClick={async () => {
                    try {
                      const response = await fetch(file.url);
                      const blob = await response.blob();
                      const link = document.createElement("a");
                      link.href = window.URL.createObjectURL(blob);
                      link.download = file.name;
                      link.click();
                    } catch (err) {
                      alert("Download failed: " + err.message);
                    }
                  }}
                >
                  ⬇️ Download
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => removeOutput(idx)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Benefits Section */}
      <section className="benefits">
        <h3>Why Use Simple PDF Tool?</h3>
        <div className="benefits-container">
          {benefitsData.map((item, idx) => (
            <div className="benefit-card" key={idx}>
              <img src={item.img} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips">
        <h3>Tips & Notes</h3>
        <div className="tips-container">
          {tipsData.map((item, idx) => (
            <div className="tip-card" key={idx}>
              <img src={item.img} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PdfTool;
