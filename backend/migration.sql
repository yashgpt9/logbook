USE machine_logbook;

ALTER TABLE logs CHANGE operator_name employee_name VARCHAR(255) NOT NULL;
ALTER TABLE logs ADD COLUMN employee_code VARCHAR(100) AFTER employee_name;
ALTER TABLE logs ADD COLUMN type_of_work ENUM('Mechanical', 'Electrical', 'Software', 'General') DEFAULT 'General' AFTER employee_code;
ALTER TABLE logs ADD COLUMN part_used VARCHAR(255) AFTER type_of_work;
ALTER TABLE logs ADD COLUMN time_taken INT AFTER part_used;
