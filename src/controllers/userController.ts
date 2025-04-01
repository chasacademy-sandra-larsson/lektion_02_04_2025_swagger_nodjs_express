import { Request, Response } from "express"
import { prisma } from "../config/db"



// CREATE
export const createUser = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(existingUser) {
            res.status(400).json({error: "User already exists"})
            return
        }
        
    
        const result = await prisma.user.create({
            data: {
                email: email,
                password: password
            }
        })

        if(result) {
            res.status(201).json({message: "User created successfully", user: result})
        } else {
            res.status(400).json({error: "User creation failed"})
        }

    } catch(error) {

        res.status(500).json({error: "Internal server error"});
    }

};



// READ ONE
export const getUser = async (req: Request, res: Response) => {

    // Hämta url-parameter
    const { id } = req.params;
    try {
     
        const result = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if(result) {
            res.status(200).json({message: "User fetched successfuly", user: result});
        } else {
            res.status(404).json({error: "User not found"});
        }

    } catch(error) {
        res.status(500).json({error: "Internal server error"});
    }

}


// READ MANY
export const getUsers = async (req: Request, res: Response) => {

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 0;
    //const sortBy = req.query.sortBy || "email";
    const sortOrder = req.query.sortOrder as "asc" | "desc" || "desc";

    try {


        const result = await prisma.user.findMany({
            skip: page * limit,
            take: limit,
            orderBy: {
                email: sortOrder
            }
        });

        if(result) {
            res.status(200).json({message: "Users fetched successfully", user: result});
        } else {
            res.status(404).json({error: "Users not found"});
        }

    } catch(error) {
        res.status(500).json({error: "Internal server error"});
    }

};



// UPDATE 
export const updateUser = async (req: Request, res: Response) => {

    const { id } = req.params; // URL-parameter
    const { email, password } = req.body; // Data som skickas via body (som i formulär)

    
    try {

        const result = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email: email,
                password: password
            }
        })


          if(result) {
            res.status(200).json({message: "User updated successfuly"});
          } else {
            res.status(404).json({error: "User not found"});
          }

    } catch(error) {
        res.status(500).json({error: "Internal server error"});
    }


};



// DELETE
export const deleteUser = async (req: Request, res: Response) => {

        const { id } = req.params;

        try {
            
            const result = await prisma.user.delete({
                where: {
                    id: parseInt(id)
                }
            })
    
            res.status(200).json({message: "User deleted successfully"});
    
        } catch(error) {
            res.status(500).json({error: "Internal server error"});
        }





};

