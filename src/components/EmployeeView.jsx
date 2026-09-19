"use client";

import {useEffect,useState} from "react";


export default function EmployeeView(){


const [employees,setEmployees]=useState([]);



useEffect(()=>{

fetch("/api/employees")
.then(r=>r.json())
.then(setEmployees);

},[]);



return (

<div>

<h1 className="text-3xl font-bold mb-6">
Crew & Employees
</h1>


<div className="grid grid-cols-3 gap-5">


{
employees.map(e=>(


<div
key={e.Emp_ID}
className="
bg-slate-900
rounded-xl
p-5
border border-slate-700
"
>

<h2 className="font-bold text-xl">

{e.F_Name} {e.L_Name}

</h2>


<p>
Role : {e.Role}
</p>


<p>
Airline : {e.Airline}
</p>


<p className="mt-3">
📧 {e.Emails}
</p>


</div>


))
}


</div>


</div>

)

}