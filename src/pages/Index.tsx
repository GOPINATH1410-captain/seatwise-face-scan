import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentRegistration } from '@/components/ExamSystem/StudentRegistration';
import { ExamHallConfig } from '@/components/ExamSystem/ExamHallConfig';
import { FacialRecognition } from '@/components/ExamSystem/FacialRecognition';
import { SeatingChart } from '@/components/ExamSystem/SeatingChart';
import { Dashboard } from '@/components/ExamSystem/Dashboard';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  photo: string | null;
}

interface ExamHallData {
  name: string;
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
}

interface SeatAssignment {
  row: number;
  seat: number;
  student: Student | null;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [hallConfig, setHallConfig] = useState<ExamHallData | null>(null);
  const [seatAssignments, setSeatAssignments] = useState<SeatAssignment[]>([]);
  const { toast } = useToast();

  const handleStudentAdded = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const handleHallConfigured = (config: ExamHallData) => {
    setHallConfig(config);
    // Reset assignments when hall is reconfigured
    setSeatAssignments([]);
  };

  const handleStudentRecognized = (student: Student) => {
    if (!hallConfig) return;

    // Find next available seat
    const nextSeat = findNextAvailableSeat();
    if (nextSeat) {
      const newAssignment: SeatAssignment = {
        row: nextSeat.row,
        seat: nextSeat.seat,
        student: student
      };
      
      setSeatAssignments(prev => [...prev, newAssignment]);
    }
  };

  const findNextAvailableSeat = (): { row: number; seat: number } | null => {
    if (!hallConfig) return null;

    for (let row = 1; row <= hallConfig.rows; row++) {
      for (let seat = 1; seat <= hallConfig.seatsPerRow; seat++) {
        const isOccupied = seatAssignments.some(
          assignment => assignment.row === row && assignment.seat === seat && assignment.student
        );
        if (!isOccupied) {
          return { row, seat };
        }
      }
    }
    return null;
  };

  const generateAutomaticSeating = () => {
    if (!hallConfig) return;

    const newAssignments: SeatAssignment[] = [];
    let studentIndex = 0;

    // Distribute students evenly across the hall
    for (let row = 1; row <= hallConfig.rows && studentIndex < students.length; row++) {
      for (let seat = 1; seat <= hallConfig.seatsPerRow && studentIndex < students.length; seat++) {
        newAssignments.push({
          row,
          seat,
          student: students[studentIndex]
        });
        studentIndex++;
      }
    }

    setSeatAssignments(newAssignments);
  };

  const exportSeatingData = () => {
    const exportData = {
      hallConfig,
      students,
      assignments: seatAssignments.filter(a => a.student),
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `seating-arrangement-${hallConfig?.name || 'exam-hall'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Seating arrangement data has been downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card shadow-card-enhanced">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="hall">Hall Config</TabsTrigger>
            <TabsTrigger value="recognition">Recognition</TabsTrigger>
            <TabsTrigger value="seating">Seating Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              students={students}
              hallConfig={hallConfig}
              assignments={seatAssignments}
              onGenerateSeating={generateAutomaticSeating}
              onExportData={exportSeatingData}
            />
          </TabsContent>

          <TabsContent value="students">
            <div className="flex justify-center">
              <StudentRegistration onStudentAdded={handleStudentAdded} />
            </div>
          </TabsContent>

          <TabsContent value="hall">
            <div className="flex justify-center">
              <ExamHallConfig 
                onHallConfigured={handleHallConfigured} 
                currentConfig={hallConfig || undefined}
              />
            </div>
          </TabsContent>

          <TabsContent value="recognition">
            <div className="flex justify-center">
              <FacialRecognition 
                students={students}
                onStudentRecognized={handleStudentRecognized}
              />
            </div>
          </TabsContent>

          <TabsContent value="seating">
            <div className="flex justify-center">
              {hallConfig ? (
                <SeatingChart
                  hallName={hallConfig.name}
                  rows={hallConfig.rows}
                  seatsPerRow={hallConfig.seatsPerRow}
                  assignments={seatAssignments}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Please configure the exam hall first</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
