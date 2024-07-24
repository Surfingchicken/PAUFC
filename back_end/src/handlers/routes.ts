import express, { Request, Response } from "express";
import { UserHandler } from "./user";
import { authMiddleware } from "./middleware/auth-middleware";
import { roleMiddleware } from "./middleware/role-middleware";
import { documentCreateValidation, documentListValidation, getCategoryValidation, getYearsValidation } from "./validators/document-validation";
import { createSurveyResponseValidation } from './validators/survey-validation';
import { updateUserValidation, userListValidation } from "./validators/user-validator";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { UserUsecase } from "../domain/user-usecase";
import { DocumentUsecase, listDocumentFilter } from "../domain/document-usecase";
import { AppDataSource } from "../database/database";
import { getUserIdFromToken } from "./utils/getUserId";
import { userUpdateRoleValidation } from "./validators/user-validator";
import { createSurveyValidation, CreateSurveyRequest } from './validators/survey-validation';
import { SurveyUsecase } from '../domain/survey-usecase';
import { createVoteValidation, CreateVoteRequest, voteListValidation } from './validators/vote-validation';
import { VoteUsecase } from '../domain/vote-usecase'; 
import { AGUsecase } from "../domain/ag-usecase";
import { AG } from "../database/entities/ag";
import { createAGValidation } from './validators/ag-validation';
import multer from 'multer';
import path from 'path';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import { Token } from "@mui/icons-material";
import { ContributionUsecase } from "../domain/contributions-usecase";
import { compare, hash } from "bcrypt";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const stripe = new Stripe('sk_test_51PdZ5OJR2hyal4ZRjhcmR2sOamWYDegwoJgJhPs03z6Xp0mTXKqJ3jE6ZyHRv1PsgTUutf8u0mNecb5GXwnj870c00uEcHPtTw', {
  apiVersion: '2024-06-20',
});

const upload = multer({ storage });

export const initRoutes = (app:express.Express) => {

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List of users
 *     description: Retrieves a paginated list of users according to specified criteria.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to display.
 *       - in: query
 *         name: result
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users per page.
 *     responses:
 *       200:
 *         description: Successfully returned a list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */
    app.get('/users',authMiddleware, async(req: Request, res:Response)=>{

        const usersValidation = userListValidation.validate(req.body);
        if(usersValidation.error){
            res.status(400).send(generateValidationErrorMessage(usersValidation.error.details));
            return;
        }
        const userList = usersValidation.value;
        let result = 20
        if (userList.result) {
            result = userList.result
        }
        const page = userList.page ?? 1

        try {
            const userUsecase = new UserUsecase(AppDataSource);
            const listUser = await userUsecase.userList({ ... userList,page, result })
            res.status(200).send(listUser)
        } catch (error) {
           
            res.status(500).send({ error: "Internal error" })
        }
    });

    app.post('/ags', async (req: Request, res: Response) => {
      const { error, value } = createAGValidation.validate(req.body);
    
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
    
      try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const agUsecase = new AGUsecase(AppDataSource);
        const newAG = await agUsecase.createAG(value, userId);
        res.status(201).json(newAG);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.put('/profile', async (req: Request, res: Response) => {
      const { username, password } = req.body;
    
      try {
        const userId = getUserIdFromToken(req);
    
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const userProfileUsecase = new UserUsecase(AppDataSource);
        const hashedPassword = await hash(password, 10);
        await userProfileUsecase.updateProfile(userId, username, hashedPassword);
       

        res.send({ success: true });
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/documents', async (req: Request, res: Response) => {
      const { page = 1, result = 10, category, year } = req.query;
    
      try {
        const documentUsecase = new DocumentUsecase(AppDataSource);
        const filter: listDocumentFilter = {
          page: Number(page),
          result: Number(result),
          category: category ? String(category) : undefined,
          year: year ? Number(year) : undefined
        };
        const documents = await documentUsecase.documentList(filter);
        res.status(200).json(documents);
      } catch (error) {
       ;
        res.status(500).send({ error: 'Internal error retry later' });
      }
    });

    app.get('/documents/categories', async (req: Request, res: Response) => {
      try {
        const { error } = getCategoryValidation.validate(req.query);
        if (error) {
          return res.status(400).send(generateValidationErrorMessage(error.details));
        }
    
        const documentUsecase = new DocumentUsecase(AppDataSource);
        const categories = await documentUsecase.getCategories();
        res.status(200).json(categories);
      } catch (error) {
       ;
        res.status(500).send({ error: 'Internal error, retry later' });
      }
    });
    
    app.get('/documents/years', async (req: Request, res: Response) => {
      const { error, value } = getYearsValidation.validate(req.query);
    
      if (error) {
        return res.status(400).send(generateValidationErrorMessage(error.details));
      }
    
      const { category } = value;
    
      try {
        const documentUsecase = new DocumentUsecase(AppDataSource);
        const years = await documentUsecase.getYears(category);
        res.status(200).json(years);
      } catch (error) {
       ;
        res.status(500).send({ error: 'Internal error, retry later' });
      }
    });
    

    app.get('/documents', authMiddleware, roleMiddleware, async(req: Request, res:Response)=>{

        const documentsValidation = documentListValidation.validate(req.body);
        if(documentsValidation.error){
            res.status(400).send(generateValidationErrorMessage(documentsValidation.error.details));
            return;
        }
        const documentList = documentsValidation.value;
        let result = 20
        if (documentList.result) {
            result = documentList.result
        }
        const page = documentList.page ?? 1

        try {
            const documentUsecase = new DocumentUsecase(AppDataSource);
            const listDocument = await documentUsecase.documentList({ ... documentList,page, result })
            res.status(200).send(listDocument)
        } catch (error) {
           
            res.status(500).send({ error: "Internal error" })
        }
    });

    app.post('/documents', authMiddleware, roleMiddleware, upload.single('file'), async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }
    
      const { error, value } = documentCreateValidation.validate({ ...req.body, file: req.file });
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }
    
      try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
          return res.status(401).send({ error: 'Unauthorized' });
        }
        const documentUsecase = new DocumentUsecase(AppDataSource);
        const newDocument = await documentUsecase.createDocument(value, req.file.path, userId);
        res.status(201).json(newDocument);
      } catch (error) {
       ;
        res.status(500).send({ error: 'Internal error' });
      }
    });

    app.get('/documents/count', authMiddleware, async (req: Request, res: Response) => {
      try {
        const documentUsecase = new DocumentUsecase(AppDataSource);
        const count = await documentUsecase.getDocumentCount();
        res.status(200).json({ count });
      } catch (error) {
       ;
        res.status(500).send({ error: 'Internal error retry later' });
      }
    });

    app.delete('/users/:id', authMiddleware, roleMiddleware, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    
    try {
        const userUsecase = new UserUsecase(AppDataSource);
        await userUsecase.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
       ;
        res.status(500).json({ error: 'Internal error' });
    }
    });

    app.put('/users/:id/role', authMiddleware, roleMiddleware, async (req: Request, res: Response) => {
      const userId = parseInt(req.params.id, 10);
      const { roleId, toBlockOn } = req.body;
    
      const validation = userUpdateRoleValidation.validate({ roleId });
      if (validation.error) {
        res.status(400).send(generateValidationErrorMessage(validation.error.details));
        return;
      }
    
      try {
        const userUsecase = new UserUsecase(AppDataSource);
        const updatedUser = await userUsecase.updateUserRole(userId, roleId, toBlockOn);
        if (updatedUser) {
          res.status(200).json({ message: 'Role updated successfully', user: updatedUser });
        } else {
          res.status(404).json({ error: 'User or Role not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Internal error' });
      }
    });
    

      app.get('/surveys', authMiddleware, async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const result = parseInt(req.query.result as string) || 10;
        const surveyUsecase = new SurveyUsecase(AppDataSource);
      
        try {
          const surveys = await surveyUsecase.listSurveys(page, result);
          res.status(200).json(surveys);
        } catch (error) {
         
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      app.post('/survey-responses', authMiddleware, async (req: Request, res: Response) => {
        const { error, value } = createSurveyResponseValidation.validate(req.body);
      
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
      
        try {
          const userId = getUserIdFromToken(req);
          
          if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
      
          const surveyUsecase = new SurveyUsecase(AppDataSource);
          if (await surveyUsecase.hasUserResponded(value.surveyId, userId)) {
            return res.status(400).json({ error: 'Vous avez déjà répondu à ce sondage.' });
          }
      
          const newResponse = await surveyUsecase.createSurveyResponse({ ...value, userId });
          return res.status(201).json(newResponse);
        } catch (err) {
         
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      
      app.post('/vote-responses', authMiddleware, async (req: Request, res: Response) => {
        const { voteId, responses } = req.body;
      
        if (!voteId || !responses || !Array.isArray(responses)) {
          return res.status(400).json({ error: 'Invalid request payload' });
        }
      
        try {
          const userId = getUserIdFromToken(req);
      
          if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
      
          const voteUsecase = new VoteUsecase(AppDataSource);
          if (await voteUsecase.hasUserVoted(voteId, userId)) {
            return res.status(400).json({ error: 'Vous avez déjà répondu à ce sondage.' });
          }

          const newVoteResponse = await voteUsecase.createVoteResponse(voteId, userId, responses);
          return res.status(201).json(newVoteResponse);
        } catch (err) {
         
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      app.post('/votes', authMiddleware, async (req: Request, res: Response) => {
        const { id, ...voteData } = req.body;
      
        const transformedBody = {
          ...voteData,
          questions: voteData.questions.map((question: any) => ({
            ...question,
            options: question.options.map((option: any) => String(option.text)),
          })),
        };
      
        const { error, value } = createVoteValidation.validate(transformedBody);
      
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
      
        try {
          const userId = getUserIdFromToken(req);
      
          if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
      
          const voteUsecase = new VoteUsecase(AppDataSource);
          const newVote = await voteUsecase.createVote(value, userId);
          return res.status(201).json(newVote);
        } catch (err) {
         
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      app.get('/survey-responses/:surveyId', authMiddleware, async (req: Request, res: Response) => {
        const { surveyId } = req.params;
      
        if (!surveyId || isNaN(Number(surveyId))) {
          return res.status(400).json({ error: "Invalid survey ID" });
        }
      
        try {
          const surveyUsecase = new SurveyUsecase(AppDataSource);
          const responses = await surveyUsecase.getSurveyResponses(Number(surveyId));
      
          if (!responses.length) {
            return res.status(404).json({ error: "No responses found for this survey" });
          }
      
          return res.status(200).json({ responses });
        } catch (error) {
          return res.status(500).json({ error: "Internal server error" });
        }
      });

      app.get('/vote-responses/:voteId', authMiddleware, async (req: Request, res: Response) => {
        const voteId = parseInt(req.params.voteId, 10);
      
        if (isNaN(voteId)) {
          return res.status(400).json({ error: 'Invalid vote ID' });
        }
      
        try {
          const voteUsecase = new VoteUsecase(AppDataSource);
          const responses = await voteUsecase.getVoteResponses(voteId);
          return res.status(200).json({ responses });
        } catch (err) {
         
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
 
      

      app.get('/votes', authMiddleware, async (req: Request, res: Response) => {
        const { page = 1, result = 10 } = req.query;
      
        const { error } = voteListValidation.validate({ page, result });
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
      
        try {
          const voteUsecase = new VoteUsecase(AppDataSource);
          const votes = await voteUsecase.voteList({ page: Number(page), result: Number(result) });
          res.status(200).json(votes);
        } catch (err) {
          res.status(500).json({ error: 'Internal error, please try again later.' });
        }
      });

      app.post('/surveys', authMiddleware, roleMiddleware, async (req: Request, res: Response) => {
        const { error, value } = createSurveyValidation.validate(req.body);
      
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
      
        try {
          const userId = getUserIdFromToken(req);
          
          if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          const surveyUsecase = new SurveyUsecase(AppDataSource);
          const newSurvey = await surveyUsecase.createSurvey(value, userId);
          return res.status(201).json(newSurvey);
        } catch (err) {
         
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });

    app.get('/uploads/:filename', (req, res) => {
      const filename = req.params.filename;
      const file = path.join(__dirname, 'uploads', filename);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.sendFile(file);
    });

    app.post('/donations', async (req, res) => {
      const { amount, paymentMethodId } = req.body;
    
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, 
          currency: 'eur',
          payment_method: paymentMethodId,
          description: 'Donation',
          metadata: {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            address: `${req.body.streetNumber} ${req.body.streetName}, ${req.body.postalCode} ${req.body.city}`,
        },
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',  
        },
        });
    
        res.send({ success: true });
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/contributions', async (req: Request, res: Response) => {
      const { amount, paymentMethodId } = req.body;
    
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, 
          currency: 'eur',
          payment_method: paymentMethodId,
          description: 'Donation',
          metadata: {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            address: `${req.body.streetNumber} ${req.body.streetName}, ${req.body.postalCode} ${req.body.city}`,
          },
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',  
          },
        });
     
    
        const userId = getUserIdFromToken(req);
        
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const contributionUsecase = new ContributionUsecase(AppDataSource);
        await contributionUsecase.updateContributionStatus(userId);
     
    
        res.send({ success: true });
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.put('/user/update', authMiddleware, async (req: Request, res: Response) => {
      const userId = getUserIdFromToken(req); // ID de l'utilisateur extrait par le middleware
      const updateParams = req.body;
  
      // Valider les paramètres de mise à jour
      const { error } = updateUserValidation.validate(updateParams);
      if (error) {
          return res.status(400).json({ message: 'Invalid request data', error: error.details });
      }
  
      try {
        const userUsecase = new UserUsecase(AppDataSource);
          const updatedUser = await userUsecase.update(userId!, updateParams);
          if (updatedUser) {
              res.json(updatedUser);
          } else {
              res.status(404).json({ message: 'User not found' });
          }
      } catch (error) {
          res.status(500).json({ message: 'Internal server error'});
      }
  });

    app.post('/no-contributions', async (req: Request, res: Response) => {
      try {
        const userId = getUserIdFromToken(req);
        
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const contributionUsecase = new ContributionUsecase(AppDataSource);
        await contributionUsecase.setContributionStatusToZero(userId);
     
    
        res.send({ success: true });
      } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    UserHandler(app)
}
