import client from "./client";

export async function fetchBoard() {
    const response = await client.get("/api/board");
    return response;
}