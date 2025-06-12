# منصة امتحانات بريد الجزائر - PWA

منصة شاملة للتحضير لامتحان مكلف بالزبائن في بريد الجزائر مع امتحانات تجريبية وأسئلة محدثة.

## 🚀 الميزات

### 📱 Progressive Web App (PWA)
- **قابلة للتثبيت**: يمكن تثبيت التطبيق على الهاتف المحمول وسطح المكتب
- **تعمل بدون اتصال**: إمكانية الوصول للمحتوى المحفوظ حتى بدون إنترنت
- **تحديثات تلقائية**: يتم تحديث التطبيق تلقائياً في الخلفية
- **أداء سريع**: تحميل فوري وتجربة مستخدم سلسة

### 🎓 الميزات التعليمية
- امتحانات تجريبية شاملة
- أسئلة محدثة ومطابقة للامتحان الرسمي
- تتبع التقدم والنتائج
- مراجعة مفصلة للإجابات
- إحصائيات متقدمة للأداء

### 🎨 التصميم والواجهة
- تصميم متجاوب يعمل على جميع الأجهزة
- دعم كامل للغة العربية (RTL)
- واجهة مستخدم حديثة وسهلة الاستخدام
- رسوم متحركة سلسة ومؤثرات بصرية

## 🛠️ التقنيات المستخدمة

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Database + Authentication)
- **PWA**: Vite PWA Plugin + Custom Service Worker
- **State Management**: TanStack Query
- **Routing**: React Router DOM

## 📦 التثبيت والتشغيل

### متطلبات النظام
- Node.js 18+ 
- npm أو yarn أو bun

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd algeria-post-exams-pwa
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
yarn install
# أو
bun install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```
قم بتحديث ملف `.env` بمعلومات Supabase الخاصة بك.

4. **تشغيل التطبيق في وضع التطوير**
```bash
npm run dev
```

5. **بناء التطبيق للإنتاج**
```bash
npm run build
```

6. **معاينة النسخة المبنية**
```bash
npm run preview
```

## 🔧 إعداد PWA

### Service Worker
التطبيق يستخدم `vite-plugin-pwa` مع إعدادات محسنة:
- **Cache First** للملفات الثابتة
- **Network First** لـ API calls
- **Offline fallback** للصفحات غير المتاحة

### Manifest
ملف `manifest.json` محسن للتثبيت على Android:
- أيقونات بأحجام متعددة مع `purpose: "maskable"`
- إعدادات العرض والتوجه
- اختصارات التطبيق
- دعم كامل للغة العربية

### أيقونات التطبيق
يمكن إنشاء أيقونات جديدة باستخدام:
```bash
npm run pwa:generate-icons
```

## 📱 اختبار PWA

### Chrome DevTools
1. افتح DevTools (F12)
2. اذهب إلى تبويب **Application**
3. تحقق من:
   - **Manifest**: تأكد من صحة البيانات
   - **Service Workers**: تأكد من التسجيل والتفعيل
   - **Storage**: تحقق من التخزين المحلي

### Lighthouse Audit
```bash
# تشغيل Lighthouse audit
npx lighthouse http://localhost:5173 --view
```

الهدف: الحصول على درجة 90+ في جميع المقاييس.

### اختبار التثبيت
1. افتح التطبيق في Chrome على Android
2. ابحث عن رسالة "إضافة إلى الشاشة الرئيسية"
3. اختبر التطبيق بعد التثبيت

## 🚀 النشر

### Netlify (موصى به)
```bash
# بناء التطبيق
npm run build

# نشر على Netlify
# ارفع مجلد dist/ إلى Netlify
```

### إعدادات Netlify
أضف في ملف `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

## 📊 مراقبة الأداء

### Web Vitals
التطبيق يتتبع مقاييس الأداء الأساسية:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)

### تحليل الحزم
```bash
# تحليل حجم الحزم
npm run build -- --analyze
```

## 🔒 الأمان

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               font-src 'self' fonts.gstatic.com;
               img-src 'self' data: https:;
               connect-src 'self' *.supabase.co;">
```

### HTTPS
- **إجباري للـ PWA**: يجب تشغيل التطبيق على HTTPS في الإنتاج
- **Service Workers**: تتطلب HTTPS للعمل

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **Service Worker لا يعمل**
   - تأكد من HTTPS
   - تحقق من Console للأخطاء
   - امسح Cache وأعد التحميل

2. **التطبيق لا يظهر للتثبيت**
   - تأكد من صحة manifest.json
   - تحقق من تسجيل Service Worker
   - تأكد من HTTPS

3. **مشاكل في التخزين المحلي**
   - تحقق من Storage quota
   - امسح البيانات المحلية
   - تحقق من إعدادات المتصفح

### أدوات التشخيص
```javascript
// في Console المتصفح
navigator.serviceWorker.getRegistrations().then(console.log);
navigator.storage.estimate().then(console.log);
```

## 📚 الموارد المفيدة

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://web.dev/add-manifest/)

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل:
- افتح [Issue جديد](../../issues)
- راسلنا على البريد الإلكتروني
- انضم إلى مجتمعنا على Discord

---

**تم تطوير هذا التطبيق بـ ❤️ للمساعدة في التحضير لامتحان بريد الجزائر**