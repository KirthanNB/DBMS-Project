"use client";

import {useEffect,useState} from "react";


export default function FleetView(){


const [fleet,setFleet]=useState([]);



useEffect(()=>{

fetch("/api/fleet")
.then(r=>r.json())
.then(setFleet);

},[]);



return (

<div>

<h1 className="text-3xl font-bold mb-6">
Aircraft Fleet
</h1>


<div className="grid grid-cols-3 gap-6">


{
fleet.map((a,index)=>(

<div
key={index}
className="
bg-slate-900
rounded-xl
p-6
border border-slate-700
"
>


<h2 className="text-xl font-bold">

{a.Model}

</h2>


<p>
Aircraft ID : {a.Aircraft_ID}
</p>


<p>
Manufacturer : {a.Manufacturer}
</p>


<p>
Capacity : {a.Capacity}
</p>


<hr className="my-4 border-slate-700"/>


<h3 className="font-bold">
Maintenance
</h3>


<p>
{a.Maintenance_Type || "No records"}
</p>


<p>
Engineer :
{a.Engineer_Name || "-"}
</p>


<p>
Status :
{a.Status || "-"}
</p>


<p>
Cost :
₹{a.Cost || 0}
</p>



</div>

))

}



</div>

</div>

)

}