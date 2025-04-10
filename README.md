# Ta'lim markazlari uchun CRM tizimi

Ushbu loyiha ta'lim markazlari faoliyatini avtomatlashtirish uchun mo‘ljallangan oddiy CRM (Customer Relationship Management) tizimidir. Tizim orqali o‘quvchilar, o‘qituvchilar, kurslar va guruhlarni boshqarish, dars jadvalini tuzish hamda foydalanuvchilarni avtorizatsiya qilish imkoniyati mavjud.

---

## 🔧 Texnologiyalar to‘plami (Stack)

- **Backend**: [Node.js](https://nodejs.org/) (NestJS frameworki)
- **Til**: TypeScript
- **Ma'lumotlar ombori**: MongoDB (Mongoose ORM orqali)

---

## ✨ Asosiy imkoniyatlar

- **O‘quvchilar**:

  - CRUD (yaratish, o‘qish, yangilash, o‘chirish)

- **O‘qituvchilar**:

  - CRUD
  - Har bir o‘qituvchiga bir nechta kurs va guruh biriktirish mumkin

- **Kurslar**:

  - CRUD
  - Kurslar o‘rtasida ixtiyoriy ota-bola (parent-child) munosabati qo‘llab-quvvatlanadi

- **Guruhlar**:

  - CRUD
  - Guruhlarga o‘quvchilar, o‘qituvchilar va kurslar biriktirish

- **Avtorizatsiya**:

  - JWT asosida foydalanuvchini ro‘yxatdan o‘tkazish va tizimga kirish

- **Dars jadvali**:
  - Belgilangan sanaga mos ravishda rejalashtirilgan darslarni ko‘rish

---

## ⚙️ O‘rnatish (Setup)

1. **Repository-ni klonlash**:

   ```bash
   git clone https://github.com/your-username/edu-crm.git
   cd edu-crm

   ```

2. **Bog‘lanish uchun .env faylini yaratish: .env faylida quyidagilar bo‘lishi kerak**:

```bash
 MONGO_URI = 'mongodb://localhost:27017/yourdb'
 PORT = 3000
 ACCKEY = your_secret_key
 REFKEY = your_secret_key

```

3. **Dependenciyalarni o‘rnatish**:

```bash
 npm install

```

4. **Serverni ishga tushirish:**

```bash
 npm run start:dev

```

API-larni test qilish uchun quyidagi yo‘llardan foydalanishingiz mumkin:

Swagger UI: http://localhost:3000/api-doc
