---
type: concept
status: current
updated: 2026-08-11
tags: [rtl, hebrew, quality-gate]
sources: [architecture-doc]
code_refs:
  - scripts/check-rtl.mjs
  - src/app/layout.tsx
---

עברית ו‑RTL הם בסיס הפרויקט, לא תוספת — ולכן הם נאכפים אוטומטית ולא בבדיקת אדם.

## הכלל

`<html lang="he" dir="rtl">`, ו**מאפייני כיווניות לוגיים בלבד**:
`ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e`.

אסורים: `ml- mr- pl- pr- left- right- text-left text-right border-l border-r`
ומקבילותיהם ב‑CSS.

## למה סקריפט ולא code review

`ml-4` נראה תקין לחלוטין ב‑review, ומתהפך בשקט בעברית. זו מחלקת באגים שבן אדם
מפספס באופן שיטתי ומכונה תופסת ב‑100%. לכן [[rtl-check-script]] מכשיל את הבילד
במקום להסתמך על משמעת.

## bidi

מספרים, שמות מותג לועזיים, כתובות דוא"ל ו‑URLs נעטפים ב‑`<bdi>` או `dir="ltr"`.
בלי זה `19.90 ₪` ו‑`Google Play` מוצגים שבורים בתוך משפט עברי.

## נקודות שנשכחות

- אייקוני כיווניות (חצים) חייבים להתהפך.
- `inset-x-0` תקין — הוא סימטרי ולכן לא כיווני.
- `insetInlineStart` ב‑inline styles, לא `left`.

## קשור

[[design-system]] · [[accessibility]]
