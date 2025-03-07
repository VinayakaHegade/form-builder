import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center p-6'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold'>Form Builder</h1>
        <p className='text-lg text-gray-600'>
          Create, share, and collect responses with custom forms
        </p>
      </div>

      <div className='flex flex-wrap justify-center gap-4'>
        <Link href='/create/new'>
          <Button className='bg-green-350 border-green-550 shadow-custom-sm border hover:bg-green-600'>
            Create a Form
          </Button>
        </Link>
        <Link href='/submissions'>
          <Button variant='outline'>View Submissions</Button>
        </Link>
      </div>
    </div>
  );
}
