import { DataSource } from 'typeorm';
import { AG } from '../database/entities/ag';
import { User } from '../database/entities/user';
import { AGEmail } from '../database/entities/agEmails';

export interface CreateAGRequest {
  title: string;
  date: string;
  time: string;
  agenda: string;
  emails: string[];
  link?: string; 
}

export class AGUsecase {
  constructor(private db: DataSource) {}

  async createAG(data: CreateAGRequest, userId: number): Promise<AG> {
    const agRepository = this.db.getRepository(AG);
    const userRepository = this.db.getRepository(User);
    const agEmailRepository = this.db.getRepository(AGEmail);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const currentDate = new Date();
    const agDate = new Date(`${data.date}T${data.time}`);

    if (agDate < currentDate) {
      throw new Error('La date et l\'heure de l\'AG ne peuvent pas être dans le passé.');
    }

    const newAG = agRepository.create({
      title: data.title,
      date: data.date,
      time: data.time,
      agenda: data.agenda,
      emails: [],   
      link: data.link,
      createdBy: user,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedAG = await agRepository.save(newAG);

    const agEmails = data.emails.map(email => agEmailRepository.create({ email, ag: savedAG }));
    await agEmailRepository.save(agEmails);

    savedAG.emails = agEmails;
    return savedAG;
  }
}
