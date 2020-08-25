import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

// function EmployeeList(props){
//     const {} = props.employees

// }

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
        this.removeEmployee = this.removeEmployee.bind(this)
        this.generateEmployee = this.generateEmployee.bind(this)
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
            <div>
            <div>
                <h3>{this.state.employees.length} Total Employees</h3>
                <button onClick={this.generateEmployee}>Generate new employee</button>
            </div>
            <div id='depts'>
                <div className='dept' id='unassigned'>
                    <h4>Employees Without Departments ({this.state.employees.filter(emp => emp.departmentId === null).length})</h4>
                    {
                        this.nullEmps().map(emp => {
                            return(
                                <div key={emp.id} className='emp'>
                                    <p>{emp.name}</p>
                                     <button className='delete' onClick={()=>this.deleteEmployee(emp)}>x</button>
                                     <button className='assign' onClick={()=>this.removeEmployee(emp)}>Assign Employee to Department</button>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    this.state.empDepts.map( dept => {
                        return(
                            <div id={dept.deptname} className='dept' key={dept.name}>
                            <h4>{dept.deptname.toUpperCase()} ({dept.employees.length})</h4>
                            {
                            dept.employees.map( emp => {
                                return(
                                    <div id={emp.id} className='emp' key={emp.id}>
                                        <p>{emp.name}</p>
                                        <button className='delete' onClick={()=>this.deleteEmployee(emp)}>x</button>
                                        <button className='remove-dept' onClick={()=>this.removeEmployee(emp)}>Remove From Department</button>
                                    </div>
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
    async removeEmployee(emp){
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
}

ReactDOM.render(
    <Main />,
    document.getElementById('app')
  );