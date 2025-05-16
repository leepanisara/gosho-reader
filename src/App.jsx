import { useState, useEffect } from "react";

export default function GoshoSearchApp() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/gosho_dataset_cleaned.json")
      .then((res) => res.json())
      .then((json) => {
        console.log("ตัวอย่างข้อมูลจาก JSON:", json[0]);
        setData(json);
      })
      .catch((err) => console.error("โหลด JSON ไม่ได้:", err));
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    const keyword = searchTerm.toLowerCase();
    const matched = data.filter(
      (item) =>
        item.text_en?.toLowerCase().includes(keyword) ||
        item.text_th?.toLowerCase().includes(keyword),
    );
    setResults(matched);
  }, [searchTerm, data]);

  const highlight = (text) => {
    if (!searchTerm || !text) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gosho Search Tool</h1>

      <input
        className="w-full p-2 mb-4 border rounded"
        type="text"
        placeholder="พิมพ์คำที่ต้องการค้นหา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <p className="mb-4 text-sm text-gray-600">
        พบทั้งหมด {results.length} ตำแหน่ง
      </p>

      <div className="space-y-4">
        {results.map((item, idx) => (
          <div key={idx} className="p-4 border rounded bg-white shadow">
            <p className="text-sm text-gray-500">
              เล่มที่ {item.sheet_name} | เรื่องที่{" "}
              {item.paragraph_id?.split("-")[0]} | ย่อหน้าที่{" "}
              {item.paragraph_id?.split("-")[1]} | หน้า {item.page_th} (
              {item.page_en})
            </p>

            <p className="text-base font-semibold text-gray-700 mt-1">
              {item.gosho_name}
            </p>

            <p className="mt-2 text-gray-800 whitespace-pre-wrap">
              {highlight(item.text_en)}
            </p>
            <p className="mt-2 text-gray-900 whitespace-pre-wrap">
              {highlight(item.text_th)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
