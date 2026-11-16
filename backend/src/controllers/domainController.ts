import { Request, Response } from "express";
import { getDomains } from "../services/domainService.js";


export async function domainController(req: Request, res: Response) {
    try {
        const domains = await getDomains();
        res.status(200).json(domains);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to retrieve domains"
        })
    }
}