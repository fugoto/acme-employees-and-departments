import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

function EmployeeList(props){
    const {id, name} = props.emp
    return (
        <div id={id} className='emp'>
            <p>{name}</p>
            <button className='delete' onClick={()=>props.deleteEmployee(props.emp)}>x</button>
            <button className='remove-dept' onClick={()=>props.updateEmployee(props.emp)}>Remove From Department</button>
        </div>
    )
}

function Unassigned(props){
    const {id, name} = props.emp
    return(
        <div key={id} className='emp'>
            <p>{name}</p>
                <button className='delete' onClick={()=>props.deleteEmployee(props.emp)}>x</button>
                <button className='assign' onClick={()=>props.updateEmployee(props.emp)}>Assign Employee to Department</button>
        </div>
    )
}

class Main extends Component {
    constructor(){
        super()
        this.state = {
            employees : [],
            departments: [],
            empDepts:[]
        }
        this.nullEmps = this.nullEmps.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
        this.updateEmployee = this.updateEmployee.bind(this)
        this.generateEmployee = this.generateEmployee.bind(this)
        this.generateDepartment = this.generateDepartment.bind(this)
        this.deleteDepartment = this.deleteDepartment.bind(this)
    }

async componentDidMount(){
    try{
        const resDept = await axios.get('/api/departments')
        const departments = resDept.data
        this.setState( {departments} )

        const resEmpDepts = await axios.get('/api')
        const empDepts = resEmpDepts.data
        this.setState( {empDepts} )

        const resEmps = await axios.get('/api/employees')
        const employees = resEmps.data
        this.setState( {employees} )                

    } catch(error) { console.error(error) }
}

render(){
    return(
        <div id='container' key='container'>
            <div key='header'>
                <h3>{this.state.employees.length} Total Employees</h3>
                <button onClick={this.generateEmployee}>Generate new employee</button>
                <button onClick={this.generateDepartment}>Generate new department</button>
            </div>
            <div id='depts' key='depts'>
                <div className='dept' id='unassigned' key='dept'>
                    <h5>Employees Without Departments ({this.state.employees.filter(emp => emp.departmentId === null).length})</h5>
                    {
                        this.nullEmps().map(emp => {
                            return(
                                <Unassigned emp={emp} deleteEmployee={this.deleteEmployee} updateEmployee={this.updateEmployee} key={emp.id}/>
                            )
                        })
                    }
                </div>
                {
                    this.state.empDepts.map( dept => {
                        return(
                            <div id={dept.deptname} className='dept' key={dept.deptname}>
                                <h5>{dept.deptname.toUpperCase()} ({dept.employees.length})</h5>
                                <button className='delete' onClick={()=>this.deleteDepartment(dept)}>Delete Department</button>
                                {
                                dept.employees.map( emp => {
                                    return(
                                        <EmployeeList emp={emp} deleteEmployee={this.deleteEmployee} updateEmployee={this.updateEmployee} key={emp.id}/>
                                    )
                                })
                                }
                            </div>
                            )
                        })
                }
            </div>
        </div>    
    )
}
    //return array of employees with unassigned depts
    nullEmps(){
        return this.state.employees.filter(emp => emp.departmentId === null)
    }
    async deleteEmployee(emp){
        const res = await axios({
            method: 'delete',
            url: `api/employees`,
            data: {emp}
        })
        const employees = res.data
        this.setState( {employees} )

        const resEmpDepts = await axios.get('/api')
        const empDepts = resEmpDepts.data
        this.setState( {empDepts} )
    }
    //also serves to randomly assign employees to depts
    async updateEmployee(emp){
        const res = await axios.put(`/api/employees/${emp.id}`)
        const employees = res.data
        this.setState( {employees} )
        
        const resEmpDepts = await axios.get('/api')
        const empDepts = resEmpDepts.data
        this.setState( {empDepts} )
    }
    async generateEmployee(){
        const res = await axios.post('/api/employees')
        const employees = res.data
        this.setState( {employees} )

        const resEmpDepts = await axios.get('/api')
        const empDepts = resEmpDepts.data
        this.setState( {empDepts} )
    }
    async generateDepartment(){
        const res = await axios.post('/api/departments')
        const departments = res.data
        this.setState( {departments} )

        const empDepts = (await axios.get('/api')).data
        this.setState( {empDepts} )
    }
    async deleteDepartment(dept){
        const res = await axios({
            method: 'delete',
            url: `api/departments`,
            data: {dept}
        })
        const departments = res.data
        this.setState( {departments} )

        const resEmpDepts = await axios.get('/api')
        const empDepts = resEmpDepts.data
        this.setState( {empDepts} )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('app')
  );