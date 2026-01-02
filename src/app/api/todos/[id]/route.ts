import { NextResponse } from "next/server";
import { SupabaseCrudService } from "@/src/services";
import { TodoType } from "@/src/types/todoType";

const service = new SupabaseCrudService<TodoType>('todo')

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    const payload: Partial<TodoType> = await req.json();

    const data = await service.update(id, payload);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params;

    await service.delete(id);

    return NextResponse.json(
      { message: `Todo ${id} deleted successfully.` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}