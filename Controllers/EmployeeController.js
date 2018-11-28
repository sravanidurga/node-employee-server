var Router = require('./basecontroller');
const middleware = require("../Middleware");
const RouteStub = require('../Common/routestub');
const EmployeeService = require("../Services/employee.service");
const asyncWrapper = middleware.asyncWrapper;
const syncWrapper = middleware.wrapper;
//var fs = require('fs');

class EmployeeController extends Router {
    constructor(routePath, app) {
        super(routePath, app);
        this.Service = new EmployeeService();
    }

    get services() {
        return [
            // Property Routes
            new RouteStub('GET', '/get-all-employees', 'getAllEmployees'),
            new RouteStub('POST','/add-employee','addEmployee'),
            new RouteStub('POST','/update-employee','updateEmployee'),
            new RouteStub('POST','/delete-employee','deleteEmployee'),
        ];
    }

      async getAllEmployees(req, res) {
        // var employees;
        // fs.readFile('./Files/Employees.json', 'utf8',  function readFileCallback(err, data){
        //     if (err){
        //         console.log(err);
        //         res.status(500).send(data);
        //     } else {
        //     var employees = JSON.parse(data);
        //     res.status(200).send(data);
        // }});
        const data = await asyncWrapper("Failed to Get All Employees", this.Service.getAllEmployees);
        console.log(data);
        res.status(data.statusCode).send(data);
    }
    async addEmployee(req, res) {
        const data = await asyncWrapper("Failed to Add Employee", this.Service.addEmployee,req.body);
        res.status(data.statusCode).send(data);
    }
    async updateEmployee(req, res) {
        const data = await asyncWrapper("Failed to Update Employee", this.Service.updateEmployee,req.body);
        res.status(data.statusCode).send(data);
    }
    async deleteEmployee(req, res) {
        const data = await asyncWrapper("Failed to Delete Employee", this.Service.deleteEmployee,req.body);
        res.status(data.statusCode).send(data);
    }

 
}

module.exports = EmployeeController;