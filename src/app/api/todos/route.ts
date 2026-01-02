import { NextResponse } from "next/server";
import { SupabaseCrudService } from "@/src/services";
import { TodoType } from "@/src/types/todoType";

const service = new SupabaseCrudService<TodoType>('todo')

export async function GET() {
  try {
    const data = await service.findAll();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload: Partial<TodoType> = await req.json();

    const data = await service.create(payload);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
