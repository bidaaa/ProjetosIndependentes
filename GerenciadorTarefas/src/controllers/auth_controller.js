import { User } from "../models/user_schema.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: "Todos os campos sao necessarios." });
        }

        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "Email ja cadastrado." });
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            message: 'Usuario cadastrado com sucesso',
            userId: newUser._id
        })
    }catch(error){
        res.status(500).json({message: 'Erro no servidor', error: error.message})
    }
}
    