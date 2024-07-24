import { DataSource } from 'typeorm';
import { Document } from '../database/entities/document';
import { AppDataSource } from '../database/database';
import { documentCreateValidationRequest } from '../handlers/validators/document-validation';
import { User } from '../database/entities/user';

export interface listDocumentFilter {
  page: number;
  result: number;
  category?: string;
  year?: number;
}

export class DocumentUsecase {
  constructor(private db: DataSource) {}

  async documentList(listDocumentFilter: listDocumentFilter): Promise<{ document: Document[] }> {
    const query = this.db.createQueryBuilder(Document, 'document');
    query.take(listDocumentFilter.result);
    if (listDocumentFilter.category) {
      query.where('document.category = :category', { category: listDocumentFilter.category });
    }
    if (listDocumentFilter.year) {
      query.andWhere('YEAR(document.createdAt) = :year', { year: listDocumentFilter.year });
    }
    const listeDocument = await query.getMany();
    return { document: listeDocument };
  }

  async createDocument(data: documentCreateValidationRequest, filePath: string, userId: number): Promise<Document> {
    const documentRepository = this.db.getRepository(Document);
    const userRepository = this.db.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const newDocument = documentRepository.create({
      ...data,
      fileUrl: filePath,
      originalName: data.file.originalname,
      createdBy: user,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await documentRepository.save(newDocument);
  }

  async getDocumentCount(): Promise<number> {
    const documentRepository = this.db.getRepository(Document);
    const count = await documentRepository.count();
    return count;
  }

  async getCategories(): Promise<string[]> {
    const documentRepository = this.db.getRepository(Document);
    const categories = await documentRepository
      .createQueryBuilder('document')
      .select('document.category')
      .distinct(true)
      .getRawMany();
    return categories.map(cat => cat.document_category);
  }

  async getYears(category: string): Promise<number[]> {
    const documentRepository = this.db.getRepository(Document);
    const years = await documentRepository
      .createQueryBuilder('document')
      .select('YEAR(document.createdAt)', 'year')
      .where('document.category = :category', { category })
      .distinct(true)
      .getRawMany();
    return years.map(y => y.year);
  }

  async deleteDocument(documentId: number): Promise<void> {
    const documentRepository = this.db.getRepository(Document);
    const document = await documentRepository.findOneBy({ id: documentId });
    if (!document) {
      throw new Error("Document not found");
    }
    await documentRepository.remove(document);
  }

  async updateDocument(documentId: number, updatedTitle: string): Promise<Document> {
    const documentRepository = this.db.getRepository(Document);
    const document = await documentRepository.findOneBy({ id: documentId });
    if (!document) {
      throw new Error("Document not found");
    }
    document.title = updatedTitle;
    document.updatedAt = new Date();
    return await documentRepository.save(document);
  }
}
