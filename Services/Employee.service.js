// const accountsettingRepository = require('../../DataAccess/accountSetting.repo');
var fs = require('fs');
class EmployeeService {

      async getAllEmployees() {
         return new Promise((resolve, reject) => {
            fs.readFile('./Files/Employees.json', 'utf8',  async function readFileCallback(err, data){
                if (err){
                            console.log(err);
                            return await {Message:"Failed to add Employee"};
                        } else {
                            var employees = JSON.parse(data);
                            resolve({
                                "employees": employees.table
                            });//now it an object
                        }
                    });
                });

    }

    async addEmployee(employee) {     
        return new Promise((resolve, reject) => {    
         fs.readFile('./Files/Employees.json', 'utf8', async function readFileCallback(err, data){
            if (err){
                console.log(err);
                reject({Message:"Failed to add Employee"});
            } else {
            var employees = JSON.parse(data); //now it an object
            employees.table.push(employee); //add some data
            var json = JSON.stringify(employees); //convert it back to json
            fs.writeFile('./Files/Employees.json', json, 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                    reject({Message:"Failed to add Employee"});
                } else {
                    console.log("Successfully written");
                    resolve({Message:"Successfully added employee"});
                }
            }); // write it back 
        }});
    });
                  
    }

    async updateEmployee(employee) {
        return await { "id": 1, "name": "Employee1" };
    }
    async deleteEmployee(id) {
        return await { "id": 1, "name": "Employee1" };
    }


}

module.exports = EmployeeService;