🍎 Fruit Management System - Installation Guide
📋 Prerequisites
ก่อนเริ่มติดตั้ง ต้องมีสิ่งเหล่านี้ในเครื่อง:

Node.js (v16 หรือสูงกว่า) - Download
Docker Desktop - Download
Git - Download

🚀 Quick Start (One-Click Setup)
# 1. Clone repository
git clone https://github.com/yourusername/fruit-management-system.git
cd fruit-management-system

# 2. Start development environment (One-click!)
# Windows:
start-dev.bat
# Mac/Linux:
chmod +x start-dev.sh
./start-dev.sh

🌐 Application Features
✅ Core Features

User Authentication - Login/Logout system
CRUD Operations - Add, Edit, Delete fruit records
Data Grid - View, search, and paginate records
CSV Import - Upload CSV files to import bulk data
Auto Calculation - Total = Amount × Unit
Data Validation - Form validation and error handling

✅ Technical Features

REST API - Complete backend API
Responsive UI - Works on desktop and mobile
Real-time Updates - Data refreshes automatically
Pagination - Efficient data loading
Search - Find records quickly
File Upload - CSV import functionality

📱 Usage Instructions
1. Login

เปิดเบราว์เซอร์ไปที่ http://localhost:3000
ใส่ Username: admin, Password: admin123

2. View Data

ดูข้อมูลทั้งหมดในตาราง
ใช้ Search เพื่อค้นหา
ใช้ Pagination เพื่อดูหน้าถัดไป

3. Add New Record

กด "➕ Add New Record"
เลือก Date, Product Name และ Color
ใส่ Amount และ Unit
Total จะคำนวณอัตโนมัติ

4. Edit Record

กด "Edit" ในแถวที่ต้องการแก้ไข
แก้ไขได้เฉพาะ Amount, Unit, และ Color
Date และ Product Name แก้ไขไม่ได้

5. Delete Record

กด "Delete" ในแถวที่ต้องการลบ
Confirm การลบ

6. CSV Import

ด้านล่าง
กด "📁 Choose File" เพื่อเลือกไฟล์ CSV
กด "📤 Upload & Import"
ระบบจะเพิ่มข้อมูลใหม่
