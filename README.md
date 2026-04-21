# 🌾 FELLAH — فلاح
## المساعد الزراعي الذكي للفلاح الجزائري

**فكرة ومشروع: KHEDIM BENYAKHLEF DIT BENY JOE**  
🇩🇿 صُنع بـ ❤️ للفلاح الجزائري

---

## 📁 هيكل المشروع

```
fellah-project/
├── frontend/
│   ├── index.html        ← التطبيق الكامل (PWA)
│   └── manifest.json     ← إعدادات PWA للتثبيت على الهاتف
├── backend/
│   ├── server.js         ← API Node.js مع تناوب مفاتيح Groq
│   └── package.json      ← التبعيات
├── render.yaml           ← إعدادات الرفع على Render.com
└── README.md             ← هذا الملف
```

---

## ✨ المميزات

| الميزة | الوصف |
|--------|-------|
| 🤖 **ذكاء اصطناعي Groq** | محادثة زراعية بالدارجة والعربية |
| 🔬 **تشخيص الأمراض** | تحليل صورة النبتة بالذكاء AI |
| 📈 **أسعار السوق** | أسعار المنتجات الزراعية يومياً |
| 🌤 **الطقس** | توقعات 7 أيام مع توصيات زراعية |
| 🌱 **المحاصيل** | اقتراحات حسب المنطقة والموسم |
| 📅 **التقويم** | جدولة مواعيد العمل الزراعي |
| 📲 **PWA** | قابل للتثبيت على الهاتف بدون Play Store |
| 🔄 **تناوب المفاتيح** | مفتاحا Groq يتناوبان تلقائياً |

---

## 🚀 الرفع على Render.com (مجاني)

### الخطوة 1 — إنشاء حساب
1. اذهب إلى [render.com](https://render.com) وسجّل دخول بـ GitHub

### الخطوة 2 — رفع الكود على GitHub
```bash
git init
git add .
git commit -m "FellaH v2.0 — KHEDIM BENYAKHLEF DIT BENY JOE"
git remote add origin https://github.com/YOUR_USERNAME/fellah-app.git
git push -u origin main
```

### الخطوة 3 — نشر الـ Backend
1. في Render → **New** → **Web Service**
2. اختر مستودعك من GitHub
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Environment Variables:** أضف:
   - `GROQ_KEY_1` = مفتاحك الأول من console.groq.com
   - `GROQ_KEY_2` = مفتاحك الثاني من console.groq.com
   - `FRONTEND_URL` = رابط الفرونتند بعد نشره
7. اضغط **Create Web Service** ✅

### الخطوة 4 — نشر الـ Frontend
1. في Render → **New** → **Static Site**
2. اختر نفس المستودع
3. **Root Directory:** `frontend`
4. **Publish Directory:** `.`
5. اضغط **Create Static Site** ✅

### الخطوة 5 — ربط الـ URLs
- انسخ رابط الـ Backend (مثال: `https://fellah-backend.onrender.com`)
- في `frontend/index.html` السطر 1: غيّر `BACKEND_URL` للرابط الحقيقي
- ادفع التغيير لـ GitHub — Render يحدّث تلقائياً ✅

---

## 🔑 إعداد مفاتيح Groq

### كيف تحصل على مفاتيح مجانية:
1. اذهب إلى [console.groq.com](https://console.groq.com)
2. سجّل دخول (مجاني)
3. اضغط **API Keys** → **Create API Key**
4. أنشئ مفتاحين باسمين مختلفين: `fellah-key-1` و `fellah-key-2`

### كيف يعمل التناوب:
```
طلب 1 → مفتاح 1
طلب 2 → مفتاح 2  
طلب 3 → مفتاح 1
طلب 4 → مفتاح 2
...
```
هذا يضاعف الحد اليومي المجاني ويمنع انقطاع الخدمة.

---

## 📱 تثبيت على الهاتف (PWA)

### Android:
1. افتح الرابط في Chrome
2. اضغط **⋮** (القائمة)
3. اختر **"تثبيت التطبيق"** أو **"إضافة للشاشة الرئيسية"**

### iOS (iPhone):
1. افتح الرابط في Safari
2. اضغط **زر المشاركة** (□↑)
3. اختر **"إضافة إلى الشاشة الرئيسية"**

---

## 🛠️ تطوير محلي

```bash
# Backend
cd backend
npm install
GROQ_KEY_1=gsk_xxx GROQ_KEY_2=gsk_yyy node server.js

# Frontend — افتح مباشرة في المتصفح
open frontend/index.html
```

---

## 📊 الحدود المجانية Groq

| الميزة | المجاني |
|--------|---------|
| طلبات/يوم | 14,400 |
| رموز/دقيقة | 30,000 |
| نموذج الدردشة | llama3-70b-8192 |
| نموذج الصور | llama-3.2-90b-vision |

مع مفتاحين → **28,800 طلب/يوم** 🎉

---

## 📧 تواصل

**المؤسس:** KHEDIM BENYAKHLEF DIT BENY JOE  
🇩🇿 الجزائر

---

*فلاح v2.0 — مجاني وبدون إعلانات للفلاح الجزائري*
