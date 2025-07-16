# MondayWeb – Warehouse Management System

**MondayWeb** adalah proyek manajemen gudang berbasis web yang dibangun dengan **Laravel (backend)** dan **React 19 + TypeScript (frontend)**. 


## Fitur Proyek

- **Manajemen Merchant**: CRUD data toko dan afiliasinya
- **Manajemen Produk**: Kelola stok, harga, dan kategori produk
- **Transaksi & Customer**: Pencatatan dan pengelolaan data transaksi dan pelanggan
- **Pengaturan Stok Otomatis**: Sinkronisasi stok antara gudang dan merchant
- **Autentikasi & Role User**:
  - Laravel Sanctum untuk autentikasi token
  - Spatie Permission untuk pengaturan role user (seperti Manager & Keeper)

---

##  Teknologi yang Digunakan

### Backend:
- Laravel 10+
- MySQL
- Service Repository Pattern
- Sanctum, Spatie Laravel Permission

### Frontend:
- React 19
- TypeScript
- Axios, React Router, Tanstack React Query
- Custom Hooks, LocalStorage

---

## Instalasi Proyek

### 1. Clone Repository
```bash
git clone https://github.com/yurimuhtasim/mondayweb.git
cd mondayweb
