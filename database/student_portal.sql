-- Create database
CREATE DATABASE IF NOT EXISTS student_portal;
USE student_portal;

-- Students table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    major VARCHAR(100),
    gpa DECIMAL(3,2)
);

-- Courses table
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    department VARCHAR(50) NOT NULL
);

-- Enrollment table (M-M relationship)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    grade VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id, semester)
);

-- Insert sample data
INSERT INTO students (first_name, last_name, email, enrollment_date, major, gpa)
VALUES 
('John', 'Doe', 'john.doe@uni.edu', '2022-09-01', 'Computer Science', 3.75),
('Jane', 'Smith', 'jane.smith@uni.edu', '2021-09-01', 'Biology', 3.90);

INSERT INTO courses (course_code, title, credits, department)
VALUES
('CS101', 'Introduction to Programming', 3, 'Computer Science'),
('BIO201', 'Cell Biology', 4, 'Biology'),
('MATH150', 'Calculus I', 4, 'Mathematics');

INSERT INTO enrollments (student_id, course_id, semester, grade)
VALUES
(1, 1, 'Fall 2022', 'A'),
(1, 3, 'Fall 2022', 'B+'),
(2, 2, 'Spring 2023', 'A-');
