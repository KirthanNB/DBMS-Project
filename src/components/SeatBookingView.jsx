"use client";

import {useEffect,useState} from "react";


export default function SeatBookingView(){

const [seats,setSeats]=useState([]);
const [selected,setSelected]=useState(null);
const [passenger,setPassenger]=useState("");



useEffect(()=>{

async function loadSeats(){

  const res = await fetch("/api/seats");

  const data = await res.json();

  setSeats(data);

}


loadSeats();


},[]);



async function bookSeat(){


if(!selected || !passenger)
{
alert("Select seat and passenger");
return;
}



await fetch("/api/seats",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

seat_no:selected.Seat_No,

aircraft_id:selected.Aircraft_ID,

passenger_id:passenger

})

});


alert("Seat booked");


loadSeats();


}



const rows={};


seats.forEach(s=>{


if(!rows[s.Seat_No.match(/\d+/)])
rows[s.Seat_No.match(/\d+/)] = [];


rows[s.Seat_No.match(/\d+/)].push(s);


});



return (

<div>


<h1 className="text-3xl font-bold mb-8">
Aircraft Cabin Booking
</h1>



<div className="
flex
gap-10
">


{/* Cabin */}

<div
className="
bg-slate-900
rounded-[80px]
p-10
w-[500px]
border
border-slate-700
"
>


<div className="
text-center
mb-8
text-gray-400
">
✈ FRONT OF AIRCRAFT
</div>



{

Object.entries(rows).map(([row,seats])=>(


<div
key={row}
className="
flex
justify-center
gap-3
mb-4
"
>


{
seats.map(seat=>(


<button

key={
seat.Seat_No+
seat.Aircraft_ID
}

onClick={()=>setSelected(seat)}

className={`
w-10
h-10
rounded-lg
text-sm

${
seat.Pass_ID
?
"bg-red-600"
:
"bg-green-600"
}


${
selected===seat
?
"ring-4 ring-yellow-400"
:""
}

`}

>


{seat.Seat_No}


</button>


))
}


</div>


))

}



</div>



{/* Booking Panel */}

<div
className="
bg-slate-900
p-6
rounded-xl
w-80
"
>


<h2 className="text-xl font-bold">

Booking

</h2>


<p className="mt-4">

Selected Seat:

</p>


<div className="text-blue-400">

{
selected?
selected.Seat_No:
"None"
}

</div>



<input

placeholder="Passenger ID"

value={passenger}

onChange={
e=>setPassenger(e.target.value)
}

className="
mt-5
w-full
bg-slate-800
p-3
rounded
"

/>



<button

onClick={bookSeat}

className="
mt-5
bg-blue-600
px-5
py-3
rounded
w-full
"

>

Confirm Booking

</button>


</div>



</div>


</div>

)

}