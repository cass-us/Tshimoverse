import React from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

type User = {
  fullName: string;
  email: string;
  [key: string]: any;
};

// Helper to convert Excel serial date to ISO string
const excelSerialToDate = (serial: number): string => {
  const excelEpoch = new Date(1899, 11, 30); // Excel date system starts from Dec 30, 1899
  const jsDate = new Date(excelEpoch.getTime() + serial * 86400000);
  return jsDate.toISOString().split('T')[0]; // return 'YYYY-MM-DD'
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
      const rawUsers: User[] = XLSX.utils.sheet_to_json(sheet);

      const users = rawUsers.map((user) => {
        const processedUser = { ...user };

        // Fix date fields if they are numbers
        if (typeof user.cohortStartDate === 'number') {
          processedUser.cohortStartDate = excelSerialToDate(user.cohortStartDate);
        }
        if (typeof user.cohortEndDate === 'number') {
          processedUser.cohortEndDate = excelSerialToDate(user.cohortEndDate);
        }

        return processedUser;
      });

      try {
        await axios.post('http://localhost:8000/api/admin/bulk-users', users);
        console.log(users);
        alert('Users uploaded successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to upload users.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className='bg-blue-300 p-10'>
      <h2 >Upload User Excel File</h2>
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
    </div>
  );
};

export default admin;
