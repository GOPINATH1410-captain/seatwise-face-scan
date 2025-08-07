import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Settings, 
  Camera, 
  MapPin, 
  RefreshCw, 
  Download,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

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

interface DashboardProps {
  students: Student[];
  hallConfig: ExamHallData | null;
  assignments: SeatAssignment[];
  onGenerateSeating: () => void;
  onExportData: () => void;
}

export const Dashboard = ({ 
  students, 
  hallConfig, 
  assignments, 
  onGenerateSeating,
  onExportData 
}: DashboardProps) => {
  const { toast } = useToast();
  
  const assignedSeats = assignments.filter(a => a.student !== null).length;
  const totalSeats = hallConfig?.totalSeats || 0;
  const occupancyRate = totalSeats > 0 ? Math.round((assignedSeats / totalSeats) * 100) : 0;

  const handleGenerateSeating = () => {
    if (!hallConfig) {
      toast({
        title: "Hall Not Configured",
        description: "Please configure the exam hall first",
        variant: "destructive"
      });
      return;
    }

    if (students.length === 0) {
      toast({
        title: "No Students",
        description: "Please register students first",
        variant: "destructive"
      });
      return;
    }

    onGenerateSeating();
    toast({
      title: "Seating Generated",
      description: `Seating arrangement created for ${students.length} students`,
    });
  };

  const stats = [
    {
      title: "Registered Students",
      value: students.length.toString(),
      icon: Users,
      color: "text-academic",
      bgColor: "bg-academic-lighter/10"
    },
    {
      title: "Hall Capacity",
      value: totalSeats.toString(),
      icon: Settings,
      color: "text-info",
      bgColor: "bg-blue-50"
    },
    {
      title: "Assigned Seats",
      value: assignedSeats.toString(),
      icon: MapPin,
      color: "text-success",
      bgColor: "bg-green-50"
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      icon: CheckCircle2,
      color: occupancyRate > 80 ? "text-success" : occupancyRate > 50 ? "text-warning" : "text-muted-foreground",
      bgColor: occupancyRate > 80 ? "bg-green-50" : occupancyRate > 50 ? "bg-yellow-50" : "bg-gray-50"
    }
  ];

  const getSystemStatus = () => {
    if (!hallConfig) return { status: 'warning', text: 'Hall Not Configured', icon: AlertCircle };
    if (students.length === 0) return { status: 'warning', text: 'No Students Registered', icon: AlertCircle };
    if (assignedSeats === 0) return { status: 'info', text: 'Ready for Seating Generation', icon: Clock };
    if (assignedSeats < students.length) return { status: 'warning', text: 'Partial Assignment', icon: AlertCircle };
    return { status: 'success', text: 'System Ready', icon: CheckCircle2 };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-academic bg-clip-text text-transparent">
          Exam Hall Management System
        </h1>
        <p className="text-muted-foreground">
          Automated seating arrangement using facial recognition technology
        </p>
      </div>

      {/* System Status */}
      <Card className="shadow-card-enhanced">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                systemStatus.status === 'success' ? 'bg-success/10 text-success' :
                systemStatus.status === 'warning' ? 'bg-warning/10 text-warning' :
                'bg-info/10 text-info'
              }`}>
                <systemStatus.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">System Status</p>
                <p className="text-sm text-muted-foreground">{systemStatus.text}</p>
              </div>
            </div>
            <Badge variant={
              systemStatus.status === 'success' ? 'default' :
              systemStatus.status === 'warning' ? 'destructive' : 'secondary'
            }>
              {systemStatus.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Manage the seating arrangement system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleGenerateSeating}
              variant="academic"
              disabled={!hallConfig || students.length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Seating
            </Button>
            
            <Button 
              onClick={onExportData}
              variant="academic-outline"
              disabled={assignments.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Arrangement
            </Button>
          </div>

          {/* Current Configuration Summary */}
          {hallConfig && (
            <div className="bg-academic-lighter/10 rounded-lg p-4 border border-academic-lighter/30">
              <h4 className="font-medium text-academic mb-2">Current Configuration</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Hall: </span>
                  <span className="font-medium">{hallConfig.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Layout: </span>
                  <span className="font-medium">{hallConfig.rows}×{hallConfig.seatsPerRow}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity: </span>
                  <span className="font-medium">{hallConfig.totalSeats} seats</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Utilization: </span>
                  <span className="font-medium">{occupancyRate}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card-enhanced">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.slice(-5).reverse().map((student, index) => (
              <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                {student.photo && (
                  <img 
                    src={student.photo} 
                    alt={student.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{student.name} registered</p>
                  <p className="text-xs text-muted-foreground">Roll: {student.rollNumber}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              </div>
            ))}
            
            {students.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No recent activity. Start by registering students.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};