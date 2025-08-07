import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, User } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  photo: string | null;
}

interface SeatAssignment {
  row: number;
  seat: number;
  student: Student | null;
}

interface SeatingChartProps {
  hallName: string;
  rows: number;
  seatsPerRow: number;
  assignments: SeatAssignment[];
}

export const SeatingChart = ({ hallName, rows, seatsPerRow, assignments }: SeatingChartProps) => {
  const getSeatAssignment = (row: number, seat: number): Student | null => {
    const assignment = assignments.find(a => a.row === row && a.seat === seat);
    return assignment?.student || null;
  };

  const assignedSeats = assignments.filter(a => a.student !== null).length;
  const totalSeats = rows * seatsPerRow;

  return (
    <Card className="w-full shadow-card-enhanced">
      <CardHeader className="bg-gradient-academic text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Seating Chart - {hallName}
        </CardTitle>
        <CardDescription className="text-white/90">
          Automated seating arrangement based on facial recognition
        </CardDescription>
        <div className="flex gap-4 mt-2">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {assignedSeats}/{totalSeats} seats assigned
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-academic rounded border"></div>
              <span>Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted border rounded"></div>
              <span>Available</span>
            </div>
          </div>

          {/* Seating Chart */}
          <div className="bg-background border rounded-lg p-6 overflow-auto">
            {/* Teacher's Desk */}
            <div className="text-center mb-6">
              <div className="w-32 h-8 bg-academic-lighter/30 border-2 border-academic rounded mx-auto flex items-center justify-center text-sm font-medium text-academic">
                Teacher's Desk
              </div>
            </div>

            {/* Seats Grid */}
            <div className="space-y-3">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center items-center">
                  <div className="w-8 text-sm font-medium text-academic text-center">
                    {String.fromCharCode(65 + rowIndex)}
                  </div>
                  {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                    const student = getSeatAssignment(rowIndex + 1, seatIndex + 1);
                    return (
                      <div
                        key={seatIndex}
                        className={`
                          relative w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110
                          ${student 
                            ? 'bg-academic text-white border-academic shadow-md' 
                            : 'bg-muted border-muted-foreground/20 text-muted-foreground hover:bg-muted/80'
                          }
                        `}
                        title={student ? `${student.name} (${student.rollNumber})` : `Row ${rowIndex + 1}, Seat ${seatIndex + 1}`}
                      >
                        {student ? (
                          <div className="flex flex-col items-center">
                            <User className="h-3 w-3" />
                            <span className="text-[8px] leading-none">{seatIndex + 1}</span>
                          </div>
                        ) : (
                          <span>{seatIndex + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Students List */}
          {assignedSeats > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-academic">Assigned Students</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {assignments
                  .filter(a => a.student)
                  .map((assignment, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-academic-lighter/10 rounded border border-academic-lighter/30"
                    >
                      {assignment.student?.photo && (
                        <img 
                          src={assignment.student.photo} 
                          alt={assignment.student.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{assignment.student?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {String.fromCharCode(64 + assignment.row)}{assignment.seat} • {assignment.student?.rollNumber}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};