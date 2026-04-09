import { Roster, AssignRosterDto, RosterResponse } from '@/types/roster';
import { toast } from 'sonner';

// Mock data for initial state
let mockRosters: Roster[] = [
  {
    _id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    companyName: 'TechCorp Solutions',
    shiftId: 'shift1',
    shiftName: 'Morning Shift',
    startDate: '2026-04-10',
    endDate: '2026-04-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    companyName: 'Innovate Hub',
    shiftId: 'shift2',
    shiftName: 'Evening Shift',
    startDate: '2026-04-11',
    endDate: '2026-04-16',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const rosterService = {
  /**
   * Get all rosters
   */
  getAll: async (): Promise<RosterResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { rosters: [...mockRosters] };
  },

  /**
   * Assign roster to multiple employees
   */
  assign: async (data: AssignRosterDto): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    console.log('Assigning roster:', data);
    
    // Mock the assignment logic for the demo
    const newRosters: Roster[] = data.employeeIds.map(empId => ({
      _id: Math.random().toString(36).substr(2, 9),
      employeeId: empId,
      employeeName: `Employee ${empId}`, // Mock name
      companyName: 'Assigned Company', // Mock name
      shiftId: data.shiftId,
      shiftName: 'Assigned Shift', // Mock name
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    mockRosters = [...newRosters, ...mockRosters];
    
    toast.success('Roster assigned successfully');
  },

  /**
   * Delete a roster entry
   */
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockRosters = mockRosters.filter(r => r._id !== id);
    toast.success('Roster entry deleted');
  }
};

export default rosterService;
