const faker = require('faker')
const Sequelize = require('sequelize')
const { STRING } = require('sequelize')
const { random } = require('faker')
const databaseUrl = process.env.DATABASE_URL || 'postgres:localhost:5432/emp-depts'
const db = new Sequelize(databaseUrl, {
    logging: false,
    operatorsAliases: false
})

const Employees = db.define('employees',{
    name: {
        type: STRING,
    },
})

const Departments = db.define('departments',{
    deptname: {
        type: STRING,
        unique: true
    }
})

Employees.belongsTo(Departments)
Departments.hasMany(Employees)

module.exports = { db, Employees, Departments } 