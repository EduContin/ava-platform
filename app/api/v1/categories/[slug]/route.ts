import { NextRequest, NextResponse } from "next/server";
import database from "@/infra/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  try {
    const categoryQuery = {
      text: `
        SELECT c.id, c.name, c.description,
          (SELECT COUNT(*) FROM threads t WHERE t.category_id = c.id) AS thread_count,
          (SELECT COUNT(*) FROM posts p JOIN threads t ON p.thread_id = t.id WHERE t.category_id = c.id) AS post_count,
          (
            SELECT json_agg(sub)
            FROM (
              SELECT sc.id, sc.name, sc.description,
                (SELECT COUNT(*) FROM threads t WHERE t.category_id = sc.id) AS thread_count,
                (SELECT COUNT(*) FROM posts p JOIN threads t ON p.thread_id = t.id WHERE t.category_id = sc.id) AS post_count
              FROM categories sc
              WHERE sc.parent_id = c.id
            ) sub
          ) AS subcategories
        FROM categories c
        WHERE REGEXP_REPLACE(LOWER(c.name), '[^a-z0-9]+', '-', 'g') = $1
      `,
      values: [slug.toLowerCase()],
    };

    const text = `SELECT name,
          REGEXP_REPLACE(LOWER(name), '[^a-z0-9]+', '-', 'g') AS slug_name
          FROM categories`;

    const result_1 = await database.query(text);

    if(result_1.rows.length > 0){
      console.log("NOME DAS CATEGORIAS COM SLUG: ");
      console.log(result_1.rows);
    }

    const result = await database.query(categoryQuery);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
