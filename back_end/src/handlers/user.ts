import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { createUserValidation, loginUserValidation } from "./validators/user-validator";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { User } from "../database/entities/user";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Token } from "../database/entities/token";
import { Role } from "../database/entities/roles";
import { authMiddleware } from "./middleware/auth-middleware";

export const UserHandler = (app: express.Express) => {
    // Créer un nouvel utilisateur
    app.post('/auth/signup', async (req: Request, res: Response) => {
        try {
            const { error, value } = createUserValidation.validate(req.body);
            if (error) {
                return res.status(400).send(generateValidationErrorMessage(error.details));
            }
    
            const { username, email, password } = value;
    
            const hashedPassword = await hash(password, 10);
    
            const userRepository = AppDataSource.getRepository(User);
            const roleRepository = AppDataSource.getRepository(Role);
    
            const existingUsername = await userRepository.findOneBy({ username });
            if (existingUsername) {
                return res.status(400).send({ error: "Le nom d'utilisateur est déjà utilisé" });
            }
    
            const existingEmail = await userRepository.findOneBy({ email });
            if (existingEmail) {
                return res.status(400).send({ error: "L'email est déjà utilisé" });
            }
    
            // Rechercher le rôle par ID
            const role = await roleRepository.findOneBy({ id: 3 }); // Utiliser l'ID du rôle que vous souhaitez assigner
    
            if (!role) {
                return res.status(400).send({ error: 'Role not found' });
            }
    
            // Créer un nouvel utilisateur avec le rôle trouvé et contribution à 0
            const user = userRepository.create({
                username,
                email,
                password: hashedPassword,
                roles: role, // Assigner le rôle trouvé
                contribution: false // Initialiser la contribution à 0
            });
    
            await userRepository.save(user);
    
            const secret = process.env.JWT_SECRET ?? "";
            const token = sign({ userId: user.id, username: user.username, roles: user.roles.id }, secret, { expiresIn: '1d' });
    
            const tokenRepository = AppDataSource.getRepository(Token);
            await tokenRepository.save({ token, user });
    
            return res.status(200).json({ token });
        } catch (error) { 
            return res.status(500).send({ error: 'Internal error retry later' });
        }
    });
    
    // Connexion d'un utilisateur
    app.post('/auth/login', async (req: Request, res: Response) => {
        try {
            const { error, value } = loginUserValidation.validate(req.body);
            if (error) {
                return res.status(400).send(generateValidationErrorMessage(error.details));
            }

            const { username, password } = value;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ username });

            if (!user) {
                return res.status(400).send({ error: "Invalid username or password" });
            }

            // Validate password for this user
            const isValidPassword = await compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).send({ error: "Invalid username or password" });
            }

            const secret = process.env.JWT_SECRET ?? "";
            const token = sign({ userId: user.id, username: user.username, roles: user.roles.id }, secret, { expiresIn: '1d' });

            const tokenRepository = AppDataSource.getRepository(Token);
            await tokenRepository.save({ token, user });

            return res.status(200).json({ token });
        } catch (error) { 
            return res.status(500).send({ error: "Internal error retry later" });
        }
    });

    app.delete('/logout', authMiddleware, async (req: Request, res: Response) => {
        try {
            const tokenRepository = AppDataSource.getRepository(Token);
            const authToken = req.headers.authorization;

            if (!authToken) {
                return res.status(401).send({ error: "Unauthorized" });
            }

            const token = authToken.replace(/"/g, '').split(' ')[1];
            await tokenRepository.delete({ token });

            return res.status(201).send({ message: "Déconnexion réussie" });
        } catch (error) { 
            return res.status(500).send({ error: "Internal error retry later" });
        }
    });
};
