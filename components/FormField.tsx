'use client';

import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '@/lib/types';
import { Input } from './ui/input';
import { Calendar } from 'lucide-react';
import { Icons } from './Icons';

interface FormFieldProps {
  question: Question;
  readOnly?: boolean;
  value?: any;
  onChange?: (questionId: string, value: any) => void;
}

export default function FormField({
  question,
  readOnly = true,
  value,
  onChange,
}: FormFieldProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(question.id, newValue);
    }
  };

  const getInputValue = (defaultValue: any = '') => {
    if (readOnly) return undefined;
    return value !== undefined ? value : defaultValue;
  };

  if (!isClient) {
    return (
      <div className='rounded border border-gray-200 bg-gray-50 p-2'>
        Loading...
      </div>
    );
  }

  switch (question.type) {
    case QuestionType.ShortAnswer:
      return (
        <Input
          disabled={readOnly}
          className='bg-gray-50'
          placeholder='Short answer text'
          value={getInputValue()}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case QuestionType.LongAnswer:
      return (
        <textarea
          disabled={readOnly}
          className='h-24 w-full resize-none rounded-md border border-gray-200 bg-gray-50 p-2 focus:ring-2 focus:ring-gray-200 focus:outline-none'
          placeholder='Long answer text'
          value={getInputValue()}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case QuestionType.SingleSelect:
      return (
        <div className='space-y-2'>
          {question.options?.map((option) => (
            <div key={option.id} className='flex items-center gap-2'>
              <Input
                type='radio'
                id={option.id}
                name={question.id}
                disabled={readOnly}
                checked={!readOnly && value === option.id}
                onChange={() => handleChange(option.id)}
                className='h-4 w-4'
              />
              <label htmlFor={option.id} className='text-sm'>
                {option.value}
              </label>
            </div>
          ))}
        </div>
      );

    case QuestionType.Number:
      return (
        <Input
          disabled={readOnly}
          type='number'
          className='bg-gray-50'
          placeholder='0'
          value={getInputValue()}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case QuestionType.URL:
      return (
        <Input
          disabled={readOnly}
          className='bg-gray-50'
          placeholder='http://example.com'
          value={getInputValue()}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case QuestionType.Date:
      return (
        <div className='relative'>
          <Input
            disabled={readOnly}
            type='text'
            className='bg-gray-50 pr-10'
            placeholder='MM-DD-YYYY'
            value={getInputValue()}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div className='absolute top-1/2 right-2 -translate-y-1/2 transform'>
            <Icons.calendar className='h-4 w-4 text-gray-400' />
          </div>
        </div>
      );

    default:
      return null;
  }
}
