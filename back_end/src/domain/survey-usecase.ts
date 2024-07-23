import { DataSource } from 'typeorm';
import { Survey } from '../database/entities/Survey';
import { SurveyQuestion } from '../database/entities/SurveyQuestion';
import { SurveyResponse } from '../database/entities/SurveyResponse';
import { CreateSurveyRequest, CreateSurveyResponseRequest } from '../handlers/validators/survey-validation';
import { User } from '../database/entities/user';

export class SurveyUsecase {
  constructor(private db: DataSource) {}

  async createSurvey(data: CreateSurveyRequest, userId: number): Promise<Survey> {
    const surveyRepository = this.db.getRepository(Survey);
    const questionRepository = this.db.getRepository(SurveyQuestion);
    const userRepository = this.db.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const questions = data.questions.map(q => {
      const surveyQuestion = questionRepository.create({
        questionText: q.questionText,
        type: q.type,
        options: q.options
      });
      return surveyQuestion;
    });

    const survey = surveyRepository.create({
      title: data.title,
      questions,
      createdBy: user,
      deadline: new Date(data.deadline),
    });

    await surveyRepository.save(survey);
    await questionRepository.save(questions);

    return survey;
  }

  async listSurveys(page: number, result: number): Promise<{ surveys: Survey[] }> {
    const query = this.db.getRepository(Survey)
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'question')
      .take(result)
      .skip((page - 1) * result);

    const surveys = await query.getMany();
    return { surveys };
  }

  async deleteSurvey(surveyId: number): Promise<void> {
    const surveyRepository = this.db.getRepository(Survey);
    const survey = await surveyRepository.findOneBy({ id: surveyId });
    if (survey) {
      await surveyRepository.remove(survey);
    }
  }

  async hasUserResponded(surveyId: number, userId: number): Promise<boolean> {
    const surveyResponseRepository = this.db.getRepository(SurveyResponse);
    const count = await surveyResponseRepository.count({ where: { survey: { id: surveyId }, user: { id: userId } } });
    return count > 0;
  }

  async createSurveyResponse(data: CreateSurveyResponseRequest): Promise<SurveyResponse> {
    const surveyRepository = this.db.getRepository(Survey);
    const userRepository = this.db.getRepository(User);
    const surveyResponseRepository = this.db.getRepository(SurveyResponse);

    const survey = await surveyRepository.findOneBy({ id: data.surveyId });
    if (!survey) {
      throw new Error("Survey not found");
    }

    const user = await userRepository.findOneBy({ id: data.userId });
    if (!user) {
      throw new Error("User not found");
    }

    if (new Date() > new Date(survey.deadline)) {
      throw new Error("The deadline for this survey has passed");
    }

    if (await this.hasUserResponded(data.surveyId, data.userId)) {
      throw new Error("User has already responded to this survey");
    }

    const surveyResponse = surveyResponseRepository.create({
      responses: data.responses,
      survey: survey,
      user: user,
    });

    await surveyResponseRepository.save(surveyResponse);

    return surveyResponse;
  }

  async getSurveyResponses(surveyId: number): Promise<string[][]> {
    const surveyResponseRepository = this.db.getRepository(SurveyResponse);
    const responses = await surveyResponseRepository.find({ where: { survey: { id: surveyId } } });

    const formattedResponses = responses.map(response => response.responses);
    return formattedResponses;
  }
}
