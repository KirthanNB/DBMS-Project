"use client";


export default function Navbar({tab,setTab}){


const menus=[
 ["dashboard","Dashboard"],
 ["flights","Flights"],
 ["passengers","Passengers"],
 ["fleet","Fleet"],
 ["employees","Employees"],
 ["maintenance","Maintenance"],
 ["seats","Seats"],
 ["sql","SQL Console"]
];


async function resetDatabase(){

 await fetch("/api/init");

 alert("Database reset completed");

}


return (

<nav className="flex items-center justify-between p-5 bg-slate-900 border-b border-slate-700">


<div className="text-xl font-bold">
✈ Airline OS
</div>


<div className="flex gap-3">

{
menus.map(item=>(

<button
key={item[0]}
onClick={()=>setTab(item[0])}
className={`
px-3 py-2 rounded-lg text-sm
${tab===item[0]
?"bg-blue-600"
:"bg-slate-800"}
`}
>

{item[1]}

</button>

))
}


</div>


<button
onClick={resetDatabase}
className="bg-red-600 px-4 py-2 rounded-lg"
>
Reset DB
</button>


</nav>

)

}