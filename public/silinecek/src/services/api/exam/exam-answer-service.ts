import { ExamAnswerDto } from '@/types/exam/exam-type';
import api from '../base-api';
import axios from "axios";

class ExamAnswerService {
    private readonly baseUrl = '/exam/exam-answer';

    // Core Answer Operations
    async saveAnswer(sessionId: string, questionId: string, answerData: string): Promise<ExamAnswerDto> {
        const response = await api.post<ExamAnswerDto>(`${this.baseUrl}/save/${sessionId}/${questionId}`, answerData);
        return response.data;
    }

    async submitAnswer(sessionId: string, questionId: string, answerData: string): Promise<ExamAnswerDto> {
        const response = await api.post<ExamAnswerDto>(`${this.baseUrl}/submit/${sessionId}/${questionId}`, answerData);
        return response.data;
    }

    async clearAnswer(sessionId: string, questionId: string): Promise<ExamAnswerDto> {
        const response = await api.delete<ExamAnswerDto>(`${this.baseUrl}/clear/${sessionId}/${questionId}`);
        return response.data;
    }

    // Mark for Review Operations
    async markForReview(sessionId: string, questionId: string, marked: boolean): Promise<ExamAnswerDto> {
        const response = await api.put<ExamAnswerDto>(`${this.baseUrl}/mark-review/${sessionId}/${questionId}/${marked}`);
        return response.data;
    }

    // Answer Retrieval
    async getAnswer(sessionId: string, questionId: string): Promise<ExamAnswerDto | null> {
        try {
            const response = await api.get<ExamAnswerDto>(`${this.baseUrl}/get/${sessionId}/${questionId}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async getSessionAnswers(sessionId: string): Promise<ExamAnswerDto[]> {
        const response = await api.get<ExamAnswerDto[]>(`${this.baseUrl}/session/${sessionId}`);
        return response.data;
    }

    async getAnsweredQuestions(sessionId: string): Promise<ExamAnswerDto[]> {
        const response = await api.get<ExamAnswerDto[]>(`${this.baseUrl}/session/${sessionId}/answered`);
        return response.data;
    }

    async getUnansweredQuestions(sessionId: string): Promise<ExamAnswerDto[]> {
        const response = await api.get<ExamAnswerDto[]>(`${this.baseUrl}/session/${sessionId}/unanswered`);
        return response.data;
    }

    async getMarkedQuestions(sessionId: string): Promise<ExamAnswerDto[]> {
        const response = await api.get<ExamAnswerDto[]>(`${this.baseUrl}/session/${sessionId}/marked`);
        return response.data;
    }

    // Bulk Operations
    async saveMultipleAnswers(sessionId: string, answerMap: Record<string, string>): Promise<ExamAnswerDto[]> {
        const response = await api.post<ExamAnswerDto[]>(`${this.baseUrl}/save-multiple/${sessionId}`, answerMap);
        return response.data;
    }

    async clearAllAnswers(sessionId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/clear-all/${sessionId}`);
        return response.data;
    }

    // Answer Statistics
    async getAnswerStatistics(sessionId: string): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/statistics/${sessionId}`);
        return response.data;
    }

    async getCompletionPercentage(sessionId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/completion-percentage/${sessionId}`);
        return response.data;
    }

    async getQuestionModificationHistory(sessionId: string, questionId: string): Promise<string[]> {
        const response = await api.get<string[]>(`${this.baseUrl}/modification-history/${sessionId}/${questionId}`);
        return response.data;
    }

    // Time Tracking
    async updateTimeSpent(sessionId: string, questionId: string, timeSpentSeconds: number): Promise<ExamAnswerDto> {
        const response = await api.put<ExamAnswerDto>(`${this.baseUrl}/time-spent/${sessionId}/${questionId}/${timeSpentSeconds}`);
        return response.data;
    }

    async getTimeSpentByQuestion(sessionId: string): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/time-spent/${sessionId}`);
        return response.data;
    }

    // Answer Validation
    async validateSessionAnswers(sessionId: string): Promise<string[]> {
        const response = await api.get<string[]>(`${this.baseUrl}/validate/${sessionId}`);
        return response.data;
    }

    // Utility Methods
    async getTotalAnswerCount(sessionId: string): Promise<number> {
        const statistics = await this.getAnswerStatistics(sessionId);
        return statistics.totalQuestions || 0;
    }

    async getAnsweredCount(sessionId: string): Promise<number> {
        const statistics = await this.getAnswerStatistics(sessionId);
        return statistics.answeredQuestions || 0;
    }

    async getUnansweredCount(sessionId: string): Promise<number> {
        const statistics = await this.getAnswerStatistics(sessionId);
        return statistics.unansweredQuestions || 0;
    }

    async getMarkedCount(sessionId: string): Promise<number> {
        const statistics = await this.getAnswerStatistics(sessionId);
        return statistics.markedQuestions || 0;
    }

    async getSkippedCount(sessionId: string): Promise<number> {
        const statistics = await this.getAnswerStatistics(sessionId);
        return statistics.skippedQuestions || 0;
    }

    async isQuestionAnswered(sessionId: string, questionId: string): Promise<boolean> {
        const answer = await this.getAnswer(sessionId, questionId);
        return answer?.isAnswered || false;
    }

    async isQuestionMarkedForReview(sessionId: string, questionId: string): Promise<boolean> {
        const answer = await this.getAnswer(sessionId, questionId);
        return answer?.isMarkedForReview || false;
    }

    async hasAnyAnswers(sessionId: string): Promise<boolean> {
        const count = await this.getAnsweredCount(sessionId);
        return count > 0;
    }

    async isSessionComplete(sessionId: string): Promise<boolean> {
        const percentage = await this.getCompletionPercentage(sessionId);
        return percentage >= 100;
    }

    async getTotalTimeSpent(sessionId: string): Promise<number> {
        const timeSpentByQuestion = await this.getTimeSpentByQuestion(sessionId);
        return Object.values(timeSpentByQuestion).reduce((total, time) => total + time, 0);
    }

    async getAverageTimePerQuestion(sessionId: string): Promise<number> {
        const totalTime = await this.getTotalTimeSpent(sessionId);
        const answeredCount = await this.getAnsweredCount(sessionId);
        return answeredCount > 0 ? totalTime / answeredCount : 0;
    }

    // Auto-save functionality
    async autoSaveAnswer(sessionId: string, questionId: string, answerData: string): Promise<ExamAnswerDto> {
        return this.saveAnswer(sessionId, questionId, answerData);
    }

    async autoSaveMultipleAnswers(sessionId: string, answerMap: Record<string, string>): Promise<ExamAnswerDto[]> {
        return this.saveMultipleAnswers(sessionId, answerMap);
    }

    // Session management helpers
    async getSessionProgress(sessionId: string): Promise<{
        totalQuestions: number;
        answeredQuestions: number;
        unansweredQuestions: number;
        markedQuestions: number;
        skippedQuestions: number;
        completionPercentage: number;
        totalTimeSpent: number;
        averageTimePerQuestion: number;
    }> {
        const [statistics, completionPercentage, totalTimeSpent] = await Promise.all([
            this.getAnswerStatistics(sessionId),
            this.getCompletionPercentage(sessionId),
            this.getTotalTimeSpent(sessionId)
        ]);

        const answeredCount = statistics.answeredQuestions || 0;
        const averageTimePerQuestion = answeredCount > 0 ? totalTimeSpent / answeredCount : 0;

        return {
            totalQuestions: statistics.totalQuestions || 0,
            answeredQuestions: statistics.answeredQuestions || 0,
            unansweredQuestions: statistics.unansweredQuestions || 0,
            markedQuestions: statistics.markedQuestions || 0,
            skippedQuestions: statistics.skippedQuestions || 0,
            completionPercentage,
            totalTimeSpent,
            averageTimePerQuestion
        };
    }

    async getQuestionStatus(sessionId: string, questionId: string): Promise<{
        isAnswered: boolean;
        isMarkedForReview: boolean;
        timeSpent: number;
        modificationCount: number;
        lastModified: string | null;
    }> {
        const answer = await this.getAnswer(sessionId, questionId);

        return {
            isAnswered: answer?.isAnswered || false,
            isMarkedForReview: answer?.isMarkedForReview || false,
            timeSpent: answer?.timeSpentOnQuestion || 0,
            modificationCount: answer?.modificationCount || 0,
            lastModified: answer?.lastModifiedAt || null
        };
    }

    // Navigation helpers
    async getNextUnansweredQuestion(sessionId: string, currentQuestionId?: string): Promise<ExamAnswerDto | null> {
        const unansweredQuestions = await this.getUnansweredQuestions(sessionId);

        if (unansweredQuestions.length === 0) {
            return null;
        }

        if (!currentQuestionId) {
            return unansweredQuestions[0];
        }

        const allAnswers = await this.getSessionAnswers(sessionId);
        const currentIndex = allAnswers.findIndex(answer => answer.questionId === currentQuestionId);

        if (currentIndex === -1) {
            return unansweredQuestions[0];
        }

        // Find next unanswered question after current
        for (let i = currentIndex + 1; i < allAnswers.length; i++) {
            const answer = allAnswers[i];
            if (!answer.isAnswered) {
                return answer;
            }
        }

        // If no unanswered question found after current, return first unanswered
        return unansweredQuestions[0];
    }

    async getPreviousAnsweredQuestion(sessionId: string, currentQuestionId?: string): Promise<ExamAnswerDto | null> {
        const answeredQuestions = await this.getAnsweredQuestions(sessionId);

        if (answeredQuestions.length === 0) {
            return null;
        }

        if (!currentQuestionId) {
            return answeredQuestions[answeredQuestions.length - 1];
        }

        const allAnswers = await this.getSessionAnswers(sessionId);
        const currentIndex = allAnswers.findIndex(answer => answer.questionId === currentQuestionId);

        if (currentIndex === -1) {
            return answeredQuestions[answeredQuestions.length - 1];
        }

        // Find previous answered question before current
        for (let i = currentIndex - 1; i >= 0; i--) {
            const answer = allAnswers[i];
            if (answer.isAnswered) {
                return answer;
            }
        }

        // If no answered question found before current, return last answered
        return answeredQuestions[answeredQuestions.length - 1];
    }
}

export const examAnswerService = new ExamAnswerService();