import Image from 'next/image'
import Button from './ui/Button'
import logo from '@/public/logo.png'


const Navbar = () => {
    return (
        <div className='fixed top-0 left-0 black-bg w-full flex items-center justify-between py-4 px-16 z-50'>
            <div className='flex items-center space-x-3'>
                <Image
                src={logo}
                alt="Logo"
                width={40}
                height={40}
                />
                <span className='block text-white text-xl font-semibold tracking-wider'>Editar</span>
            </div>
            <Button variant='secondary' className='px-4 py-2!'>
                Sign In
            </Button>
        </div>
    )
}

export default Navbar
