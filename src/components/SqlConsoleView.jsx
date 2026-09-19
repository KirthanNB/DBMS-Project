"use client";


import {useState} from "react";


export default function SqlConsoleView(){


const [sql,setSql]=useState("");

const [result,setResult]=useState([]);



async function execute(){


const res=await fetch(
"/api/query",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
sql
})

});


const data=await res.json();


setResult(
data.rows || data
);


}



return (

<div>


<h1 className="text-3xl font-bold mb-5">

SQL Terminal

</h1>



<textarea

value={sql}

onChange={
e=>setSql(e.target.value)
}

placeholder="
SELECT * FROM Flight;
"

className="
w-full
h-40
bg-black
text-green-400
font-mono
p-5
rounded-xl
"


/>



<button

onClick={execute}

className="
mt-4
bg-green-600
px-5
py-3
rounded
"

>

Execute

</button>



<div className="
mt-8
overflow-auto
">


<table
className="
w-full
bg-slate-900
"
>


<tbody>

{
result.map(
(row,i)=>(


<tr
key={i}
className="
border-b
border-slate-700
"
>


{
Object.values(row)
.map(
(v,j)=>(

<td
key={j}
className="p-3"
>
{String(v)}
</td>

))

}


</tr>


))
}

</tbody>


</table>


</div>


</div>

)

}