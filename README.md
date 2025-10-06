# Subscription Manager - CRUD Application with Firebase

Ung dung quan ly subscription voi day du chuc nang CRUD (Create, Read, Update, Delete) va Firebase Firestore database.

## Tinh nang

- ✅ **Create**: Them subscription moi
- ✅ **Read**: Xem danh sach tat ca subscriptions
- ✅ **Update**: Chinh sua subscription hien co
- ✅ **Delete**: Xoa subscription
- ✅ **Firebase Firestore**: Database realtime cloud
- ✅ **Analytics**: Thong ke chi phi theo category
- ✅ **Upcoming Payments**: Xem thanh toan sap toi

---

## Setup Firebase (5 phut thoi!)

### Buoc 1: Tao Project & Lay Config (3 phut)

1. Vao https://console.firebase.google.com/
2. Click **"Add project"** → Dat ten → **Tat** Google Analytics → Create
3. Doi project tao xong, click **"Continue"**
4. Click icon **Web** `</>` (goc tren cung, ben canh iOS/Android)
5. Dat ten app → Click **"Register app"**
6. **Copy toan bo doan code** trong phan `firebaseConfig`:

```javascript
// Copy cai nay!
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXX",
  authDomain: "ten-project-cua-ban.firebaseapp.com",
  projectId: "ten-project-cua-ban",
  storageBucket: "ten-project-cua-ban.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

7. **Paste vao file `firebase-config.js`** (thay the phan YOUR_API_KEY...)

### Buoc 2: Bat Firestore Database (2 phut)

1. Trong Firebase Console, menu ben trai → Click **"Firestore Database"**
2. Click **"Create database"**
3. Chon **"Start in test mode"** → Next
4. Chon location (chon **asia-southeast1** cho VN) → Enable
5. Xong! Database da ready

**LUU Y**: Test mode cho phep ai cung doc/ghi duoc (dung cho hoc tap). Production can setup rules bao mat.

### Buoc 3: Chay thoi!

Mo file `app.html` trong browser la xong!

---

## Tai sao KHONG dung Service Account Key?

**Service Account Key CHI DUNG CHO BACKEND (Node.js server)**, KHONG dung cho web app!

❌ **KHONG duoc:**
- Service Account Key (file .json) → Chi cho server-side
- Admin SDK → Chi cho Node.js/Python backend

✅ **PHAI DUNG:**
- Firebase Web SDK (nhu da setup o tren)
- Config voi apiKey, authDomain... → An toan cho frontend
- Firebase tu dong bao mat qua Firestore Rules

**Ly do:** Service Account Key cho full admin access, neu de len web ai cung thay duoc va hack database ban!

---

## Cach su dung

### Them Subscription (Create)

1. Click nut "Add New" hoac "+ Add Subscription"
2. Dien thong tin:
   - Service Name (ten dich vu)
   - Cost (gia)
   - Billing Cycle (chu ky thanh toan)
   - Category (phan loai)
   - Next Payment Date (ngay thanh toan tiep theo)
3. Click "Add Subscription"

### Xem Subscriptions (Read)

- Tat ca subscriptions se hien thi trong "Your Subscriptions" section
- Xem thong ke tong quan o phan "Analytics & Insights"

### Sua Subscription (Update)

1. Click nut "Edit" tren subscription card ban muon sua
2. Modal se mo voi thong tin hien tai
3. Chinh sua thong tin
4. Click "Update Subscription"

### Xoa Subscription (Delete)

1. Click nut "Delete" tren subscription card
2. Xac nhan xoa trong dialog
3. Subscription se bi xoa khoi Firestore

---

## Cau truc Project

```
subscription-manager/
├── app.html              # Main HTML file (file chinh de chay)
├── index.html            # Landing page
├── styles.css            # Styles
├── script.js             # JavaScript logic + CRUD functions
├── firebase-config.js    # Firebase configuration
└── README.md            # Huong dan nay
```

## Firestore Database Structure

```
subscriptions/
  └── {documentId}
      ├── name: string
      ├── cost: number
      ├── billing: string ('monthly' | 'yearly' | 'weekly')
      ├── category: string
      └── nextPayment: string (date)
```

---

## Troubleshooting

### Loi: "Firebase not initialized"
- Kiem tra xem ban da thay doi config trong `firebase-config.js` chua
- Dam bao Firebase SDK duoc load truoc `firebase-config.js`

### Loi: "Permission denied"
- Vao Firebase Console > Firestore Database > Rules
- Trong development mode, rules nen nhu sau:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
- **Luu y**: Rules nay CHI dung cho development. Production can rules bao mat hon.

### Khong thay data
- Mo Console (F12) de xem errors
- Kiem tra Firebase Console > Firestore Database xem data co duoc tao khong

---

## Security (Production)

Khi deploy production, cap nhat Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /subscriptions/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Va them Firebase Authentication de bao mat.

---

## Technologies Used

- HTML5
- CSS3 (Custom Properties)
- Vanilla JavaScript (ES6+)
- Firebase Firestore 9.22.0
- No framework - Pure JavaScript!

## License

MIT License - Free to use
