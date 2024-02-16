--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE students (
  id                  INTEGER PRIMARY KEY,
  name                TEXT    NOT NULL,
  grade               TEXT    NOT NULL,
  profile_picture_url TEXT    NOT NULL
);

INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 1', '5', 'https://gravatar.com/avatar/student1?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 2', '3', 'https://gravatar.com/avatar/student2?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 3', '5', 'https://gravatar.com/avatar/student3?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 4', '5', 'https://gravatar.com/avatar/student4?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 5', '8', 'https://gravatar.com/avatar/student5?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 6', '1', 'https://gravatar.com/avatar/student6?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 7', '10', 'https://gravatar.com/avatar/student7?s=400&d=robohash&r=x');
INSERT INTO students (name, grade, profile_picture_url) VALUES ('student 8', '12', 'https://gravatar.com/avatar/student8?s=400&d=robohash&r=x');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE students;
