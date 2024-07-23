import { DataSource } from 'typeorm';
import { Vote } from '../database/entities/vote';
import { VoteQuestion } from '../database/entities/votequestion';
import { VoteResponse } from '../database/entities/voteResponse';
import { CreateVoteRequest } from '../handlers/validators/vote-validation';
import { User } from "../database/entities/user";

export interface ListVoteFilter {
  page: number;
  result: number;
}

export class VoteUsecase {
  constructor(private db: DataSource) {}

  async createVote(data: CreateVoteRequest, userId: number): Promise<Vote> {
    const voteRepository = this.db.getRepository(Vote);
    const questionRepository = this.db.getRepository(VoteQuestion);
    const userRepository = this.db.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const questions = data.questions.map(q => {
      const voteQuestion = questionRepository.create({
        questionText: q.questionText,
        options: q.options.map(option => ({ text: option }))
      });
      return voteQuestion;
    });

    const vote = voteRepository.create({
      title: data.title,
      mode: data.mode,
      comment: data.comment,
      majority: data.majority,
      deadline: new Date(data.deadline),
      questions,
      createdBy: user,
    });

    await voteRepository.save(vote);
    await questionRepository.save(questions);

    return vote;
  }

  async voteList(filter: ListVoteFilter): Promise<{ votes: Vote[] }> {
    const query = this.db.getRepository(Vote)
      .createQueryBuilder('vote')
      .leftJoinAndSelect('vote.questions', 'question')
      .leftJoinAndSelect('question.options', 'option')
      .take(filter.result)
      .skip((filter.page - 1) * filter.result);

    const votes = await query.getMany();
    return { votes };
  }

  async getVoteResponses(voteId: number): Promise<VoteResponse[]> {
    const responseRepository = this.db.getRepository(VoteResponse);
    const responses = await responseRepository.find({
      where: { vote: { id: voteId } },
      relations: ['user']
    });
    return responses;
  }

  async hasUserVoted(voteId: number, userId: number): Promise<boolean> {
    const responseRepository = this.db.getRepository(VoteResponse);
    const count = await responseRepository.count({
      where: { vote: { id: voteId }, user: { id: userId } }
    });
    return count > 0;
  }

  async createVoteResponse(voteId: number, userId: number, responses: string[]): Promise<VoteResponse> {
    const voteRepository = this.db.getRepository(Vote);
    const responseRepository = this.db.getRepository(VoteResponse);
    const userRepository = this.db.getRepository(User);

    const vote = await voteRepository.findOneBy({ id: voteId });
    if (!vote) {
      throw new Error("Vote not found");
    }

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    if (await this.hasUserVoted(voteId, userId)) {
      throw new Error("User has already voted for this vote");
    }

    const voteResponse = responseRepository.create({
      vote: vote,
      user: user,
      responses: responses,
    });

    await responseRepository.save(voteResponse);

    return voteResponse;
  }
}
