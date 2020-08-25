const express = require('express')
const app = express()
const { db, Employees, Departments } = require('./db')
const path = require('path')
const faker = require('faker')

app.use(express.json())
app.use(express.urlencoded( { extended: false }))

app.use('/dist',express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname,'./public')))

app.get('/',(req,res,next) => {
    try{
        res.sendFile(path.join(__dirname,'index.html'))
    } catch(error) { next(error) } 
})

app.get('/api',async (req,res,next) => {
    try{
        const departments = await Departments.findAll()
        const employees = await Employees.findAll()
        
        const EmpDepts = await Departments.findAll({
            include: Employees
        })
        res.send(EmpDepts)
    }catch(error) { next(error) }
})

app.get('/api/employees', async(req,res,next) => {
    try{
        const employees = await Employees.findAll()
        res.send(employees)
    } catch(error){ next(error) }
})

app.get('/api/departments', async(req,res,next) => {
    try{
        const departments = await Departments.findAll()
        res.send(departments)
    } catch(error){ next(error) }
})

app.delete('/api/employees/',async(req,res,next) => {
    const deleted = req.body.emp
    await Employees.destroy({
        where: {
            id: deleted.id
        }
    })
    res.send(await Employees.findAll())
})

app.delete('/api/departments',async(req,res,next)=> {
    const deleted = req.body.dept
    await Departments.destroy({
        where: {
            id: deleted.id
        }
    })
    res.send(await Departments.findAll())
})

app.put('/api/employees/:id',async (req,res,next) => {
    try{
        const updatedId = req.params.id
        const updated = await Employees.findOne({
            where: {
                id: updatedId
            }
        })
        const departments = await Departments.findAll()
        
      if(updated.departmentId) {
        await updated.update(
            { departmentId: null },
            {
                where: {
                id: updatedId
            }
            }
        )
      }
      else {
          console.log('null!')
          console.log('length',departments.length)
          await updated.update(
            { departmentId: Math.floor(Math.random() * departments.length) + 1  },
            { 
                where: {
                    id: updatedId
                }
            }
        )
    }
    res.send(await Employees.findAll())
    }catch(error){ next(error) }
})

app.post('/api/employees',async (req, res, next) => {
    try{
        const newEmployee = await Employees.create({name: faker.name.firstName()})
        res.send(await Employees.findAll())
    } catch(err){ next(err) }
})

app.post('/api/departments',async(req,res,next) => {
    try{
        const newDepartment = await Departments.create( {deptname: faker.commerce.department()} )
        res.send(await Departments.findAll())
    } catch(error){ next(error) }
})

async function init(){
    try{
        console.log('syncing')
        await db.sync()
        const PORT = process.env.PORT || 3000
        await app.listen(PORT,function(){
            console.log(`Listening at http://localhost:${PORT}`);
        })
    } catch(error) { console.error(error) }
}
init()