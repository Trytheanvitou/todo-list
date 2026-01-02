import { createClient } from "@/src/utils/supabase/client";

export class SupabaseCrudService<T> {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  private client() {
    return createClient();
  }

  //CREATE
  async create(payload: Partial<T>): Promise<T> {
    const { data, error } = await this.client()
      .from(this.table)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  //READ ALL
  async findAll(): Promise<T[]> {
    const { data, error } = await this.client()
      .from(this.table)
      .select("*").order('id');

    if (error) throw error;
    return data as T[];
  }

  //UPDATE 
  async update(
    id: number | string,
    payload: Partial<T>
  ): Promise<T> {
    const { data, error } = await this.client()
      .from(this.table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  /** DELETE */
  async delete(id: number | string): Promise<boolean> {
    const { error } = await this.client()
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
}
