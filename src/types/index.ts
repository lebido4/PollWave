export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: string;
  endDate: string;
  isPublic: boolean;
  allowComments: boolean;
  createdBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}