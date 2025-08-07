import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Scan, CheckCircle2, XCircle, Eye } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  photo: string | null;
}

interface FacialRecognitionProps {
  students: Student[];
  onStudentRecognized: (student: Student) => void;
}

export const FacialRecognition = ({ students, onStudentRecognized }: FacialRecognitionProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastRecognized, setLastRecognized] = useState<Student | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const simulateRecognition = useCallback(async () => {
    if (students.length === 0) {
      toast({
        title: "No Students Registered",
        description: "Please register students first",
        variant: "destructive"
      });
      return;
    }

    setRecognitionStatus('scanning');
    setIsScanning(true);

    // Simulate facial recognition processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate recognition result (in real implementation, this would use ML models)
    const recognitionSuccess = Math.random() > 0.3; // 70% success rate for demo
    
    if (recognitionSuccess) {
      // Select a random registered student for demo
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      setLastRecognized(randomStudent);
      setRecognitionStatus('success');
      onStudentRecognized(randomStudent);
      
      toast({
        title: "Student Recognized",
        description: `${randomStudent.name} (${randomStudent.rollNumber}) identified successfully`,
      });
    } else {
      setRecognitionStatus('failed');
      toast({
        title: "Recognition Failed",
        description: "Student not found in database. Please try again.",
        variant: "destructive"
      });
    }

    setIsScanning(false);
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setRecognitionStatus('idle');
      setLastRecognized(null);
    }, 3000);
  }, [students, onStudentRecognized, toast]);

  const handleStartScanning = async () => {
    await startCamera();
    await simulateRecognition();
  };

  const handleStopScanning = () => {
    stopCamera();
    setIsScanning(false);
    setRecognitionStatus('idle');
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const getStatusColor = () => {
    switch (recognitionStatus) {
      case 'scanning': return 'text-info';
      case 'success': return 'text-success';
      case 'failed': return 'text-destructive';
      default: return 'text-academic';
    }
  };

  const getStatusIcon = () => {
    switch (recognitionStatus) {
      case 'scanning': return <Scan className="h-5 w-5 animate-pulse" />;
      case 'success': return <CheckCircle2 className="h-5 w-5" />;
      case 'failed': return <XCircle className="h-5 w-5" />;
      default: return <Eye className="h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    switch (recognitionStatus) {
      case 'scanning': return 'Scanning...';
      case 'success': return 'Recognition Successful';
      case 'failed': return 'Recognition Failed';
      default: return 'Ready to Scan';
    }
  };

  return (
    <Card className="w-full shadow-card-enhanced">
      <CardHeader className="bg-gradient-academic text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Facial Recognition
        </CardTitle>
        <CardDescription className="text-white/90">
          Identify students for automatic seating assignment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Camera Feed */}
        <div className="relative">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-academic-lighter/30">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            
            {/* Overlay for scanning state */}
            {isScanning && (
              <div className="absolute inset-0 bg-academic/20 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-academic border-t-transparent"></div>
                  <span className="font-medium text-academic">Analyzing facial features...</span>
                </div>
              </div>
            )}

            {/* Recognition overlay */}
            {!isScanning && streamRef.current && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-academic rounded-lg opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-2 border-academic rounded-lg opacity-30"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Display */}
        <div className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${getStatusColor()} ${
          recognitionStatus === 'success' ? 'bg-success/10 border-success' :
          recognitionStatus === 'failed' ? 'bg-destructive/10 border-destructive' :
          'bg-academic-lighter/10 border-academic-lighter'
        }`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>

        {/* Last Recognized Student */}
        {lastRecognized && recognitionStatus === 'success' && (
          <div className="bg-success/10 border border-success rounded-lg p-4">
            <div className="flex items-center gap-3">
              {lastRecognized.photo && (
                <img 
                  src={lastRecognized.photo} 
                  alt={lastRecognized.name}
                  className="w-12 h-12 rounded-lg object-cover border border-success"
                />
              )}
              <div>
                <h3 className="font-semibold text-success">{lastRecognized.name}</h3>
                <p className="text-sm text-muted-foreground">Roll Number: {lastRecognized.rollNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!streamRef.current ? (
            <Button 
              onClick={handleStartScanning} 
              variant="academic"
              size="lg"
              disabled={isScanning || students.length === 0}
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Recognition
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={simulateRecognition} 
                variant="academic"
                disabled={isScanning}
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan Student
              </Button>
              <Button 
                onClick={handleStopScanning} 
                variant="academic-outline"
              >
                Stop Camera
              </Button>
            </div>
          )}
        </div>

        {/* Student Count */}
        <div className="text-center text-sm text-muted-foreground">
          {students.length} students registered for recognition
        </div>
      </CardContent>
    </Card>
  );
};