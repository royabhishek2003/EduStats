import * as XLSX from "xlsx";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { useResultStore } from "../stores/ResultStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useThemeStore } from "../stores/ThemeStore";

function ExcelUpload() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const user = useIsLoggedIn((s) => s.user);
  const navigate = useNavigate();
  const setResults = useResultStore((s) => s.setResults);

  const [excelData, setExcelData] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(worksheet);
      
      const formatted = raw.map((s) => ({
        name: s.Name || s.name || "Unknown",
        marks: Number(s.Marks || s.marks || 0),
        subject: s.Subject || s.subject || "N/A",
        totalMarks: Number(s.TotalMarks || s.totalMarks || s.total_marks || s.Total || 100),
        remarks: s.Remarks || s.remarks || "N/A",
      }));

      setExcelData(formatted);
    };
  };

  const sendToBackend = async () => {
    if (!excelData.length) {
      toast.error("Please upload an Excel file first");
      return;
    }

    const payload = {
      students: excelData,
      vizName: "Excel Upload Visualization",
      user: {
        name: user?.name || "Guest",
        email: user?.email || "guest@example.com",
      },
    };

    const res = await fetch("http://localhost:3000/api/uploadExcel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      setResults(result);
      toast.success("Data processed successfully");
      setTimeout(() => navigate("/results"), 800);
    } else {
      toast.error(result.message || "Something went wrong");
    }
  };

  return (
    <div
    htmlFor="excel-upload"
      className={` group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
        darkMode
          ? "bg-zinc-900 hover:bg-zinc-900/80"
          : "bg-white border border-gray-400 hover:bg-gray-50 shadow-sm hover:shadow-md"
      }`}
    >
      <div
        className={`cursor-pointer absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 ${
          darkMode ? "bg-emerald-500" : "bg-emerald-400"
        }`}
        htmlFor="excel-upload"
      ></div>

      <div className="relative flex flex-col items-center text-center gap-4">
        <label
          htmlFor="excel-upload"
          className={`cursor-pointer inline-flex p-4 rounded-2xl transition ${
            darkMode ? "bg-emerald-500/10" : "bg-emerald-50"
          }`}
        >
          <UploadCloud
            className={`w-8 h-8 ${
              darkMode ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
        </label>

        <input
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="hidden"
        />

        <div>
          <h3
            className={`text-xl font-medium mb-1 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Upload Excel
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-zinc-500" : "text-gray-600"
            }`}
          >
            Import student performance data
          </p>
        </div>

        {uploadedFileName && (
          <p
            className={`text-xs ${
              darkMode ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            📄 {uploadedFileName}
          </p>
        )}

        <button
          onClick={sendToBackend}
          className={`w-full mt-2 py-2 rounded-xl font-medium transition ${
            darkMode
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          Process Data
        </button>
      </div>
    </div>
  );
}

export default ExcelUpload;
