const { Employees, Departments, db } = require ('./db')
const faker = require('faker')


const seedDepartments = []
for(let i = 1; i <= 5; i++) {
    seedDepartments.push({
        deptname: faker.commerce.department()
    })
}

const seedEmployees = []
for(let i = 1; i <= 50; i++) {
    seedEmployees.push(
        {
            name: faker.name.firstName(),
            // memberOf: seedDepartments[Math.floor(Math.random() * 5)]
            departmentId: Math.floor(Math.random()* seedDepartments.length+1)
        }
    )
}
console.log(seedEmployees)
async function seed(){
    try{
        console.log('seeding database')
        await db.sync( {force: true} )
        // await db.sync()
        await Departments.bulkCreate(seedDepartments)
        await Employees.bulkCreate(seedEmployees)
        await db.close()
        console.log('seeded')
    } catch(err) { console.error(err) }
}

seed()
