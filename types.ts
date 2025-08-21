
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: Role;
  content: string;
  isImage?: boolean;
}

export enum Feature {
  CHAT = 'Chat',
  IMAGE = 'Image',
  CODING = 'Coding',
  EDUCATION = 'Education',
}
