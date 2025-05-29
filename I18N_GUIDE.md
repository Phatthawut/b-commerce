# Internationalization (i18n) Guide

This project now supports both English and Thai languages using Vue I18n.

## Quick Start

### Language Switcher

A language switcher has been added to the navigation menu (both desktop and mobile versions). Users can click on the globe icon to switch between English and Thai.

### Using Translations in Components

#### Template Usage

```vue
<template>
  <div>
    <h1>{{ $t("pages.home.title") }}</h1>
    <p>{{ $t("pages.home.subtitle") }}</p>
    <button>{{ $t("buttons.learnMore") }}</button>
  </div>
</template>
```

#### Script Usage (Composition API)

```vue
<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Use in reactive computations
const pageTitle = computed(() => t("pages.home.title"));

// Use in functions
const showMessage = () => {
  alert(t("common.success"));
};
</script>
```

## Available Translation Keys

### Navigation

- `nav.home` - Home / หน้าแรก
- `nav.about` - About / เกี่ยวกับเรา
- `nav.ourBooks` - Our Books / หนังสือของเรา
- `nav.ourServices` - Our Services / บริการของเรา
- `nav.donationCampaign` - Donation Campaign / แคมเปญบริจาค
- `nav.contactUs` - Contact Us / ติดต่อเรา

### Common Terms

- `common.language` - Language / ภาษา
- `common.english` - English / อังกฤษ
- `common.thai` - Thai / ไทย
- `common.loading` - Loading... / กำลังโหลด...
- `common.error` - Error / ข้อผิดพลาด
- `common.success` - Success / สำเร็จ
- `common.welcome` - Welcome / ยินดีต้อนรับ

### Buttons

- `buttons.learnMore` - Learn More / เรียนรู้เพิ่มเติม
- `buttons.readMore` - Read More / อ่านเพิ่มเติม
- `buttons.submit` - Submit / ส่ง
- `buttons.cancel` - Cancel / ยกเลิก
- `buttons.save` - Save / บันทึก
- `buttons.delete` - Delete / ลบ

### Page Content

- `pages.home.title` - Welcome to Woody Prieb
- `pages.about.title` - About Us
- `pages.contact.title` - Contact Us
- `pages.notFound.title` - Page Not Found

### Form Fields

- `forms.name` - Name / ชื่อ
- `forms.email` - Email / อีเมล
- `forms.phone` - Phone / เบอร์โทร
- `forms.message` - Message / ข้อความ
- `forms.required` - This field is required / จำเป็นต้องกรอกข้อมูลนี้

## Adding New Translations

1. Add the new key-value pairs to both language files:

   - `src/i18n/locales/en.json`
   - `src/i18n/locales/th.json`

2. Use the translation in your component:
   ```vue
   {{ $t("your.new.key") }}
   ```

## Language Persistence

The selected language is automatically saved to localStorage and will be restored when the user returns to the site.

## Language Composable

Use the `useLanguage` composable for advanced language management:

```vue
<script setup>
import { useLanguage } from "@/composables/useLanguage";

const { locale, changeLanguage } = useLanguage();

// Get current language
console.log(locale.value); // 'en' or 'th'

// Change language programmatically
changeLanguage("th");
</script>
```

## File Structure

```
src/
├── i18n/
│   ├── index.js              # i18n configuration
│   └── locales/
│       ├── en.json           # English translations
│       └── th.json           # Thai translations
├── composables/
│   └── useLanguage.js        # Language management composable
└── components/
    └── LanguageSwitcher.vue  # Language switcher component
```

## Examples of Updated Components

### TopNav.vue

The navigation component has been updated to use translations instead of hardcoded text and includes the language switcher.

### LanguageSwitcher.vue

A dropdown component that allows users to switch between English and Thai with flag icons.

## Best Practices

1. **Nested Keys**: Use nested objects for better organization

   ```json
   {
     "pages": {
       "home": {
         "title": "Welcome"
       }
     }
   }
   ```

2. **Consistent Naming**: Use camelCase for keys

   ```json
   {
     "nav": {
       "ourBooks": "Our Books"
     }
   }
   ```

3. **Fallback**: Always provide translations for both languages to avoid missing text

4. **Context**: Group related translations together (nav, forms, buttons, etc.)

## Testing

1. Start the development server: `npm run dev`
2. Navigate to your application
3. Click the language switcher in the navigation
4. Verify that all text changes between English and Thai
5. Refresh the page to ensure language preference is saved

The language setting is persistent and will remember the user's choice across browser sessions.
