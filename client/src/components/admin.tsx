import React from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

type User = {
  fullName: string;
  email: string;
  [key: string]: any;
};

const admin: React.FC = () => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (!result) return;

      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const users: User[] = XLSX.utils.sheet_to_json(sheet);

      try {
        await axios.post('http://localhost:8000/api/admin/bulk-users', users);
        alert('Users uploaded successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to upload users.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>Upload User Excel File</h2>
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
    </div>
  );
};

export default admin;
