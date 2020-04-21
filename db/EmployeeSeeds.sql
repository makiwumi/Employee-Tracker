USE employee_db

INSERT INTO department (name)
VALUES ("Front-End"), ("Back-End"),("Design"),("Marketing"),("Lead");

SELECT * FROM department

INSERT INTO role (title, salary, department_id)
VALUES("Junior Developer", 50000, 1), ("Senior Developer", 150000, 2),
("Graphic Designer", 80000, 3), ("Senior Marketer", 100000, 4), ("Project Manager", 300000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Marian", "Akiwumi", 5, null), ("Allen", "Paul", 2, 1), ("Kelly", "Brown", 1, 2), 
("Fumilayo", "Adefila", 3, 2), ("Hess Nana", "Jensen", 4, 3);


