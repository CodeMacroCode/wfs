export type InterviewStatus = "Pending" | "Selected" | "Not Selected" | "Interview" | "Rejected";

export interface InterviewMetadata {
  currentCTC?: string;
  expectedCTC?: string;
  experience?: string;
  location?: string;
  noticePeriod?: string;
  skills?: string;
}

export interface Interview {
  id: string;         // mapped from _id
  _id?: string;
  candidateName: string;
  email: string;
  contact: string;    // mapped from contactNumber
  contactNumber?: string;
  position: string;   // mapped from appliedPosition
  appliedPosition?: string;
  interviewDate: string;
  interviewer: string;        // mapped from interviewerName
  interviewerName?: string;
  feedback?: string;          // mapped from interviewerFeedback
  interviewerFeedback?: string;
  status: InterviewStatus;    // mapped from selectionStatus
  selectionStatus?: InterviewStatus;
  resumes?: string[];
  metadata?: InterviewMetadata;
  createdAt: string;
  updatedAt?: string;
}

export type CreateInterviewDto = Omit<Interview, "id" | "_id" | "createdAt" | "updatedAt">;
export type UpdateInterviewDto = Partial<CreateInterviewDto> & {
  status?: InterviewStatus;
};

export interface RecruitmentStats {
  totalCandidates: number;
  pending: number;
  selected: number;
  rejected: number;
  interviewScheduled: number;
}

export interface RecruitmentResponse {
  data: Interview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: RecruitmentStats;
}

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
