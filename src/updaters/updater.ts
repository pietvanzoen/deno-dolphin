export interface Update {
  timestamp: Date;
  content: string;
}

export interface Updater {
  create(updateData: Update): Promise<any>;
}
