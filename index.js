//Required external modules
const connection = require("./db/connectiondb");
const inquirer = require("inquirer");
const cTable = require("console.table");

//Functions to prompt users to view, update or change employees
const startPrompt = function() {
    inquirer.prompt({
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add employee",
          "add department",
          "add role",
          "update employee role",
        ]
    })
    .then(function(answer){
       switch (answer.start) {
           case "view all departments":
               viewDepartments();
               break;
            case "view all roles":
                viewRoles();
                break;
            case "view all employees":
                viewEmployees();
                break;
            case "add employee":
                addEmployee();
                break;
            case "add department":
                addDepartment();
                break;
            case "add role":
                addRole();
                break;
            case "update employee role":
                updateRole();
                break;
        
        } 
    }); 
};

//get departments from database
function viewDepartments() {
    connection.query("SELECT * FROM department", function(err,answer){
        console.log("\n Departments from Database \n");
        console.table(answer);
    });
    startPrompt();
}
  
//get roles from database
function viewRoles() {
    connection.query("SELECT * FROM role", function(err,answer){
        console.log("\n Roles from Database \n");
        console.table(answer);
    });
    startPrompt();
}
  
//get employees from database
function viewEmployees() {
    const allInfo = "SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;";
    connection.query(allInfo, function(err, answer){
       console.log("\n List of Employees from database \n");
       console.table(answer);
    });
    startPrompt();
}

//add employees
function addEmployee() {
    inquirer.prompt([
        {
            type:"input",
            message: "Enter employee's first name",
            name:"firstname"
        },
        {
            type:"input",
            message: "Enter employee's last name",
            name:"lastname"
        },

    ]).then(answer => {
        connection.query("INSERT INTO employee SET ?",{
            first_name: answer.firstname,
            lastname: answer.lastname,
            role_id: null,
            manager_id: null

        },
        function(err,answer){
            if (err){
                throw err;
            }
            console.table(answer);
        }
        );
        startPrompt();
    });
}

//add department
function addDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What department would you like to add?",
        name: "depo_name"
    },
    ]).then(answer => {
        connection.query("INSERT INTO department SET ?",{
            name:answer.depo_name
        },function(err, answer){
            if(err){
                throw err;
            }
        }
        ),
        console.table(answer);
        startPrompt();
    });
}

//add role
function addRole() {
    inquirer.prompt([{
        type: "input",
        message: "Enter employee's role",
        name: "add_role"
    },
    {
        type: "input",
        message: "Enter employee's salary",
        name: "add_salary"
    },
    {
        type: "input",
        message: "Enter employee's department",
        name: "add_depo"
    }
    ]).then(answer => {
        connection.query("INSERT INTO role SET ?",{
            title:answer.add_role,
            salary: answer.add_salary,
            department_id: answer.add_depo


        },
        function(err, answer){
            if(err){
                throw err;
            }
        }
        ),
        console.table(answer);
        startPrompt();
    });
    
}

//update employees
function updateRole() {
    let allemp = [];
    connection.query("SELECT * FROM employee", function(err, answer) {
      for (let i = 0; i < answer.length; i++) {
        let employeeString =
          answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
        allemp.push(employeeString);
    }
    inquirer.prompt([{
        type: "list",
        name: "updateRole",
        message: "select employee to update role",
        choices: allemp
    },
    {
        type: "list",
        message: "select new role",
        choices: ["manager", "employee"],
        name: "newrole"
    }
    ]).then(answer => {
        console.log("about to update", answer);
        const idToUpdate = {};
        idToUpdate.employeeId = parseInt(answer.updateRole.split(" ")[0]);
          if (answer.newrole === "manager") {
            idToUpdate.role_id = 1;
          } else if (answer.newrole === "employee") {
            idToUpdate.role_id = 2;
          }
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [idToUpdate.role_id, idToUpdate.employeeId],
            function(err, data) {
              startPrompt();
            }
          );
        });
    });
}

module.exports = {start:startPrompt()}