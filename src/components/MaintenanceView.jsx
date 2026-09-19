"use client";

import {useEffect,useState} from "react";


export default function MaintenanceView(){


const [logs,setLogs]=useState([]);


useEffect(()=>{

fetch("/api/fleet")
.then(r=>r.json())
.then(setLogs);

},[]);



return (

<div>

<h1 className="text-3xl font-bold mb-6">
Maintenance Logs
</h1>


<table className="w-full bg-slate-900">


<thead>

<tr className="bg-slate-800">

<th className="p-3">
Aircraft
</th>

<th>
Task
</th>

<th>
Engineer
</th>

<th>
Cost
</th>

<th>
Status
</th>


</tr>

</thead>


<tbody>


{
logs.map((m,i)=>(


<tr
key={i}
className="border-t border-slate-700"
>


<td className="p-3">
{m.Aircraft_ID}
</td>


<td>
{m.Maintenance_Type}
</td>


<td>
{m.Engineer_Name}
</td>


<td>
₹{m.Cost}
</td>


<td>
{m.Status}
</td>


</tr>


))
}


</tbody>


</table>


</div>

)

}