# Cấu trúc Dữ liệu (Database Schema) - QLTC

Dữ liệu sẽ được lưu dưới dạng JSON trong `LocalStorage`.

## 1. Đối tượng "Hũ" (Jar)
```json
{
  "id": "nec",
  "name": "Thiết yếu",
  "percentage": 55,
  "balance": 11000000,
  "color": "#00D1FF"
}
```

## 2. Đối tượng "Giao dịch" (Transaction)
```json
{
  "id": "uuid-1234",
  "date": "2024-03-18T10:00:00Z",
  "type": "out", // "in" hoặc "out"
  "amount": 500000,
  "jarId": "play",
  "note": "Ăn tối cùng bạn bè",
  "category": "Ăn uống"
}
```

## 3. Cấu hình "Người dùng" (Settings)
```json
{
  "currency": "VND",
  "lastSalaryDate": "2024-03-01",
  "autoAllocate": true
}
```
