import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "./../assets/styles/Reports.css";

const Reports = ({ userId }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const storage = getStorage();
    const reportsRef = ref(storage, `reports/${userId}`);

    listAll(reportsRef)
      .then(async (result) => {
        const reportUrls = await Promise.all(result.items.map((item) => 
          getDownloadURL(item).then(url => ({ url, name: item.name })) // URL ve dosya adını sakla
        ));
        setReports(reportUrls);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  if (!reports.length) {
    return <div className="reports-container">Henüz rapor yok.</div>;
  }
  
    return (
      <div className="reports-container">
        <h3>Raporlar</h3>
        <div className="reports-list">
          {reports.map((report, index) => (
            <div key={index} className="report-card">
              {/* Örnek olarak sabit bir resim koydum, uygun bir önizleme veya simge ile değiştirin */}
              <img src="/path/to/report-preview.png" alt={`Rapor ${index + 1}`} className="report-image" />
              <div className="report-title">Rapor {index + 1} - {report.name}</div>
              <a href={report.url} target="_blank" rel="noopener noreferrer" className="report-link">Raporu İncele</a>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Reports