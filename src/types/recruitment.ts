export type InterviewStatus = "Pending" | "Selected" | "Not Selected";

export interface Interview {
  id: string;
  candidateName: string;
  email: string;
  contact: string;
  position: string;
  interviewDate: string;
  interviewer: string;
  feedback?: string;
  status: InterviewStatus;
  createdAt: string;
}

export type CreateInterviewDto = Omit<Interview, "id" | "createdAt">;
export type UpdateInterviewDto = Partial<CreateInterviewDto> & {
  status?: InterviewStatus;
};

export interface InterviewsResponse {
  data: Interview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InterviewQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InterviewStatus;
}
