import { Entity, IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, UserSession } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserSessionEntity extends Entity<UserSession> {
  static readonly entityName = "userSession";
  static readonly initialState: UserSession = { email: "", favorites: [], recents: [] };
  async toggleFavorite(repoFullName: string): Promise<UserSession> {
    return this.mutate((s) => {
      const favorites = s.favorites || [];
      const isFavorited = favorites.includes(repoFullName);
      const newFavorites = isFavorited
        ? favorites.filter((fav) => fav !== repoFullName)
        : [...favorites, repoFullName];
      return { ...s, favorites: newFavorites };
    });
  }
  async addRecent(repoFullName: string): Promise<UserSession> {
    return this.mutate((s) => {
      const recents = s.recents || [];
      const newRecents = [repoFullName, ...recents.filter((rec) => rec !== repoFullName)].slice(0, 10); // Keep last 10
      return { ...s, recents: newRecents };
    });
  }
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & {
  messages: ChatMessage[];
};
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map((c) => ({ ...c, messages: MOCK_CHAT_MESSAGES.filter((m) => m.chatId === c.id) }));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate((s) => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}