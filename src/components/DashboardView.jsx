"use client";

import {useEffect,useState} from "react";


export default function DashboardView(){


const [data,setData]=useState({
flights:0,
passengers:0,
aircraft:0,
cost:0
});


useEffect(()=>{


async function load(){


const flights=
await fetch("/api/flights")
.then(r=>r.json());


const passengers=
await fetch("/api/passengers")
.then(r=>r.json());


const fleet=
await fetch("/api/fleet")
.then(r=>r.json());


setData({

flights:flights.length,

passengers:passengers.length,

aircraft:
new Set(
fleet.map(x=>x.Aircraft_ID)
).size,


cost:
fleet.reduce(
(a,b)=>a+(b.Cost||0),
0
)

});


}


load();


},[]);



const cards=[

["Flights",data.flights,"✈"],

["Passengers",data.passengers,"👥"],

["Aircraft",data.aircraft,"🛩"],

["Maintenance",`₹${data.cost}`,"🔧"]

];


return (

<div>


<h1 className="text-3xl font-bold mb-8">
Airport Control Dashboard
</h1>



<div className="grid grid-cols-4 gap-6">


{
cards.map(card=>(

<div
key={card[0]}
className="
rounded-2xl
bg-slate-900
p-6
border border-slate-700
shadow-xl
"
>


<div className="text-4xl">
{card[2]}
</div>


<div className="text-gray-400 mt-4">
{card[0]}
</div>


<div className="text-3xl font-bold">
{card[1]}
</div>


</div>

))
}


</div>


</div>

)

}