
import { View } from '../types';

export interface DraftData {
  content: string;
  source: string;
  type?: string;
  tags?: string[];
}

class DraftService {
  private static instance: DraftService;
  private draft: DraftData | null = null;

  private constructor() {}

  public static getInstance(): DraftService {
    if (!DraftService.instance) {
      DraftService.instance = new DraftService();
    }
    return DraftService.instance;
  }

  public setDraft(data: DraftData) {
    this.draft = data;
  }

  public getDraft(): DraftData | null {
    const data = this.draft;
    this.draft = null; // Clear after reading (one-time consumption)
    return data;
  }

  public hasDraft(): boolean {
    return this.draft !== null;
  }
}

export const draftService = DraftService.getInstance();
