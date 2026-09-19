"use client";

import {useEffect,useState} from "react";


export default function PassengerView(){


const [passengers,setPassengers]=useState([]);



useEffect(()=>{

fetch("/api/passengers")
.then(r=>r.json())
.then(setPassengers);

},[]);



return (

<div>


<h1 className="text-3xl font-bold mb-6">
Passenger Records
</h1>



<div className="grid grid-cols-3 gap-5">


{
passengers.map(p=>(


<div
key={p.Pass_ID}
className="
bg-slate-900
border border-slate-700
rounded-xl
p-5
"
>


<h2 className="text-xl font-bold">
{p.Name}
</h2>


<p>
ID : {p.Pass_ID}
</p>


<p>
Nationality : {p.Nationality}
</p>


<p>
Gender : {p.Gender}
</p>


<p>
Age : {p.Age}
</p>


<div className="mt-3">

<p className="text-gray-400">
Phone Numbers
</p>

<p>
{p.Phone_Numbers || "No phone"}
</p>

</div>


</div>


))
}


</div>


</div>

)

}