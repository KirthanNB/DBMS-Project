"use client";

import {useEffect,useState} from "react";


export default function FlightsView(){

const [flights,setFlights]=useState([]);


useEffect(()=>{

fetch("/api/flights")
.then(res=>res.json())
.then(data=>setFlights(data));

},[]);



return (

<div>

<h1 className="text-3xl font-bold mb-6">
Flight Operations
</h1>


<div className="overflow-x-auto">

<table className="w-full bg-slate-900 rounded-xl overflow-hidden">

<thead className="bg-slate-800">

<tr>

<th className="p-4">Flight</th>
<th>Airline</th>
<th>Aircraft</th>
<th>Status</th>
<th>Departure</th>
<th>Arrival</th>

</tr>

</thead>


<tbody>

{
flights.map(f=>(

<tr
key={f.Flight_ID}
className="border-t border-slate-700"
>

<td className="p-4">
{f.Flight_ID}
</td>


<td>
{f.Airline}
</td>


<td>
{f.Model}
</td>


<td>

<span className="
px-3 py-1 rounded-full
bg-blue-600
">

{f.Status}

</span>

</td>


<td>
{f.Dept_Time}
</td>


<td>
{f.Arrival_Time}
</td>


</tr>

))
}

</tbody>

</table>

</div>


</div>

)

}