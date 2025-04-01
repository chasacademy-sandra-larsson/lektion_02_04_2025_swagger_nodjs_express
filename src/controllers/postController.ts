import {Request, Response } from "express"

import { prisma } from "../config/db"


// CREATE
export const createPostByUser = async (req: Request, res: Response) => {

    const { title, content, userId } = req.body;


    try {

        const result = await prisma.post.create({
            data: {
                title: title,
                content: content,
                authorId: parseInt(userId)
            }
        })

        if(result) {
            res.status(201).json({ message: "Post created successfully", post: result})
        } else {
            res.status(400).json({error: "Post creation failed"})
        }

    } catch(error) {
        res.status(500).json({error: "Internal Server error"});

    }

};





// READ MANY
export const getPostsByUser = async (req: Request, res: Response) => {


    const { userId } = req.body;
    // TODO: ersätt i auth-hantering

    try {

        const result = await prisma.post.findMany({
            where: {
                authorId: parseInt(userId)
            }
        })

        if(result) {
            res.status(200).json({message: "Posts fetched successfully", result: result});
        } else {
            res.status(404).json({error: "Posts not found"});
        }
      

    } catch(error) {
        res.status(500).json({error: "Internal Server error"});

    }

};




// READ ONE
export const getPostByUser = async (req: Request, res: Response) => {

      const { postId } = req.params;
      const { userId } = req.body;   // TODO: ersätt i auth-hantering


    try {


        const result = await prisma.post.findUnique({
            where: {
                id: parseInt(postId),
  
            }
        })

        if(result) {
            res.status(200).json({message: "Post fetched successfully", result: result})
        } else {
            res.status(404).json({error: "Post not found"})
        }


    } catch(error) {
        res.status(500).json({error: "Internal Server error"});

    }

};



// UPDATE
export const updatePostByUser = async (req: Request, res: Response) => {


    const { postId } = req.params;
    const { title, content, userId } = req.body;   // TODO: ersätt i auth-hantering

    try {
      
 
        const result = await prisma.post.update({   
            where: {
                id: parseInt(postId)
            },
            data: {
                title: title,
                content: content
            }
        })

        if(result) {
            res.status(200).json({message: "Post updated successfully"})
        } else {
            res.status(404).json({error: "Post not found"})
        }

    } catch(error) {
        res.status(500).json({error: "Internal Server error"});

    }

};



// DELETE
export const deletePostByUser = async (req: Request, res: Response) => {


    const { postId } = req.params;
    const { userId } = req.body;   // TODO: ersätt i auth-hantering


    try {

        const result = await prisma.post.delete({
            where: {
                id: parseInt(postId)
            }
        })

        if(result) {
            res.status(200).json({message: "Post deleted successfully"})
        } else {
            res.status(404).json({error: "Post not found"})
        }
        

    } catch(error) {
        res.status(500).json({error: "Internal Server error"});

    }

};