---
type: component
status: current
updated: 2026-08-11
tags: [ui, conversion]
sources: [architecture-doc]
code_refs:
  - src/components/download/DownloadOptions.tsx
---

ארבעת כרטיסי ההתקנה בעמוד `/download`, והמימוש של [[download-logic]].

## איך ההדגשה עובדת

`recommended` מאותחל ל‑`null` ונקבע רק ב‑`useEffect`. כלומר השרת מרנדר מצב
נייטרלי שבו אף כרטיס לא מודגש, וההדגשה מופיעה אחרי הידרציה.

זה מכוון: זיהוי פלטפורמה בשרת דורש ניתוח UA בבקשה, שובר caching סטטי, ומייצר
hydration mismatch. המחיר — הבהוב קצר — זניח, כי ההדגשה היא צבע גבול ותג, לא
שינוי פריסה.

## כשל בטוח

הכרטיס בודק `!links.apk` ומרנדר `<Button disabled>` עם הטקסט "בקרוב" במקום
קישור. כלומר **הכפתור לא יכול להצביע לשום מקום בטעות** — עמידה בדרישת הבריף
שאין להשתמש בכתובת APK לא רשמית. ראו [[d-005-apk-interim-link]].

באותו אופן, `apkRelease` ריק פשוט לא מרונדר. ראו [[content-model]].

## מלכודת אימות

בבדיקה נמדד שגבול הכרטיס המומלץ לבן במקום ציאן. הסיבה לא הייתה באג אלא
**transition שנתקע** — הדפדפן לא הרכיב פריימים, ולכן מעבר הצבע מעולם לא התקדם.
ביטול ה‑transition הראה את הערך הנכון.

**לקח:** בבדיקה סביבתית של צבע, יש לנטרל transitions לפני שמסיקים שיש באג.

## קשור

[[cta-link]] · [[accessibility]]
