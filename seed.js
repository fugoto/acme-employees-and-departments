const { Employees, Departments, db } = require ('./db')
const faker = require('faker')

//manual checking of unique here given errors i was getting, but given we have specified unique condition on db, is there a better way of doing this? to cover in an office hour
const seedDepartments = []
const deptnames=[]
while(seedDepartments.length<=5) {
    const deptname = faker.commerce.department()
    if(!deptnames.includes(deptname)) {
        deptnames.push(deptname)
        seedDepartments.push({
            deptname
          })
    }
}

const seedEmployees = []
for(let i = 1; i <= 50; i++) {
    seedEmployees.push(
        {
            name: faker.name.firstName(),
            departmentId: Math.floor(Math.random()* seedDepartments.length+1)
        }
    )
}
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
