

// user-assignment.service.ts
import api from '../base-api';
import { UserAssignment, UserAssignmentFormData } from "@/types/management/user-assignment";

class UserAssignmentService {
    private readonly baseUrl = '/user-assignment';

    async createUserAssignment(assignment: UserAssignmentFormData): Promise<UserAssignment> {
        const response = await api.post<UserAssignment>(`${this.baseUrl}/`, assignment);
        return response.data;
    }

    async updateUserAssignment(assignmentId: string, assignment: UserAssignmentFormData): Promise<UserAssignment> {
        const response = await api.put<UserAssignment>(`${this.baseUrl}/${assignmentId}`, assignment);
        return response.data;
    }

    async deleteUserAssignmentById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getUserAssignmentById(id: string): Promise<UserAssignment> {
        const response = await api.get<UserAssignment>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllUserAssignments(): Promise<UserAssignment[]> {
        const response = await api.get<UserAssignment[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const userAssignmentService = new UserAssignmentService();
