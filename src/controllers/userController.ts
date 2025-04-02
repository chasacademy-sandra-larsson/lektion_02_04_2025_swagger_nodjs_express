import { Request, Response } from "express"
import { prisma } from "../config/db"


/**
 * @openapi
 * /users:
 *   post:
 *     description: Create a new user
 *     responses:       
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:                   
 *         description: Internal server error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user    
 *             required:        
 *               - email
 *               - password 
 *             example: 
 *               email: "test@test.com"
 *               password: "password"  
 *     tags:
 *          - users
 * 
 */

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

/**
 * @openapi 
 * /users/{id}:
 *   get:
 *     description: Get a user by ID
 *     responses:
 *       200:
 *         description: User fetched successfully   
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     tags:
 *       - users
 *     
 */
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

/**
 * @openapi
 * /users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:           
 *         description: Users fetched successfully
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 *     parameters:  
 *       - name: limit
 *         in: query
 *         description: The number of users to fetch
 *         required: false
 *         schema:
 *           type: number
 *           example: 10
 *       - name: page   
 *         in: query
 *         description: The page number
 *         required: false
 *         schema:
 *           type: number
 *           example: 0
 *       - name: sortOrder
 *         in: query
 *         description: The order of the users
 *         required: false
 *         schema:
 *           type: string
 *           example: "asc"
 *       - name: sortBy (optional)
 *         in: query
 *         description: The field to sort by
 *         required: false
 *         schema:
 *           type: string
 *           example: "email"
 *     tags:
 *       - users
 */
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

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     description: Update a user by ID
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             required:
 *               - email
 *             example:
 *               email: "test@test.com"
 *               password: "password"
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     tags:
 *       - users
 * 
 */

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

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     description: Delete a user by ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error   
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     tags:
 *       - users
 */



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

