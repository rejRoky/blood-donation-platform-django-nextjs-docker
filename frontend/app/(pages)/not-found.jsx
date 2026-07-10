import '@/app/globals.css';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='w-1/4 mx-auto text-center mt-64'>
            <h2>Not Found</h2>
            <p className='mb-4'>Could not find requested resource</p>
            <Link href="/" className='bg-red-300 px-4 py-2 rounded-lg text-red-600 font-bold'>Return Home</Link>
        </div>
    )
}