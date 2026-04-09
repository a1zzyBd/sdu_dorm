-- ====================================
-- SDU Dorm: Updated Seed Data SQL Script
-- ====================================
-- Creates: 21 students (20 students + 1 coordinator)
-- Password for all users: password123 (hashed with Argon2)
-- NEW: Added school, university_email, personal_email, status, degree, special_room
-- ====================================

-- Clean existing data (if any)
TRUNCATE TABLE room_assignments, explanations, rooms, students CASCADE;

-- ====================================
-- 1. CREATE STUDENTS (20 students)
-- ====================================
-- Password hash for "password123" using Argon2
-- Note: university_email is used for login, personal_email is optional

INSERT INTO students (
    student_id, fullname, birthdate, specialty, course, 
    email, university_email, personal_email, school,
    gender, access, password_hash, violation_count, created_at, 
    iin, iban, doc_type, doc_number, doc_issue_date, local_address, account_status,
    status, degree, special_room
) VALUES

-- Block A Students (Male) - Assigned
('22B030001', 'Nurzhan Aitanov', '2004-03-15', 'Computer Science', '2', 
 'nurzhan.aitanov@stu.sdu.edu.kz', 'nurzhan.aitanov@stu.sdu.edu.kz', 'nurzhan.aitanov04@gmail.com', 'NIS Almaty',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 '040315123456', 'KZ123456789012345678', 'ID Card', 'N12345678', '2020-01-15', 'Almaty, Nauryzbay district', 'active',
 NULL, NULL, NULL),

('22B030002', 'Timur Serikbayev', '2003-07-22', 'Information Systems', '3', 
 'timur.serikbayev@stu.sdu.edu.kz', 'timur.serikbayev@stu.sdu.edu.kz', 'timur.serik22@gmail.com', '№35 zhalpy mektep',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 '030722234567', 'KZ234567890123456789', 'Passport', 'N23456789', '2019-05-20', 'Astana, Esil district', 'active',
 NULL, NULL, NULL),

('22B030003', 'Arman Nurgaliyev', '2004-11-08', 'Software Engineering', '2', 
 'arman.nurgaliyev@stu.sdu.edu.kz', 'arman.nurgaliyev@stu.sdu.edu.kz', 'arman.nurgaliev@mail.ru', 'Bilim Innovation Lyceum',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030004', 'Dias Kenjebayev', '2003-05-12', 'Computer Science', '3', 
 'dias.kenjebayev@stu.sdu.edu.kz', 'dias.kenjebayev@stu.sdu.edu.kz', 'dias.kenj03@gmail.com', 'School #147 Almaty',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030005', 'Bekzat Omarov', '2004-09-30', 'Information Systems', '2', 
 'bekzat.omarov@stu.sdu.edu.kz', 'bekzat.omarov@stu.sdu.edu.kz', 'b.omarov2004@inbox.ru', 'Daryn School',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

-- Block B Students (Female) - Assigned
('22B030006', 'Aigerim Suleimenova', '2004-02-18', 'Computer Science', '2', 
 'aigerim.suleimenova@stu.sdu.edu.kz', 'aigerim.suleimenova@stu.sdu.edu.kz', 'aigulaltynbaeva07@gmail.com', '№35 zhalpy mektep',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 '040218345678', 'KZ345678901234567890', 'ID Card', 'N34567890', '2020-03-10', 'Shymkent, Abay district', 'active',
 NULL, NULL, NULL),

('22B030007', 'Dariya Kassymova', '2003-12-05', 'Software Engineering', '3', 
 'dariya.kassymova@stu.sdu.edu.kz', 'dariya.kassymova@stu.sdu.edu.kz', 'dariya.kass03@gmail.com', 'Haileybury Almaty',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030008', 'Asel Zhaksylykova', '2004-06-20', 'Information Systems', '2', 
 'asel.zhaksylykova@stu.sdu.edu.kz', 'asel.zhaksylykova@stu.sdu.edu.kz', 'asel.zh2004@mail.ru', 'School №165',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030009', 'Kamila Bektasova', '2003-08-14', 'Computer Science', '3', 
 'kamila.bektasova@stu.sdu.edu.kz', 'kamila.bektasova@stu.sdu.edu.kz', 'kamila.bektas@gmail.com', 'BIL Astana',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030010', 'Saule Amangeldiyeva', '2004-04-25', 'Software Engineering', '2', 
 'saule.amangeldiyeva@stu.sdu.edu.kz', 'saule.amangeldiyeva@stu.sdu.edu.kz', 'saule.aman04@inbox.kz', 'NIS Kokshetau',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030011', 'Zhanel Tursynbayeva', '2003-10-03', 'Information Systems', '3', 
 'zhanel.tursynbayeva@stu.sdu.edu.kz', 'zhanel.tursynbayeva@stu.sdu.edu.kz', 'zhanel.t2003@gmail.com', 'Kazakh-Turkish Lyceum',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030012', 'Madina Kenzhebekova', '2004-01-17', 'Computer Science', '2', 
 'madina.kenzhebekova@stu.sdu.edu.kz', 'madina.kenzhebekova@stu.sdu.edu.kz', 'madina.k17@mail.ru', 'School №18 Astana',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

-- Unassigned Students (Male)
('22B030013', 'Yerlan Zhumabekov', '2004-07-11', 'Software Engineering', '2', 
 'yerlan.zhumabekov@stu.sdu.edu.kz', 'yerlan.zhumabekov@stu.sdu.edu.kz', 'yerlan.zh11@gmail.com', 'RFMS Almaty',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030014', 'Aidar Akhmetov', '2003-09-28', 'Information Systems', '3', 
 'aidar.akhmetov@stu.sdu.edu.kz', 'aidar.akhmetov@stu.sdu.edu.kz', 'aidar.a28@inbox.ru', 'Miras School',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

-- Unassigned Students (Female)
('22B030015', 'Aizhan Ospanova', '2004-05-06', 'Computer Science', '2', 
 'aizhan.ospanova@stu.sdu.edu.kz', 'aizhan.ospanova@stu.sdu.edu.kz', 'aizhan.osp06@gmail.com', 'NIS Taldykorgan',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030016', 'Aliya Mukasheva', '2003-11-19', 'Software Engineering', '3', 
 'aliya.mukasheva@stu.sdu.edu.kz', 'aliya.mukasheva@stu.sdu.edu.kz', 'aliya.muk19@mail.kz', 'School №128 Shymkent',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

-- Additional Students for testing
('22B030017', 'Daniyar Karimov', '2004-03-22', 'Computer Science', '2', 
 'daniyar.karimov@stu.sdu.edu.kz', 'daniyar.karimov@stu.sdu.edu.kz', 'daniyar.k22@gmail.com', 'IT School',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030018', 'Gulnara Suleimenova', '2003-08-09', 'Information Systems', '3', 
 'gulnara.suleimenova@stu.sdu.edu.kz', 'gulnara.suleimenova@stu.sdu.edu.kz', 'gulnara.sul09@gmail.com', 'Qostanay Daryn',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030019', 'Erasyl Mukanov', '2004-12-01', 'Software Engineering', '2', 
 'erasyl.mukanov@stu.sdu.edu.kz', 'erasyl.mukanov@stu.sdu.edu.kz', 'erasyl.m01@inbox.kz', 'KTL Shymkent',
 'male', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL),

('22B030020', 'Aruzhan Toktamysova', '2003-06-15', 'Computer Science', '3', 
 'aruzhan.toktamysova@stu.sdu.edu.kz', 'aruzhan.toktamysova@stu.sdu.edu.kz', 'aruzhan.tok15@gmail.com', 'Zerde Lyceum',
 'female', 'student', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(), 
 NULL, NULL, NULL, NULL, NULL, NULL, 'active',
 NULL, NULL, NULL);


-- ====================================
-- 2. CREATE COORDINATOR (1 user)
-- ====================================
INSERT INTO students (
    student_id, fullname, birthdate, specialty, course, 
    email, university_email, personal_email, school,
    gender, access, password_hash, violation_count, created_at, 
    iin, iban, doc_type, doc_number, doc_issue_date, local_address, account_status,
    status, degree, special_room
) VALUES
('COORD001', 'Altynai Bekturova', '1985-05-12', 'Physics', 'M2', 
 'coordinator@sdu.edu.kz', 'coordinator@sdu.edu.kz', 'altynai.bekturova@gmail.com', NULL,
 'female', 'coordinator', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Zm95eUZ5VlpjeURpSjBlRXVGYzdDdQ$G/l1YmXnmbpnqNz+6VZ945Qwh3q0baZkN5Axo0oh7bA', 0, NOW(),
 '850512456789', 'KZ456789012345678901', 'Passport', 'N45678901', '2018-01-10', 'Kaskelen, SDU Campus', 'active',
 'Coordinator of B block', 'M2', 'B418');


-- ====================================
-- 3. CREATE ROOMS
-- ====================================
-- Block A: Rooms for male students (Floors 1-3)
INSERT INTO rooms (room_number, block, floor, max_capacity, status, gender) VALUES
-- Floor 1
('A101', 'A', 1, 4, 'active', 'male'),
('A102', 'A', 1, 4, 'active', 'male'),
('A103', 'A', 1, 4, 'active', 'male'),
('A104', 'A', 1, 4, 'active', 'male'),
('A105', 'A', 1, 4, 'active', 'male'),

-- Floor 2
('A201', 'A', 2, 4, 'active', 'male'),
('A202', 'A', 2, 4, 'active', 'male'),
('A203', 'A', 2, 4, 'active', 'male'),
('A204', 'A', 2, 4, 'active', 'male'),
('A205', 'A', 2, 4, 'active', 'male'),

-- Floor 3
('A301', 'A', 3, 4, 'active', 'male'),
('A302', 'A', 3, 4, 'active', 'male'),
('A303', 'A', 3, 4, 'active', 'male'),
('A304', 'A', 3, 4, 'maintenance', 'male'),  -- In maintenance
('A305', 'A', 3, 4, 'active', 'male');

-- Block B: Rooms for female students (Floors 1-4)
INSERT INTO rooms (room_number, block, floor, max_capacity, status, gender) VALUES
-- Floor 1
('B101', 'B', 1, 4, 'active', 'female'),
('B102', 'B', 1, 4, 'active', 'female'),
('B103', 'B', 1, 4, 'active', 'female'),
('B104', 'B', 1, 4, 'active', 'female'),
('B105', 'B', 1, 4, 'active', 'female'),

-- Floor 2
('B201', 'B', 2, 4, 'active', 'female'),
('B202', 'B', 2, 4, 'active', 'female'),
('B203', 'B', 2, 4, 'active', 'female'),
('B204', 'B', 2, 4, 'active', 'female'),
('B205', 'B', 2, 4, 'active', 'female'),

-- Floor 3
('B301', 'B', 3, 4, 'active', 'female'),
('B302', 'B', 3, 4, 'active', 'female'),
('B303', 'B', 3, 4, 'active', 'female'),
('B304', 'B', 3, 4, 'active', 'female'),
('B305', 'B', 3, 4, 'active', 'female'),

-- Floor 4 (special rooms for coordinator and guests)
('B401', 'B', 4, 2, 'active', 'female'),
('B402', 'B', 4, 2, 'active', 'female'),
('B418', 'B', 4, 1, 'active', 'female');  -- Special room for coordinator


-- ====================================
-- 4. CREATE ROOM ASSIGNMENTS
-- ====================================
INSERT INTO room_assignments (student_id, room_id, assigned_at) VALUES
-- Male students in Block A
('22B030001', 'A301', NOW()),
('22B030002', 'A301', NOW()),
('22B030003', 'A302', NOW()),
('22B030004', 'A303', NOW()),
('22B030005', 'A303', NOW()),

-- Female students in Block B
('22B030006', 'B301', NOW()),
('22B030007', 'B301', NOW()),
('22B030008', 'B302', NOW()),
('22B030009', 'B303', NOW()),
('22B030010', 'B303', NOW()),
('22B030011', 'B201', NOW()),
('22B030012', 'B202', NOW());


-- ====================================
-- 5. CREATE EXPLANATIONS
-- ====================================

INSERT INTO explanations (student_id, explanation_text, status, created_at, reviewed_at) VALUES
-- Nurzhan: 1 approved + 1 pending = violation_count will be 1
('22B030001', 'I was late for curfew because my train was delayed. I have a ticket as proof.', 'approved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
('22B030001', 'I accidentally made noise after quiet hours while studying for exams. It won''t happen again.', 'pending', NOW() - INTERVAL '2 days', NULL),

-- Timur: 1 approved = violation_count will be 1
('22B030002', 'I forgot to sign out when visiting a friend in another block. My apologies.', 'approved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),

-- Dariya: 1 rejected + 2 approved + 1 pending = violation_count will be 2
('22B030007', 'I had guests without permission because it was an emergency family visit.', 'rejected', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
('22B030007', 'I was sick and couldn''t clean my room on time. Here is my medical certificate.', 'approved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
('22B030007', 'I was late returning to dorm after the allowed time. I apologize.', 'approved', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('22B030007', 'I apologize for the noise complaint. I was celebrating my birthday with roommates.', 'pending', NOW() - INTERVAL '1 day', NULL),

-- Asel: 1 approved + 1 rejected = violation_count will be 1
('22B030008', 'I missed the room inspection because I was at the hospital. Attaching documents.', 'approved', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),
('22B030008', 'I brought a pet temporarily while finding it a home. I understand it''s against rules.', 'rejected', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days');


-- ====================================
-- 6. UPDATE VIOLATION COUNTS
-- ====================================

UPDATE students
SET violation_count = (
    SELECT COUNT(*)
    FROM explanations
    WHERE explanations.student_id = students.student_id
      AND explanations.status = 'approved'
);

-- Update account_status to 'blocked' for students with 3+ violations
UPDATE students
SET account_status = 'blocked'
WHERE violation_count >= 3;

-- ====================================
-- End of Seed Data
-- ====================================
