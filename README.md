CAREEM GLOBAL SERVICES LIMITED — Website (UAE Jobs & UAE Safaris)

Fungua index.html kwenye browser kuona preview.
Ku-publish: pakia faili zote .html na folder la assets kwenye Netlify, Vercel au hosting yako.

KURASA:
- index.html      Nyumbani
- jobs.html       Ajira UAE
- register.html   Fomu ya usajili wa wanaotafuta kazi (Register Now)
- safari.html     Safari UAE
- plan-trip.html  Fomu ya watalii (Plan My Trip) - ?tour=desert inachagua ziara moja kwa moja
- visa.html       Visa & Tiketi
- contact.html    Wasiliana + Faragha (contact.html?service=employer inachagua huduma)
- assets/style.css, assets/main.js  CSS na JS za kurasa zote

- Lugha: Kiswahili (default) + English (kitufe SW/EN juu). Chaguo la mtumiaji linahifadhiwa.
- Fomu ya mawasiliano inaandaa ujumbe wa WhatsApp (+255 773 490 719); haihifadhi data.
- Picha zinatoka Unsplash (zinahitaji internet). Picha ikishindwa ku-load, inaonyeshwa rangi badala yake.

KABLA YA KUWEKA HEWANI:
1. Thibitisha jina/trademark "CAREEM" (linakaribiana na Careem ya UAE).
2. Leseni ya wakala wa ajira nje ya nchi (Tanzania) na kibali cha tour operator/travel agent.
3. Ongeza email rasmi, TIN/namba ya usajili, na anwani/namba ya UAE kama ipo.
4. Weka picha halisi za kampuni (ofisi, wateja waliosafiri) badala ya picha za stock pale zinapopatikana.

ADMIN APP (/admin)
- Fungua /admin/ kuingia. Fomu za website (register, plan-trip, contact) zinahifadhiwa kwenye Supabase kisha WhatsApp inafunguka.
- Database: supabase/migrations/20261121000000_careem_init.sql (tables: profiles, leads, lead_activity + RLS).
- Kuunganisha: weka supabaseUrl na publishable key kwenye assets/config.js (USIWEKE service/secret key).
- Admin wa kwanza: jisajili kwenye /admin, kisha kwenye Supabase SQL Editor:
    update public.profiles set role = 'admin' where email = 'EMAIL_YAKO';
- Wafanyakazi wapya wanajisajili /admin na admin anawaidhinisha kwenye ukurasa wa Wafanyakazi.
