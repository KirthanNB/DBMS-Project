import { queryRaw } from "../../../../lib/db";


export async function POST(request) {


  const data = await request.json();


  const result = queryRaw(data.sql);


  return Response.json(result);

}