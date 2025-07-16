import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileStatus {
  completionPercentage: number;
  isComplete: boolean;
  isVerified: boolean;
  missingFields: string[];
}

export function useProfileStatus(): ProfileStatus {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user || user.type !== 'teacher') {
      return {
        completionPercentage: 0,
        isComplete: false,
        isVerified: false,
        missingFields: []
      };
    }

    const requiredFields = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'subjects',
      'schoolLevel',
      'bio',
      'hourlyRate'
    ];

    const missingFields: string[] = [];
    let filledFields = 0;

    requiredFields.forEach(field => {
      const value = (user as any)[field];
      
      if (field === 'subjects') {
        if (!value || !Array.isArray(value) || value.length === 0) {
          missingFields.push('Matières enseignées');
        } else {
          filledFields++;
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        switch (field) {
          case 'firstName':
            missingFields.push('Prénom');
            break;
          case 'lastName':
            missingFields.push('Nom');
            break;
          case 'email':
            missingFields.push('Email');
            break;
          case 'phone':
            missingFields.push('Téléphone');
            break;
          case 'schoolLevel':
            missingFields.push('Niveau enseigné');
            break;
          case 'bio':
            missingFields.push('Biographie');
            break;
          case 'hourlyRate':
            missingFields.push('Tarif horaire');
            break;
        }
      } else {
        filledFields++;
      }
    });

    const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);
    const isComplete = completionPercentage === 100;
    const isVerified = user.isVerified || false;

    return {
      completionPercentage,
      isComplete,
      isVerified,
      missingFields
    };
  }, [user]);
}