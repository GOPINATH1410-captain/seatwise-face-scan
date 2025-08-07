import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, User, Mail, Hash } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  photo: string | null;
}

interface StudentRegistrationProps {
  onStudentAdded: (student: StudentData) => void;
}

export const StudentRegistration = ({ onStudentAdded }: StudentRegistrationProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.rollNumber || !photo) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and upload a photo",
        variant: "destructive"
      });
      return;
    }

    const student: StudentData = {
      id: Date.now().toString(),
      ...formData,
      photo
    };

    onStudentAdded(student);
    
    // Reset form
    setFormData({ name: '', email: '', rollNumber: '' });
    setPhoto(null);
    
    toast({
      title: "Student Registered",
      description: `${formData.name} has been successfully registered`,
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-card-enhanced">
      <CardHeader className="bg-gradient-academic text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Registration
        </CardTitle>
        <CardDescription className="text-white/90">
          Register students with their facial recognition data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter student name"
                className="transition-all duration-300 focus:shadow-academic/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                placeholder="Enter roll number"
                className="transition-all duration-300 focus:shadow-academic/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className="transition-all duration-300 focus:shadow-academic/20"
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Student Photo
            </Label>
            
            <div className="flex flex-col items-center space-y-4">
              {photo ? (
                <div className="relative">
                  <img 
                    src={photo} 
                    alt="Student" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-academic shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="academic"
                    size="sm"
                    onClick={() => setPhoto(null)}
                    className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-academic-lighter rounded-lg flex items-center justify-center bg-academic-lighter/10">
                  <Camera className="h-8 w-8 text-academic" />
                </div>
              )}
              
              <div className="flex gap-2">
                <label htmlFor="photo-upload">
                  <Button 
                    type="button" 
                    variant="academic-outline" 
                    size="sm"
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="academic" 
            className="w-full"
            size="lg"
          >
            Register Student
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};