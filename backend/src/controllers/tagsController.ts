import { Request, Response } from "express";
import { getUniqueTags } from "../services/tagsService.js";


export async function uniqueTagsController(req: Request, res: Response) {
    try {
        const uniqueTags = await getUniqueTags();
        res.status(200).json(uniqueTags);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to retrieve unique tags"
        })
    }
}