-- seed.sql
-- DEMONSTRATION DATA ONLY.
-- Every record here is fictional placeholder content. Nothing below is verified
-- MCCI information. Remove or replace all rows before launch.

-- ---------------------------------- SECTORS ---------------------------------
insert into public.sectors (id, name, slug, active, display_order) values
  ('11111111-0000-4000-8000-000000000001','Tourism & Hospitality','tourism-hospitality',true,1),
  ('11111111-0000-4000-8000-000000000002','Construction & Real Estate','construction-real-estate',true,2),
  ('11111111-0000-4000-8000-000000000003','Fisheries & Agriculture','fisheries-agriculture',true,3),
  ('11111111-0000-4000-8000-000000000004','ICT & Digital Services','ict-digital-services',true,4),
  ('11111111-0000-4000-8000-000000000005','Transport & Logistics','transport-logistics',true,5),
  ('11111111-0000-4000-8000-000000000006','Retail & Wholesale Trade','retail-wholesale-trade',true,6),
  ('11111111-0000-4000-8000-000000000007','Finance & Insurance','finance-insurance',true,7),
  ('11111111-0000-4000-8000-000000000008','Professional Services','professional-services',true,8),
  ('11111111-0000-4000-8000-000000000009','Manufacturing','manufacturing',true,9),
  ('11111111-0000-4000-8000-000000000010','Education & Training','education-training',true,10),
  ('11111111-0000-4000-8000-000000000011','Healthcare','healthcare',true,11),
  ('11111111-0000-4000-8000-000000000012','Other','other',true,12)
on conflict (id) do nothing;

-- ------------------------------ MEMBERSHIP TIERS ----------------------------
-- Fees are DEMO VALUES requiring official confirmation.
insert into public.membership_tiers (id, name, slug, annual_fee, currency, description, benefits, active, display_order, is_demo) values
  ('22222222-0000-4000-8000-000000000001','Associate','associate',800,'MVR','Startups and sole traders (demo fee).','["Newsletter","Training discounts","Directory listing","MSME helpdesk"]',true,1,true),
  ('22222222-0000-4000-8000-000000000002','Standard','standard',2000,'MVR','Small and medium businesses (demo fee).','["All Associate benefits","One industry council","Member event rates","Trade documentation support"]',true,2,true),
  ('22222222-0000-4000-8000-000000000003','Corporate','corporate',5500,'MVR','Established enterprises (demo fee).','["All Standard benefits","Up to three councils","Policy consultations","Featured directory placement"]',true,3,true),
  ('22222222-0000-4000-8000-000000000004','Patron','patron',15000,'MVR','Strategic and institutional partners (demo fee).','["All Corporate benefits","All councils","Patron recognition","Executive roundtables"]',true,4,true)
on conflict (id) do nothing;

-- --------------------------------- COUNCILS ---------------------------------
insert into public.councils (id, name, slug, short_description, full_description_markdown, icon_name, chair_name, chair_title, contact_email, member_count_display, established_year, objectives, policy_priorities, status, display_order, is_demo) values
  ('33333333-0000-4000-8000-000000000001','ICT Council','ict','Digital economy, telecommunications, fintech, cybersecurity and technology policy.','Demonstration content — final description to be supplied by the MCCI secretariat.','Cpu','Chair name to be confirmed','Council Chair','ict.council@mcci-demo.test',64,2014,'["Connectivity and affordability","Digital payments framework","Technology talent pipeline","Cybersecurity readiness"]','["Digital commerce framework","Data protection guidance","Digital procurement transparency"]','published',1,true),
  ('33333333-0000-4000-8000-000000000002','Tourism Council','tourism','Hospitality, tourism development, aviation, visitor experience and sustainable operations.','Demonstration content — final description to be supplied by the MCCI secretariat.','Palmtree','Chair name to be confirmed','Council Chair','tourism.council@mcci-demo.test',118,2009,'["Balanced tourism growth","Workforce development","Sustainability reporting","Source-market diversification"]','["Tourism taxation predictability","Guesthouse regulatory clarity","Aviation connectivity"]','published',2,true),
  ('33333333-0000-4000-8000-000000000003','Construction Council','construction','Infrastructure, real estate, engineering, procurement and building standards.','Demonstration content — final description to be supplied by the MCCI secretariat.','HardHat','Chair name to be confirmed','Council Chair','construction.council@mcci-demo.test',87,2011,'["Procurement transparency","Timely payment practices","Building and safety standards","Material logistics"]','["Public procurement reform","Payment security for subcontractors","Licensing framework"]','published',3,true),
  ('33333333-0000-4000-8000-000000000004','Fisheries & Agriculture Council','fisheries-agriculture','Fisheries, aquaculture, food security, agriculture and marine value chains.','Demonstration content — final description to be supplied by the MCCI secretariat.','Fish','Chair name to be confirmed','Council Chair','fisheries.council@mcci-demo.test',52,2016,'["Cold chain capacity","Market access for seafood","Island agriculture productivity","Certification readiness"]','["Export facilitation","Aquaculture licensing","Access to working capital"]','published',4,true),
  ('33333333-0000-4000-8000-000000000005','Transport Council','transport','Maritime transport, ferry connectivity, logistics, shipping and port development.','Demonstration content — final description to be supplied by the MCCI secretariat.','Ship','Chair name to be confirmed','Council Chair','transport.council@mcci-demo.test',41,2018,'["Lower inter-atoll freight cost","Port handling efficiency","Reliable ferry services","Modern customs processes"]','["Inter-atoll logistics reform","Port capacity and charges","Digital customs clearance"]','published',5,true)
on conflict (id) do nothing;

-- ------------------------------ ORGANISATIONS -------------------------------
-- All fictional. "Demo" is recorded in internal_notes and is_demo = true.
insert into public.organizations (id, legal_name, display_name, slug, registration_number, year_established, sector_id, annual_turnover_range, employee_count, description, registered_address, island, atoll, public_email, public_phone, website, directory_visible, verification_status, internal_notes, is_demo) values
  ('44444444-0000-4000-8000-000000000001','Atoll Digital Solutions Pvt Ltd','Atoll Digital Solutions','atoll-digital-solutions-pvt-ltd','C-1200/2019',2010,'11111111-0000-4000-8000-000000000004','MVR 2 – 10 million','21 – 50','Demonstration business record.','Malé (placeholder)','Malé','Kaafu (Malé)','contact@atoll-demo.test','+960 000 0000','https://atoll-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000002','Coral Route Logistics Pvt Ltd','Coral Route Logistics','coral-route-logistics-pvt-ltd','C-1207/2019',2013,'11111111-0000-4000-8000-000000000005','MVR 10 – 50 million','51 – 200','Demonstration business record.','Hulhumalé (placeholder)','Hulhumalé','Kaafu (Malé)','contact@coral-demo.test','+960 000 0000','https://coral-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000003','Blue Horizon Guesthouse Pvt Ltd','Blue Horizon Guesthouse','blue-horizon-guesthouse-pvt-ltd','C-1214/2019',2016,'11111111-0000-4000-8000-000000000001','Under MVR 500,000','6 – 20','Demonstration business record.','Dhangethi (placeholder)','Dhangethi','Alifu Dhaalu','contact@bluehorizon-demo.test','+960 000 0000','https://bluehorizon-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000004','Island Build Engineering Pvt Ltd','Island Build Engineering','island-build-engineering-pvt-ltd','C-1221/2019',2008,'11111111-0000-4000-8000-000000000002','Above MVR 50 million','200+','Demonstration business record.','Malé (placeholder)','Malé','Kaafu (Malé)','contact@islandbuild-demo.test','+960 000 0000','https://islandbuild-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000005','Ocean Harvest Foods Pvt Ltd','Ocean Harvest Foods','ocean-harvest-foods-pvt-ltd','C-1228/2019',2012,'11111111-0000-4000-8000-000000000003','MVR 2 – 10 million','21 – 50','Demonstration business record.','Thinadhoo (placeholder)','Thinadhoo','Gaafu Dhaalu','contact@ocean-demo.test','+960 000 0000','https://ocean-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000006','Male Business Services Pvt Ltd','Male Business Services','male-business-services-pvt-ltd','C-1235/2019',2012,'11111111-0000-4000-8000-000000000008','MVR 2 – 10 million','21 – 50','Demonstration business record.','Malé (placeholder)','Malé','Kaafu (Malé)','contact@male-demo.test','+960 000 0000','https://male-demo.test',true,'pending','Demo record. Application under review.',true),
  ('44444444-0000-4000-8000-000000000007','Lagoon Retail & Trading Pvt Ltd','Lagoon Retail & Trading','lagoon-retail-trading-pvt-ltd','C-1242/2019',2015,'11111111-0000-4000-8000-000000000006','MVR 500,000 – 2 million','6 – 20','Demonstration business record.','Hithadhoo (placeholder)','Hithadhoo','Seenu (Addu)','contact@lagoon-demo.test','+960 000 0000','https://lagoon-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000008','Green Atoll Farms Pvt Ltd','Green Atoll Farms','green-atoll-farms-pvt-ltd','C-1249/2019',2017,'11111111-0000-4000-8000-000000000003','Under MVR 500,000','1 – 5','Demonstration business record.','Gan (placeholder)','Gan','Laamu','contact@green-demo.test','+960 000 0000','https://green-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000009','Horizon Finance Advisory Pvt Ltd','Horizon Finance Advisory','horizon-finance-advisory-pvt-ltd','C-1256/2019',2009,'11111111-0000-4000-8000-000000000007','Above MVR 50 million','51 – 200','Demonstration business record.','Malé (placeholder)','Malé','Kaafu (Malé)','contact@horizon-demo.test','+960 000 0000','https://horizon-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000010','Reefline Marine Services Pvt Ltd','Reefline Marine Services','reefline-marine-services-pvt-ltd','C-1263/2019',2014,'11111111-0000-4000-8000-000000000005','MVR 2 – 10 million','21 – 50','Demonstration business record.','Eydhafushi (placeholder)','Eydhafushi','Baa','contact@reefline-demo.test','+960 000 0000','https://reefline-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000011','Palm Works Manufacturing Pvt Ltd','Palm Works Manufacturing','palm-works-manufacturing-pvt-ltd','C-1270/2019',2011,'11111111-0000-4000-8000-000000000009','MVR 10 – 50 million','51 – 200','Demonstration business record.','Kulhudhuffushi (placeholder)','Kulhudhuffushi','Haa Dhaalu','contact@palm-demo.test','+960 000 0000','https://palm-demo.test',true,'verified','Demo record. Not a verified MCCI member.',true),
  ('44444444-0000-4000-8000-000000000012','Seabreeze Learning Centre Pvt Ltd','Seabreeze Learning Centre','seabreeze-learning-centre-pvt-ltd','C-1277/2019',2018,'11111111-0000-4000-8000-000000000010','Under MVR 500,000','6 – 20','Demonstration business record.','Villimalé (placeholder)','Villimalé','Kaafu (Malé)','contact@seabreeze-demo.test','+960 000 0000','https://seabreeze-demo.test',false,'pending','Demo record. Application under review.',true)
on conflict (id) do nothing;

-- ----------------------------------- NEWS -----------------------------------
insert into public.news_posts (id, title, slug, excerpt, body_markdown, author_display_name, status, featured, published_at, is_demo) values
  ('55555555-0000-4000-8000-000000000001','MCCI Announces 2026 Business Engagement Calendar','mcci-announces-2026-business-engagement-calendar','Planned forums, briefings and council consultations for the coming year.','Demonstration content prepared for preview purposes.','MCCI Secretariat','published',true,'2026-01-14T09:00:00Z',true),
  ('55555555-0000-4000-8000-000000000002','Applications Open for SME Export Readiness Programme','applications-open-sme-export-readiness-programme','Structured support covering documentation, compliance and buyer engagement.','Demonstration content prepared for preview purposes.','MSME Unit','published',false,'2026-01-09T09:00:00Z',true),
  ('55555555-0000-4000-8000-000000000003','ICT Council Hosts Digital Commerce Roundtable','ict-council-hosts-digital-commerce-roundtable','Technology businesses and payment providers reviewed barriers to online trade.','Demonstration content prepared for preview purposes.','ICT Council','published',false,'2025-12-18T09:00:00Z',true),
  ('55555555-0000-4000-8000-000000000004','Construction Council Publishes Procurement Recommendations','construction-council-publishes-procurement-recommendations','Member-endorsed recommendations on tender evaluation and payment terms.','Demonstration content prepared for preview purposes.','Construction Council','published',false,'2025-12-02T09:00:00Z',true),
  ('55555555-0000-4000-8000-000000000005','Tourism Council Opens Sustainable Operations Consultation','tourism-council-opens-sustainable-operations-consultation','Members invited to comment on a practical sustainability framework.','Demonstration content prepared for preview purposes.','Tourism Council','published',false,'2025-11-20T09:00:00Z',true),
  ('55555555-0000-4000-8000-000000000006','MCCI Welcomes New Demonstration Member Profiles','mcci-welcomes-new-demonstration-member-profiles','Twelve placeholder business profiles added to preview the directory.','Demonstration content prepared for preview purposes.','MCCI Secretariat','published',false,'2025-11-05T09:00:00Z',true)
on conflict (id) do nothing;

-- ---------------------------------- EVENTS ----------------------------------
insert into public.events (id, council_id, title, slug, event_type, summary, starts_at, ends_at, venue, island, atoll, audience, capacity, fee, member_only, registration_open, status, featured, is_demo) values
  ('66666666-0000-4000-8000-000000000001','33333333-0000-4000-8000-000000000001','Maldives Business Forum 2026','maldives-business-forum-2026','summit','Demonstration event record.','2026-03-12T09:00:00Z','2026-03-12T14:00:00Z','Conference venue, Malé (placeholder)','Malé','Kaafu (Malé)','Open to all businesses',300,0,false,true,'published',true,true),
  ('66666666-0000-4000-8000-000000000002','33333333-0000-4000-8000-000000000001','Digital Commerce and Fintech Roundtable','digital-commerce-and-fintech-roundtable','forum','Demonstration event record.','2026-02-19T09:30:00Z','2026-02-19T13:00:00Z','Conference venue, Malé (placeholder)','Malé','Kaafu (Malé)','MCCI members',80,0,true,true,'published',true,true),
  ('66666666-0000-4000-8000-000000000003','33333333-0000-4000-8000-000000000004','SME Export Readiness Workshop','sme-export-readiness-workshop','training','Demonstration event record.','2026-02-26T09:00:00Z','2026-02-26T14:00:00Z','Training room, Hulhumalé (placeholder)','Hulhumalé','Kaafu (Malé)','Open to all businesses',40,450,false,true,'published',false,true),
  ('66666666-0000-4000-8000-000000000004','33333333-0000-4000-8000-000000000002','Sustainable Tourism Industry Dialogue','sustainable-tourism-industry-dialogue','forum','Demonstration event record.','2026-04-08T09:00:00Z','2026-04-08T13:00:00Z','Conference venue, Malé (placeholder)','Malé','Kaafu (Malé)','Open to all businesses',150,0,false,true,'published',false,true),
  ('66666666-0000-4000-8000-000000000005','33333333-0000-4000-8000-000000000003','Construction Procurement Briefing','construction-procurement-briefing','webinar','Demonstration event record.','2026-02-05T10:00:00Z','2026-02-05T11:30:00Z','Online session','Online','Kaafu (Malé)','MCCI members',200,0,true,true,'published',false,true),
  ('66666666-0000-4000-8000-000000000006','33333333-0000-4000-8000-000000000004','Blue Economy and Fisheries Forum','blue-economy-and-fisheries-forum','forum','Demonstration event record.','2026-05-14T09:00:00Z','2026-05-14T14:00:00Z','Conference venue, Thinadhoo (placeholder)','Thinadhoo','Gaafu Dhaalu','Open to all businesses',120,0,false,true,'published',false,true),
  ('66666666-0000-4000-8000-000000000007',null,'Women in Business Networking Evening','women-in-business-networking-evening','exhibition','Demonstration event record.','2026-03-26T17:00:00Z','2026-03-26T20:00:00Z','Conference venue, Malé (placeholder)','Malé','Kaafu (Malé)','Open to all businesses',100,250,false,true,'published',false,true),
  ('66666666-0000-4000-8000-000000000008',null,'MCCI Annual General Meeting','mcci-annual-general-meeting','meeting','Demonstration event record.','2025-11-28T15:00:00Z','2025-11-28T18:00:00Z','Conference venue, Malé (placeholder)','Malé','Kaafu (Malé)','MCCI members',250,0,true,false,'published',false,true)
on conflict (id) do nothing;

-- ------------------------------- PUBLICATIONS -------------------------------
insert into public.publications (id, title, slug, publication_type, summary, file_path, page_count, published_at, status, featured, is_demo) values
  ('77777777-0000-4000-8000-000000000001','MCCI Annual Report 2025','mcci-annual-report-2025','annual_report','Demonstration annual report placeholder.','publications/demo/mcci-annual-report-2025.pdf',68,'2026-01-05T00:00:00Z','published',true,true),
  ('77777777-0000-4000-8000-000000000002','Business Confidence Survey — Q1 2026','business-confidence-survey-q1-2026','research','Quarterly sentiment indicators (demo data).','publications/demo/business-confidence-q1-2026.pdf',24,'2026-01-20T00:00:00Z','published',false,true),
  ('77777777-0000-4000-8000-000000000003','MSME Landscape in the Maldives — Demo Report','msme-landscape-demo-report','research','Overview of MSME activity (demo data).','publications/demo/msme-landscape.pdf',42,'2025-11-11T00:00:00Z','published',false,true),
  ('77777777-0000-4000-8000-000000000004','Maldives Trade Statistics Digest — Demo Edition','trade-statistics-digest-demo','statistics','Statistical digest layout demonstration.','publications/demo/trade-statistics-digest.pdf',18,'2025-10-02T00:00:00Z','published',false,true),
  ('77777777-0000-4000-8000-000000000005','Digital Commerce Policy Brief','digital-commerce-policy-brief','policy_paper','Short policy brief template.','publications/demo/digital-commerce-brief.pdf',12,'2025-09-16T00:00:00Z','published',false,true),
  ('77777777-0000-4000-8000-000000000006','Sustainable Business Operations Guide','sustainable-business-operations-guide','guide','Practical guide layout.','publications/demo/sustainable-operations-guide.pdf',30,'2025-08-08T00:00:00Z','published',false,true)
on conflict (id) do nothing;

-- ---------------------------------- POLICY ----------------------------------
insert into public.policy_items (id, title, slug, category, reference_number, summary, position_status, progress_percent, status, published_at, featured, is_demo) values
  ('88888888-0000-4000-8000-000000000001','Digital Commerce Framework','digital-commerce-framework','Regulatory Affairs','MCCI-POL-2026-001','Demonstration policy position.','Priority action',72,'published','2025-11-01T00:00:00Z',true,true),
  ('88888888-0000-4000-8000-000000000002','MSME Development Legislation','msme-development-legislation','Legislative Affairs','MCCI-POL-2026-002','Demonstration policy position.','Supports',55,'published','2025-12-02T00:00:00Z',true,true),
  ('88888888-0000-4000-8000-000000000003','Foreign Investment Review','foreign-investment-review','International Trade','MCCI-POL-2026-003','Demonstration policy position.','Under review',38,'published','2025-11-03T00:00:00Z',false,true),
  ('88888888-0000-4000-8000-000000000004','Inter-Atoll Logistics Reform','inter-atoll-logistics-reform','Regulatory Affairs','MCCI-POL-2026-004','Demonstration policy position.','Monitoring',26,'published','2025-12-04T00:00:00Z',false,true),
  ('88888888-0000-4000-8000-000000000005','Business Registration Simplification','business-registration-simplification','Regulatory Affairs','MCCI-POL-2026-005','Demonstration policy position.','Consultation',61,'published','2025-11-05T00:00:00Z',false,true)
on conflict (id) do nothing;

insert into public.policy_submissions (id, reference_number, title, slug, submitted_to, submission_date, response_status, summary, file_path, status, is_demo) values
  ('99999999-0000-4000-8000-000000000001','MCCI-SUB-2026-001','Submission on the Digital Commerce Framework','submission-on-the-digital-commerce-framework','Ministry responsible for economic development','2026-01-08','Acknowledged','Demonstration submission record.','publications/demo/submission-1.pdf','published',true),
  ('99999999-0000-4000-8000-000000000002','MCCI-SUB-2026-002','Submission on MSME Development Regulations','submission-on-msme-development-regulations','Ministry responsible for economic development','2026-02-09','Under review','Demonstration submission record.','publications/demo/submission-2.pdf','published',true),
  ('99999999-0000-4000-8000-000000000003','MCCI-SUB-2026-003','Comments on Public Procurement Guidelines','comments-on-public-procurement-guidelines','Public procurement authority','2026-03-10','Response received','Demonstration submission record.','publications/demo/submission-3.pdf','published',true),
  ('99999999-0000-4000-8000-000000000004','MCCI-SUB-2026-004','Submission on Port Handling Charges','submission-on-port-handling-charges','Ports and transport authority','2026-01-11','Acknowledged','Demonstration submission record.','publications/demo/submission-4.pdf','published',true),
  ('99999999-0000-4000-8000-000000000005','MCCI-SUB-2026-005','Comments on Business Registration Amendments','comments-on-business-registration-amendments','Registrar of companies','2026-02-12','Under review','Demonstration submission record.','publications/demo/submission-5.pdf','published',true),
  ('99999999-0000-4000-8000-000000000006','MCCI-SUB-2026-006','Submission on Tourism Sector Taxation','submission-on-tourism-sector-taxation','Ministry responsible for finance','2026-03-13','Pending','Demonstration submission record.','publications/demo/submission-6.pdf','published',true)
on conflict (id) do nothing;

-- ------------------------------ MSME PROGRAMMES -----------------------------
insert into public.msme_programs (id, title, slug, program_type, provider, summary, eligibility, deadline, status, featured, is_demo) values
  ('aaaaaaaa-0000-4000-8000-000000000001','SME Export Readiness Programme','sme-export-readiness-programme','export','MCCI MSME Unit','Demonstration support programme.','Registered Maldivian business (criteria to be confirmed).','2026-02-20','published',true,true),
  ('aaaaaaaa-0000-4000-8000-000000000002','Digital Tools for Small Business','digital-tools-for-small-business','training','ICT Council partnership','Demonstration support programme.','Registered Maldivian business (criteria to be confirmed).','2026-03-21','published',true,true),
  ('aaaaaaaa-0000-4000-8000-000000000003','Financial Management Training','financial-management-training','training','MCCI Training Services','Demonstration support programme.','Registered Maldivian business (criteria to be confirmed).','2026-04-22','published',false,true),
  ('aaaaaaaa-0000-4000-8000-000000000004','Women Entrepreneurs Mentorship Programme','women-entrepreneurs-mentorship-programme','mentorship','MCCI MSME Unit','Demonstration support programme.','Registered Maldivian business (criteria to be confirmed).','2026-05-23','published',false,true),
  ('aaaaaaaa-0000-4000-8000-000000000005','Island Business Development Grant — Demo','island-business-development-grant-demo','grant','Development partner (placeholder)','Demonstration support programme.','Registered Maldivian business (criteria to be confirmed).','2026-06-24','published',false,true),
  ('aaaaaaaa-0000-4000-8000-000000000006','Business Compliance Helpdesk','business-compliance-helpdesk','advisory','MCCI Secretariat','Demonstration support programme.','Registered Maldivian business (criteria to be confirmed).','2026-02-25','published',false,true)
on conflict (id) do nothing;

-- --------------------------------- PARTNERS ---------------------------------
insert into public.partners (id, name, slug, partner_type, website, display_order, active, is_demo) values
  ('bbbbbbbb-0000-4000-8000-000000000001','Banking Partner','banking-partner','Patron partner','https://example.test',1,true,true),
  ('bbbbbbbb-0000-4000-8000-000000000002','Telecommunications Partner','telecommunications-partner','Patron partner','https://example.test',2,true,true),
  ('bbbbbbbb-0000-4000-8000-000000000003','Development Partner','development-partner','Strategic partner','https://example.test',3,true,true),
  ('bbbbbbbb-0000-4000-8000-000000000004','Education Partner','education-partner','Strategic partner','https://example.test',4,true,true),
  ('bbbbbbbb-0000-4000-8000-000000000005','Logistics Partner','logistics-partner','Strategic partner','https://example.test',5,true,true),
  ('bbbbbbbb-0000-4000-8000-000000000006','International Chamber Partner','international-chamber-partner','Strategic partner','https://example.test',6,true,true)
on conflict (id) do nothing;

-- ------------------------------ MEMBER NOTICES ------------------------------
insert into public.member_notices (id, title, body_markdown, audience_type, published_at, status) values
  ('cccccccc-0000-4000-8000-000000000001','Membership renewal window opens 1 February','Renewal invoices for the 2026 subscription period will be issued from 1 February.','all_members','2026-01-16T00:00:00Z','published'),
  ('cccccccc-0000-4000-8000-000000000002','Council nomination forms now available','Members participating in industry councils may submit nominations.','all_members','2026-01-08T00:00:00Z','published'),
  ('cccccccc-0000-4000-8000-000000000003','Updated member directory listing guidance','Only information marked public is displayed on the website.','all_members','2025-12-15T00:00:00Z','published')
on conflict (id) do nothing;

-- ------------------------------- SITE SETTINGS ------------------------------
insert into public.site_settings (key, value, public) values
  ('contact', '{"address":"Office address to be confirmed, Malé","phone":"Telephone to be confirmed","general_email":"info@mcci-demo.test","membership_email":"membership@mcci-demo.test","events_email":"events@mcci-demo.test","office_hours":"Sunday – Thursday, 09:00 – 16:00 (placeholder)"}', true),
  ('social', '{"facebook":"","linkedin":"","x":"","youtube":""}', true),
  ('legal', '{"legal_name":"Maldives National Chamber of Commerce & Industry","registration_details":"Registration details to be confirmed"}', true),
  ('seo', '{"default_description":"The Maldives National Chamber of Commerce & Industry represents business, strengthens industries and advocates for a more competitive Maldivian economy."}', true),
  ('stats', '{"members":"420+","councils":"5","atolls":"26","years":"30+","note":"Demo values requiring official verification"}', true),
  ('banking', '{"note":"Bank account details are intentionally empty. Enter them here before launch."}', false)
on conflict (key) do nothing;
