import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Grid, Users } from 'lucide-react';

interface ExamHallData {
  name: string;
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
}

interface ExamHallConfigProps {
  onHallConfigured: (hallData: ExamHallData) => void;
  currentConfig?: ExamHallData;
}

export const ExamHallConfig = ({ onHallConfigured, currentConfig }: ExamHallConfigProps) => {
  const [formData, setFormData] = useState({
    name: currentConfig?.name || '',
    rows: currentConfig?.rows || 10,
    seatsPerRow: currentConfig?.seatsPerRow || 8
  });
  const { toast } = useToast();

  const totalSeats = formData.rows * formData.seatsPerRow;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.rows < 1 || formData.seatsPerRow < 1) {
      toast({
        title: "Invalid Configuration",
        description: "Please enter valid hall name and seat configuration",
        variant: "destructive"
      });
      return;
    }

    const hallData: ExamHallData = {
      ...formData,
      totalSeats
    };

    onHallConfigured(hallData);
    
    toast({
      title: "Hall Configured",
      description: `${formData.name} configured with ${totalSeats} seats`,
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-card-enhanced">
      <CardHeader className="bg-gradient-academic text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Exam Hall Configuration
        </CardTitle>
        <CardDescription className="text-white/90">
          Configure the exam hall layout and seating arrangement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hallName" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Hall Name
            </Label>
            <Input
              id="hallName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter exam hall name"
              className="transition-all duration-300 focus:shadow-academic/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Number of Rows</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={formData.rows}
                onChange={(e) => setFormData(prev => ({ ...prev, rows: parseInt(e.target.value) || 0 }))}
                className="transition-all duration-300 focus:shadow-academic/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seatsPerRow">Seats per Row</Label>
              <Input
                id="seatsPerRow"
                type="number"
                min="1"
                max="15"
                value={formData.seatsPerRow}
                onChange={(e) => setFormData(prev => ({ ...prev, seatsPerRow: parseInt(e.target.value) || 0 }))}
                className="transition-all duration-300 focus:shadow-academic/20"
              />
            </div>
          </div>

          <div className="bg-academic-lighter/10 rounded-lg p-4 border border-academic-lighter/30">
            <div className="flex items-center gap-2 text-academic font-medium">
              <Users className="h-5 w-5" />
              Total Seats: {totalSeats}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This configuration will create {formData.rows} rows with {formData.seatsPerRow} seats each
            </p>
          </div>

          {/* Visual Preview */}
          <div className="space-y-2">
            <Label>Layout Preview</Label>
            <div className="bg-background border rounded-lg p-4 max-h-48 overflow-auto">
              <div className="space-y-1">
                {Array.from({ length: Math.min(formData.rows, 10) }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1 justify-center">
                    {Array.from({ length: Math.min(formData.seatsPerRow, 12) }, (_, seatIndex) => (
                      <div
                        key={seatIndex}
                        className="w-6 h-6 bg-academic-lighter/30 border border-academic-lighter rounded flex items-center justify-center text-xs text-academic"
                      >
                        {rowIndex + 1}
                      </div>
                    ))}
                    {formData.seatsPerRow > 12 && (
                      <span className="text-muted-foreground text-xs self-center">...</span>
                    )}
                  </div>
                ))}
                {formData.rows > 10 && (
                  <div className="text-center text-muted-foreground text-xs">
                    ... {formData.rows - 10} more rows
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="academic" 
            className="w-full"
            size="lg"
          >
            Configure Hall
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};