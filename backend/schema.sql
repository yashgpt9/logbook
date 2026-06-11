

CREATE TABLE IF NOT EXISTS sheds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `lines` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  shed_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS machines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  machine_code VARCHAR(100) NOT NULL UNIQUE,
  machine_name VARCHAR(255) NOT NULL,
  line_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (line_id) REFERENCES `lines`(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  machine_id INT NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  employee_code VARCHAR(100),
  type_of_work ENUM('Mechanical', 'Electrical', 'Software', 'General') DEFAULT 'General',
  part_used VARCHAR(255),
  time_taken INT,
  activity TEXT NOT NULL,
  remarks TEXT,
  machine_status ENUM('Running', 'Maintenance', 'Breakdown', 'Stopped') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
);
